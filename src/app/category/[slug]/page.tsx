import { prisma } from "@/lib/prisma";
import PostCard from "@/components/ui/PostCard";
import { notFound } from "next/navigation";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      posts: {
        where: { status: "APPROVED" },
        include: { images: true, category: true, location: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!category) {
    notFound();
  }

  return (
    <div className="px-4 py-6">
      <div className="flex items-center space-x-4 mb-6">
        <div className="text-4xl">{category.icon}</div>
        <h1 className="text-2xl font-bold text-gray-800">{category.name}</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {category.posts.length > 0 ? (
          category.posts.map((post: any) => (
            <PostCard key={post.id} post={post} />
          ))
        ) : (
          <p className="col-span-full text-center py-12 text-gray-500">No posts found in this category.</p>
        )}
      </div>
    </div>
  );
}
