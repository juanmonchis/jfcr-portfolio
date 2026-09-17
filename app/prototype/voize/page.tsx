"use client";
import { useEffect, useRef, useState } from "react";
import VoizePrototype from "./VoizePrototype";

export default function PrototypePage() {
  const FRAME_W = 390;
  const FRAME_H = 844;
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const s = Math.min(1, (vw - 16) / FRAME_W, (vh - 16) / FRAME_H);
      setScale(s);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100vw",
        height: "100dvh",
        background: "#F3F3F2",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: FRAME_W,
          height: FRAME_H,
          borderRadius: 44,
          overflow: "hidden",
          boxShadow: "0 32px 80px rgba(0,0,0,0.22), 0 0 0 1px rgba(0,0,0,0.08)",
          background: "#fff",
          position: "relative",
          flexShrink: 0,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        <VoizePrototype />
      </div>
    </div>
  );
}
