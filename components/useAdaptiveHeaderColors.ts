"use client";

import { RefObject, useEffect, useState } from "react";

/**
 * Keeps the fixed header readable on any background.
 *
 * Samples what is actually painted behind the logo and the nav (element
 * backgrounds, plus image pixels where the browser allows reading them) and,
 * when the page-provided colour would have too little contrast there, flips
 * to whichever of DARK / LIGHT reads better. Re-checks on scroll and resize.
 */

const DARK = "#0C0D1F";
const LIGHT = "#F2EBD9";
const MIN_CONTRAST = 3; // WCAG minimum for UI components / large text

type RGB = [number, number, number];

// This canvas is ONLY used to parse CSS colours. Never draw images on it: one cross-origin
// drawImage "taints" a canvas permanently and every later getImageData would throw.
let scratch: CanvasRenderingContext2D | null = null;
function ctx2d() {
  if (!scratch) {
    const c = document.createElement("canvas");
    c.width = c.height = 1;
    scratch = c.getContext("2d", { willReadFrequently: true });
  }
  return scratch;
}

/** Parse any CSS colour (rgb, hex, oklch, color-mix…) → [r,g,b,a] via a 1px canvas. */
function parseColor(css: string): [number, number, number, number] | null {
  try {
    const c = ctx2d();
    if (!c) return null;
    c.clearRect(0, 0, 1, 1);
    c.fillStyle = "#000";
    c.fillStyle = css;
    c.fillRect(0, 0, 1, 1);
    const d = c.getImageData(0, 0, 1, 1).data;
    return [d[0], d[1], d[2], d[3]];
  } catch {
    return null;
  }
}

function luminance([r, g, b]: RGB) {
  const f = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

function contrast(a: RGB, b: RGB) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

function hexToRgb(hex: string): RGB {
  const c = parseColor(hex);
  return c ? [c[0], c[1], c[2]] : [0, 0, 0];
}

const unreadableImages = new WeakSet<HTMLImageElement>();

function canReadPixels(img: HTMLImageElement): boolean {
  if (unreadableImages.has(img)) return false;
  const src = img.currentSrc || img.src;
  if (!src) return false;
  if (src.startsWith("data:") || src.startsWith("blob:")) return true;
  try {
    const sameOrigin = new URL(src, location.href).origin === location.origin;
    // Cross-origin images only work if they were requested with CORS.
    return sameOrigin || !!img.crossOrigin;
  } catch {
    return false;
  }
}

/** Read one pixel from an <img> as displayed (honours object-fit: cover). Null if unreadable. */
function imagePixel(img: HTMLImageElement, x: number, y: number): RGB | null {
  if (!img.complete || !img.naturalWidth || !canReadPixels(img)) return null;
  try {
    const r = img.getBoundingClientRect();
    const fit = getComputedStyle(img).objectFit;
    const nw = img.naturalWidth;
    const nh = img.naturalHeight;
    let scaleX = r.width / nw;
    let scaleY = r.height / nh;
    if (fit === "cover") scaleX = scaleY = Math.max(scaleX, scaleY);
    else if (fit === "contain") scaleX = scaleY = Math.min(scaleX, scaleY);
    const offX = (r.width - nw * scaleX) / 2;
    const offY = (r.height - nh * scaleY) / 2;
    const sx = Math.min(nw - 1, Math.max(0, Math.floor((x - r.left - offX) / scaleX)));
    const sy = Math.min(nh - 1, Math.max(0, Math.floor((y - r.top - offY) / scaleY)));
    // Throwaway canvas per read, so a failure can never poison the shared one.
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const c = canvas.getContext("2d", { willReadFrequently: true });
    if (!c) return null;
    c.drawImage(img, sx, sy, 1, 1, 0, 0, 1, 1);
    const d = c.getImageData(0, 0, 1, 1).data; // throws if tainted
    return d[3] > 128 ? [d[0], d[1], d[2]] : null;
  } catch {
    unreadableImages.add(img); // don't retry on every scroll frame
    return null;
  }
}

/** What colour is painted at (x, y), ignoring the header itself? */
function colorBehind(x: number, y: number, header: HTMLElement): RGB {
  for (const el of document.elementsFromPoint(x, y)) {
    if (header.contains(el)) continue;
    if (el instanceof HTMLImageElement) {
      const px = imagePixel(el, x, y);
      if (px) return px;
      continue;
    }
    const bg = parseColor(getComputedStyle(el).backgroundColor);
    if (bg && bg[3] > 200) return [bg[0], bg[1], bg[2]];
  }
  return [255, 255, 255];
}

/** Average luminance-wise by sampling a few points across the element. */
function sampleRect(el: HTMLElement, header: HTMLElement): RGB | null {
  const r = el.getBoundingClientRect();
  if (r.width < 4 || r.height < 4) return null;
  const xs = [0.2, 0.5, 0.8];
  const ys = [0.15, 0.5, 0.85];
  let R = 0, G = 0, B = 0, n = 0;
  for (const fx of xs) {
    for (const fy of ys) {
      const [pr, pg, pb] = colorBehind(r.left + r.width * fx, r.top + r.height * fy, header);
      R += pr; G += pg; B += pb; n++;
    }
  }
  return [R / n, G / n, B / n];
}

function pickInk(bg: RGB): string {
  return contrast(hexToRgb(DARK), bg) >= contrast(hexToRgb(LIGHT), bg) ? DARK : LIGHT;
}

/** Present only for elements whose colour had to flip. */
export interface Tone {
  /** Replacement ink colour (DARK or LIGHT). */
  ink: string;
  /** Background that was sampled behind the element (css rgb string). */
  bg: string;
}
export type Tones = Record<string, Tone | undefined>;

/**
 * Elements opt in with `data-adaptive="<id>"` and `data-ink="<hex>"` (their current colour).
 * Returns a tone for each id that currently has too little contrast.
 */
export function useAdaptiveHeaderColors(header: RefObject<HTMLElement | null>, enabled = true): Tones {
  const [tones, setTones] = useState<Tones>({});

  useEffect(() => {
    if (!enabled) return;
    let raf = 0;

    const run = () => {
      raf = 0;
      const root = header.current;
      if (!root) return;
      try {
        measure(root);
      } catch {
        // Cosmetic feature: never let a sampling failure surface as a page error.
      }
    };

    const measure = (root: HTMLElement) => {
      const next: Tones = {};
      root.querySelectorAll<HTMLElement>("[data-adaptive]").forEach((el) => {
        const id = el.dataset.adaptive!;
        const bg = sampleRect(el, root);
        if (!bg) return; // hidden (e.g. desktop nav on mobile)
        const ink = hexToRgb(el.dataset.ink || DARK);
        if (contrast(ink, bg) >= MIN_CONTRAST) return;
        next[id] = { ink: pickInk(bg), bg: `rgb(${Math.round(bg[0])}, ${Math.round(bg[1])}, ${Math.round(bg[2])})` };
      });
      setTones((prev) => {
        const a = Object.keys(prev);
        const b = Object.keys(next);
        const same = a.length === b.length && b.every((k) => prev[k] && prev[k]!.ink === next[k]!.ink && prev[k]!.bg === next[k]!.bg);
        return same ? prev : next;
      });
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(run);
    };

    schedule();
    // Images / fonts / lazy content settle after mount.
    const timers = [150, 600, 1500].map((ms) => window.setTimeout(schedule, ms));
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("load", schedule);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("load", schedule);
    };
  }, [header, enabled]);

  return enabled ? tones : {};
}
