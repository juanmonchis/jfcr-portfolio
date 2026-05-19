"use client";

import { useState } from "react";

function isVideo(url: string) {
  return url.toLowerCase().endsWith(".mp4");
}

interface MediaUploadInputProps {
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  previewClass?: string;
}

export default function MediaUploadInput({
  value,
  onChange,
  placeholder = "https://...",
  previewClass = "h-20",
}: MediaUploadInputProps) {
  const [uploading, setUploading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const data = new FormData();
    data.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: data });
    const json = await res.json();
    if (res.ok) onChange(json.url);
    setUploading(false);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <label className="cursor-pointer bg-[#0C0D1F] text-white text-xs font-semibold px-3 py-2 rounded-lg hover:opacity-80 transition-opacity whitespace-nowrap">
          {uploading ? "Uploading..." : "Upload"}
          <input type="file" accept="image/*,image/svg+xml,video/mp4" className="hidden" onChange={handleFile} disabled={uploading} />
        </label>
        <input
          type="text"
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#0C0D1F] focus:outline-none focus:ring-1 focus:ring-[#0C0D1F]"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      </div>
      {value && (
        <div className={`${previewClass} rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center`}>
          {isVideo(value)
            ? <video src={value} className="max-h-full w-auto object-contain" muted playsInline />
            // eslint-disable-next-line @next/next/no-img-element
            : <img src={value} alt="" className="max-h-full w-auto object-contain" />}
        </div>
      )}
    </div>
  );
}
