import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import slugify from "@/utils/slugify";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const league = await prisma.league.findMany({
      include: { game: true }
    })
    return NextResponse.json(league)
  } catch (error) {
    console.log(`⛔⛔⛔ Server Error ⛔⛔⛔\n${error}`)
    return NextResponse.json({ message: "internal server error" }, { status: 500 })
  }
}
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    const insertData = await prisma.league.create({
      data: {
        name: data.name,
        code: data.code,
        userId: session.user.id,
        season: Number(data.season),
        region: data.region,
        format: data.format,
        groupMatchFormat: data.groupMatchFormat,
        gameId: data.gameId,
        slug: slugify(`${data.code}-${data.season}`)
      }
    });

    return NextResponse.json({ league: insertData }, { status: 201 });

  } catch (error) {
    console.log(`⛔⛔⛔ Server Error ⛔⛔⛔\n${error}`);
    return NextResponse.json({ message: "internal server error" }, { status: 500 });
  }
}