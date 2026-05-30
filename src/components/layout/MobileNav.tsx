"use client";

import Link from "next/link";
import { Home, PlusSquare, User, HelpCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function MobileNav() {
  const pathname = usePathname();

  // Hide in admin pages
  if (pathname.startsWith("/admin")) return null;

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Publish", href: "/publish", icon: PlusSquare },
    { label: "My", href: "/my/posts", icon: User },
    { label: "Help", href: "/help", icon: HelpCircle },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around py-2 px-4 z-50">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "flex flex-col items-center space-y-1 transition-colors",
              isActive ? "text-green-600" : "text-gray-400 hover:text-gray-600"
            )}
          >
            <Icon className="w-6 h-6" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
