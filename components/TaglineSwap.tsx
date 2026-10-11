"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// The first entry is what the tagline says on load; add more to widen the pool.
const PHRASES = [
  "a weakness for silly animations",
  "a sharp eye for visuals",
  "obsessive Figma knowledge",
  "miniature painting techniques",
  "branding experience",
  "MCP know how",
  "a feel for what can be built well",
  "strong opinions",
];

// Used to reserve space so the tagline never changes height when the phrase swaps.
export const LONGEST_PHRASE = PHRASES.reduce((a, b) => (b.length > a.length ? b : a));

// How close (px) the pointer has to get to the phrase before it changes.
const TRIGGER_RADIUS = 70;

// On devices without hover (phones), the phrase changes on its own this often.
const AUTO_SWAP_MS = 3500;

function distanceToRect(x: number, y: number, r: DOMRect) {
  const dx = Math.max(r.left - x, 0, x - r.right);
  const dy = Math.max(r.top - y, 0, y - r.bottom);
  return Math.hypot(dx, dy);
}

export default function TaglineSwap({ enabled = true }: { enabled?: boolean }) {
  const [index, setIndex] = useState(0);
  // Bumped on every swap so the fade-in animation restarts even for the same width.
  const [swaps, setSwaps] = useState(0);
  const [autoSwap, setAutoSwap] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const isNear = useRef(false);

  const swap = useCallback(() => {
    setIndex((current) => {
      let next = current;
      while (next === current) next = Math.floor(Math.random() * PHRASES.length);
      return next;
    });
    setSwaps((n) => n + 1);
  }, []);

  // Touch devices can't "approach" the phrase, so they get a timer instead
  // (unless the visitor asked for reduced motion).
  useEffect(() => {
    const noHover = window.matchMedia("(hover: none)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setAutoSwap(noHover.matches && !reduced.matches);
    update();
    noHover.addEventListener("change", update);
    reduced.addEventListener("change", update);
    return () => {
      noHover.removeEventListener("change", update);
      reduced.removeEventListener("change", update);
    };
  }, []);

  // Re-armed after every swap, so a tap restarts the countdown.
  useEffect(() => {
    if (!enabled || !autoSwap) return;
    const t = setTimeout(swap, AUTO_SWAP_MS);
    return () => clearTimeout(t);
  }, [enabled, autoSwap, swaps, swap]);

  useEffect(() => {
    if (!enabled) return;

    function onMove(e: PointerEvent) {
      if (e.pointerType === "touch") return;
      const el = ref.current;
      if (!el) return;
      // An inline phrase can wrap across lines, so measure every line box.
      const near = Array.from(el.getClientRects()).some(
        (r) => distanceToRect(e.clientX, e.clientY, r) <= TRIGGER_RADIUS
      );
      if (near && !isNear.current) swap();
      isNear.current = near;
    }

    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled, swap]);

  return (
    // Tapping works as the touch-screen equivalent of moving the pointer close.
    <span ref={ref} onClick={swap}>
      <span key={swaps} className={swaps > 0 ? "tagline-swap" : undefined}>
        {PHRASES[index]}
      </span>
    </span>
  );
}
