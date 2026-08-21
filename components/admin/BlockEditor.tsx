"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Block, GridImage, PackVersion } from "@/components/CaseStudy/BlockRenderer";
import MediaUploadInput from "@/components/admin/MediaUploadInput";

const Editor = dynamic(() => import("@/components/admin/Editor"), { ssr: false });

// Keep alias so existing single-image block usage stays readable
const ImageUploadInput = MediaUploadInput;

function ProjectTagInput({ tags, onChange, suggestions, listId }: { tags: string[]; onChange: (tags: string[]) => void; suggestions: string[]; listId: string }) {
  const [inputValue, setInputValue] = useState("");

  function addTag(raw: string) {
    const tag = raw.trim();
    if (tag && !tags.includes(tag)) onChange([...tags, tag]);
    setInputValue("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") { e.preventDefault(); addTag(inputValue); }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    if (val.endsWith(",")) { addTag(val.slice(0, -1)); return; }
    setInputValue(val);
  }

  return (
    <div className="flex flex-col gap-1">
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {tags.map(t => (
            <span key={t} className="inline-flex items-center gap-1 text-xs bg-[#0C0D1F] text-white px-2 py-1 rounded-full">
              {t}
              <button type="button" onClick={() => onChange(tags.filter(x => x !== t))} className="hover:opacity-70 leading-none">×</button>
            </span>
          ))}
        </div>
      )}
      <input
        type="text"
        list={listId}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#0C0D1F] focus:outline-none focus:ring-1 focus:ring-[#0C0D1F]"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Project tag (comma or Enter to add)"
      />
      <datalist id={listId}>
        {suggestions.filter(s => !tags.includes(s)).map(s => <option key={s} value={s} />)}
      </datalist>
    </div>
  );
}

function BulkUploadButton({ onUploaded }: { onUploaded: (urls: string[]) => void }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    setProgress({ done: 0, total: files.length });

    const urls: string[] = [];
    for (const file of files) {
      const data = new FormData();
      data.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: data });
      const json = await res.json();
      if (res.ok) urls.push(json.url);
      setProgress((p) => p ? { ...p, done: p.done + 1 } : null);
    }

    onUploaded(urls);
    setUploading(false);
    setProgress(null);
    e.target.value = "";
  }

  return (
    <label className="cursor-pointer text-xs text-[#0C0D1F] border border-dashed border-gray-400 rounded-lg px-3 py-2 hover:border-[#0C0D1F] hover:bg-gray-50 transition-colors">
      {uploading && progress
        ? `Uploading ${progress.done}/${progress.total}…`
        : "+ Bulk upload"}
      <input
        type="file"
        accept="image/*,video/mp4"
        multiple
        className="hidden"
        onChange={handleFiles}
        disabled={uploading}
      />
    </label>
  );
}

interface BlockEditorProps {
  blocks: Block[];
  onChange: (blocks: Block[]) => void;
}

const BLOCK_TYPES = [
  { value: "heading", label: "Heading" },
  { value: "text", label: "Rich Text" },
  { value: "image", label: "Image" },
  { value: "two-col", label: "Two Columns" },
  { value: "image-grid", label: "Card Deck" },
  { value: "video", label: "Video" },
  { value: "divider", label: "Divider" },
  { value: "highlight", label: "Highlight Quote" },
  { value: "button", label: "Button" },
  { value: "text-boxes", label: "Text Boxes" },
  { value: "feature-info", label: "Feature Info" },
  { value: "card-summary", label: "Card Summary" },
] as const;

function createBlock(type: Block["type"]): Block {
  const id = crypto.randomUUID();
  switch (type) {
    case "heading":
      return { id, type: "heading", level: 2, text: "" };
    case "text":
      return { id, type: "text", html: "<p></p>" };
    case "image":
      return { id, type: "image", url: "", width: "full" };
    case "two-col":
      return { id, type: "two-col", leftType: "text", leftContent: "", rightType: "text", rightContent: "" };
    case "image-grid":
      return { id, type: "image-grid", images: [{ url: "" }, { url: "" }], columns: 2 };
    case "video":
      return { id, type: "video", url: "", size: "large" };
    case "divider":
      return { id, type: "divider" };
    case "highlight":
      return { id, type: "highlight", text: "" };
    case "button":
      return { id, type: "button", text: "Click here", url: "", align: "left" };
    case "text-boxes":
      return { id, type: "text-boxes", items: [""] };
    case "feature-info":
      return { id, type: "feature-info", items: [""] };
    case "card-summary":
      return { id, type: "card-summary", heading: "", intro: "", items: ["01 — "] };
  }
}

function BlockItem({
  block,
  index,
  total,
  onUpdate,
  onRemove,
  onMove,
}: {
  block: Block;
  index: number;
  total: number;
  onUpdate: (updated: Block) => void;
  onRemove: () => void;
  onMove: (direction: "up" | "down") => void;
}) {
  const labelClass = "block text-xs font-semibold text-gray-500 mb-1";
  const inputClass =
    "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#0C0D1F] focus:outline-none focus:ring-1 focus:ring-[#0C0D1F]";
  const selectClass = inputClass;

  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold uppercase tracking-wide text-gray-400">
          {block.type === "image-grid" ? "card deck"
            : block.type === "feature-info" ? "feature info"
            : block.type === "card-summary" ? "card summary"
            : block.type}
        </span>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => onMove("up")}
            disabled={index === 0}
            className="px-2 py-1 text-xs rounded border border-gray-200 hover:bg-gray-100 disabled:opacity-30"
          >
            ↑
          </button>
          <button
            type="button"
            onClick={() => onMove("down")}
            disabled={index === total - 1}
            className="px-2 py-1 text-xs rounded border border-gray-200 hover:bg-gray-100 disabled:opacity-30"
          >
            ↓
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="px-2 py-1 text-xs rounded border border-red-200 text-red-500 hover:bg-red-50"
          >
            Remove
          </button>
        </div>
      </div>

      {/* Fields */}
      {block.type === "heading" && (
        <div className="flex flex-col gap-3">
          <div>
            <label className={labelClass}>Level</label>
            <select
              className={selectClass}
              value={block.level}
              onChange={(e) =>
                onUpdate({ ...block, level: parseInt(e.target.value) as 1 | 2 | 3 })
              }
            >
              <option value={1}>H1</option>
              <option value={2}>H2</option>
              <option value={3}>H3</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Text</label>
            <input
              type="text"
              className={inputClass}
              value={block.text}
              onChange={(e) => onUpdate({ ...block, text: e.target.value })}
            />
          </div>
        </div>
      )}

      {block.type === "text" && (
        <div>
          <label className={labelClass}>Content</label>
          <Editor
            value={block.html}
            onChange={(html) => onUpdate({ ...block, html })}
          />
        </div>
      )}

      {block.type === "image" && (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Image (desktop)</label>
              <ImageUploadInput value={block.url} onChange={(url) => onUpdate({ ...block, url })} />
            </div>
            <div>
              <label className={labelClass}>Image (mobile, optional)</label>
              <ImageUploadInput value={block.mobileUrl ?? ""} onChange={(url) => onUpdate({ ...block, mobileUrl: url || undefined })} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Caption (optional)</label>
            <input
              type="text"
              className={inputClass}
              value={block.caption ?? ""}
              onChange={(e) => onUpdate({ ...block, caption: e.target.value || undefined })}
            />
          </div>
          <div>
            <label className={labelClass}>Width</label>
            <select
              className={selectClass}
              value={block.width}
              onChange={(e) =>
                onUpdate({ ...block, width: e.target.value as "full" | "contained" })
              }
            >
              <option value="full">Full width</option>
              <option value="contained">Max width 1200px (centered)</option>
            </select>
          </div>
        </div>
      )}

      {block.type === "two-col" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-3">
            <p className="text-xs font-bold text-gray-400 uppercase">Left</p>
            <div>
              <label className={labelClass}>Type</label>
              <select
                className={selectClass}
                value={block.leftType}
                onChange={(e) =>
                  onUpdate({ ...block, leftType: e.target.value as "text" | "image", leftContent: "" })
                }
              >
                <option value="text">Text (HTML)</option>
                <option value="image">Image URL</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>{block.leftType === "text" ? "HTML" : "Image"}</label>
              {block.leftType === "text" ? (
                <Editor value={block.leftContent} onChange={(html) => onUpdate({ ...block, leftContent: html })} />
              ) : (
                <div className="flex flex-col gap-2">
                  <ImageUploadInput value={block.leftContent} onChange={(url) => onUpdate({ ...block, leftContent: url })} />
                  <input type="text" className={inputClass} value={block.leftCaption ?? ""} onChange={(e) => onUpdate({ ...block, leftCaption: e.target.value || undefined })} placeholder="Caption (optional)" />
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-xs font-bold text-gray-400 uppercase">Right</p>
            <div>
              <label className={labelClass}>Type</label>
              <select
                className={selectClass}
                value={block.rightType}
                onChange={(e) =>
                  onUpdate({ ...block, rightType: e.target.value as "text" | "image", rightContent: "" })
                }
              >
                <option value="text">Text (HTML)</option>
                <option value="image">Image URL</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>{block.rightType === "text" ? "HTML" : "Image"}</label>
              {block.rightType === "text" ? (
                <Editor value={block.rightContent} onChange={(html) => onUpdate({ ...block, rightContent: html })} />
              ) : (
                <div className="flex flex-col gap-2">
                  <ImageUploadInput value={block.rightContent} onChange={(url) => onUpdate({ ...block, rightContent: url })} />
                  <input type="text" className={inputClass} value={block.rightCaption ?? ""} onChange={(e) => onUpdate({ ...block, rightCaption: e.target.value || undefined })} placeholder="Caption (optional)" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {block.type === "image-grid" && (
        <div className="flex flex-col gap-3">
          <div>
            <label className={labelClass}>Columns</label>
            <select
              className={selectClass}
              value={block.columns}
              onChange={(e) =>
                onUpdate({ ...block, columns: parseInt(e.target.value) as 2 | 3 })
              }
            >
              <option value={2}>2 columns</option>
              <option value={3}>3 columns</option>
            </select>
          </div>
          <div className="flex flex-col gap-3">
            <label className={labelClass}>Images</label>
            <div className="grid grid-cols-3 gap-3">
            {(() => {
              const existingProjects = Array.from(new Set(
                block.images.flatMap(r => (typeof r === "string" ? [] : (r.project ?? [])))
              ));
              return block.images.map((raw, i) => {
              const item: GridImage = typeof raw === "string" ? { url: raw } : raw;
              const updateItem = (patch: Partial<GridImage>) => {
                const imgs = [...block.images];
                imgs[i] = { ...item, ...patch };
                onUpdate({ ...block, images: imgs });
              };
              return (
                <div key={i} className="flex flex-col gap-2 border border-gray-100 rounded-xl p-2 bg-gray-50 min-w-0">
                  {/* Controls row */}
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs text-gray-400 font-medium shrink-0">#{i + 1}</span>
                    <div className="flex gap-1">
                      <button type="button" onClick={() => { const imgs = [...block.images]; [imgs[i-1], imgs[i]] = [imgs[i], imgs[i-1]]; onUpdate({ ...block, images: imgs }); }} disabled={i === 0} className="px-1.5 py-0.5 text-xs rounded border border-gray-200 hover:bg-gray-100 disabled:opacity-30">↑</button>
                      <button type="button" onClick={() => { const imgs = [...block.images]; [imgs[i+1], imgs[i]] = [imgs[i], imgs[i+1]]; onUpdate({ ...block, images: imgs }); }} disabled={i === block.images.length - 1} className="px-1.5 py-0.5 text-xs rounded border border-gray-200 hover:bg-gray-100 disabled:opacity-30">↓</button>
                      <button type="button" onClick={() => onUpdate({ ...block, images: block.images.filter((_, idx) => idx !== i) })} className="px-1.5 py-0.5 text-xs rounded border border-red-200 text-red-500 hover:bg-red-50">×</button>
                    </div>
                  </div>
                  <ImageUploadInput value={item.url} placeholder={`Image ${i + 1}`} onChange={(url) => updateItem({ url })} previewClass="h-28" />
                  <input type="text" className={inputClass} value={item.description ?? ""} onChange={(e) => updateItem({ description: e.target.value || undefined })} placeholder="Description" />
                  <input type="text" className={inputClass} value={item.seriesNumber ?? ""} onChange={(e) => updateItem({ seriesNumber: e.target.value || undefined })} placeholder="Series number" />
                  <ProjectTagInput
                    tags={Array.isArray(item.project) ? item.project : item.project ? [item.project as unknown as string] : []}
                    onChange={(tags) => updateItem({ project: tags.length > 0 ? tags : undefined })}
                    suggestions={existingProjects}
                    listId={`project-suggestions-${i}`}
                  />
                  <input type="text" className={inputClass} value={item.link ?? ""} onChange={(e) => updateItem({ link: e.target.value || undefined })} placeholder="Link URL" />
                  <select
                    className={selectClass}
                    value={item.version ?? "common"}
                    onChange={(e) => updateItem({ version: e.target.value as PackVersion })}
                  >
                    <option value="common">Common (all packs)</option>
                    <option value="special">Special (all packs + glint)</option>
                    <option value="V1">V1 only</option>
                    <option value="V2">V2 only</option>
                    <option value="V3">V3 only</option>
                    <option value="rare">Rare pack only + glint</option>
                  </select>
                </div>
              );
            });})()}
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => onUpdate({ ...block, images: [...block.images, { url: "" }] })}
                className="text-xs text-[#0C0D1F] border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50"
              >+ Add image</button>
              <BulkUploadButton
                onUploaded={(urls) => onUpdate({ ...block, images: [...block.images, ...urls.map(url => ({ url }))] })}
              />
            </div>
          </div>
        </div>
      )}

      {block.type === "video" && (
        <div className="flex flex-col gap-3">
          <div>
            <label className={labelClass}>Video URL (YouTube, Vimeo, or direct)</label>
            <input
              type="text"
              className={inputClass}
              value={block.url}
              onChange={(e) => onUpdate({ ...block, url: e.target.value })}
              placeholder="https://..."
            />
          </div>
          <div>
            <label className={labelClass}>Size</label>
            <select
              className={selectClass}
              value={block.size}
              onChange={(e) =>
                onUpdate({ ...block, size: e.target.value as "full" | "large" | "medium" })
              }
            >
              <option value="full">Full width</option>
              <option value="large">Large (max-w-4xl)</option>
              <option value="medium">Medium (max-w-2xl)</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Caption (optional)</label>
            <input
              type="text"
              className={inputClass}
              value={block.caption ?? ""}
              onChange={(e) => onUpdate({ ...block, caption: e.target.value || undefined })}
            />
          </div>
        </div>
      )}

      {block.type === "button" && (
        <div className="flex flex-col gap-3">
          <div>
            <label className={labelClass}>Label</label>
            <input type="text" className={inputClass} value={block.text} onChange={(e) => onUpdate({ ...block, text: e.target.value })} placeholder="Button text" />
          </div>
          <div>
            <label className={labelClass}>URL</label>
            <input type="text" className={inputClass} value={block.url} onChange={(e) => onUpdate({ ...block, url: e.target.value })} placeholder="https://..." />
          </div>
          <div>
            <label className={labelClass}>Alignment</label>
            <select className={selectClass} value={block.align} onChange={(e) => onUpdate({ ...block, align: e.target.value as "left" | "center" | "right" })}>
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
        </div>
      )}

      {block.type === "text-boxes" && (
        <div className="flex flex-col gap-2">
          <label className={labelClass}>Items</label>
          {block.items.map((item, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                className={inputClass}
                value={item}
                onChange={(e) => {
                  const items = [...block.items];
                  items[i] = e.target.value;
                  onUpdate({ ...block, items });
                }}
                placeholder={`Box ${i + 1}`}
              />
              <button
                type="button"
                onClick={() => onUpdate({ ...block, items: block.items.filter((_, idx) => idx !== i) })}
                className="px-2 py-1 text-xs rounded border border-red-200 text-red-500 hover:bg-red-50 shrink-0"
              >×</button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => onUpdate({ ...block, items: [...block.items, ""] })}
            className="text-xs text-[#0C0D1F] border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 self-start"
          >+ Add item</button>
        </div>
      )}

      {block.type === "feature-info" && (
        <div className="flex flex-col gap-2">
          <label className={labelClass}>Items (first word becomes the large stat)</label>
          {block.items.map((item, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                className={inputClass}
                value={item}
                onChange={(e) => {
                  const items = [...block.items];
                  items[i] = e.target.value;
                  onUpdate({ ...block, items });
                }}
                placeholder={`e.g. "2× app installs doubled after the redesign"`}
              />
              <button
                type="button"
                onClick={() => onUpdate({ ...block, items: block.items.filter((_, idx) => idx !== i) })}
                className="px-2 py-1 text-xs rounded border border-red-200 text-red-500 hover:bg-red-50 shrink-0"
              >×</button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => onUpdate({ ...block, items: [...block.items, ""] })}
            className="text-xs text-[#0C0D1F] border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 self-start"
          >+ Add item</button>
        </div>
      )}

      {block.type === "card-summary" && (
        <div className="flex flex-col gap-3">
          <div>
            <label className={labelClass}>Heading</label>
            <input
              type="text"
              className={inputClass}
              value={block.heading}
              onChange={(e) => onUpdate({ ...block, heading: e.target.value })}
              placeholder="Section heading"
            />
          </div>
          <div>
            <label className={labelClass}>Intro (optional)</label>
            <input
              type="text"
              className={inputClass}
              value={block.intro ?? ""}
              onChange={(e) => onUpdate({ ...block, intro: e.target.value || undefined })}
              placeholder="Intro paragraph shown above cards"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className={labelClass}>Cards (use "01 — Title. Body…" format for numbered cards)</label>
            {block.items.map((item, i) => (
              <div key={i} className="flex gap-2">
                <textarea
                  rows={3}
                  className={inputClass}
                  value={item}
                  onChange={(e) => {
                    const items = [...block.items];
                    items[i] = e.target.value;
                    onUpdate({ ...block, items });
                  }}
                  placeholder={`e.g. "01 — Build a brand. The visual identity…"`}
                />
                <button
                  type="button"
                  onClick={() => onUpdate({ ...block, items: block.items.filter((_, idx) => idx !== i) })}
                  className="px-2 py-1 text-xs rounded border border-red-200 text-red-500 hover:bg-red-50 shrink-0 self-start"
                >×</button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => onUpdate({ ...block, items: [...block.items, `${String(block.items.length + 1).padStart(2, "0")} — `] })}
              className="text-xs text-[#0C0D1F] border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 self-start"
            >+ Add card</button>
          </div>
        </div>
      )}

      {block.type === "divider" && (
        <p className="text-xs text-gray-400 italic">Horizontal rule — no configuration needed.</p>
      )}

      {block.type === "highlight" && (
        <div>
          <label className={labelClass}>Text</label>
          <input
            type="text"
            className={inputClass}
            value={block.text}
            onChange={(e) => onUpdate({ ...block, text: e.target.value })}
            placeholder="Large highlight quote..."
          />
        </div>
      )}
    </div>
  );
}

export default function BlockEditor({ blocks, onChange }: BlockEditorProps) {
  function addBlock(type: Block["type"]) {
    onChange([...blocks, createBlock(type)]);
  }

  function updateBlock(index: number, updated: Block) {
    const next = [...blocks];
    next[index] = updated;
    onChange(next);
  }

  function removeBlock(index: number) {
    onChange(blocks.filter((_, i) => i !== index));
  }

  function moveBlock(index: number, direction: "up" | "down") {
    const next = [...blocks];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= next.length) return;
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
    onChange(next);
  }

  return (
    <div className="flex flex-col gap-4">
      {blocks.length === 0 && (
        <p className="text-sm text-gray-400 italic text-center py-8">
          No blocks yet. Add one below.
        </p>
      )}

      {blocks.map((block, index) => (
        <BlockItem
          key={block.id}
          block={block}
          index={index}
          total={blocks.length}
          onUpdate={(updated) => updateBlock(index, updated)}
          onRemove={() => removeBlock(index)}
          onMove={(dir) => moveBlock(index, dir)}
        />
      ))}

      {/* Add block */}
      <div className="flex flex-wrap gap-2 pt-2">
        {BLOCK_TYPES.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => addBlock(value as Block["type"])}
            className="text-xs border border-dashed border-gray-300 text-gray-600 px-3 py-2 rounded-lg hover:border-[#0C0D1F] hover:text-[#0C0D1F] transition-colors"
          >
            + {label}
          </button>
        ))}
      </div>
    </div>
  );
}
