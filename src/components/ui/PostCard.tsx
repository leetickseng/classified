import Link from "next/link";
import { MapPin, Clock } from "lucide-react";
import Image from "next/image";

interface PostCardProps {
  post: {
    id: string;
    title: string;
    images: { url: string }[];
    location?: { city: string } | null;
    priceRange?: string | null;
    workingHours?: string | null;
    category: { name: string };
  };
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/post/${post.id}`} className="block bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition">
      <div className="relative aspect-video w-full">
        {post.images[0] ? (
          <Image
            src={post.images[0].url}
            alt={post.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
        <div className="absolute top-2 left-2 bg-green-600 text-white text-[10px] px-2 py-0.5 rounded font-semibold uppercase">
          {post.category.name}
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-bold text-gray-800 line-clamp-1 mb-1">{post.title}</h3>
        {post.priceRange && (
          <p className="text-green-600 font-bold text-sm mb-2">{post.priceRange}</p>
        )}
        <div className="flex flex-col space-y-1">
          {post.location && (
            <div className="flex items-center text-gray-500 text-xs">
              <MapPin className="w-3 h-3 mr-1" />
              <span>{post.location.city}</span>
            </div>
          )}
          {post.workingHours && (
            <div className="flex items-center text-gray-500 text-xs">
              <Clock className="w-3 h-3 mr-1" />
              <span>{post.workingHours}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
