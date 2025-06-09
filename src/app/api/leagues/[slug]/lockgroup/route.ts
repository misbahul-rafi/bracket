import { NextRequest, NextResponse } from "next/server";


export async function PATCH(
  req: NextRequest
) {
  try {
    const data = await req.json()
    console.log(data)
    await prisma.league.update({
      where: { id: data.leagueId },
      data: {
        groupIsLock: true
      }
    })
    return NextResponse.json({ message: "group is locked" }, { status: 201 });
  } catch (error) {
    console.log(`⛔⛔⛔ Server Error ⛔⛔⛔\n${error}`);
    return NextResponse.json({ message: "internal server error" }, { status: 500 });
  }
}