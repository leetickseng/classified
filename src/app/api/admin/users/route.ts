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
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      status: true,
      createdAt: true,
      _count: { select: { posts: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(users);
}
