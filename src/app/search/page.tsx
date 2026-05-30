import { prisma } from "@/lib/prisma";
import PostCard from "@/components/ui/PostCard";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q: query = "" } = await searchParams;

  const posts = await prisma.post.findMany({
    where: {
      status: "APPROVED",
      OR: [
        { title: { contains: query } },
        { description: { contains: query } },
      ],
    },
    include: { images: true, category: true, location: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Search Results for "{query}"
      </h1>

      {posts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {posts.map((post: any) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl">
          <p className="text-gray-500">No results found for your search.</p>
        </div>
      )}
    </div>
  );
}
