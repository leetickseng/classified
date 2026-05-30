import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { MapPin, Clock, Phone, Tag } from "lucide-react";
import { notFound } from "next/navigation";

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      images: true,
      category: true,
      location: true,
      tags: true,
      user: { select: { name: true } },
    },
  });

  if (!post || (post.status !== "APPROVED" && post.status !== "PENDING")) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto bg-white min-h-screen md:mt-6 md:rounded-xl shadow-sm overflow-hidden pb-20">
      <div className="relative aspect-video md:aspect-[21/9] w-full bg-gray-100">
        {post.images.length > 0 ? (
          <Image
            src={post.images[0].url}
            alt={post.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
        )}
      </div>

      <div className="p-6 space-y-6">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-bold">
              {post.category.name}
            </span>
            {post.status === "PENDING" && (
              <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded font-bold">
                UNDER REVIEW
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{post.title}</h1>
          <p className="text-green-600 text-xl font-bold mt-2">{post.priceRange}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          {post.location && (
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-green-600" />
              <span>{post.location.city}, {post.location.state}</span>
            </div>
          )}
          {post.workingHours && (
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2 text-green-600" />
              <span>{post.workingHours}</span>
            </div>
          )}
          <div className="flex items-center">
            <Phone className="w-4 h-4 mr-2 text-green-600" />
            <span>{post.contact}</span>
          </div>
        </div>

        <div className="border-t pt-6">
          <h2 className="font-bold text-lg mb-3">Description</h2>
          <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
            {post.description}
          </div>
        </div>

        {post.address && (
          <div className="border-t pt-6">
            <h2 className="font-bold text-lg mb-3">Address</h2>
            <p className="text-gray-700">{post.address}</p>
          </div>
        )}

        {post.tags.length > 0 && (
          <div className="border-t pt-6">
            <h2 className="font-bold text-lg mb-3">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: any) => (
                <span key={tag.id} className="flex items-center bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                  <Tag className="w-3 h-3 mr-1" />
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-20 left-0 right-0 px-6 md:hidden">
        <a
          href={`tel:${post.contact}`}
          className="block w-full bg-green-600 text-white text-center font-bold py-3 rounded-xl shadow-lg"
        >
          Contact Now
        </a>
      </div>
    </div>
  );
}
