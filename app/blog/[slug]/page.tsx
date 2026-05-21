import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
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
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://www.jfcr.design/blog/${slug}`,
      type: "article",
      ...(post.coverImage ? { images: [{ url: post.coverImage }] } : {}),
    },
    twitter: {
      card: post.coverImage ? "summary_large_image" : "summary",
      title: post.title,
      description: post.excerpt,
      ...(post.coverImage ? { images: [post.coverImage] } : {}),
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

  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const blocks = parseBlocks(post.blocks);
  const hasBlocks = blocks.length > 0;

  return (
    <div className="relative min-h-screen bg-[#0C0D1F]">
      <SiteHeader logoSize={100} logoVariant="light" color="#F2EBD9" />

      {/* Hero */}
      <div className="px-6 md:px-12 lg:px-20 pt-40 pb-8 max-w-3xl mx-auto">
        <p className="type-tag text-[#F2EBD9]/40 mb-4">{formattedDate}</p>
        <h1 className="type-case-title text-[#F2EBD9] mb-6">
          {post.title}
        </h1>
        <p className="type-paragraph text-[#F2EBD9]/60 mb-8">{post.excerpt}</p>

        {post.coverImage && (
          <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-10">
            <Image src={assetPath(post.coverImage)} alt={post.title} fill className="object-cover" />
          </div>
        )}
      </div>

      {/* Content */}
      {hasBlocks ? (
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 pb-20">
          <BlockRenderer blocks={blocks} />
        </div>
      ) : post.content ? (
        <div className="px-6 md:px-12 lg:px-20 pb-20 max-w-3xl mx-auto">
          <div className="prose text-white/80" dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      ) : null}
    </div>
  );
}
