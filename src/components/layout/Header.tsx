"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function Header() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  // Hide header in admin pages
  if (pathname.startsWith("/admin")) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <header className="bg-green-600 text-white sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          Marilah
        </Link>
        <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4 relative">
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-green-700 text-white placeholder-green-200 border-none rounded-full py-2 px-10 focus:ring-2 focus:ring-white focus:bg-green-800 transition duration-200"
          />
          <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2">
            <Search className="w-4 h-4 text-green-200" />
          </button>
        </form>
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/publish" className="bg-white text-green-600 px-4 py-2 rounded-lg font-semibold hover:bg-green-50 transition">
            Publish
          </Link>
          <Link href="/login" className="hover:text-green-200 font-medium">
            Login
          </Link>
        </div>
      </div>
    </header>
  );
}
