import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await prisma.team.findMany()
    return NextResponse.json(data)
  } catch (error) {
    console.log(`⛔⛔⛔ Server Error ⛔⛔⛔\n${error}`)
    return NextResponse.json({ message: "internal server error" }, { status: 500 })
  }
}