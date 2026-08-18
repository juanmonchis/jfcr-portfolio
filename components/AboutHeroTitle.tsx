"use client";

import { useRef, useState, useEffect } from "react";
import { assetPath } from "@/lib/assetPath";

const CREAM = "#F2EBD9";
const GIF_SIZE = 250;
const LERP = 0.04;

const WORDS = ["Yes,", "I", "am", "Juan", "Felipe"];
const WORD_OFFSETS   = [0, 1000, 1180, 1320, 1420];
const WORD_DURATIONS = [1.2, 0.38, 0.28, 0.22, 0.18];
const START_DELAY = 500;

export default function AboutHeroTitle() {
  const containerRef  = useRef<HTMLDivElement>(null);
  const home          = useRef({ x: 0, y: 0 });
  const target        = useRef({ x: 0, y: 0 });
  const current       = useRef({ x: 0, y: 0 });
  const rafId         = useRef<number | null>(null);
  const isDragging    = useRef(false);
  const dragOffset    = useRef({ x: 0, y: 0 });

  const [pos,        setPos]        = useState({ x: 0, y: 0 });
  const [ready,      setReady]      = useState(false);
  const [wordCount,  setWordCount]  = useState(0);
  const [gifVisible, setGifVisible] = useState(false);

  function calcHome() {
    if (!containerRef.current) return;
    const { width, height } = containerRef.current.getBoundingClientRect();
    const hx = width * 0.5;
    const hy = height * 0.45;
    home.current = { x: hx, y: hy };
    if (!ready) {
      current.current = { x: hx, y: hy };
      target.current  = { x: hx, y: hy };
      setPos({ x: hx, y: hy });
      setReady(true);
    }
  }

  // Initial measurement + resize
  useEffect(() => {
    calcHome();
    window.addEventListener("resize", calcHome);
    return () => window.removeEventListener("resize", calcHome);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Lerp loop (desktop mouse-follow + mobile settle-back)
  useEffect(() => {
    function loop() {
      if (!isDragging.current) {
        const dx = target.current.x - current.current.x;
        const dy = target.current.y - current.current.y;
        current.current.x += dx * LERP;
        current.current.y += dy * LERP;
        setPos({ x: current.current.x, y: current.current.y });
      }
      rafId.current = requestAnimationFrame(loop);
    }
    rafId.current = requestAnimationFrame(loop);
    return () => { if (rafId.current) cancelAnimationFrame(rafId.current); };
  }, []);

  // Word animation + gif reveal
  useEffect(() => {
    const timers = WORDS.map((_, i) =>
      setTimeout(() => setWordCount(i + 1), START_DELAY + WORD_OFFSETS[i])
    );
    const lastWordEnd = START_DELAY
      + WORD_OFFSETS[WORD_OFFSETS.length - 1]
      + Math.round(WORD_DURATIONS[WORD_DURATIONS.length - 1] * 1000);
    const gifTimer = setTimeout(() => setGifVisible(true), lastWordEnd);
    return () => { timers.forEach(clearTimeout); clearTimeout(gifTimer); };
  }, []);

  // Mobile drag — attach native listeners so we can call preventDefault
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    function clamp(val: number, min: number, max: number) {
      return Math.max(min, Math.min(max, val));
    }

    function onTouchStart(e: TouchEvent) {
      const touch = e.touches[0];
      const rect  = el!.getBoundingClientRect();
      const tx    = touch.clientX - rect.left;
      const ty    = touch.clientY - rect.top;
      const dx    = tx - current.current.x;
      const dy    = ty - current.current.y;
      // Only start drag if touch lands on the gif
      if (Math.sqrt(dx * dx + dy * dy) < GIF_SIZE / 2) {
        isDragging.current = true;
        dragOffset.current = { x: dx, y: dy };
        e.preventDefault(); // prevent scroll while dragging gif
      }
    }

    function onTouchMove(e: TouchEvent) {
      if (!isDragging.current) return;
      e.preventDefault();
      const touch = e.touches[0];
      const rect  = el!.getBoundingClientRect();
      const rawX  = touch.clientX - rect.left - dragOffset.current.x;
      const rawY  = touch.clientY - rect.top  - dragOffset.current.y;
      const cx    = clamp(rawX, GIF_SIZE / 2, rect.width  - GIF_SIZE / 2);
      const cy    = clamp(rawY, GIF_SIZE / 2, rect.height - GIF_SIZE / 2);
      // Directly move gif (no lerp during drag for immediate feel)
      current.current = { x: cx, y: cy };
      target.current  = { x: cx, y: cy };
      setPos({ x: cx, y: cy });
    }

    function onTouchEnd() {
      isDragging.current = false;
      // Let gif drift back to center
      target.current = { x: home.current.x, y: home.current.y };
    }

    el.addEventListener("touchstart", onTouchStart, { passive: false });
    el.addEventListener("touchmove",  onTouchMove,  { passive: false });
    el.addEventListener("touchend",   onTouchEnd);

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove",  onTouchMove);
      el.removeEventListener("touchend",   onTouchEnd);
    };
  }, []);

  // Desktop mouse-follow
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
        {WORDS.slice(0, wordCount).map((word, i) => (
          <span key={word} style={{ display: "inline" }}>
            <span
              className="hero-word"
              style={{
                marginRight: "0.28em",
                animation: `wordPop ${WORD_DURATIONS[i]}s cubic-bezier(0.16,1,0.3,1) 1ms both`,
                willChange: "transform, opacity",
              }}
            >
              {word}
            </span>
          </span>
        ))}
      </h2>

      {ready && (
        <img
          src={assetPath("/images/aboutme/aboutme_purpledude_jfcr.gif")}
          alt=""
          aria-hidden="true"
          style={{
            position:      "absolute",
            left:          pos.x,
            top:           pos.y,
            width:         GIF_SIZE,
            height:        GIF_SIZE,
            transform:     `translate(-50%, -50%) scale(${gifVisible ? 1 : 0})`,
            transition:    "transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
            pointerEvents: "none",
            zIndex:        10,
            userSelect:    "none",
          }}
        />
      )}
    </div>
  );
}
