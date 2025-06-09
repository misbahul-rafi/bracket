import { NextResponse } from "next/server"
import { hash } from "bcrypt"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  const { name, username, email, password } = await req.json()

  const exists = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
  })

  if (exists) {
    return NextResponse.json({ error: "Username atau email sudah digunakan" }, { status: 400 })
  }

  const hashed = await hash(password, 10)

  const user = await prisma.user.create({
    data: { name, email, username, role: "user", password: hashed },
  })

  return NextResponse.json(user)
}
