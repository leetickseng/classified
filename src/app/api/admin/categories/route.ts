import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return false;
  }
  return true;
}

export async function GET() {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const categories = await prisma.category.findMany({
    include: { _count: { select: { posts: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const data = await req.json();
    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        icon: data.icon,
      },
    });
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create category" }, { status: 400 });
  }
}
