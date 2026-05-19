"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface BorderedItemFormData {
  title: string;
  tags: string; // comma-separated
  href: string;
  bgColor: string;
  textColor: string;
  tagColor: string;
  glowColor: string;
  order: number;
}

interface BorderedItemFormProps {
  initialData?: Partial<BorderedItemFormData> & { id?: number };
  mode: "create" | "edit";
}

export default function BorderedItemForm({ initialData, mode }: BorderedItemFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<BorderedItemFormData>({
    title: initialData?.title ?? "",
    tags: initialData?.tags ?? "",
    href: initialData?.href ?? "#",
    bgColor: initialData?.bgColor ?? "transparent",
    textColor: initialData?.textColor ?? "#0C0D1F",
    tagColor: initialData?.tagColor ?? "#0C0D1F",
    glowColor: initialData?.glowColor ?? "#0C0D1F",
    order: initialData?.order ?? 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
        ? "/api/admin/bordered-items"
        : `/api/admin/bordered-items/${initialData?.id}`;
    const method = mode === "create" ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/admin/bordered-items");
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

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Title *</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          required
          className={inputClass}
          placeholder="Project name"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Tags (comma-separated)</label>
        <input
          type="text"
          value={form.tags}
          onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))}
          className={inputClass}
          placeholder="Design, Art Direction"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Link URL *</label>
        <input
          type="text"
          value={form.href}
          onChange={(e) => setForm((p) => ({ ...p, href: e.target.value }))}
          required
          className={inputClass}
          placeholder="https://..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <ColorField
          label="Background Color"
          value={form.bgColor}
          onChange={(v) => setForm((p) => ({ ...p, bgColor: v }))}
          placeholder="transparent or #FFFFFF"
        />
        <ColorField
          label="Text Color"
          value={form.textColor}
          onChange={(v) => setForm((p) => ({ ...p, textColor: v }))}
          placeholder="#0C0D1F"
          showPicker={form.textColor.startsWith("#")}
        />
        <ColorField
          label="Tag Color"
          value={form.tagColor}
          onChange={(v) => setForm((p) => ({ ...p, tagColor: v }))}
          placeholder="#0C0D1F"
          showPicker={form.tagColor.startsWith("#")}
        />
        <ColorField
          label="Glow Color (hover)"
          value={form.glowColor}
          onChange={(v) => setForm((p) => ({ ...p, glowColor: v }))}
          placeholder="#0C0D1F"
          showPicker={form.glowColor.startsWith("#")}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Order</label>
        <input
          type="number"
          value={form.order}
          onChange={(e) => setForm((p) => ({ ...p, order: parseInt(e.target.value) || 0 }))}
          className={inputClass}
          min={0}
        />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-[#0C0D1F] text-white font-semibold px-6 py-2.5 rounded-xl hover:opacity-80 transition-opacity text-sm disabled:opacity-50"
        >
          {loading ? "Saving..." : mode === "create" ? "Create Item" : "Save Changes"}
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

function ColorField({
  label,
  value,
  onChange,
  placeholder,
  showPicker = true,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  showPicker?: boolean;
}) {
  const inputClass =
    "border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0C0D1F] transition-colors";
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
      <div className="flex items-center gap-2">
        {showPicker && (
          <input
            type="color"
            value={value.startsWith("#") ? value : "#000000"}
            onChange={(e) => onChange(e.target.value)}
            className="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer flex-shrink-0"
          />
        )}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputClass} flex-1`}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
