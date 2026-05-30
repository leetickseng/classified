"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import PostCard from "@/components/ui/PostCard";

export default function MyPostsPage() {
  const sessionData = useSession();
  const session = sessionData?.data;
  const status = sessionData?.status || "loading";

  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      fetch("/api/posts")
        .then(res => res.json())
        .then(data => {
          setPosts(data);
          setLoading(false);
        });
    }
  }, [status, router]);

  if (loading || status === "loading") return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">My Published Content</h1>

      {posts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl">
          <p className="text-gray-500 mb-4">You haven't published anything yet.</p>
          <button
            onClick={() => router.push("/publish")}
            className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold"
          >
            Publish Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {posts.map((post) => (
            <div key={post.id} className="relative">
              <PostCard post={post} />
              <div className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold ${
                post.status === "APPROVED" ? "bg-green-100 text-green-700" :
                post.status === "PENDING" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
              }`}>
                {post.status}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
