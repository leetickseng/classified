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
    const tag = await prisma.tag.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
      },
    });
    return NextResponse.json(tag);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update tag" }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  try {
    await prisma.tag.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete tag" }, { status: 400 });
  }
}
