import { authOptions } from "@/lib/auth";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await prisma.team.findMany()
    return NextResponse.json(data)
  } catch (error) {
    console.error(`⛔⛔⛔ Server Error ⛔⛔⛔\n${error}`)
    return NextResponse.json({ message: "internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const { name, code, region } = await req.json()
  const session = await getServerSession(authOptions)

  try {
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    if (!name || !code || !region) return NextResponse.json({ message: "bad request" }, { status: 400 })
    const newTeam = await prisma.team.create({
      data: {
        name, code, region, userId: session.user.id
      }
    })
    if (newTeam) return NextResponse.json({ message: "team added" }, { status: 201 })
    return NextResponse.json({ message: "team can't add" }, { status: 500 })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2002":
          return NextResponse.json(
            { message: "Team already exists" },
            { status: 409 }
          );
        case "P2003":
          return NextResponse.json(
            { message: "Invalid user. User not found." },
            { status: 400 }
          );
      }
    }
    console.error(`⛔ Server Error ⛔\n${error}`);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}