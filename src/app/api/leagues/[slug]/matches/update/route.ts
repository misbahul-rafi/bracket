import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: NextRequest, 
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const slug = (await params).slug;
    const body = await req.json();
    const { matches } = body;

    const league = await prisma.league.findUnique({
      where: { slug },
      select: { id: true },
    });
    
    if (!league) {
      return NextResponse.json({ error: 'League not found' }, { status: 404 });
    }
    
    const updates = [];
    
    for (const match of matches) {
      const { matchId, homeScore, awayScore } = match;
      
      const existingMatch = await prisma.match.findFirst({
        where: {
          id: matchId,
          leagueId: league.id,
        },
        select: { id: true },
      });
      
      if (!existingMatch) {
        return NextResponse.json({ error: `Match ${matchId} not found in this league` }, { status: 400 });
      }
      
      const updatedMatch = await prisma.match.update({
        where: { id: matchId },
        data: {
          homeScore: homeScore,
          awayScore: awayScore,
        },
      });
      
      updates.push(updatedMatch);
    }
    
    return NextResponse.json({ success: true, updates }, { status: 200 });
    
  } catch (error: any) {
    console.log("⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔")
    console.error('[MATCH_UPDATE_ERROR]', error);
    
    if (error.code === 'P2003') {
      return NextResponse.json({ message: "Foreign key constraint failed" }, { status: 400 });
    }

    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
