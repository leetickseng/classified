import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();
    const post = await prisma.post.create({
      data: {
        title: data.title,
        description: data.description,
        address: data.address,
        contact: data.contact,
        workingHours: data.workingHours,
        priceRange: data.priceRange,
        status: "PENDING",
        userId: (session.user as any).id,
        categoryId: data.categoryId,
        locationId: data.locationId || null,
        images: { create: data.images.map((url: string) => ({ url })) },
        tags: { connect: data.tags?.map((id: string) => ({ id })) || [] },
      },
    });
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const posts = await prisma.post.findMany({
    where: { userId: (session.user as any).id },
    include: { category: true, images: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(posts);
}
