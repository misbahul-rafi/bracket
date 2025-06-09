import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma" 


export async function GET(
  req: NextRequest, { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const slug = (await params).slug;

    const league = await prisma.league.findUnique({
      where: { slug },
      include: {
        game: true,
        matches: {
          include: {
            homeTeam: true,
            awayTeam: true,
          },
        },
        groups: {
          include: {
            members: {
              include: {
                team: true,
              },
            },
          },
        },
      },
    });

    if (!league) {
      return NextResponse.json({ message: "league not found" }, { status: 404 });
    }

    return NextResponse.json(league);
  } catch (error) {
    console.log(`⛔⛔⛔ Server Error ⛔⛔⛔\n${error}`);
    return NextResponse.json({ message: "internal server error" }, { status: 500 });
  }
}
