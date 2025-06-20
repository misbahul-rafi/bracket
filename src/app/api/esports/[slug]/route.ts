import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest, { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const slug = (await params).slug;
    const game = await prisma.esport.findUnique({
      where: { slug: slug },
      include: {
        leagues: true
      }
    })
    if (!game) return NextResponse.json({ message: "game not found" }, { status: 404 })
    return NextResponse.json(game)

  } catch (error) {
    console.log(`⛔⛔⛔ Server Error ⛔⛔⛔\n${error}`)
    return NextResponse.json({ message: "internal server error" }, { status: 500 })
  }
}
