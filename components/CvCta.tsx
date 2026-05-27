"use client";

import { useRef, useState, useEffect } from "react";
import { assetPath } from "@/lib/assetPath";

const BG = "#2D0055";
const CREAM = "#F2EBD9";
const SIZE = 200;
const LERP_POS = 0.14;
const LERP_ROT = 0.06;
const MOVE_THRESHOLD = 3;
const ROT_CLAMP = 45; // max degrees in either direction

function shortestAngleDelta(from: number, to: number): number {
  let delta = (to - from) % 360;
  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;
  return delta;
}

export default function CvCta() {
  const containerRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const targetRot = useRef(0);
  const currentRot = useRef(0);
  const rafId = useRef<number | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [visible, setVisible] = useState(false);
  const [ctaHovered, setCtaHovered] = useState(false);

  useEffect(() => {
    function loop() {
      // Lerp position
      const dx = target.current.x - current.current.x;
      const dy = target.current.y - current.current.y;
      current.current.x += dx * LERP_POS;
      current.current.y += dy * LERP_POS;

      // Update rotation target only when the lerped position is moving meaningfully
      const speed = Math.sqrt(dx * dx + dy * dy);
      if (speed > MOVE_THRESHOLD) {
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        targetRot.current = Math.max(-ROT_CLAMP, Math.min(ROT_CLAMP, angle));
      }

      // Lerp rotation via shortest path
      const delta = shortestAngleDelta(currentRot.current, targetRot.current);
      currentRot.current += delta * LERP_ROT;

      setPos({ x: current.current.x, y: current.current.y });
      setRotation(currentRot.current);

      rafId.current = requestAnimationFrame(loop);
    }

    rafId.current = requestAnimationFrame(loop);
    return () => { if (rafId.current) cancelAnimationFrame(rafId.current); };
  }, []);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    target.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      className="w-full flex flex-col items-center gap-6 rounded-3xl px-8 py-12 relative overflow-hidden cursor-none"
      style={{ background: CREAM }}
    >
      {/* Cursor-following GIF */}
      <img
        src={assetPath("/images/aboutme/aboutme_purpledude_jfcr.gif")}
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          left: pos.x,
          top: pos.y,
          width: SIZE,
          height: SIZE,
          transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
          pointerEvents: "none",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.2s ease",
        }}
      />

      <p className="type-case-subtitle relative z-10" style={{ color: BG }}>
        Interested in more detailed info about my past jobs and experience?
      </p>
      <a
        href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/jfcr_CV_2026.pdf`}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setCtaHovered(true)}
        onMouseLeave={() => setCtaHovered(false)}
        className="type-tag relative z-10 inline-flex items-center px-5 py-2 border rounded-full"
        style={{
          color: ctaHovered ? CREAM : BG,
          borderColor: BG,
          backgroundColor: ctaHovered ? BG : "transparent",
          transform: ctaHovered ? "scale(1.12)" : "scale(1)",
          transition: "transform 0.25s ease, background-color 0.25s ease, color 0.25s ease",
        }}
      >
        CV 2026
      </a>
    </div>
  );
}
