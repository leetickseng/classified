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
  const banners = await prisma.banner.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(banners);
}

export async function POST(req: Request) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const data = await req.json();
    const banner = await prisma.banner.create({
      data: {
        title: data.title,
        imageUrl: data.imageUrl,
        link: data.link,
        position: data.position || "HOME_TOP",
      },
    });
    return NextResponse.json(banner);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create banner" }, { status: 400 });
  }
}
