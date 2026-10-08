"use client";

import { useState } from "react";
import Link from "next/link";

function roundedStarPath(
  cx: number, cy: number,
  outerR: number, innerR: number,
  numPoints: number, roundness: number
): string {
  const outerPts: { x: number; y: number }[] = [];
  const innerPts: { x: number; y: number }[] = [];

  for (let i = 0; i < numPoints; i++) {
    const outerAngle = (i * 2 * Math.PI) / numPoints - Math.PI / 2;
    const innerAngle = outerAngle + Math.PI / numPoints;
    outerPts.push({ x: cx + outerR * Math.cos(outerAngle), y: cy + outerR * Math.sin(outerAngle) });
    innerPts.push({ x: cx + innerR * Math.cos(innerAngle), y: cy + innerR * Math.sin(innerAngle) });
  }

  const path: string[] = [];

  for (let i = 0; i < numPoints; i++) {
    const outer = outerPts[i];
    const prevInner = innerPts[(i - 1 + numPoints) % numPoints];
    const nextInner = innerPts[i];

    const ax = outer.x + roundness * (prevInner.x - outer.x);
    const ay = outer.y + roundness * (prevInner.y - outer.y);
    const dx = outer.x + roundness * (nextInner.x - outer.x);
    const dy = outer.y + roundness * (nextInner.y - outer.y);

    if (i === 0) path.push(`M ${ax.toFixed(2)} ${ay.toFixed(2)}`);
    else path.push(`L ${ax.toFixed(2)} ${ay.toFixed(2)}`);

    path.push(`Q ${outer.x.toFixed(2)} ${outer.y.toFixed(2)} ${dx.toFixed(2)} ${dy.toFixed(2)}`);
    path.push(`L ${nextInner.x.toFixed(2)} ${nextInner.y.toFixed(2)}`);
  }

  path.push("Z");
  return path.join(" ");
}

const starD = roundedStarPath(80, 80, 72, 48, 8, 0.28);

interface HeroStarProps {
  /** Rendered width/height in px. */
  size?: number;
  /** Star fill colour. */
  fill?: string;
  /** Colour of the "TCG by JFCR" text. */
  textColor?: string;
  onClick?: () => void;
  /**
   * When set, the star is drawn blank and this label slides out to its left on
   * hover (used in the desktop menu). When omitted, "TCG by JFCR" sits inside the star.
   */
  hoverLabel?: string;
}

export default function HeroStar({
  size = 160,
  fill = "#0C0D1F",
  textColor = "#DDED3C",
  onClick,
  hoverLabel,
}: HeroStarProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href="/projects/trading-card-game"
      aria-label="TCG by JFCR"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      style={{ position: "relative", display: "inline-block" }}
    >

      {hoverLabel && (
        <span
          className="type-tag"
          aria-hidden="true"
          style={{
            position: "absolute",
            right: "100%",
            top: "50%",
            marginRight: 4,
            whiteSpace: "nowrap",
            color: fill,
            opacity: hovered ? 1 : 0,
            transform: `translate(${hovered ? "0" : "16px"}, -50%)`,
            transition: "opacity 0.3s ease, transform 0.3s ease",
            pointerEvents: "none",
          }}
        >
          {hoverLabel}
        </span>
      )}

      <span
        style={{
          display: "inline-block",
          transformOrigin: "center",
          transform: hovered ? "scale(1.2)" : "scale(1)",
          filter: hovered ? "drop-shadow(0px 8px 24px rgba(0,0,0,0.35))" : "none",
          transition: "transform 0.3s ease, filter 0.3s ease",
          animation: `starRock ${hovered ? "0.8s" : "3s"} ease-in-out infinite alternate`,
        }}
      >
        <svg width={size} height={size} viewBox="0 0 160 160" aria-hidden="true" style={{ display: "block" }}>
          <path d={starD} fill={fill} />
          {!hoverLabel && (
            <>
              <text
                x="80" y="76"
                textAnchor="middle"
                dominantBaseline="middle"
                fill={textColor}
                fontSize="18"
                fontWeight="700"
                fontFamily="var(--font-migra), serif"
              >
                TCG
              </text>
              <text
                x="80" y="93"
                textAnchor="middle"
                dominantBaseline="middle"
                fill={textColor}
                fontSize="13"
                fontFamily="var(--font-telegraf), sans-serif"
                letterSpacing="0.05em"
              >
                by JFCR
              </text>
            </>
          )}
        </svg>
      </span>
    </Link>
  );
}
