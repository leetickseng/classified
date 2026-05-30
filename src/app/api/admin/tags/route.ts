import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === "admin";
}

export async function GET() {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const tags = await prisma.tag.findMany({
    include: { _count: { select: { posts: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(tags);
}

export async function POST(req: Request) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const data = await req.json();
    const tag = await prisma.tag.create({
      data: {
        name: data.name,
        slug: data.slug,
      },
    });
    return NextResponse.json(tag);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create tag" }, { status: 400 });
  }
}
