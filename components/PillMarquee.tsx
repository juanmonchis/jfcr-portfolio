"use client";

import Link from "next/link";

const PILLS = [
  { label: "Book Recs", href: "/books" },
  { label: "Notes",  href: "/blog"   },
];

export default function PillMarquee() {
  // Four copies so the -50% translate lands exactly at the start of the second set
  const items = [...PILLS, ...PILLS, ...PILLS, ...PILLS];

  return (
    <div className="overflow-hidden py-16" style={{ background: "#DDED3C" }}>
      <div
        style={{
          display: "flex",
          gap: "1.5rem",
          width: "max-content",
          animation: "marquee 18s linear infinite",
        }}
      >
        {items.map((pill, i) => (
          <Link key={i} href={pill.href} className="pill-marquee-item">
            <span className="type-homepage-hero" style={{ color: "#0C0D1F", display: "block" }}>
              {pill.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
