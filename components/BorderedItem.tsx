/*
 * ════════════════════════════════════════════════════════════════════════════
 * FILE: components/BorderedItem.tsx
 * ════════════════════════════════════════════════════════════════════════════
 * WHAT IT DOES:
 *   Renders a single item in the "other projects" section at the bottom of
 *   the homepage. Each item is a bordered box with a title, tags, and a link.
 *
 * 🎨 DESIGN — things to edit here:
 *   - Border shape & size     → rounded-2xl border-2 p-5
 *   - Hover scale             → hover:scale-105
 *   - Hover glow opacity      → the 55 suffix in glowColor (0–ff = 0–100%)
 *   - Transition speed        → duration-300
 *   - Tag pill style          → text-xs px-2 py-0.5 rounded-full border
 *   - Title style             → text-lg font-bold mb-3
 *
 * ℹ️  ALL COLORS ARE PER-ITEM (set in the admin panel):
 *   - bgColor    → background of the box
 *   - textColor  → title color AND border color
 *   - tagColor   → tag text and border color
 *   - glowColor  → color of the hover glow shadow
 *   These are NOT hardcoded here — change them per item in /admin/bordered-items.
 * ════════════════════════════════════════════════════════════════════════════
 */

"use client";

import Link from "next/link";

interface BorderedItemProps {
  title: string;
  tags: string[];
  href: string;
  bgColor?: string;
  textColor?: string;
  tagColor?: string;
  glowColor?: string;
}

export default function BorderedItem({
  title,
  tags,
  href,
  bgColor = "transparent",
  textColor = "#0C0D1F",
  tagColor = "#0C0D1F",
  glowColor = "#0C0D1F",
}: BorderedItemProps) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-2xl border-2 p-5 transition-all duration-300 hover:scale-105"
      style={{
        backgroundColor: bgColor,
        borderColor: textColor,
        color: textColor,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 0 30px 8px ${glowColor}55`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
      }}
    >
      <h3 className="text-lg font-bold mb-3" style={{ color: textColor }}>
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-0.5 rounded-full font-medium border"
            style={{
              color: tagColor,
              borderColor: tagColor,
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
