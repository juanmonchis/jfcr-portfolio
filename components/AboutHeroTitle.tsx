"use client";

import { useRef, useState, useEffect } from "react";
import { assetPath } from "@/lib/assetPath";

const CREAM = "#F2EBD9";
const GIF_SIZE = 250;
const LERP = 0.04;

export default function AboutHeroTitle() {
  const containerRef = useRef<HTMLDivElement>(null);
  const home = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [ready, setReady] = useState(false);

  function calcHome() {
    if (!containerRef.current) return;
    const { width, height } = containerRef.current.getBoundingClientRect();
    const hx = width * 0.5;
    const hy = height * 0.35; // roughly middle of the title block
    home.current = { x: hx, y: hy };
    if (!ready) {
      current.current = { x: hx, y: hy };
      target.current = { x: hx, y: hy };
      setPos({ x: hx, y: hy });
      setReady(true);
    }
  }

  useEffect(() => {
    calcHome();
    window.addEventListener("resize", calcHome);
    return () => window.removeEventListener("resize", calcHome);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    function loop() {
      const dx = target.current.x - current.current.x;
      const dy = target.current.y - current.current.y;
      current.current.x += dx * LERP;
      current.current.y += dy * LERP;
      setPos({ x: current.current.x, y: current.current.y });
      rafId.current = requestAnimationFrame(loop);
    }
    rafId.current = requestAnimationFrame(loop);
    return () => { if (rafId.current) cancelAnimationFrame(rafId.current); };
  }, []);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    target.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  function handleMouseLeave() {
    target.current = { x: home.current.x, y: home.current.y };
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full pb-16"
    >
      <h2 className="type-homepage-hero leading-none" style={{ color: CREAM }}>
        Yes, I am<br />Juan Felipe
      </h2>

      {ready && (
        <img
          src={assetPath("/images/aboutme/aboutme_purpledude_jfcr.gif")}
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            left: pos.x,
            top: pos.y,
            width: GIF_SIZE,
            height: GIF_SIZE,
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
            zIndex: 10,
          }}
        />
      )}
    </div>
  );
}
