import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client";


export async function GET(
  req: NextRequest, { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const slug = (await params).slug;

    const league = await prisma.league.findUnique({
      where: { slug },
      include: {
        esport: true,
        stage: {
          include: {
            groups: {
              include: {
                members: {
                  include: {
                    team: true,
                  },
                },
              },
            },
            matches: {
              include: {
                homeTeam: true,
                awayTeam: true,
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
export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const league = await prisma.league.findUnique({
      where: { slug },
      include: {
        stage: {
          include: {
            matches: true,
            groups: {
              include: {
                members: true,
              },
            },
          },
        },
      },
    });

    if (!league) {
      return NextResponse.json({ message: "League not found" }, { status: 404 });
    }

    // Hapus semua data berjenjang
    for (const stage of league.stage) {
      for (const group of stage.groups) {
        await prisma.groupMember.deleteMany({
          where: { groupId: group.id },
        });
      }

      await prisma.group.deleteMany({
        where: { stageId: stage.id },
      });

      await prisma.match.deleteMany({
        where: { stageId: stage.id },
      });
    }

    await prisma.stage.deleteMany({
      where: { leagueId: league.id },
    });

    await prisma.league.delete({
      where: { slug },
    });

    return NextResponse.json({ message: "League deleted successfully" });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json({ message: "League not found" }, { status: 404 })
      }
    }
    console.error("⛔ Error deleting league:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
