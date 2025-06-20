import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { MatchStruct } from '../../../../../../types/struct';

async function createMatches(matches: MatchStruct[]) {
  return await prisma.$transaction(
    matches.map((match) =>
      prisma.match.create({
        data: {
          date: new Date(match.date),
          stageId: match.stageId,
          format: match.format,
          homeScore: match.homeScore,
          awayScore: match.awayScore,
          homeTeamId: match.homeTeamId,
          awayTeamId: match.awayTeamId,
        },
      })
    )
  );
}
async function createMatch(match: MatchStruct) {
  return prisma.match.create({
    data: {
      date: new Date(match.date),
      stageId: match.stageId,
      format: match.format,
      homeScore: match.homeScore,
      awayScore: match.awayScore,
      homeTeamId: match.homeTeamId,
      awayTeamId: match.awayTeamId,
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json();
    const stage = await prisma.stage.findUnique({
      where: {id: body.stageId},
      include: {league: true}
    })
    
    if (!stage) {
      return NextResponse.json({ message: "League not found" }, { status: 404 });
    }
    if (!session) {
      return NextResponse.json({ message: "unauthorized" }, { status: 401 });
    }
    if (session.user.id !== stage.league.userId) {
      return NextResponse.json({ message: "unauthorized" }, { status: 401 });
    }

    if (Array.isArray(body.matches)) {
      const result = await createMatches(body.matches);
      return NextResponse.json({ message: 'Matches created', data: result }, { status: 201 });
    }
    const result = await createMatch(body.matches);
    return NextResponse.json({ message: 'Match created', data: result }, { status: 201 });
  } catch (error) {
    console.error('Error creating matches:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}