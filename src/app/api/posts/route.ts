import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();

    // Ensure userId is correctly cast and present
    const userId = (session.user as any).id;
    if (!userId) {
       // Fallback to find by email
       const user = await prisma.user.findUnique({ where: { email: session.user.email! } });
       if (!user) throw new Error("User not found in database");
       (session.user as any).id = user.id;
    }

    const post = await prisma.post.create({
      data: {
        title: data.title,
        description: data.description,
        address: data.address || null,
        contact: data.contact,
        workingHours: data.workingHours || null,
        priceRange: data.priceRange || null,
        status: "PENDING",
        userId: (session.user as any).id,
        categoryId: data.categoryId,
        locationId: data.locationId || null,
        images: {
          create: (data.images || []).map((url: string) => ({ url }))
        },
        tags: {
          connect: (data.tags || []).map((id: string) => ({ id }))
        },
      },
    });
    return NextResponse.json(post, { status: 201 });
  } catch (error: any) {
    console.error("Publish Error:", error);
    return NextResponse.json({ error: "Failed to create post", details: error.message }, { status: 500 });
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
