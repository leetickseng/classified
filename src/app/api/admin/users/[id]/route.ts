import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === "admin";
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  try {
    const data = await req.json();
    const user = await prisma.user.update({
      where: { id },
      data: {
        status: data.status, // active, disabled
      },
    });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update user" }, { status: 400 });
  }
}
