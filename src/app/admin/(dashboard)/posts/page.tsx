import { prisma } from "@/lib/prisma";
import AdminPostTable from "@/components/admin/AdminPostTable";

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true } },
      category: { select: { name: true } },
      images: { take: 1 }
    },
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">Post Management</h1>
      <AdminPostTable initialPosts={posts} />
    </div>
  );
}
