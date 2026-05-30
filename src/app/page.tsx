import { prisma } from "@/lib/prisma";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import PostCard from "@/components/ui/PostCard";
import Link from "next/link";
import Image from "next/image";

export default async function Home() {
  const categories = await prisma.category.findMany();
  const posts = await prisma.post.findMany({
    where: { status: "APPROVED" },
    include: { images: true, category: true, location: true },
    orderBy: { createdAt: "desc" },
    take: 10,
  });
  const pinnedPosts = await prisma.post.findMany({
    where: { status: "APPROVED", isPinned: true },
    include: { images: true, category: true, location: true },
    take: 4,
  });
  const announcements = await prisma.announcement.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    take: 3,
  });
  const banners = await prisma.banner.findMany({
    where: { position: "HOME_TOP" },
    take: 3,
  });

  return (
    <div className="bg-gray-50 pb-20 md:pb-0">
      <Header />

      <main className="container mx-auto px-4 py-4 space-y-6">
        {/* Banner Section */}
        <section className="relative h-40 md:h-64 rounded-xl overflow-hidden bg-green-100 shadow-sm">
          {banners.length > 0 ? (
            <div className="w-full h-full relative">
              <Image
                src={banners[0].imageUrl}
                alt={banners[0].title || "Banner"}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-green-700 text-lg font-bold bg-gradient-to-r from-green-400 to-green-600">
              Welcome to Marilah.my
            </div>
          )}
        </section>

        {/* Categories Grid */}
        <section className="bg-white rounded-xl p-4 shadow-sm">
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
            {categories.map((cat) => (
              <Link key={cat.id} href={`/category/${cat.slug}`} className="flex flex-col items-center space-y-2 group">
                <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-2xl group-hover:bg-green-100 transition shadow-sm border border-green-50">
                  {cat.icon || "📂"}
                </div>
                <span className="text-xs font-medium text-gray-700">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Announcements */}
        {announcements.length > 0 && (
          <section className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-center space-x-3">
            <div className="bg-green-500 text-white text-[10px] px-2 py-0.5 rounded font-bold whitespace-nowrap">ANNOUNCEMENT</div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm text-green-800 truncate">{announcements[0].content}</p>
            </div>
          </section>
        )}

        {/* Pinned/Recommended */}
        {pinnedPosts.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-800 flex items-center">
              <span className="w-1 h-5 bg-green-500 rounded-full mr-2"></span>
              Recommended
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {pinnedPosts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        )}

        {/* Latest Posts */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-gray-800 flex items-center">
            <span className="w-1 h-5 bg-green-500 rounded-full mr-2"></span>
            Latest
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      </main>

      <MobileNav />
    </div>
  );
}
