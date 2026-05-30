import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const [userCount, postCount, pendingPosts, categoryCount] = await Promise.all([
    prisma.user.count(),
    prisma.post.count(),
    prisma.post.count({ where: { status: "PENDING" } }),
    prisma.category.count(),
  ]);

  const recentPosts = await prisma.post.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true } }, category: true },
  });

  const stats = [
    { name: "Total Users", value: userCount, color: "bg-blue-500" },
    { name: "Total Posts", value: postCount, color: "bg-green-500" },
    { name: "Pending Review", value: pendingPosts, color: "bg-yellow-500" },
    { name: "Categories", value: categoryCount, color: "bg-purple-500" },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm">{stat.name}</p>
            <p className="text-3xl font-bold mt-2">{stat.value}</p>
            <div className={`h-1 w-12 mt-4 ${stat.color} rounded-full`}></div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-bold">Recent Submissions</h2>
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
            <tr>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">User</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {recentPosts.map((post) => (
              <tr key={post.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium">{post.title}</td>
                <td className="px-6 py-4">{post.user?.name || "Unknown"}</td>
                <td className="px-6 py-4">{post.category.name}</td>
                <td className="px-6 py-4 text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                    post.status === "APPROVED" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {post.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
