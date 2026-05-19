"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BlockEditor from "@/components/admin/BlockEditor";
import MediaUploadInput from "@/components/admin/MediaUploadInput";
import { Block } from "@/components/CaseStudy/BlockRenderer";

interface PostFormData {
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  blocks: Block[];
  published: boolean;
}

interface PostFormProps {
  initialData?: {
    id?: number;
    title?: string;
    slug?: string;
    excerpt?: string;
    coverImage?: string;
    blocks?: string;
    published?: boolean;
  };
  mode: "create" | "edit";
}

function parseBlocks(raw?: string): Block[] {
  try {
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function PostForm({ initialData, mode }: PostFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<PostFormData>({
    title: initialData?.title ?? "",
    slug: initialData?.slug ?? "",
    excerpt: initialData?.excerpt ?? "",
    coverImage: initialData?.coverImage ?? "",
    blocks: parseBlocks(initialData?.blocks),
    published: initialData?.published ?? false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function autoSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const title = e.target.value;
    setForm((prev) => ({
      ...prev,
      title,
      slug: mode === "create" ? autoSlug(title) : prev.slug,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const url = mode === "create" ? "/api/admin/posts" : `/api/admin/posts/${initialData?.id}`;
    const method = mode === "create" ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, blocks: form.blocks }),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/admin/posts");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Something went wrong. Please try again.");
    }
  }

  const inputClass = "w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0C0D1F] transition-colors";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm">{error}</div>
      )}

      {/* Meta */}
      <div className="bg-white rounded-2xl p-6 flex flex-col gap-4">
        <h2 className="text-lg font-bold text-[#0C0D1F]">Post Settings</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Title *</label>
            <input type="text" value={form.title} onChange={handleTitleChange} required className={inputClass} placeholder="Post title..." />
          </div>
          <div>
            <label className={labelClass}>Slug *</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
              required
              className={`${inputClass} font-mono`}
              placeholder="post-slug"
            />
            <p className="text-xs text-gray-400 mt-1">Public URL: /blog/{form.slug || "..."}</p>
          </div>
        </div>

        <div>
          <label className={labelClass}>Excerpt *</label>
          <textarea
            value={form.excerpt}
            onChange={(e) => setForm((p) => ({ ...p, excerpt: e.target.value }))}
            required
            rows={3}
            className={`${inputClass} resize-none`}
            placeholder="Brief description of the post..."
          />
        </div>

        <div>
          <label className={labelClass}>Cover Image</label>
          <MediaUploadInput
            value={form.coverImage}
            onChange={(url) => setForm((p) => ({ ...p, coverImage: url }))}
            placeholder="https://... or upload a file"
            previewClass="h-40"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="published"
            checked={form.published}
            onChange={(e) => setForm((p) => ({ ...p, published: e.target.checked }))}
            className="w-4 h-4 rounded accent-[#0C0D1F]"
          />
          <label htmlFor="published" className="text-sm font-semibold text-gray-700">Published</label>
        </div>
      </div>

      {/* Block editor */}
      <div className="bg-white rounded-2xl p-6 flex flex-col gap-4">
        <h2 className="text-lg font-bold text-[#0C0D1F]">Content Blocks</h2>
        <BlockEditor blocks={form.blocks} onChange={(blocks) => setForm((p) => ({ ...p, blocks }))} />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-[#0C0D1F] text-white font-semibold px-6 py-2.5 rounded-xl hover:opacity-80 transition-opacity text-sm disabled:opacity-50"
        >
          {loading ? "Saving..." : mode === "create" ? "Create Post" : "Save Changes"}
        </button>
        <button type="button" onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
          Cancel
        </button>
        {mode === "edit" && initialData?.slug && (
          <a
            href={`/blog/${initialData.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#0C0D1F] underline hover:no-underline ml-2"
          >
            View post →
          </a>
        )}
      </div>
    </form>
  );
}
