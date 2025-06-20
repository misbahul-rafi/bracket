import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest, 
  { params }: { params: Promise<{ slug: string }> }

) {
  try {
    const slug = (await params).slug
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token || !token.sub) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const league = await prisma.league.findUnique({
      where: { slug: slug },
      select: { userId: true }
    });

    if (!league) {
      return NextResponse.json({ message: 'League not found' }, { status: 404 });
    }

    if (league.userId !== token.sub) {
      return NextResponse.json({ message: 'Forbidden: You are not the owner' }, { status: 403 });
    }

    return NextResponse.json({ message: 'Authorized' }, { status: 200 });

  } catch (error) {
    console.error('Error verifying owner:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
