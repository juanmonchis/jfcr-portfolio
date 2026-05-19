"use client";

import { useState } from "react";
import Link from "next/link";
import BlockEditor from "@/components/admin/BlockEditor";
import { Block } from "@/components/CaseStudy/BlockRenderer";

interface Props {
  projectId: number;
  projectTitle: string;
  initialSlug: string;
  initialTeamMembers: string[];
  initialBlocks: string;
  initialDescription: string;
  initialCtaLabel: string;
  initialCtaUrl: string;
  existingSlug: string | null;
}

function parseBlocks(raw: string): Block[] {
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export default function CaseStudyEditorClient({
  projectId,
  initialSlug,
  initialTeamMembers,
  initialBlocks,
  initialDescription,
  initialCtaLabel,
  initialCtaUrl,
  existingSlug,
}: Props) {
  const [slug, setSlug] = useState(initialSlug);
  const [teamInput, setTeamInput] = useState(initialTeamMembers.join(", "));
  const [description, setDescription] = useState(initialDescription);
  const [ctaLabel, setCtaLabel] = useState(initialCtaLabel);
  const [ctaUrl, setCtaUrl] = useState(initialCtaUrl);
  const [blocks, setBlocks] = useState<Block[]>(() => parseBlocks(initialBlocks));
  const [saving, setSaving] = useState(false);
  const [savedSlug, setSavedSlug] = useState<string | null>(existingSlug);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSuccess(false);

    const teamMembers = teamInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      const res = await fetch(`/api/admin/case-studies/${projectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          teamMembers,
          blocks,
          description: description || null,
          ctaLabel: ctaLabel || null,
          ctaUrl: ctaUrl || null,
        }),
      });

      if (!res.ok) {
        let message = "Failed to save";
        try {
          const data = await res.json() as { error?: string };
          message = data.error ?? message;
        } catch {}
        throw new Error(message);
      }

      setSavedSlug(slug);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#0C0D1F] focus:outline-none focus:ring-1 focus:ring-[#0C0D1F]";
  const labelClass = "block text-xs font-semibold text-gray-500 mb-1";

  return (
    <div className="flex flex-col gap-6">
      {/* Back link */}
      <div>
        <Link
          href={`/admin/projects/${projectId}`}
          className="text-sm text-gray-500 hover:text-[#0C0D1F]"
        >
          ← Back to project
        </Link>
      </div>

      {/* Meta fields */}
      <div className="bg-white rounded-2xl p-6 flex flex-col gap-4">
        <h2 className="text-lg font-bold text-[#0C0D1F]">Case Study Settings</h2>

        <div>
          <label className={labelClass}>Slug</label>
          <input
            type="text"
            className={inputClass}
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="my-project-slug"
          />
          <p className="text-xs text-gray-400 mt-1">
            Public URL: /projects/{slug || "..."}
          </p>
        </div>

        <div>
          <label className={labelClass}>Description</label>
          <textarea
            className={`${inputClass} resize-none`}
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Shown in the hero section of this case study…"
          />
        </div>

        <div>
          <label className={labelClass}>Team Members (comma-separated)</label>
          <input
            type="text"
            className={inputClass}
            value={teamInput}
            onChange={(e) => setTeamInput(e.target.value)}
            placeholder="Alice, Bob, Charlie"
          />
        </div>

        <div className="flex flex-col gap-3">
          <p className={labelClass}>CTA (optional)</p>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className={labelClass}>Label</label>
              <input
                type="text"
                className={inputClass}
                value={ctaLabel}
                onChange={(e) => setCtaLabel(e.target.value)}
                placeholder="View prototype"
              />
            </div>
            <div className="flex-1">
              <label className={labelClass}>URL</label>
              <input
                type="text"
                className={inputClass}
                value={ctaUrl}
                onChange={(e) => setCtaUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Block editor */}
      <div className="bg-white rounded-2xl p-6 flex flex-col gap-4">
        <h2 className="text-lg font-bold text-[#0C0D1F]">Content Blocks</h2>
        <BlockEditor blocks={blocks} onChange={setBlocks} />
      </div>

      {/* Save / status */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="bg-[#0C0D1F] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-[#0C0D1F]/80 disabled:opacity-50 transition-colors"
        >
          {saving ? "Saving…" : "Save Case Study"}
        </button>

        {savedSlug && (
          <Link
            href={`/projects/${savedSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#0C0D1F] underline hover:no-underline"
          >
            View case study →
          </Link>
        )}

        {error && <p className="text-sm text-red-500">{error}</p>}
        {success && <p className="text-sm text-green-600">Saved!</p>}
      </div>
    </div>
  );
}
