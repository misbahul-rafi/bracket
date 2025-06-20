import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import slugify from "@/utils/slugify";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const league = await prisma.league.findMany({
      include: { esport: true }
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

    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      code,
      region,
      season,
      esportId,
      groupIsLock,
      format,
      groupFormat,
      playoffFormat,
    } = body;

    const slug = slugify(`${code}-${season}`);

    const newLeague = await prisma.league.create({
      data: {
        name,
        code,
        region,
        season: Number(season),
        esportId: Number(esportId),
        userId: session.user.id,
        groupIsLock: Boolean(groupIsLock),
        slug,
      },
    });

    if (format === "GROUP") {
      await prisma.stage.create({
        data: {
          name: "Group Stage",
          leagueId: newLeague.id,
          format: groupFormat || "ROUND_ROBIN",
          teamsPerGroup: 3,
          order: 1,
        },
      });

      if (playoffFormat) {
        await prisma.stage.create({
          data: {
            name: "Playoff",
            leagueId: newLeague.id,
            format: playoffFormat,
            teamsPerGroup: 3,
            order: 2,
          },
        });
      }
    } else if (format === "KNOCKOUT") {
      await prisma.stage.create({
        data: {
          name: "Knockout Stage",
          leagueId: newLeague.id,
          format: playoffFormat || "SINGLE_ELIMINATION",
          order: 1,
        },
      });
    } else if (format === "LADDER") {
      await prisma.stage.create({
        data: {
          name: "Ladder",
          leagueId: newLeague.id,
          format: "LADDER",
          order: 1,
        },
      });
    }

    return NextResponse.json(
      {
        league: {
          id: newLeague.id,
          name: newLeague.name,
          slug: newLeague.slug,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("⛔ Error creating league:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
