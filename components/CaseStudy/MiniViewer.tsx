"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const Canvas3D = dynamic(() => import("./MiniViewerCanvas"), {
  ssr: false,
  loading: () => (
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(12,13,31,0.2)", fontSize: 13, fontFamily: "var(--font-telegraf), sans-serif" }}>
      loading…
    </div>
  ),
});

export interface MiniData {
  name: string;
  game: string;
  faction: string;
  date: string;
  notes?: string;
  src: string;
  thumbnail?: string;
  scale?: string;
}

export interface MiniViewerBlock {
  id: string;
  type: "mini-viewer";
  minis: MiniData[];
}

function FactionPill({ label }: { label: string }) {
  return (
    <span style={{
      display: "inline-block",
      padding: "4px 12px",
      borderRadius: 999,
      background: "#DDED3C",
      color: "#0C0D1F",
      fontSize: 13,
      fontWeight: 600,
      fontFamily: "var(--font-telegraf), sans-serif",
      letterSpacing: "0.01em",
    }}>
      {label}
    </span>
  );
}

function MiniCard({ mini, selected, onClick }: { mini: MiniData; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: selected ? "#1A1A2E" : "transparent",
        border: selected ? "none" : "1px solid rgba(12,13,31,0.1)",
        borderRadius: 12,
        overflow: "hidden",
        cursor: "pointer",
        textAlign: "left",
        padding: 0,
        transition: "background 0.15s, border-color 0.15s",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Thumbnail */}
      <div style={{
        width: "100%",
        aspectRatio: "1 / 1",
        background: selected ? "rgba(255,255,255,0.06)" : "#F2F0EB",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}>
        {mini.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={mini.thumbnail} alt={mini.name} style={{ width: "80%", height: "80%", objectFit: "contain" }} />
        ) : (
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
            <path d="M22 6L38 34H6L22 6Z" fill="none" stroke={selected ? "rgba(255,255,255,0.3)" : "rgba(12,13,31,0.15)"} strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M22 38L6 34L22 6" fill="none" stroke={selected ? "rgba(255,255,255,0.15)" : "rgba(12,13,31,0.08)"} strokeWidth="1" strokeLinejoin="round" />
          </svg>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: "10px 12px 14px", overflow: "hidden" }}>
        <p style={{
          fontFamily: "var(--font-telegraf), sans-serif",
          fontSize: 10,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: selected ? "rgba(255,255,255,0.4)" : "rgba(12,13,31,0.35)",
          margin: "0 0 3px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}>
          {mini.game}
        </p>
        <p style={{
          fontFamily: "var(--font-migra), serif",
          fontSize: 16,
          fontWeight: 400,
          color: selected ? "#FFFFFF" : "#0C0D1F",
          margin: "0 0 8px",
          lineHeight: 1.2,
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
        }}>
          {mini.name}
        </p>
        <span style={{
          display: "inline-block",
          padding: "3px 10px",
          borderRadius: 999,
          background: "#DDED3C",
          color: "#0C0D1F",
          fontSize: 12,
          fontWeight: 600,
          fontFamily: "var(--font-telegraf), sans-serif",
          maxWidth: "100%",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          verticalAlign: "bottom",
        }}>
          {mini.faction}
        </span>
      </div>
    </button>
  );
}

export default function MiniViewer({ block }: { block: MiniViewerBlock }) {
  const [selected, setSelected] = useState(0);
  const mini = block.minis[selected];

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", padding: "0 24px 0 24px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 2fr) minmax(0, 3fr)", gap: "clamp(20px, 3vw, 48px)", alignItems: "start" }}>

        {/* Left — scrollable card grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          maxHeight: 580,
          overflowY: "auto",
          scrollbarWidth: "none",
        }}>
          {block.minis.map((m, i) => (
            <MiniCard key={i} mini={m} selected={i === selected} onClick={() => setSelected(i)} />
          ))}
        </div>

        {/* Right — featured viewer + info */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{
            height: 480,
            borderRadius: 16,
            overflow: "hidden",
            background: "#F2F0EB",
            border: "1px solid rgba(12,13,31,0.06)",
          }}>
            <Canvas3D key={`${selected}-${mini.src}`} src={mini.src} autoRotate />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <p style={{
              fontFamily: "var(--font-telegraf), sans-serif",
              fontSize: 11,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "rgba(12,13,31,0.4)",
              margin: 0,
            }}>
              {mini.game}
            </p>
            <h3 style={{
              fontFamily: "var(--font-migra), serif",
              fontSize: "clamp(1.5rem, 2.5vw, 2.25rem)",
              fontWeight: 400,
              color: "#0C0D1F",
              margin: 0,
              lineHeight: 1.1,
            }}>
              {mini.name}
            </h3>
            <div style={{ marginTop: 4 }}>
              <FactionPill label={mini.faction} />
            </div>
            {mini.notes && (
              <p style={{
                fontFamily: "var(--font-telegraf), sans-serif",
                fontSize: 14,
                color: "rgba(12,13,31,0.55)",
                lineHeight: 1.7,
                margin: "8px 0 0",
              }}>
                {mini.notes}
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
