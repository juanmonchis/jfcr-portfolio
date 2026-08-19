"use client";

import Link from "next/link";

const PILLS = [
  { label: "Books",  href: "/books"  },
  { label: "Drafts", href: "/blog"   },
];

export default function PillMarquee() {
  // Four copies so the -50% translate lands exactly at the start of the second set
  const items = [...PILLS, ...PILLS, ...PILLS, ...PILLS];

  return (
    <div className="overflow-hidden py-8" style={{ background: "#DDED3C" }}>
      <div
        style={{
          display: "flex",
          gap: "1.5rem",
          width: "max-content",
          animation: "marquee 18s linear infinite",
        }}
      >
        {items.map((pill, i) => (
          <Link
            key={i}
            href={pill.href}
            style={{
              border: "1.5px solid #0C0D1F",
              borderRadius: 9999,
              padding: "36px 96px",
              flexShrink: 0,
              textDecoration: "none",
              display: "block",
            }}
          >
            <span
              className="type-homepage-hero"
              style={{ color: "#0C0D1F", display: "block" }}
            >
              {pill.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
