import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [postCount, projectCount, borderedItemCount] = await Promise.all([
    prisma.post.count(),
    prisma.project.count(),
    prisma.borderedItem.count(),
  ]);

  const cards = [
    {
      title: "Blog Posts",
      count: postCount,
      href: "/admin/posts",
      newHref: "/admin/posts/new",
      color: "#B8C8FF",
    },
    {
      title: "Projects",
      count: projectCount,
      href: "/admin/projects",
      newHref: "/admin/projects/new",
      color: "#DDED3C",
    },
    {
      title: "Bordered Items",
      count: borderedItemCount,
      href: "/admin/bordered-items",
      newHref: "/admin/bordered-items/new",
      color: "#FFD6A5",
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-black text-[#0C0D1F] mb-2">Dashboard</h1>
      <p className="text-gray-500 mb-8">Manage your portfolio content</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div
            key={card.title}
            className="rounded-2xl p-6"
            style={{ backgroundColor: card.color }}
          >
            <h2 className="text-xl font-black text-[#0C0D1F] mb-1">{card.title}</h2>
            <p className="text-4xl font-black text-[#0C0D1F] mb-6">{card.count}</p>
            <div className="flex gap-3">
              <Link
                href={card.href}
                className="text-sm font-semibold border-2 border-[#0C0D1F] text-[#0C0D1F] px-4 py-2 rounded-full hover:bg-[#0C0D1F] hover:text-white transition-colors"
              >
                Manage
              </Link>
              <Link
                href={card.newHref}
                className="text-sm font-semibold bg-[#0C0D1F] text-white px-4 py-2 rounded-full hover:opacity-80 transition-opacity"
              >
                + New
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
