"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Check, X, Star, Trash2 } from "lucide-react";

interface AdminPostTableProps {
  initialPosts: any[];
}

export default function AdminPostTable({ initialPosts }: AdminPostTableProps) {
  const router = useRouter();

  const handleAction = async (id: string, action: string, data?: any) => {
    let method = "PATCH";
    let body = data || {};

    if (action === "approve") body.status = "APPROVED";
    if (action === "reject") body.status = "REJECTED";
    if (action === "delete") method = "DELETE";
    if (action === "toggleRecommended") body.isRecommended = !data.isRecommended;

    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: method === "DELETE" ? undefined : JSON.stringify(body),
      });

      if (res.ok) {
        router.refresh();
      } else {
        alert("Action failed");
      }
    } catch (err) {
      alert("An error occurred");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
          <tr>
            <th className="px-6 py-3">Preview</th>
            <th className="px-6 py-3">Title</th>
            <th className="px-6 py-3">User</th>
            <th className="px-6 py-3">Category</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Featured</th>
            <th className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-sm">
          {initialPosts.map((post) => (
            <tr key={post.id} className="hover:bg-gray-50 transition">
              <td className="px-6 py-4">
                <div className="relative w-16 h-12 bg-gray-100 rounded overflow-hidden">
                  {post.images[0] && (
                    <Image src={post.images[0].url} alt="" fill className="object-cover" />
                  )}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="font-medium">{post.title}</div>
                <div className="text-[10px] text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</div>
              </td>
              <td className="px-6 py-4">{post.user?.name || "Unknown"}</td>
              <td className="px-6 py-4 text-xs">{post.category.name}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                  post.status === "APPROVED" ? "bg-green-100 text-green-700" :
                  post.status === "PENDING" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
                }`}>
                  {post.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex space-x-2">
                  {post.isPinned && <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-[8px] font-bold">PINNED</span>}
                  {post.isRecommended && <span className="bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded text-[8px] font-bold">REC</span>}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleAction(post.id, "approve")}
                    title="Approve"
                    className="p-1.5 bg-green-50 text-green-600 rounded hover:bg-green-100"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleAction(post.id, "reject")}
                    title="Reject"
                    className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleAction(post.id, "toggleRecommended", { isRecommended: post.isRecommended })}
                    title="Recommend"
                    className={`p-1.5 rounded ${post.isRecommended ? 'bg-purple-600 text-white' : 'bg-purple-50 text-purple-600'}`}
                  >
                    <Star className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => confirm("Delete this post?") && handleAction(post.id, "delete")}
                    title="Delete"
                    className="p-1.5 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
