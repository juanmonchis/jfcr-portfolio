/*
 * ════════════════════════════════════════════════════════════════════════════
 * FILE: components/LogoIcon.tsx
 * ════════════════════════════════════════════════════════════════════════════
 * WHAT IT DOES:
 *   Renders the animated Lottie logo that appears on the homepage, case study
 *   pages, and blog pages. Always links back to the homepage (/).
 *
 * 🎨 DESIGN — things to edit here:
 *   - SIZE constant (line ~18) → controls the logo size in pixels everywhere.
 *                                Change this one number to resize on all pages.
 *   - Animation files         → swap the JSON files in /public/:
 *                                 logo-light.json  → used on light backgrounds
 *                                 logo-dark.json   → used on dark backgrounds
 *                                 logo-color.json  → used on colored card backgrounds
 *
 * ℹ️  BEHAVIOUR:
 *   - Desktop: plays once on hover, stops on mouse leave
 *   - Mobile:  loops automatically, no hover needed
 *   The mobile/desktop split is handled by a window.matchMedia listener.
 *
 * ℹ️  HOW TO USE ON A NEW PAGE:
 *   import LogoIcon from "@/components/LogoIcon";
 *   <LogoIcon variant="dark" />   ← pick: "light" | "dark" | "color"
 * ════════════════════════════════════════════════════════════════════════════
 */

"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import logoLight from "@/public/logo-light.json";
import logoDark from "@/public/logo-dark.json";
import logoColor from "@/public/logo-color.json";

export type LogoVariant = "light" | "dark" | "color";

const animations: Record<LogoVariant, object> = {
  light: logoLight,
  dark: logoDark,
  color: logoColor,
};

const SIZE = 175;

interface LogoIconProps {
  variant?: LogoVariant;
  size?: number;
  /** Crop px from each side — shrinks the visible viewport without scaling the icon */
  cropPx?: number;
  /** External play control — when provided, disables internal hover and mobile autoplay */
  playing?: boolean;
  /** Renders a div instead of a Link — use when the logo is decorative and shouldn't navigate */
  noLink?: boolean;
  /** Override the default "/" href — use for external links */
  href?: string;
  /** Always autoplay and loop regardless of platform */
  alwaysPlay?: boolean;
}

export default function LogoIcon({ variant = "light", size = 175, cropPx = 0, playing, noLink, href, alwaysPlay }: LogoIconProps) {
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const [isMobile, setIsMobile] = useState(false);
  const externalControl = playing !== undefined;

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (!externalControl) return;
    if (playing) {
      lottieRef.current?.goToAndPlay(0, true);
    } else {
      lottieRef.current?.stop();
    }
  }, [playing, externalControl]);

  function handleMouseEnter() {
    if (externalControl || isMobile) return;
    lottieRef.current?.goToAndPlay(0, true);
  }

  function handleMouseLeave() {
    if (externalControl || isMobile) return;
    lottieRef.current?.stop();
  }

  const wrapperStyle: React.CSSProperties = { display: "block", width: size - cropPx * 2, height: size - cropPx * 2, flexShrink: 0 };
  const inner = (
    <div style={{ width: size - cropPx * 2, height: size - cropPx * 2, overflow: "hidden", position: "relative" }}>
      <Lottie
        lottieRef={lottieRef}
        animationData={animations[variant]}
        autoplay={alwaysPlay || (!externalControl && isMobile)}
        loop={alwaysPlay || (!externalControl && isMobile)}
        style={{ width: size, height: size, position: "absolute", top: -cropPx, left: -cropPx }}
      />
    </div>
  );

  if (noLink) {
    return <div style={wrapperStyle}>{inner}</div>;
  }

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Go home"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ ...wrapperStyle, textDecoration: "none" }}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link
      href="/"
      aria-label="Go home"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={wrapperStyle}
    >
      {inner}
    </Link>
  );
}
