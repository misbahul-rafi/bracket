import { NextResponse } from "next/server";


export async function GET() {
  try {
    const games = await prisma.game.findMany()

    return NextResponse.json(games)
  } catch (error) {
    console.log(`⛔⛔⛔ Server Error ⛔⛔⛔\n${error}`)
    return NextResponse.json({ message: "internal server error" }, { status: 500 })
  }
}