import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import BlogCard from "@/components/BlogCard";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Notes",
  description: "Thoughts on design, creativity, and building things that matter.",
  openGraph: {
    title: "Notes - JFCR",
    description: "Thoughts on design, creativity, and building things that matter.",
    url: "https://www.jfcr.design/notes",
  },
};

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="relative min-h-screen bg-[#F2EBD9]">
      <SiteHeader logoSize={100} logoVariant="dark" color="#0C0D1F" mobileOverlayColor="#F2EBD9" mobileNavColor="#0C0D1F" mobileLogoVariant="dark" />

      <main className="px-6 md:px-12 pt-36 md:pt-64 pb-24 max-w-[1400px] mx-auto">
        <header className="mb-14 flex flex-col gap-4">
          <h1 className="type-case-title !text-[#0C0D1F]">Notes</h1>
          <p className="type-paragraph !text-[#0C0D1F]/60 max-w-xl">
            Thoughts and rants on design, inspiration and the creative process without interfering AI
          </p>
        </header>

        {posts.length > 0 ? (
          // Each card carries a left border + padding; the grid is shifted left by that
          // padding (the card itself adds more padding for its hover container) and clipped, so dividers appear only between columns at any width.
          <div className="overflow-hidden">
            <div className="-ml-3 grid border-t border-[#0C0D1F]/20 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {posts.map((post: any) => (
                <div key={post.id} className="flex flex-col border-l border-b border-[#0C0D1F]/20">
                  <BlogCard
                    title={post.title}
                    slug={post.slug}
                    excerpt={post.excerpt}
                    coverImage={post.coverImage}
                    createdAt={post.createdAt}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="type-caption-sm !text-[#0C0D1F]/40">No posts published yet.</p>
        )}
      </main>
    </div>
  );
}
