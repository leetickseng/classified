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
  const locations = await prisma.location.findMany({
    orderBy: { state: "asc" },
  });
  return NextResponse.json(locations);
}

export async function POST(req: Request) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const data = await req.json();
    const location = await prisma.location.create({
      data: {
        city: data.city,
        state: data.state,
        country: data.country || "Malaysia",
      },
    });
    return NextResponse.json(location);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create location" }, { status: 400 });
  }
}
