import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import path from "path";
import { existsSync } from "fs";
import SiteHeader from "@/components/SiteHeader";
import BlockRenderer, { Block } from "@/components/CaseStudy/BlockRenderer";
import { assetPath } from "@/lib/assetPath";

export const dynamicParams = false;

export async function generateStaticParams() {
  try {
    const posts = await prisma.post.findMany({ where: { published: true }, select: { slug: true } });
    return posts.map((p: { slug: string }) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug, published: true } });
  if (!post) return {};

  // Link preview: the generated 1200x630 card (illustration + title + blurb) from
  // scripts/generate-og.mjs. Falls back to the raw cover image if it wasn't generated.
  const ogFile = path.join(process.cwd(), "public", "og", `${slug}.png`);
  const previewImage = existsSync(ogFile)
    ? { url: `/og/${slug}.png`, width: 1200, height: 630, alt: `${post.title} — Notes by JFCR` }
    : post.coverImage
      ? { url: post.coverImage }
      : null;

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://www.jfcr.design/notes/${slug}`,
      type: "article",
      ...(previewImage ? { images: [previewImage] } : {}),
    },
    twitter: {
      card: previewImage ? "summary_large_image" : "summary",
      title: post.title,
      description: post.excerpt,
      ...(previewImage ? { images: [previewImage.url] } : {}),
    },
  };
}

function parseBlocks(raw: string): Block[] {
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: { slug, published: true },
  });

  if (!post) notFound();

  const adjacentSelect = { slug: true, title: true, createdAt: true } as const;
  const [newer, older] = await Promise.all([
    prisma.post.findFirst({
      where: { published: true, createdAt: { gt: post.createdAt } },
      orderBy: { createdAt: "asc" },
      select: adjacentSelect,
    }),
    prisma.post.findFirst({
      where: { published: true, createdAt: { lt: post.createdAt } },
      orderBy: { createdAt: "desc" },
      select: adjacentSelect,
    }),
  ]);
  const keepReading = [
    newer,
    older,
  ].filter(Boolean) as { slug: string; title: string; createdAt: Date }[];

  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const blocks = parseBlocks(post.blocks);
  const hasBlocks = blocks.length > 0;

  return (
    <div className="relative min-h-screen bg-[#DDED3C]">
      <SiteHeader logoSize={100} logoVariant="dark" color="#0C0D1F" mobileOverlayColor="#F2EBD9" mobileNavColor="#0C0D1F" mobileLogoVariant="dark" />

      <Link
        href="/notes"
        className="type-tag md:hidden absolute top-10 left-1/2 -translate-x-1/2 z-40 whitespace-nowrap rounded-full border-2 border-[#0C0D1F] !text-[#0C0D1F] px-5 py-2 hover:bg-[#F2EBD9] transition-colors duration-300"
      >
        ← Back to posts
      </Link>

      {/* Hero: image first, then the pink title container */}
      <div className="px-6 md:px-12 pt-36 md:pt-40 pb-12 max-w-[1400px] mx-auto">
        {post.coverImage && (
          <div className="relative w-full aspect-[16/9] md:aspect-[2/1] rounded-t-3xl overflow-hidden">
            <Image src={assetPath(post.coverImage)} alt={post.title} fill priority sizes="(min-width: 1400px) 1400px, 100vw" className="object-cover" />
          </div>
        )}

        <div className="bg-[#F2EBD9] rounded-b-3xl p-6 md:p-12">
          <p className="type-tag !text-[#0C0D1F]/60 mb-4">{formattedDate}</p>
          <div className="flex items-start gap-6 mb-6">
            <Link
              href="/notes"
              aria-label="Back to posts"
              className="hidden md:flex shrink-0 mt-2 w-12 h-12 rounded-full border-2 border-[#0C0D1F] items-center justify-center text-[#0C0D1F] hover:bg-[#DDED3C] hover:-translate-x-1 transition-all duration-300"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                <path d="M16 10H4M9 4.5L3.5 10L9 15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <h1 className="type-case-title !text-[#0C0D1F] max-w-4xl">
              {post.title}
            </h1>
          </div>
          <div className="pb-8 md:pb-12 border-b border-[#0C0D1F]/25">
            <p className="type-paragraph !text-[#0C0D1F]/70 max-w-3xl">{post.excerpt}</p>
          </div>

          {/* Content */}
          {hasBlocks ? (
            <div className="blog-post mt-8 md:mt-12">
              <BlockRenderer blocks={blocks} />
            </div>
          ) : post.content ? (
            <div className="blog-post mt-8 md:mt-12">
              <div className="prose blog-prose max-w-3xl" dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>
          ) : null}

          {/* Sign-off */}
          <div className="mt-12 md:mt-16 max-w-3xl">
            <p
              className="text-[#0C0D1F]"
              style={{ fontFamily: "var(--font-migra), serif", fontStyle: "italic", fontSize: "clamp(2.25rem, 5vw, 3.5rem)", lineHeight: 1.1, fontWeight: 800 }}
            >
              Juan Felipe
            </p>
            <p className="type-tag !text-[#0C0D1F]/60 mt-3">{formattedDate}</p>

            {keepReading.length > 0 && (
              <div className="mt-12">
                <p className="type-tag !text-[#0C0D1F] mb-4">Keep reading</p>
                <ul>
                  {keepReading.map((p) => (
                    <li key={p.slug} className="border-b border-[#0C0D1F]/25">
                      <Link href={`/notes/${p.slug}`} className="group flex items-baseline gap-4 md:gap-8 py-4">
                        <span className="type-card-description !text-[#0C0D1F] !text-lg flex-1 group-hover:underline decoration-2 underline-offset-4">{p.title}</span>
                        <span className="type-tag !text-[#0C0D1F]/60 hidden sm:block shrink-0">
                          {new Date(p.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-16 md:mt-24 pt-6 border-t-2 border-[#0C0D1F] flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="type-tag !text-[#0C0D1F]">Notes are written and published by Juan Felipe.</p>
            <Link href="/notes" className="type-tag !text-[#0C0D1F] hover:underline underline-offset-4 decoration-2">← All notes</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
