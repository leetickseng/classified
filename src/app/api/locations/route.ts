import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const locations = await prisma.location.findMany({ orderBy: { city: "asc" } });
  return NextResponse.json(locations);
}
