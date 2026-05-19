import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import BlogCard from "@/components/BlogCard";
import SiteHeader from "@/components/SiteHeader";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts on design, creativity, and building things that matter.",
  openGraph: {
    title: "Blog — JFCR",
    description: "Thoughts on design, creativity, and building things that matter.",
    url: "https://www.jfcr.design/blog",
  },
};

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="relative min-h-screen bg-[#0C0D1F]">
      <SiteHeader logoSize={100} logoVariant="light" color="#F2EBD9" />

      <main className="px-6 md:px-12 lg:px-20 pt-40 pb-16 max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Blog</h1>
        <p className="text-white/60 mb-12 text-lg">Thoughts on design, products, and everything in between.</p>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <BlogCard
                key={post.id}
                title={post.title}
                slug={post.slug}
                excerpt={post.excerpt}
                coverImage={post.coverImage}
                createdAt={post.createdAt}
              />
            ))}
          </div>
        ) : (
          <p className="text-white/40">No posts published yet.</p>
        )}
      </main>
    </div>
  );
}
