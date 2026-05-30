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
  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(announcements);
}

export async function POST(req: Request) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const data = await req.json();
    const announcement = await prisma.announcement.create({
      data: {
        content: data.content,
        isActive: data.isActive ?? true,
      },
    });
    return NextResponse.json(announcement);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create announcement" }, { status: 400 });
  }
}
