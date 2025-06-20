import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import slugify from "@/utils/slugify";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    const esport = await prisma.esport.findMany()

    return NextResponse.json(esport)
  } catch (error) {
    console.error(`⛔⛔⛔ Server Error ⛔⛔⛔\n${error}`)
    return NextResponse.json({ message: "internal server error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, imageUrl } = body;
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    if (session.user.role !== 'admin') return NextResponse.json({ message: "cannot access" }, { status: 403 })
    if (!name) return NextResponse.json({ message: "bad request" }, { status: 400 })
    const esport = await prisma.esport.create({
      data: {
        name,
        userId: session.user.id,
        slug: slugify(name),
        description,
        imageUrl,
      },
    });

    return NextResponse.json(esport);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json({ error: "esport with the same name already exists." }, { status: 409 });
      }
      if (error.code === "P2003") {
        return NextResponse.json({ error: "user does not exist." }, { status: 400 });
      }
    }
    console.error(`⛔⛔⛔ Server Error ⛔⛔⛔\n${error}`)
    return NextResponse.json({ message: "internal server error" }, { status: 500 })
  }
}
