import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PostForm from "@/components/admin/PostForm";

export const dynamic = "force-dynamic";
export function generateStaticParams() { return []; }

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id: parseInt(id) } });

  if (!post) {
    notFound();
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-black text-[#0C0D1F]">Edit Post</h1>
        <p className="text-gray-500 text-sm mt-1">{post.title}</p>
      </div>
      <div className="bg-white rounded-2xl p-6">
        <PostForm
          mode="edit"
          initialData={{
            id: post.id,
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            coverImage: post.coverImage ?? "",
            blocks: post.blocks,
            published: post.published,
          }}
        />
      </div>
    </div>
  );
}
