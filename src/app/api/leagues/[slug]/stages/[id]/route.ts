import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

type UpdatePayload = {
  isLock?: boolean
  teamsPerGroup?: number
}
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const stageId = params.id
  const body = await req.json()
  const allowedFields: (keyof UpdatePayload)[] = ['isLock', 'teamsPerGroup']
  const dataToUpdate: Partial<UpdatePayload> = {}
  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      dataToUpdate[field] = body[field]
    }
  }
  if (Object.keys(dataToUpdate).length === 0) {
    return NextResponse.json({ message: "No valid fields to update" }, { status: 400 })
  }
  try {
    await prisma.stage.update({
      where: { id: stageId },
      data: dataToUpdate
    })

    return NextResponse.json({ message: "updated" }, { status: 200 })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json({ message: "Stage not found" }, { status: 404 })
      }
    }
    console.error("⛔ Error updating stage:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}