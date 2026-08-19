"use client";

const PILLS = ["Books", "Drafts"];

export default function PillMarquee() {
  // Four copies so the -50% translate lands exactly at the start of the second set
  const items = [...PILLS, ...PILLS, ...PILLS, ...PILLS];

  return (
    <div className="overflow-hidden py-8 bg-[#0C0D1F]">
      <div
        style={{
          display: "flex",
          gap: "1.5rem",
          width: "max-content",
          animation: "marquee 18s linear infinite",
        }}
      >
        {items.map((text, i) => (
          <div
            key={i}
            style={{
              border: "1.5px solid rgba(242,235,217,0.3)",
              borderRadius: 9999,
              padding: "36px 96px",
              flexShrink: 0,
            }}
          >
            <span
              className="type-homepage-hero"
              style={{ color: "#F2EBD9", display: "block" }}
            >
              {text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
