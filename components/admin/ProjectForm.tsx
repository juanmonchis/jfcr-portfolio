"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ProjectFormData {
  title: string;
  subtitle: string;
  tags: string; // comma-separated input
  description: string;
  ctaLabel: string;
  ctaHref: string;
  thumbnailUrl: string;
  cardColor: string;
  size: "default" | "small" | "xsmall";
  showThumbnailOnMobile: boolean;
  order: number;
}

interface ProjectFormProps {
  initialData?: Partial<ProjectFormData> & { id?: number };
  mode: "create" | "edit";
}

export default function ProjectForm({ initialData, mode }: ProjectFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<ProjectFormData>({
    title: initialData?.title ?? "",
    subtitle: initialData?.subtitle ?? "",
    tags: initialData?.tags ?? "",
    description: initialData?.description ?? "",
    ctaLabel: initialData?.ctaLabel ?? "View Project",
    ctaHref: initialData?.ctaHref ?? "#",
    thumbnailUrl: initialData?.thumbnailUrl ?? "",
    cardColor: initialData?.cardColor ?? "#B8C8FF",
    size: initialData?.size ?? "default",
    showThumbnailOnMobile: initialData?.showThumbnailOnMobile ?? true,
    order: initialData?.order ?? 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const data = new FormData();
    data.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: data });
    const json = await res.json();
    if (res.ok) {
      setForm((p) => ({ ...p, thumbnailUrl: json.url }));
    } else {
      setError(json.error || "Upload failed.");
    }
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const tagsArray = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      ...form,
      tags: JSON.stringify(tagsArray),
    };

    const url =
      mode === "create"
        ? "/api/admin/projects"
        : `/api/admin/projects/${initialData?.id}`;
    const method = mode === "create" ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/admin/projects");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Something went wrong.");
    }
  }

  const inputClass =
    "w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0C0D1F] transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Title *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            required
            className={inputClass}
            placeholder="Project title"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Subtitle</label>
          <input
            type="text"
            value={form.subtitle}
            onChange={(e) => setForm((p) => ({ ...p, subtitle: e.target.value }))}
            className={inputClass}
            placeholder="Brief subtitle (optional)"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Tags (comma-separated)</label>
        <input
          type="text"
          value={form.tags}
          onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))}
          className={inputClass}
          placeholder="Design, Branding, Motion"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Description *</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
          required
          rows={3}
          className={`${inputClass} resize-none`}
          placeholder="Project description..."
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">CTA Label *</label>
        <input
          type="text"
          value={form.ctaLabel}
          onChange={(e) => setForm((p) => ({ ...p, ctaLabel: e.target.value }))}
          required
          className={inputClass}
          placeholder="View Project"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Thumbnail</label>
        <div className="flex items-center gap-3">
          <label className="cursor-pointer bg-[#0C0D1F] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:opacity-80 transition-opacity whitespace-nowrap">
            {uploading ? "Uploading..." : "Upload image"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
              disabled={uploading}
            />
          </label>
          <input
            type="text"
            value={form.thumbnailUrl}
            onChange={(e) => setForm((p) => ({ ...p, thumbnailUrl: e.target.value }))}
            className={`${inputClass} flex-1`}
            placeholder="/images/my-image.jpg"
          />
        </div>
        {form.thumbnailUrl && (
          <img src={form.thumbnailUrl} alt="Thumbnail preview" className="mt-3 h-24 rounded-xl object-cover" />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Card Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={form.cardColor}
              onChange={(e) => setForm((p) => ({ ...p, cardColor: e.target.value }))}
              className="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={form.cardColor}
              onChange={(e) => setForm((p) => ({ ...p, cardColor: e.target.value }))}
              className={`${inputClass} flex-1`}
              placeholder="#B8C8FF"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Card Size</label>
          <select
            value={form.size}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                size: e.target.value as "default" | "small" | "xsmall",
              }))
            }
            className={inputClass}
          >
            <option value="default">Default (full width)</option>
            <option value="small">Small (2 per row)</option>
            <option value="xsmall">Extra Small (3 per row)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Order (within size group)</label>
          <input
            type="number"
            value={form.order}
            onChange={(e) =>
              setForm((p) => ({ ...p, order: parseInt(e.target.value) || 0 }))
            }
            className={inputClass}
            min={0}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="showMobile"
          checked={form.showThumbnailOnMobile}
          onChange={(e) =>
            setForm((p) => ({ ...p, showThumbnailOnMobile: e.target.checked }))
          }
          className="w-4 h-4 rounded accent-[#0C0D1F]"
        />
        <label htmlFor="showMobile" className="text-sm font-semibold text-gray-700">
          Show thumbnail on mobile
        </label>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-[#0C0D1F] text-white font-semibold px-6 py-2.5 rounded-xl hover:opacity-80 transition-opacity text-sm disabled:opacity-50"
        >
          {loading ? "Saving..." : mode === "create" ? "Create Project" : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
