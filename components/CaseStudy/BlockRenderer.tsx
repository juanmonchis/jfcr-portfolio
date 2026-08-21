/*
 * ════════════════════════════════════════════════════════════════════════════
 * FILE: components/CaseStudy/BlockRenderer.tsx
 * ════════════════════════════════════════════════════════════════════════════
 * WHAT IT DOES:
 *   Renders the content blocks of a case study in sequence.
 *   Each block is a different layout type — this file maps each type to its
 *   visual output. Also exports the Block type used by the admin editor.
 *
 * 🎨 DESIGN — things to edit per block type:
 *   - "heading"      → h1/h2/h3 font classes (text-4xl, font-black, etc.)
 *                      → swap with .type-case-main-title / .type-case-title etc.
 *   - "text"         → prose class controls rich text styling
 *                      → prose styles are defined in globals.css
 *   - "image"        → aspect-video, rounded-xl, object-cover
 *                      "full" = 100% width, "contained" = max-w-2xl centered
 *   - "two-col"      → grid-cols-2 gap-8, aspect-video for images
 *   - "image-grid"   → grid-cols-2 or grid-cols-3, aspect-square per image
 *   - "video"        → aspect-video, rounded-xl
 *                      "full" = 100% width, "large" = max-w-4xl, "medium" = max-w-2xl
 *   - "divider"      → border-gray-200 (horizontal rule)
 *   - "highlight"    → centered, font-black, text-3xl md:text-5xl
 *                      → swap with .type-case-highlight from globals.css
 *   - Spacing between blocks → py-8 on each block wrapper
 *
 * ℹ️  ADDING A NEW BLOCK TYPE:
 *   1. Add a new variant to the Block union type at the top of this file
 *   2. Add the render logic inside the BlockRenderer map below
 *   3. Add the editor fields in components/admin/BlockEditor.tsx
 * ════════════════════════════════════════════════════════════════════════════
 */

"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import LogoIcon from "@/components/LogoIcon";
import { assetPath } from "@/lib/assetPath";

export type PackVersion = "common" | "V1" | "V2" | "V3" | "rare" | "special";
export type GridImage = { url: string; description?: string; link?: string; seriesNumber?: string; project?: string[]; version?: PackVersion };

// Handles legacy string-only format and legacy project-as-string
function toGridImage(item: GridImage | string): GridImage {
  if (typeof item === "string") return { url: item };
  if (item.project && !Array.isArray(item.project)) {
    return { ...item, project: [(item.project as unknown) as string] };
  }
  return item;
}

export type Block =
  | { id: string; type: "heading"; level: 1 | 2 | 3; text: string }
  | { id: string; type: "text"; html: string }
  | { id: string; type: "image"; url: string; mobileUrl?: string; caption?: string; width: "full" | "contained" }
  | {
      id: string;
      type: "two-col";
      leftType: "text" | "image";
      leftContent: string;
      leftCaption?: string;
      rightType: "text" | "image";
      rightContent: string;
      rightCaption?: string;
    }
  | { id: string; type: "image-grid"; images: GridImage[]; columns: 2 | 3 }
  | { id: string; type: "video"; url: string; size: "full" | "large" | "medium"; caption?: string }
  | { id: string; type: "divider" }
  | { id: string; type: "highlight"; text: string }
  | { id: string; type: "button"; text: string; url: string; align: "left" | "center" | "right" }
  | { id: string; type: "text-boxes"; items: string[] }
  | { id: string; type: "feature-info"; items: string[] }
  | { id: string; type: "card-summary"; heading: string; intro?: string; items: string[] };

function getVideoEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    // YouTube
    if (u.hostname.includes("youtube.com") || u.hostname.includes("youtu.be")) {
      let videoId = u.searchParams.get("v");
      if (!videoId && u.hostname === "youtu.be") {
        videoId = u.pathname.slice(1);
      }
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }
    // Vimeo
    if (u.hostname.includes("vimeo.com")) {
      const videoId = u.pathname.split("/").filter(Boolean).pop();
      if (videoId) return `https://player.vimeo.com/video/${videoId}`;
    }
  } catch {
    // not a valid URL
  }
  return null;
}

function isEmbeddable(url: string): boolean {
  return getVideoEmbedUrl(url) !== null;
}

function VideoBlock({ block }: { block: Extract<Block, { type: "video" }> }) {
  const embedUrl = getVideoEmbedUrl(block.url);
  const sizeClass =
    block.size === "full"
      ? "w-full"
      : block.size === "large"
      ? "max-w-4xl mx-auto"
      : "max-w-2xl mx-auto";

  return (
    <div className={sizeClass}>
      <div className="relative aspect-video">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            className="w-full h-full rounded-xl"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        ) : (
          <video src={assetPath(block.url)} controls className="w-full h-full rounded-xl object-cover" />
        )}
      </div>
      {block.caption && (
        <p className="mt-2 text-sm text-gray-500 text-center">{block.caption}</p>
      )}
    </div>
  );
}

const textWrapper = "max-w-[1000px] mx-auto w-full px-6 md:px-12";

const MAX_GRID_IMAGES = 12;
const PACK_LIMIT = 5;
const DRAG_Z = 200;

function openAfterDelay(link: string, delayMs: number) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const summonUrl = `${window.location.origin}${basePath}/summon?to=${encodeURIComponent(link)}`;
  setTimeout(() => { window.location.href = summonUrl; }, delayMs);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Builds a moving rainbow gradient for the foil effect on special cards.
 *  x / y are 0–100 (percent across the card). */
/** Full-spectrum rainbow foil for special cards. */
function foilGradient(x: number, y: number): string {
  const hue   = x * 3.6;
  const angle = 110 + y * 0.6;
  return (
    `linear-gradient(${angle}deg,` +
    `hsla(${hue      },80%,62%,0.55) 0%,`  +
    `hsla(${hue + 60 },80%,62%,0.55) 16%,` +
    `hsla(${hue + 120},80%,62%,0.55) 33%,` +
    `hsla(${hue + 180},80%,62%,0.55) 50%,` +
    `hsla(${hue + 240},80%,62%,0.55) 67%,` +
    `hsla(${hue + 300},80%,62%,0.55) 84%,` +
    `hsla(${hue + 360},80%,62%,0.55) 100%)`
  );
}

/** Purple-tinted holographic foil for rare cards. Hues stay in the
 *  blue → purple → pink band and shift gently with mouse position. */
function rareGradient(x: number, y: number): string {
  const center = 270 + (x - 50) * 1.2; // purple core, drifts with x
  const angle  = 120 + y * 0.5;
  return (
    `linear-gradient(${angle}deg,` +
    `hsla(${center - 80},90%,65%,0.60) 0%,`  +
    `hsla(${center - 40},90%,62%,0.65) 20%,` +
    `hsla(${center      },85%,68%,0.70) 40%,` +
    `hsla(${center + 40 },85%,62%,0.65) 60%,` +
    `hsla(${center + 80 },80%,65%,0.55) 80%,` +
    `hsla(${center      },85%,68%,0.60) 100%)`
  );
}

function Lightbox({ items, initialIndex, showDots = true, onClose }: { items: GridImage[]; initialIndex: number; showDots?: boolean; onClose: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [sheen, setSheen] = useState({ x: 50, y: 50 });
  const [hovering, setHovering] = useState(false);
  const [closing, setClosing] = useState(false);
  const [needsGyroPermission, setNeedsGyroPermission] = useState(false);
  const settled = useRef(false);
  const mountedRef = useRef(true);
  const betaNeutralRef = useRef<number | null>(null);
  const gyroRafRef = useRef<number | null>(null);
  const gyroCleanupRef = useRef<(() => void) | null>(null);

  const item = items[currentIndex];

  function goTo(idx: number) {
    // Wrap around both ends
    const wrapped = ((idx % items.length) + items.length) % items.length;
    setCurrentIndex(wrapped);
    setTilt({ x: 0, y: 0 });
    setSheen({ x: 50, y: 50 });
    setHovering(false);
  }

  useEffect(() => {
    const t = setTimeout(() => { settled.current = true; }, 350);
    return () => clearTimeout(t);
  }, []);

  function setupGyroListener() {
    betaNeutralRef.current = null;
    function onOrientation(e: DeviceOrientationEvent) {
      const beta  = e.beta  ?? 0;
      const gamma = e.gamma ?? 0;
      if (betaNeutralRef.current === null) betaNeutralRef.current = beta;
      const dBeta = Math.max(-30, Math.min(30, beta - betaNeutralRef.current));
      const g     = Math.max(-30, Math.min(30, gamma));
      if (gyroRafRef.current !== null) return;
      gyroRafRef.current = requestAnimationFrame(() => {
        gyroRafRef.current = null;
        if (!mountedRef.current) return;
        setTilt({ x: dBeta * -0.3, y: g * 0.3 });
        setSheen({ x: Math.max(0, Math.min(100, 50 - g * 1.5)), y: Math.max(0, Math.min(100, 50 + dBeta * 1.5)) });
        setHovering(true);
      });
    }
    window.addEventListener("deviceorientation", onOrientation);
    gyroCleanupRef.current = () => window.removeEventListener("deviceorientation", onOrientation);
  }

  function requestGyroPermission() {
    // Only exists on iOS 13+ — already confirmed before showing the button
    const DOE = DeviceOrientationEvent as unknown as { requestPermission: () => Promise<string> };
    DOE.requestPermission().then((result) => {
      if (result === "granted") {
        setNeedsGyroPermission(false);
        setupGyroListener();
      }
    }).catch(() => {
      // Permission denied or unavailable — silently do nothing
    });
  }

  useEffect(() => {
    mountedRef.current = true;
    // All DeviceOrientationEvent access must be inside useEffect (client-only)
    if (typeof DeviceOrientationEvent === "undefined") return;
    const DOE = DeviceOrientationEvent as unknown as { requestPermission?: unknown };
    if (typeof DOE.requestPermission === "function") {
      // iOS 13+ — needs user gesture to unlock
      setNeedsGyroPermission(true);
    } else if ("ondeviceorientation" in window) {
      // Android / other — fires without permission
      setupGyroListener();
    }
    return () => {
      mountedRef.current = false;
      if (gyroCleanupRef.current) { gyroCleanupRef.current(); gyroCleanupRef.current = null; }
      if (gyroRafRef.current !== null) { cancelAnimationFrame(gyroRafRef.current); gyroRafRef.current = null; }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleClose() {
    if (!settled.current) return;
    setClosing(true);
    setTimeout(onClose, 300);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape")      handleClose();
      if (e.key === "ArrowLeft")   goTo(currentIndex - 1);
      if (e.key === "ArrowRight")  goTo(currentIndex + 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width;
    const ny = (e.clientY - r.top) / r.height;
    setTilt({ x: (ny - 0.5) * -8, y: (nx - 0.5) * 8 });
    setSheen({ x: nx * 100, y: ny * 100 });
  }

  function handleMouseLeave() {
    setTilt({ x: 0, y: 0 });
    setSheen({ x: 50, y: 50 });
    setHovering(false);
  }

  const isVid = item.url.toLowerCase().endsWith(".mp4");
  const hasContent = item.description || item.link || item.seriesNumber || (item.project && item.project.length > 0);
  const multiCard = items.length > 1;

  return createPortal(
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-white/30 backdrop-blur-md"
      style={{ animation: `${closing ? "fadeOut" : "fadeIn"} 300ms ease forwards` }}
      onClick={handleClose}
    >
      <div
        className="flex flex-col items-center gap-4 max-w-[80vw]"
        style={{ animation: `${closing ? "zoomOut" : "zoomIn"} 300ms ease forwards` }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Card with 3D hover tilt + sheen */}
        <div
          ref={cardRef}
          onClick={handleClose}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={handleMouseLeave}
          style={{
            transform:    `perspective(700px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transition:   hovering ? "transform 80ms ease" : "transform 400ms ease",
            borderRadius: "0.75rem",
            overflow:     "hidden",
            position:     "relative",
            boxShadow:    hovering
              ? "0 40px 80px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.12) inset"
              : "0 20px 50px rgba(0,0,0,0.2)",
            cursor:       "zoom-out",
          }}
        >
          {isVid ? (
            <video src={assetPath(item.url)} className="max-h-[70vh] rounded-xl object-contain block" autoPlay loop muted playsInline preload="none" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={assetPath(item.url)} alt="" className="max-h-[70vh] rounded-xl object-contain block" />
          )}
          <div style={{
            position:   "absolute",
            inset:      0,
            borderRadius: "0.75rem",
            background: `radial-gradient(circle at ${sheen.x}% ${sheen.y}%, rgba(255,255,255,0.38) 0%, rgba(255,255,255,0) 65%)`,
            opacity:    hovering ? 1 : 0,
            transition: hovering ? "opacity 150ms ease" : "opacity 400ms ease",
            pointerEvents: "none",
          }} />
          {(item.version === "special" || item.version === "rare") && (
            <div style={{
              position:      "absolute",
              inset:         0,
              borderRadius:  "0.75rem",
              background:    item.version === "rare"
                ? rareGradient(sheen.x, sheen.y)
                : foilGradient(sheen.x, sheen.y),
              mixBlendMode:  "color-dodge",
              opacity:       hovering ? 0.9 : 0,
              transition:    hovering ? "opacity 150ms ease" : "opacity 400ms ease",
              pointerEvents: "none",
            }} />
          )}
        </div>

        {/* Description + link */}
        {hasContent && (
          <div className="bg-white/80 rounded-2xl px-6 py-4 flex flex-col gap-3 w-full border border-white">
            {(item.seriesNumber || item.project) && (
              <div className="flex gap-4">
                {item.seriesNumber && (
                  <div className="flex flex-col gap-0.5">
                    <span className="type-tag text-[#0C0D1F]/40">Series</span>
                    <span className="type-caption-sm font-medium text-[#0C0D1F]">{item.seriesNumber}</span>
                  </div>
                )}
                {item.project && item.project.length > 0 && (
                  <div className="flex flex-col gap-0.5">
                    <span className="type-tag text-[#0C0D1F]/40">Project</span>
                    <div className="flex flex-wrap gap-1">
                      {item.project.map(p => (
                        <span key={p} className="type-caption-sm font-medium text-[#0C0D1F] bg-black/8 px-2 py-0.5 rounded-full">{p}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            {item.description && (
              <p className="type-caption text-[#0C0D1F]/80">{item.description}</p>
            )}
            {item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 type-caption bg-white/60 backdrop-blur-md border border-[#0C0D1F]/20 text-[#0C0D1F] px-4 py-2 rounded-full hover:bg-[#0C0D1F] hover:text-[#F2EBD9] hover:border-[#0C0D1F] hover:shadow-[0_0_18px_4px_rgba(12,13,31,0.35)] transition-all duration-300 ease-in-out self-start"
              >
                View →
              </a>
            )}
          </div>
        )}

      </div>

      {/* Close */}
      <button
        onClick={handleClose}
        className="absolute top-6 right-6 text-[#0C0D1F] text-2xl font-bold w-10 h-10 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 transition-colors"
      >×</button>

      {/* iOS 13+ gyroscope permission — tap once to unlock tilt effect */}
      {needsGyroPermission && (
        <button
          onClick={(e) => { e.stopPropagation(); requestGyroPermission(); }}
          style={{
            position: "fixed", bottom: 80, left: "50%", transform: "translateX(-50%)",
            background: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            border: "1px solid rgba(12,13,31,0.12)", borderRadius: 20,
            padding: "6px 14px", fontSize: 11, color: "#0C0D1F",
            cursor: "pointer", zIndex: 10, whiteSpace: "nowrap",
          }}
        >
          ↕ Enable tilt
        </button>
      )}

      {/* Prev / Next arrows — fixed to viewport sides on all screen sizes */}
      {multiCard && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); goTo(currentIndex - 1); }}
            style={{
              position: "fixed", left: 20, top: "50%", transform: "translateY(-50%)",
              width: 44, height: 44, borderRadius: "50%",
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(12,13,31,0.12)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
              zIndex: 10,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8L10 13" stroke="#0C0D1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); goTo(currentIndex + 1); }}
            style={{
              position: "fixed", right: 20, top: "50%", transform: "translateY(-50%)",
              width: 44, height: 44, borderRadius: "50%",
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(12,13,31,0.12)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
              zIndex: 10,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="#0C0D1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>

          {/* Dot indicators — only in pack view */}
          {showDots && (
            <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 6, zIndex: 10 }}>
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); goTo(i); }}
                  style={{
                    width: i === currentIndex ? 20 : 6, height: 6, borderRadius: 3,
                    background: i === currentIndex ? "#0C0D1F" : "rgba(12,13,31,0.25)",
                    border: "none", padding: 0, cursor: "pointer",
                    transition: "width 200ms ease, background 200ms ease",
                  }}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>,
    document.body
  );
}

function InstagramIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
    </svg>
  );
}

type ImageGridBlock = Extract<Block, { type: "image-grid" }>;

type CardState = { item: GridImage; x: number; y: number; rot: number; z: number; dragTilt: number };

function MediaEl({ item, className, onClick, lazy = false }: { item: GridImage; className: string; onClick: () => void; lazy?: boolean }) {
  return item.url.toLowerCase().endsWith(".mp4") ? (
    <video src={assetPath(item.url)} className={className} autoPlay loop muted playsInline preload="none" onClick={onClick} />
  ) : (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={assetPath(item.url)} alt="" className={className} onClick={onClick} loading={lazy ? "lazy" : "eager"} decoding="async" />
  );
}

function SelectionPack({ version, rotate, tx, ty, z, transitioning, onClick, isDesktop }: {
  version: PackVersion; rotate: number; tx: number; ty: number; z: number;
  transitioning: PackVersion | null; onClick: () => void; isDesktop: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const [holoMouse, setHoloMouse] = useState({ nx: 0.5, ny: 0.5 });
  const isSelected = transitioning === version;
  const isDismissed = transitioning !== null && !isSelected;
  const mobileScale = isDesktop ? 1 : (isSelected ? 1 : 0.7);
  const isRare = version === "rare";
  const currentTy = hovered ? ty - 20 : ty;
  const holoAngle = holoMouse.nx * 180;

  return (
    <div
      onClick={!transitioning ? onClick : undefined}
      onMouseEnter={() => { if (!transitioning) setHovered(true); }}
      onMouseLeave={() => { setHovered(false); setHoloMouse({ nx: 0.5, ny: 0.5 }); }}
      onMouseMove={(e) => {
        if (!isRare || !hovered) return;
        const r = e.currentTarget.getBoundingClientRect();
        setHoloMouse({ nx: (e.clientX - r.left) / r.width, ny: (e.clientY - r.top) / r.height });
      }}
      style={{
        position:   "absolute",
        left:       "50%",
        top:        "50%",
        width:      200,
        height:     350,
        marginLeft: -100,
        marginTop:  -175,
        transform:  isSelected
          ? `rotate(0deg) translate(0px, 0px) scale(${isDesktop ? 1 : 0.7})`
          : `rotate(${rotate}deg) translate(${tx}px, ${currentTy}px) scale(${mobileScale})`,
        zIndex:     isSelected ? 20 : z,
        opacity:    isDismissed ? 0 : 1,
        cursor:     transitioning ? "default" : "pointer",
        transition: isSelected
          ? "transform 480ms cubic-bezier(0.25,0.46,0.45,0.94)"
          : isDismissed
          ? "opacity 280ms ease"
          : "transform 350ms cubic-bezier(0.34,1.56,0.64,1)",
        display:    "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Card body — owns background, clipping, shadow and float */}
      <div style={{
        position:           "absolute",
        inset:              0,
        overflow:           "hidden",
        backgroundImage:    `url(${assetPath(PACK_IMAGES[version])})`,
        backgroundSize:     "cover",
        backgroundPosition: "center",
        boxShadow:          hovered && !transitioning ? "0 32px 80px rgba(0,0,0,0.55)" : "0 20px 60px rgba(0,0,0,0.4)",
        animation:          isRare && !isDismissed && !isSelected ? "rareFloat 3s ease-in-out infinite" : undefined,
      }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 45%)" }} />

        {/* Holographic rainbow layer — always-on slow hue cycle, intensifies on hover */}
        {isRare && (
          <div style={{
            position:     "absolute",
            inset:        0,
            pointerEvents: "none",
            background:   `linear-gradient(${holoAngle}deg,
              rgba(255,0,128,0.45),
              rgba(255,180,0,0.45),
              rgba(0,255,160,0.45),
              rgba(0,140,255,0.45),
              rgba(180,0,255,0.45),
              rgba(255,0,128,0.45))`,
            mixBlendMode: "screen",
            opacity:      hovered ? 0.85 : 0.35,
            animation:    !hovered ? "holoShift 5s linear infinite" : undefined,
            transition:   "opacity 300ms ease",
          }} />
        )}

        {/* Specular highlight — follows cursor on hover */}
        {isRare && hovered && (
          <div style={{
            position:     "absolute",
            inset:        0,
            pointerEvents: "none",
            background:   `radial-gradient(circle at ${holoMouse.nx * 100}% ${holoMouse.ny * 100}%, rgba(255,255,255,0.45) 0%, transparent 55%)`,
            mixBlendMode: "overlay",
          }} />
        )}
      </div>
      {!isRare && <LogoIcon variant="light" size={100} cropPx={10} playing={hovered} noLink />}
    </div>
  );
}

const PACK_IMAGES: Record<PackVersion, string> = {
  common:  "/images/cardpackageV1_jfcr.png",
  special: "/images/cardpackageV1_jfcr.png",
  V1:      "/images/cardpackageV1_jfcr.png",
  V2:      "/images/cardpackageV2_jfcr.png",
  V3:      "/images/cardpackageV3_jfcr.png",
  rare:    "/images/cardpackagerare_jfcr.png",
};

function buildFanVersions(unlimited: boolean, rareOpened: boolean): [PackVersion, PackVersion, PackVersion] {
  if (!unlimited) return ["V3", "V1", "V2"];
  if (!rareOpened) return ["V3", "rare", "V2"];
  if (Math.random() < 0.33) {
    const slot = Math.floor(Math.random() * 3) as 0 | 1 | 2;
    const v: [PackVersion, PackVersion, PackVersion] = ["V3", "V1", "V2"];
    v[slot] = "rare";
    return v;
  }
  return ["V3", "V1", "V2"];
}

function ImageGrid({ block, onOpen, cardColor = "#DDED3C", title = "", showLogo = false, description }: { block: ImageGridBlock; onOpen: (items: GridImage[], index: number, showDots: boolean) => void; cardColor?: string; title?: string; showLogo?: boolean; description?: string }) {
  const allImages = block.images.map(toGridImage);
  const storageKey = `collected-${block.id}`;
  const [selectedVersion, setSelectedVersion] = useState<PackVersion>("V1");
  const [packSelectionPhase, setPackSelectionPhase] = useState(true);
  const [packTransitioningTo, setPackTransitioningTo] = useState<PackVersion | null>(null);
  const [mounted, setMounted] = useState(false);
  const [packOpened, setPackOpened] = useState(false);
  const [packAnimating, setPackAnimating] = useState(false);
  const [packHovering, setPackHovering] = useState(false);
  const [packMouse, setPackMouse] = useState({ nx: 0.5, ny: 0.5 });
  const packRef = useRef<HTMLDivElement>(null);
  const packTransitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function resetPackState() {
    setPackOpened(false);
    setPackAnimating(false);
    setPackHovering(false);
    setPackMouse({ nx: 0.5, ny: 0.5 });
  }

  function enterSelectionPhase() {
    if (packTransitionTimer.current) {
      clearTimeout(packTransitionTimer.current);
      packTransitionTimer.current = null;
    }
    resetPackState();
    setPackTransitioningTo(null);
    setFanVersions(buildFanVersions(unlockedUnlimited, rareOpened));
    setPackSelectionPhase(true);
  }

  function handlePackMouseMove(e: React.MouseEvent) {
    const el = packRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPackMouse({ nx: (e.clientX - r.left) / r.width, ny: (e.clientY - r.top) / r.height });
  }
  const [stack, setStack] = useState<CardState[]>([]);
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
  const [overZone, setOverZone] = useState(false);
  const [collected, setCollected] = useState<GridImage[]>([]);
  const [filterProject, setFilterProject] = useState<string | null>(null);
  const [summoning, setSummoning] = useState(false);
  const [mobileZoneOpen, setMobileZoneOpen] = useState(false);
  const [packsUsed, setPacksUsed] = useState(0);
  const [unlockedUnlimited, setUnlockedUnlimited] = useState(false);
  const [rareOpened, setRareOpened] = useState(false);
  const [fanVersions, setFanVersions] = useState<[PackVersion, PackVersion, PackVersion]>(["V3", "V1", "V2"]);
  const [foilFlashUrl, setFoilFlashUrl] = useState<string | null>(null);

  const draggingCardRef = useRef<HTMLDivElement | null>(null);
  const specialCollectedRef = useRef<GridImage[]>([]);
  // Live drag position stored imperatively — avoids setStack on every pointermove
  const liveDragPos = useRef<{ x: number; y: number; dragTilt: number } | null>(null);
  // rAF handle for throttling overZone + circleProgress state updates during drag
  const rafDragRef = useRef<number | null>(null);
  const [isDesktop, setIsDesktop] = useState(true);
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1000);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  const maxZ = useRef(0);
  const zoneShowTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const mobileDropRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    idx: number;
    startPX: number; startPY: number;
    startCX: number; startCY: number;
    prevPX: number; prevPY: number;
    lastVX: number; lastVY: number;
    smoothTilt: number;
    moved: boolean;
    restingZ: number;
    prevAngle: number | null;
    accumulatedAngle: number;
  } | null>(null);
  const [circleProgress, setCircleProgress] = useState(0);
  const [justReleasedIdx, setJustReleasedIdx] = useState<number | null>(null);

  function imagesForVersion(version: PackVersion): GridImage[] {
    // common / no version  → every pack
    // special              → every pack (max 2 per draw — enforced in buildPackDraw)
    // rare                 → rare pack only
    // V1 / V2 / V3        → their own pack only
    return allImages.filter(img =>
      !img.version ||
      img.version === "common" ||
      img.version === "special" ||
      img.version === version
    );
  }

  /** Draws up to MAX_GRID_IMAGES cards for a pack, capping special cards at 2. */
  function buildPackDraw(version: PackVersion): GridImage[] {
    const pool     = shuffle(imagesForVersion(version));
    const specials = pool.filter(img => img.version === "special").slice(0, 2);
    const others   = pool.filter(img => img.version !== "special");
    return shuffle([...specials, ...others]).slice(0, MAX_GRID_IMAGES);
  }

  function makeStack(imgs: GridImage[]): CardState[] {
    maxZ.current = imgs.length;
    return imgs.map((item, i) => ({
      item, x: 0, y: 0,
      rot: (Math.random() - 0.5) * 30,
      z: i + 1, dragTilt: 0,
    }));
  }

  useEffect(() => {
    setMounted(true);
    setStack(makeStack(buildPackDraw(selectedVersion)));
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        // Merge cached cards with current server data by URL so that
        // admin edits (descriptions, series numbers, etc.) are always reflected.
        const cached = (JSON.parse(stored) as GridImage[]).map(toGridImage);
        const byUrl = new Map(allImages.map(img => [img.url, img]));
        setCollected(cached.map(c => byUrl.get(c.url) ?? c));
      }
    } catch {}
    try {
      const storedPacks = localStorage.getItem(`${storageKey}-packs-used`);
      setPacksUsed(storedPacks ? parseInt(storedPacks, 10) : 1);
      const unlimited = localStorage.getItem(`${storageKey}-unlimited`) === "true";
      const hasOpenedRare = localStorage.getItem(`${storageKey}-rare-opened`) === "true";
      if (unlimited) setUnlockedUnlimited(true);
      if (hasOpenedRare) setRareOpened(true);
      setFanVersions(buildFanVersions(unlimited, hasOpenedRare));
    } catch {}
    return () => {
      if (packTransitionTimer.current) clearTimeout(packTransitionTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try { localStorage.setItem(storageKey, JSON.stringify(collected)); } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collected]);

  // Keep the ref in sync so the foil-flash interval always reads the latest special/rare cards
  useEffect(() => {
    specialCollectedRef.current = collected.filter(c => c.version === "special" || c.version === "rare");
  }, [collected]);

  // Periodically flash the foil animation on a random collected special/rare card — mobile only
  useEffect(() => {
    if (isDesktop) return;
    const timer = setInterval(() => {
      const items = specialCollectedRef.current;
      if (items.length === 0) return;
      const pick = items[Math.floor(Math.random() * items.length)];
      setFoilFlashUrl(pick.url);
      setTimeout(() => setFoilFlashUrl(null), 1600);
    }, 3500);
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDesktop]);

  useEffect(() => {
    if (!mounted) return;
    try { localStorage.setItem(`${storageKey}-packs-used`, String(packsUsed)); } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packsUsed]);

  useEffect(() => {
    if (!mounted) return;
    try { localStorage.setItem(`${storageKey}-unlimited`, String(unlockedUnlimited)); } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unlockedUnlimited]);

  useEffect(() => {
    if (!mounted) return;
    try { localStorage.setItem(`${storageKey}-rare-opened`, String(rareOpened)); } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rareOpened]);

  useEffect(() => {
    if (!mounted) return;
    setStack(makeStack(buildPackDraw(selectedVersion)));
    resetPackState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVersion]);

  function addToCollection(item: GridImage) {
    setCollected(prev => prev.some(c => c.url === item.url) ? prev : [item, ...prev]);
  }

  const isLimited = packsUsed >= PACK_LIMIT && !unlockedUnlimited;

  function handleInstagramUnlock(e: React.MouseEvent) {
    e.preventDefault();
    setUnlockedUnlimited(true);
    window.open("https://www.instagram.com/jfcr_/", "_blank", "noopener,noreferrer");
  }

  function releaseDragSelection() {
    (document.body.style as CSSStyleDeclaration & { webkitUserSelect: string }).webkitUserSelect = "";
    document.body.style.userSelect = "";
  }

  function triggerCircleSummon(idx: number) {
    const d = dragRef.current;
    if (!d) return;
    const link = stack[idx]?.item.link;
    const restingZ = d.restingZ;
    if (rafDragRef.current !== null) { cancelAnimationFrame(rafDragRef.current); rafDragRef.current = null; }
    const finalPos = liveDragPos.current;
    liveDragPos.current = null;
    dragRef.current = null;
    setDraggingIdx(null);
    setOverZone(false);
    setMobileZoneOpen(false);
    setCircleProgress(0);
    releaseDragSelection();
    addToCollection(stack[idx].item);
    setStack(prev => prev.map((c, i) => i === idx ? { ...c, x: finalPos?.x ?? c.x, y: finalPos?.y ?? c.y, z: restingZ, dragTilt: 0 } : c));
    if (link) {
      setSummoning(true);
      openAfterDelay(link, 2000);
      setTimeout(() => { setSummoning(false); }, 2000);
    }
  }

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>, idx: number) {
    e.currentTarget.setPointerCapture(e.pointerId);
    e.preventDefault();
    // Suppress text selection across the whole page for the duration of the drag
    (document.body.style as CSSStyleDeclaration & { webkitUserSelect: string }).webkitUserSelect = "none";
    document.body.style.userSelect = "none";
    if (isDesktop && zoneShowTimer.current) {
      clearTimeout(zoneShowTimer.current);
      zoneShowTimer.current = null;
    }
    const restingZ = Math.min(maxZ.current + 1, 35);
    maxZ.current = restingZ;
    setStack(prev => prev.map((c, i) => i === idx ? { ...c, z: DRAG_Z } : c));
    setDraggingIdx(idx);
    dragRef.current = {
      idx,
      startPX: e.clientX, startPY: e.clientY,
      startCX: stack[idx]?.x ?? 0,
      startCY: stack[idx]?.y ?? 0,
      prevPX: e.clientX, prevPY: e.clientY,
      lastVX: 0, lastVY: 0,
      smoothTilt: 0,
      moved: false,
      restingZ,
      prevAngle: null,
      accumulatedAngle: 0,
    };
    setCircleProgress(0);
  }

  function cardOverlapsZone(_zoneEl: HTMLDivElement | null): boolean {
    if (!isDesktop) return false;
    const cardEl = draggingCardRef.current;
    if (!cardEl) return false;
    const c = cardEl.getBoundingClientRect();
    // Compute zone's stable final rect from window geometry rather than measuring
    // the animated element — getBoundingClientRect() returns mid-animation positions
    // which causes the first-drop to always miss.
    let z: { left: number; right: number; top: number; bottom: number };
    if (isDesktop) {
      const zoneW = 416, zoneH = 72;
      const zoneLeft  = window.innerWidth / 2 - zoneW / 2;
      const zoneBottom = window.innerHeight * 0.86;
      z = { left: zoneLeft, right: zoneLeft + zoneW, top: zoneBottom - zoneH, bottom: zoneBottom };
    } else {
      const zoneH = 72;
      const zoneBottom = window.innerHeight - 16;
      z = { left: 16, right: window.innerWidth - 16, top: zoneBottom - zoneH, bottom: zoneBottom };
    }
    return c.left < z.right && c.right > z.left && c.top < z.bottom && c.bottom > z.top;
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>, idx: number) {
    const d = dragRef.current;
    if (!d || d.idx !== idx) return;
    const dx = e.clientX - d.startPX;
    const dy = e.clientY - d.startPY;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      if (!d.moved) setMobileZoneOpen(true);
      d.moved = true;
    }
    const vx = e.clientX - d.prevPX;
    const vy = e.clientY - d.prevPY;
    // EMA-smooth the tilt so it eases in/out instead of jumping — fixes Firefox jank
    const rawTilt = Math.max(-22, Math.min(22, vx * 0.6));
    d.smoothTilt = d.smoothTilt * 0.72 + rawTilt * 0.28;
    const dragTilt = d.smoothTilt;
    d.lastVX = d.lastVX * 0.6 + vx * 0.4;
    d.lastVY = d.lastVY * 0.6 + vy * 0.4;
    d.prevPX = e.clientX;
    d.prevPY = e.clientY;

    const newX = d.startCX + dx;
    const newY = d.startCY + dy;

    // Store live position so any React re-render triggered by other state
    // (overZone, circleProgress) reads the correct drag coordinates
    liveDragPos.current = { x: newX, y: newY, dragTilt };

    // Direct DOM update — zero React overhead, cursor-accurate
    const el = draggingCardRef.current;
    if (el) {
      el.style.willChange = "transform";
      el.style.transition = "none";
      el.style.transform = `translate(calc(-50% + ${newX}px), calc(-50% + ${newY}px)) rotate(${(stack[idx]?.rot ?? 0) + dragTilt}deg) scale(1)`;

      // Show foil animation on special/rare cards during mobile drag
      if (!isDesktop && (stack[idx]?.item.version === "special" || stack[idx]?.item.version === "rare")) {
        const r = el.getBoundingClientRect();
        const fx = Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100));
        const fy = Math.max(0, Math.min(100, ((e.clientY - r.top)  / r.height) * 100));
        const foil = el.querySelector<HTMLElement>(".foil-overlay");
        if (foil) {
          foil.style.background = stack[idx].item.version === "rare" ? rareGradient(fx, fy) : foilGradient(fx, fy);
          foil.style.opacity = "0.9";
        }
      }
    }

    // Circle gesture detection — must run on every event for accurate angle accumulation
    let capturedProgress: number | null = null;
    if (isDesktop && d.moved) {
      const rdx = e.clientX - d.startPX;
      const rdy = e.clientY - d.startPY;
      const radius = Math.sqrt(rdx * rdx + rdy * rdy);
      if (radius >= 40) {
        const angle = Math.atan2(rdy, rdx);
        if (d.prevAngle !== null) {
          let delta = angle - d.prevAngle;
          if (delta > Math.PI)  delta -= 2 * Math.PI;
          if (delta < -Math.PI) delta += 2 * Math.PI;
          // Only accumulate in the dominant direction — small reversals don't bleed progress
          if (d.accumulatedAngle === 0 || delta * d.accumulatedAngle >= 0) {
            d.accumulatedAngle += delta;
          }
          capturedProgress = Math.min(Math.abs(d.accumulatedAngle) / (3 * 2 * Math.PI), 1);
          if (Math.abs(d.accumulatedAngle) >= 3 * 2 * Math.PI) {
            triggerCircleSummon(idx);
            return;
          }
        }
        d.prevAngle = angle;
      } else {
        // Reset angle reference when cursor returns to centre so the next
        // crossing doesn't produce a stale-angle spike
        d.prevAngle = null;
      }
    }

    // Throttle React state updates (overZone highlight, circle progress) to one per frame
    if (rafDragRef.current !== null) return;
    const capturedOver = cardOverlapsZone(mobileDropRef.current);
    const capturedCircle = capturedProgress;
    rafDragRef.current = requestAnimationFrame(() => {
      rafDragRef.current = null;
      setOverZone(capturedOver);
      if (capturedCircle !== null) setCircleProgress(capturedCircle);
    });
  }

  function handlePointerUp(e: React.PointerEvent<HTMLDivElement>, idx: number) {
    const d = dragRef.current;
    if (!d || d.idx !== idx) return;
    if (zoneShowTimer.current) { clearTimeout(zoneShowTimer.current); zoneShowTimer.current = null; }
    // Cancel pending rAF and capture final drag position before clearing
    if (rafDragRef.current !== null) { cancelAnimationFrame(rafDragRef.current); rafDragRef.current = null; }
    const finalPos = liveDragPos.current;
    liveDragPos.current = null;
    // Restore transition so release animations (scale-down, tilt reset) play correctly
    if (draggingCardRef.current) {
      draggingCardRef.current.style.transition = "";
      draggingCardRef.current.style.willChange = "auto";
      // Hide foil that was lit during mobile drag
      const foil = draggingCardRef.current.querySelector<HTMLElement>(".foil-overlay");
      if (foil) foil.style.opacity = "0";
    }
    const droppedOnZone = cardOverlapsZone(mobileDropRef.current);
    const restingZ = d.restingZ;
    const baseX = finalPos?.x ?? 0;
    const baseY = finalPos?.y ?? 0;
    const THROW = 12;
    const CAP   = 200;
    const throwX = baseX + Math.max(-CAP, Math.min(CAP, d.lastVX * THROW));
    const throwY = baseY + Math.max(-CAP, Math.min(CAP, d.lastVY * THROW));
    const hasMomentum = d.moved && !droppedOnZone && (Math.abs(d.lastVX) > 1 || Math.abs(d.lastVY) > 1);
    if (hasMomentum) {
      setJustReleasedIdx(idx);
      setTimeout(() => setJustReleasedIdx(null), 750);
    }
    dragRef.current = null;
    setDraggingIdx(null);
    setOverZone(false);
    setCircleProgress(0);
    releaseDragSelection();
    setStack(prev => prev.map((c, i) => i === idx ? { ...c, x: hasMomentum ? throwX : baseX, y: hasMomentum ? throwY : baseY, z: droppedOnZone ? DRAG_Z : restingZ, dragTilt: 0 } : c));
    if (d.moved) addToCollection(stack[idx].item);
    if (droppedOnZone) {
      addToCollection(stack[idx].item);
      const link = stack[idx].item.link;
      if (link) {
        setSummoning(true);
        openAfterDelay(link, 2000);
        setTimeout(() => {
          setSummoning(false);
          setMobileZoneOpen(false);
          setStack(prev => prev.map((c, i) => i === idx ? { ...c, z: restingZ, x: 0, y: 0 } : c));
        }, 2000);
      } else {
        setStack(prev => prev.map((c, i) => i === idx ? { ...c, z: restingZ, x: 0, y: 0 } : c));
        setMobileZoneOpen(false);
      }
    } else {
      setTimeout(() => setMobileZoneOpen(false), 400);
    }
    if (!d.moved && !droppedOnZone) {
      addToCollection(stack[idx].item);
      onOpen(stack.map(c => c.item), idx, true);
    }
  }

  return (
    <div className="w-full flex flex-col">
    <div
      className="min-h-[calc(100vh-80px)] w-full flex flex-col wide:flex-row wide:items-center px-0 wide:px-12 pt-0 wide:pt-0 gap-4 wide:gap-0"
      style={{
        backgroundImage: "radial-gradient(circle, rgba(138,94,217,0.3) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }}
    >

      {/* Left column: logo → title → description */}
      <div className="w-full wide:w-1/3 shrink-0 flex flex-col wide:gap-6 px-6 wide:px-0 wide:pl-12 wide:pr-8 items-center wide:items-start text-center wide:text-left" style={{ gap: isDesktop ? undefined : "0.5rem", paddingTop: 0, marginTop: 0, position: "relative" }}>
        {showLogo && <LogoIcon variant="color" cropPx={50} href="https://www.jfcr.design/" />}
        {title && (
          <h2 className="type-case-subtitle">{title}</h2>
        )}
        {description && (
          <p className="type-caption-sm text-[#0C0D1F]/50" style={{ maxWidth: 280 }}>{description}</p>
        )}
        {/* CTA on desktop — z-index keeps it above dragged cards */}
        {mounted && isDesktop && (
          <div style={{ position: "relative", zIndex: 400 }}>
            {isLimited ? (
              <a
                href="https://www.instagram.com/jfcr_/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleInstagramUnlock}
                className="type-caption-sm bg-white/60 backdrop-blur-md border border-[#0C0D1F]/20 text-[#0C0D1F] px-4 py-1.5 rounded-full hover:bg-[#0C0D1F] hover:text-[#F2EBD9] hover:border-[#0C0D1F] hover:shadow-[0_0_18px_4px_rgba(12,13,31,0.35)] active:bg-[#0C0D1F] active:text-[#F2EBD9] active:border-[#0C0D1F] active:shadow-[0_0_18px_4px_rgba(12,13,31,0.35)] transition-all duration-300 ease-in-out self-start inline-flex items-center gap-2"
                style={{ textDecoration: "none" }}
              >
                <InstagramIcon />
                Follow for unlimited packs
              </a>
            ) : (
              <button
                onClick={enterSelectionPhase}
                className="type-caption-sm bg-white/60 backdrop-blur-md border border-[#0C0D1F]/20 text-[#0C0D1F] px-4 py-1.5 rounded-full hover:bg-[#0C0D1F] hover:text-[#F2EBD9] hover:border-[#0C0D1F] hover:shadow-[0_0_18px_4px_rgba(12,13,31,0.35)] transition-all duration-300 ease-in-out self-start"
              >
                Get a new pack ↻
              </button>
            )}
          </div>
        )}
      </div>

      {/* CTA on mobile — floats outside the column above all cards */}
      {mounted && !isDesktop && (
        <div style={{ position: "relative", zIndex: 400, display: "flex", justifyContent: "center", width: "100%", paddingInline: 24 }}>
          {isLimited ? (
            <a
              href="https://www.instagram.com/jfcr_/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleInstagramUnlock}
              className="type-caption-sm bg-white/60 backdrop-blur-md border border-[#0C0D1F]/20 text-[#0C0D1F] px-4 py-1.5 rounded-full hover:bg-[#0C0D1F] hover:text-[#F2EBD9] hover:border-[#0C0D1F] hover:shadow-[0_0_18px_4px_rgba(12,13,31,0.35)] active:bg-[#0C0D1F] active:text-[#F2EBD9] active:border-[#0C0D1F] active:shadow-[0_0_18px_4px_rgba(12,13,31,0.35)] transition-all duration-300 ease-in-out inline-flex items-center gap-2"
              style={{ textDecoration: "none" }}
            >
              <InstagramIcon />
              Follow for unlimited packs
            </a>
          ) : (
            <button
              onClick={enterSelectionPhase}
              className="type-caption-sm bg-white/60 backdrop-blur-md border border-[#0C0D1F]/20 text-[#0C0D1F] px-4 py-1.5 rounded-full hover:bg-[#0C0D1F] hover:text-[#F2EBD9] hover:border-[#0C0D1F] hover:shadow-[0_0_18px_4px_rgba(12,13,31,0.35)] active:bg-[#0C0D1F] active:text-[#F2EBD9] active:border-[#0C0D1F] active:shadow-[0_0_18px_4px_rgba(12,13,31,0.35)] transition-all duration-300 ease-in-out"
            >
              Get a new pack ↻
            </button>
          )}
        </div>
      )}

      {/* Right section: spinning circle + cards + drop zone */}
      <div className="flex-1 relative" style={{ height: 700 }}>
      {/* Spinning text circle — always visible */}
      {mounted && (
        <svg
          style={{
            position:      "absolute",
            left:          "50%",
            top:           -80,
            transform:     "translateX(-50%)",
            width:         440,
            overflow:      "visible",
            pointerEvents: "none",
            zIndex:        0,
          }}
          viewBox="0 0 300 220"
        >
          <defs>
            <path id="grid-arch" d="M 20,200 Q 150,66 280,200" />
          </defs>
          <g>
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 150 293"
              to="360 150 293"
              dur="28s"
              repeatCount="indefinite"
            />
            {[0, 120, 240].map((deg) => (
              <g key={deg} transform={`rotate(${deg} 150 293)`}>
                <text
                  fill="#8A5ED9"
                  fontSize="24"
                  fontWeight="800"
                  textAnchor="middle"
                  style={{ fontFamily: "var(--font-migra), serif", userSelect: "none", WebkitUserSelect: "none" }}
                >
                  <textPath href="#grid-arch" startOffset="50%">
                    new pack • unwrap • repeat •
                  </textPath>
                </text>
              </g>
            ))}
          </g>
        </svg>
      )}

      {mounted && packSelectionPhase && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "relative", width: 560, height: 420 }}>
            {([
              { version: fanVersions[0], rotate: -14, tx: isDesktop ? -140 : -80, ty: 40, z: 1 },
              { version: fanVersions[1], rotate: 0,   tx: 0,                      ty: 0,  z: 3 },
              { version: fanVersions[2], rotate: 14,  tx: isDesktop ? 140  : 80,  ty: 40, z: 2 },
            ]).map(({ version, rotate, tx, ty, z }) => (
              <SelectionPack
                key={version}
                version={version} rotate={rotate} tx={tx} ty={ty} z={z}
                transitioning={packTransitioningTo}
                isDesktop={isDesktop}
                onClick={() => {
                  if (packTransitionTimer.current) clearTimeout(packTransitionTimer.current);
                  resetPackState();
                  setPackTransitioningTo(version);
                  setSelectedVersion(version);
                  // Always rebuild the stack so same-version re-picks get a fresh shuffle
                  setStack(makeStack(buildPackDraw(version)));
                  packTransitionTimer.current = setTimeout(() => {
                    packTransitionTimer.current = null;
                    setPackSelectionPhase(false);
                    setPackTransitioningTo(null);
                  }, 520);
                }}
              />
            ))}
          </div>
          <p style={{ position: "absolute", bottom: 60, left: "50%", transform: "translateX(-50%)", color: "rgba(255,255,255,0.4)", fontSize: 13, whiteSpace: "nowrap" }}>
            no take backsies
          </p>
        </div>
      )}
      {mounted && !packSelectionPhase && (<>

        {/* Card pack stand-in — shown until opened */}
        {!packOpened && (() => {
          const tiltX = packHovering && !packAnimating ? (packMouse.ny - 0.5) * -8 : 0;
          const tiltY = packHovering && !packAnimating ? (packMouse.nx - 0.5) * 8 : 0;
          const foilAngle = packMouse.nx * 180;
          return (
          <div style={{
            position: "absolute", left: "50%", top: "50%",
            marginLeft: -100, marginTop: -175,
            width: 200, height: 350,
            transform: isDesktop ? undefined : "scale(0.7)",
            transformOrigin: "center center",
            zIndex: 20,
          }}>
          <div
            ref={packRef}
            onClick={() => { if (!packAnimating) setPackAnimating(true); }}
            onAnimationEnd={(e) => { if (e.animationName === "packReveal") { setPackOpened(true); setPacksUsed(prev => prev + 1); if (selectedVersion === "rare") setRareOpened(true); } }}
            onMouseEnter={() => setPackHovering(true)}
            onMouseLeave={() => { setPackHovering(false); setPackMouse({ nx: 0.5, ny: 0.5 }); }}
            onMouseMove={handlePackMouseMove}
            style={{
              position:    "relative",
              width:       200,
              height:      350,
              borderRadius: 0,
              background:  "#1a1a2e",
              backgroundImage: `url(${assetPath(PACK_IMAGES[selectedVersion])})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              display:     "flex",
              alignItems:  "center",
              justifyContent: "center",
              cursor:      packAnimating ? "default" : "pointer",
              overflow:    "hidden",
              transform:   packAnimating ? undefined
                : `perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(${packHovering ? 50 : 0}px)`,
              transition:  packAnimating ? undefined
                : packHovering ? "transform 80ms ease, box-shadow 80ms ease" : "transform 400ms ease, box-shadow 400ms ease",
              animation:   packAnimating
                ? "packReveal 1.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards"
                : "packFloat 3s ease-in-out infinite",
              boxShadow:   packHovering && !packAnimating
                ? "0 32px 80px rgba(0,0,0,0.5)"
                : "0 20px 60px rgba(0,0,0,0.35)",
            }}
          >
            {/* Static diagonal gloss — always visible */}
            <div style={{
              position: "absolute", inset: 0, pointerEvents: "none", borderRadius: 0,
              background: "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 45%)",
            }} />
            {/* Specular highlight — follows cursor */}
            <div style={{
              position:   "absolute", inset: 0, pointerEvents: "none",
              background: `radial-gradient(circle at ${packMouse.nx * 100}% ${packMouse.ny * 100}%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 55%)`,
              opacity:    packHovering && !packAnimating ? 1 : 0,
              transition: "opacity 200ms ease",
            }} />
            {/* Iridescent foil — angle follows cursor */}
            <div style={{
              position:   "absolute", inset: 0, pointerEvents: "none",
              background: `linear-gradient(${foilAngle}deg, rgba(255,0,128,0.18), rgba(255,200,0,0.18), rgba(0,255,180,0.18), rgba(0,140,255,0.18), rgba(180,0,255,0.18))`,
              opacity:    packHovering && !packAnimating ? 1 : 0,
              transition: "opacity 200ms ease",
              mixBlendMode: "screen",
            }} />
            {/* Logo */}
            {selectedVersion !== "rare" && <LogoIcon variant="light" size={100} cropPx={10} playing={packHovering} noLink />}
          </div>
          </div>
          );
        })()}


        <div style={{
          opacity:        packOpened ? 1 : 0,
          pointerEvents:  packOpened ? "auto" : "none",
          transition:     "opacity 300ms ease",
          position:       "absolute", inset: 0,
          transform:      isDesktop ? undefined : "scale(0.7)",
          transformOrigin: "center center",
        }}>
        {stack.map((card, i) => {
          const isZoneCard = draggingIdx === i && overZone;
          const isNew = !collected.some(c => c.url === card.item.url);
          const showRainbow = draggingIdx === i && isNew;
          return (
          <div
            key={i}
            ref={draggingIdx === i ? draggingCardRef : undefined}
            style={{
              position:   "absolute",
              left:       "50%",
              top:        "50%",
              width:      360,
              zIndex:     card.z,
              cursor:     draggingIdx === i ? "grabbing" : "grab",
              userSelect: "none",
              touchAction:"none",
              transform:  (() => {
                // During drag, read from liveDragPos so any React re-render from
                // other state (overZone, circleProgress) uses the correct live coords
                const live = draggingIdx === i ? liveDragPos.current : null;
                const x = live ? live.x : card.x;
                const y = live ? live.y : card.y;
                const tilt = live ? live.dragTilt : card.dragTilt;
                return `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${card.rot + tilt}deg) scale(${draggingIdx === i ? 1 : 0.667})`;
              })(),
              filter:     draggingIdx !== null && draggingIdx !== i ? "blur(3px)" : "none",
              // Dragged card: no transition during drag (direct DOM); float on release
              transition: draggingIdx === i
                ? "none"
                : justReleasedIdx === i
                  ? "transform 750ms cubic-bezier(0.25, 0.46, 0.45, 0.94), filter 200ms ease"
                  : "transform 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94), filter 200ms ease",
              borderRadius: 16,
            }}
            onPointerDown={(e) => handlePointerDown(e, i)}
            onPointerMove={(e) => handlePointerMove(e, i)}
            onPointerUp={(e)   => handlePointerUp(e, i)}
            onMouseMove={(card.item.version === "special" || card.item.version === "rare") ? (e) => {
              const r = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - r.left) / r.width) * 100;
              const y = ((e.clientY - r.top)  / r.height) * 100;
              const foil = e.currentTarget.querySelector<HTMLElement>(".foil-overlay");
              if (foil) {
                foil.style.background = card.item.version === "rare" ? rareGradient(x, y) : foilGradient(x, y);
                foil.style.opacity = "0.9";
              }
            } : undefined}
            onMouseLeave={(card.item.version === "special" || card.item.version === "rare") ? (e) => {
              const foil = e.currentTarget.querySelector<HTMLElement>(".foil-overlay");
              if (foil) foil.style.opacity = "0";
            } : undefined}
          >
            {/* 3D tilt wrapper — also owns the shadow and radius so they follow the tilt */}
            <div style={{
              transform:    isZoneCard ? "perspective(500px) rotateY(22deg) rotateX(-12deg)" : "perspective(500px) rotateY(0deg) rotateX(0deg)",
              transition:   "transform 250ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 200ms ease",
              borderRadius: "0.75rem",
              position:     "relative",
              overflow:     "hidden",
              ["--glow-color" as string]: `${cardColor}88`,
              boxShadow:    draggingIdx === i && circleProgress > 0
                  ? `0 0 0 ${(circleProgress * 5).toFixed(1)}px rgba(147,51,234,${(circleProgress * 0.85).toFixed(2)}), 0 0 ${(circleProgress * 55).toFixed(0)}px ${(circleProgress * 20).toFixed(0)}px rgba(147,51,234,${(circleProgress * 0.5).toFixed(2)}), 0 20px 50px rgba(0,0,0,0.3)`
                  : isZoneCard
                    ? "0 40px 80px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.15) inset"
                    : draggingIdx === i
                      ? "0 20px 60px rgba(0,0,0,0.35)"
                      : "0 8px 32px rgba(0,0,0,0.2)",
              animation:    isZoneCard
                  ? "zoneGlow 0.8s ease-in-out infinite"
                  : "none",
            }}>
              <MediaEl
                item={card.item}
                className="w-full h-auto block rounded-xl pointer-events-none select-none"
                onClick={() => {}}
                lazy
              />
              {/* Foil — rainbow for special, purple-tinted for rare */}
              {(card.item.version === "special" || card.item.version === "rare") && (
                <div className="foil-overlay" />
              )}
              {/* Sheen — slow sweep when over drop zone, quick loop while dragging a new card */}
              {(isZoneCard || showRainbow) && (
                <div style={{
                  position:      "absolute",
                  top:           0,
                  left:          0,
                  width:         "45%",
                  height:        "100%",
                  background:    "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.95) 40%, rgba(255,255,255,0.2) 70%, rgba(255,255,255,0) 100%)",
                  animation:     isZoneCard ? "sheenSlide 6s ease-in-out infinite" : "sheenSlide 2.4s ease-in-out infinite",
                  pointerEvents: "none",
                }} />
              )}
            </div>
          </div>
          );
        })}
        </div>{/* end preloaded cards wrapper */}
      </>)}
      </div>{/* end right section */}

    </div>{/* end flex row */}

    {/* Summon zone — desktop only */}
    {mounted && isDesktop && (
      <div
        ref={mobileDropRef}
        style={{
          position:        "fixed",
          ...(isDesktop ? {
            bottom:  "14%",
            left:    "50%",
            width:   416,
            height:  72,
            transform: mobileZoneOpen || summoning ? "translateX(-50%) translateY(0) scale(1)" : "translateX(-50%) translateY(40px) scale(0.95)",
            transformOrigin: "bottom center",
          } : {
            bottom:  `calc(16px + env(safe-area-inset-bottom, 0px))`,
            left:    16,
            right:   16,
            height:  72,
            transform: mobileZoneOpen || summoning ? "translateY(0) scale(1)" : "translateY(120%) scale(0.95)",
            transformOrigin: "bottom center",
          }),
          borderRadius:    16,
          background:      summoning ? `${cardColor}dd` : "rgba(255,255,255,0.55)",
          backdropFilter:  "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border:          `1.5px solid ${summoning ? cardColor : "rgba(12,13,31,0.12)"}`,
          display:         "flex",
          opacity:         isDesktop ? (mobileZoneOpen || summoning ? 1 : 0) : 1,
          alignItems:      "center",
          justifyContent:  "center",
          pointerEvents:   "none",
          transition:      "transform 350ms cubic-bezier(0.34,1.56,0.64,1), opacity 350ms ease, background 300ms ease, border-color 300ms ease",
          zIndex:          draggingIdx !== null ? 50 : 100,
          boxShadow:       summoning ? undefined : "0 4px 20px rgba(0,0,0,0.12)",
          animation:       summoning ? "mobileZoneSummon 1s ease-in-out infinite" : "none",
        }}
      >
        <span style={{
          fontSize:      12,
          fontFamily:    "var(--font-telegraf), sans-serif",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color:         summoning ? "#ffffff" : "rgba(12,13,31,0.45)",
          transition:    "color 300ms ease",
        }}>
          {summoning ? "summoning…" : "drop card here to summon"}
        </span>
      </div>
    )}

    {/* Collection grid — cards revealed so far */}
    {collected.length > 0 && (
      <div className="w-full px-12 pb-20 pt-[110px] wide:pt-0 wide:-mt-10">
        <div className="flex flex-wrap gap-2 items-center justify-center md:justify-start mb-6">
          <p className="mr-2 text-[#0C0D1F]/40" style={{ fontFamily: "var(--font-migra), serif", fontSize: "1.75rem", fontWeight: 700 }}>
            Collected — <span>{collected.length}</span> / <span>{allImages.length}</span>
          </p>
          {Array.from(new Set(collected.flatMap(c => c.project ?? []))).map(p => (
            <button
              key={p}
              onClick={() => {
                const y = window.scrollY;
                setFilterProject(filterProject === p ? null : p);
                requestAnimationFrame(() => window.scrollTo({ top: y, behavior: "instant" }));
              }}
              className="type-tag px-3 py-1 rounded-full border transition-colors duration-150 leading-none flex items-center"
              style={{
                background:  filterProject === p ? cardColor : "transparent",
                borderColor: filterProject === p ? cardColor : "rgba(12,13,31,0.2)",
                color:       filterProject === p ? "#0C0D1F" : "rgba(12,13,31,0.5)",
              }}
            >
              {p}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4 items-center">
          {collected.filter(c => !filterProject || c.project?.includes(filterProject)).map((item, i, arr) => (
            <div
              key={item.url}
              onClick={() => onOpen(arr, i, false)}
              style={{
                width:        "100%",
                borderRadius: "0.75rem",
                overflow:     "hidden",
                boxShadow:    "0 4px 16px rgba(0,0,0,0.15)",
                cursor:       "pointer",
                position:     "relative",
                flexShrink:   0,
                transition:   "transform 200ms ease, box-shadow 200ms ease",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "scale(1.05)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.22)"; }}
              onMouseMove={(item.version === "special" || item.version === "rare") ? (e) => {
                const r = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - r.left) / r.width) * 100;
                const y = ((e.clientY - r.top)  / r.height) * 100;
                const foil = e.currentTarget.querySelector<HTMLElement>(".foil-overlay");
                if (foil) {
                  foil.style.background = item.version === "rare" ? rareGradient(x, y) : foilGradient(x, y);
                  foil.style.opacity = "0.9";
                }
              } : undefined}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.15)";
                const foil = e.currentTarget.querySelector<HTMLElement>(".foil-overlay");
                if (foil) foil.style.opacity = "0";
              }}
            >
              <MediaEl item={item} className="w-full h-auto block pointer-events-none select-none" onClick={() => {}} lazy />
              {(item.version === "special" || item.version === "rare") && (
                <div
                  className="foil-overlay"
                  style={!isDesktop && foilFlashUrl === item.url ? {
                    background: item.version === "rare" ? rareGradient(50, 50) : foilGradient(50, 50),
                    animation: "foilFlash 1.6s ease forwards",
                    transition: "none",
                  } : undefined}
                />
              )}
              {item.seriesNumber && (
                <div style={{
                  position:      "absolute",
                  bottom:        8,
                  left:          10,
                  zIndex:        1,
                  fontSize:      11,
                  fontWeight:    600,
                  fontFamily:    "var(--font-telegraf), sans-serif",
                  color:         "#fff",
                  textShadow:    "0 1px 4px rgba(0,0,0,0.6)",
                  letterSpacing: "0.04em",
                  pointerEvents: "none",
                }}>
                  {item.seriesNumber}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )}
    </div>
  );
}

export default function BlockRenderer({ blocks, cardColor, title, showLogo, description }: { blocks: Block[]; cardColor?: string; title?: string; showLogo?: boolean; description?: string }) {
  const [lightbox, setLightbox] = useState<{ items: GridImage[]; index: number; showDots: boolean } | null>(null);

  return (
    <>
    <div className="flex flex-col">
      {blocks.map((block) => (
        <div key={block.id} className="py-8">

          {block.type === "heading" && (
            <div className={textWrapper}>
              {block.level === 1 && <h1 className="type-case-title">{block.text}</h1>}
              {block.level === 2 && <h2 className="type-case-subtitle">{block.text}</h2>}
              {block.level === 3 && <h3 className="type-case-heading-sm">{block.text}</h3>}
            </div>
          )}

          {block.type === "text" && (
            <div className={textWrapper}>
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: block.html }} />
            </div>
          )}

          {block.type === "highlight" && (
            <div className={`${textWrapper} py-12 text-center`}>
              <p className="font-black text-3xl md:text-5xl text-[#0C0D1F]">{block.text}</p>
            </div>
          )}

          {block.type === "divider" && (
            <div className={textWrapper}>
              <hr className="border-gray-200" />
            </div>
          )}

          {block.type === "two-col" && (
            <div className={textWrapper}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  {block.leftType === "text" ? (
                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: block.leftContent }} />
                  ) : (
                    <figure>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={assetPath(block.leftContent)} alt={block.leftCaption ?? ""} className="w-full h-auto block" />
                      {block.leftCaption && <figcaption className="type-caption-sm text-[#0C0D1F]/50 mt-2">{block.leftCaption}</figcaption>}
                    </figure>
                  )}
                </div>
                <div>
                  {block.rightType === "text" ? (
                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: block.rightContent }} />
                  ) : (
                    <figure>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={assetPath(block.rightContent)} alt={block.rightCaption ?? ""} className="w-full h-auto block" />
                      {block.rightCaption && <figcaption className="type-caption-sm text-[#0C0D1F]/50 mt-2">{block.rightCaption}</figcaption>}
                    </figure>
                  )}
                </div>
              </div>
            </div>
          )}

          {block.type === "image" && (
            <div className={block.width === "contained" ? "max-w-[1200px] mx-auto w-full px-6 md:px-12" : "w-full"}>
              <picture>
                {block.mobileUrl && <source srcSet={assetPath(block.mobileUrl)} media="(max-width: 767px)" />}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={assetPath(block.url)} alt={block.caption ?? ""} className="w-full h-auto block" />
              </picture>
              {block.caption && (
                <p className="mt-2 text-sm text-gray-500 text-center">{block.caption}</p>
              )}
            </div>
          )}

          {block.type === "image-grid" && (
            <ImageGrid block={block} onOpen={(items, index, showDots) => setLightbox({ items, index, showDots })} cardColor={cardColor} title={title} showLogo={showLogo} description={description} />
          )}

          {block.type === "video" && <VideoBlock block={block} />}

          {block.type === "text-boxes" && (
            <div className="w-[90%] mx-auto">
              <div className="flex flex-wrap gap-3">
                {block.items.map((text, i) => (
                  <div
                    key={i}
                    className="border-2 border-[#0C0D1F] rounded-2xl px-5 py-4"
                    style={{ flex: "1 1 calc(33.333% - 8px)" }}
                  >
                    <span className="type-paragraph font-bold">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {block.type === "feature-info" && (
            <div className={textWrapper}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                {block.items.map((text, i) => {
                  const spaceIdx = text.indexOf(" ");
                  const stat = spaceIdx === -1 ? text : text.slice(0, spaceIdx);
                  const desc = spaceIdx === -1 ? "" : text.slice(spaceIdx + 1);
                  return (
                    <div key={i} style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.4rem",
                      border: "1.5px solid rgba(12,13,31,0.1)",
                      borderRadius: 16,
                      padding: "1.25rem 1.25rem 1.25rem",
                    }}>
                      <span style={{
                        fontFamily: "var(--font-migra), serif",
                        fontSize: 52,
                        fontWeight: 800,
                        lineHeight: 1,
                        letterSpacing: "-0.02em",
                        color: "#0C0D1F",
                      }}>{stat}</span>
                      {desc && (
                        <span style={{
                          fontFamily: "var(--font-telegraf), sans-serif",
                          fontSize: 17,
                          color: "rgba(12,13,31,0.6)",
                          lineHeight: 1.45,
                        }}>{desc}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {block.type === "card-summary" && (
            <div className={textWrapper}>
              <h2 className="type-case-subtitle mb-4">{block.heading}</h2>
              {block.intro && (
                <p style={{
                  fontFamily: "var(--font-telegraf), sans-serif",
                  fontSize: 16,
                  color: "rgba(12,13,31,0.65)",
                  lineHeight: 1.65,
                  marginBottom: "2rem",
                }}>{block.intro}</p>
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {block.items.map((text, i) => {
                  const dashIdx = text.indexOf(" — ");
                  const label = dashIdx !== -1 ? text.slice(0, dashIdx) : String(i + 1).padStart(2, "0");
                  const body = dashIdx !== -1 ? text.slice(dashIdx + 3) : text;
                  return (
                    <div key={i} style={{
                      border: "1.5px solid rgba(12,13,31,0.1)",
                      borderRadius: 16,
                      padding: "1.5rem 1.75rem",
                    }}>
                      <div style={{
                        fontFamily: "var(--font-migra), serif",
                        fontSize: 40,
                        fontWeight: 800,
                        lineHeight: 1,
                        letterSpacing: "-0.02em",
                        color: "#0C0D1F",
                        opacity: 0.18,
                        marginBottom: "0.75rem",
                      }}>{label}</div>
                      <p style={{
                        fontFamily: "var(--font-telegraf), sans-serif",
                        fontSize: 15,
                        color: "#0C0D1F",
                        lineHeight: 1.65,
                        margin: 0,
                      }}>{body}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {block.type === "button" && (
            <div className={`${textWrapper} flex ${block.align === "center" ? "justify-center" : block.align === "right" ? "justify-end" : "justify-start"}`}>
              <a
                href={block.url}
                target="_blank"
                rel="noopener noreferrer"
                className="type-cta inline-flex items-center gap-2 bg-[#0C0D1F] text-[#F2EBD9] px-8 py-3 rounded-full hover:bg-[#DDED3C] hover:text-[#0C0D1F] transition-all duration-300 ease-in-out"
              >
                {block.text}
              </a>
            </div>
          )}

        </div>
      ))}
    </div>
    {lightbox && <Lightbox items={lightbox.items} initialIndex={lightbox.index} showDots={lightbox.showDots} onClose={() => setLightbox(null)} />}
    </>
  );
}
