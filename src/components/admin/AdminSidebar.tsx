import Link from "next/link";
import { LayoutDashboard, FileText, FolderTree, Tags, Image as ImageIcon, Megaphone, Users, LogOut } from "lucide-react";

export default function AdminSidebar() {
  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
    { name: "Posts", icon: FileText, href: "/admin/posts" },
    { name: "Categories", icon: FolderTree, href: "/admin/categories" },
    { name: "Tags", icon: Tags, href: "/admin/tags" },
    { name: "Banners", icon: ImageIcon, href: "/admin/banners" },
    { name: "Announcements", icon: Megaphone, href: "/admin/announcements" },
    { name: "Users", icon: Users, href: "/admin/users" },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-4 flex flex-col">
      <div className="text-xl font-bold mb-8 px-4 py-2 border-b border-gray-800">
        Marilah Admin
      </div>
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition"
          >
            <item.icon className="w-5 h-5" />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
      <div className="mt-auto pt-4 border-t border-gray-800">
        <Link href="/api/auth/signout" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-900 text-red-400 transition">
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </Link>
      </div>
    </aside>
  );
}
