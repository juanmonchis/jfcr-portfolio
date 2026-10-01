"use client";

import { useState } from "react";
import BlockRenderer, { Block } from "./BlockRenderer";

interface Props {
  blocks: Block[];
  cardColor?: string;
  title?: string;
  showLogo?: boolean;
  description?: string;
}

export default function DeepThoughtsWrapper({ blocks, cardColor, title, showLogo, description }: Props) {
  const [deepThoughtsActive, setDeepThoughtsActive] = useState(false);

  const hasDeepThoughts = blocks.some(b => b.deepThoughts);

  return (
    <>
      <BlockRenderer
        blocks={blocks}
        cardColor={cardColor}
        title={title}
        showLogo={showLogo}
        description={description}
        hideDeepThoughts={deepThoughtsActive}
      />
      {hasDeepThoughts && (
        <div className="fixed bottom-6 md:bottom-8 left-0 right-0 flex justify-center z-50 pointer-events-none">
          <div className="pointer-events-auto">
          <button
            onClick={() => setDeepThoughtsActive(v => !v)}
            style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
          >
            {/* Pill track — cardColor background */}
            <span
              style={{
                display: "inline-block",
                width: 270,
                height: 48,
                borderRadius: 24,
                background: cardColor ?? "#0C0D1F",
                border: "1px solid #0C0D1F",
                position: "relative",
              }}
            >
              {/* Sliding thumb — each slot = 129px, gap = 4px */}
              <span
                style={{
                  position: "absolute",
                  top: "50%",
                  marginTop: -20,
                  left: deepThoughtsActive ? 137 : 4,
                  width: 129,
                  height: 40,
                  borderRadius: 20,
                  background: deepThoughtsActive ? "#0C0D1F" : "#ffffff",
                  transition: "left 0.35s cubic-bezier(0.4, 0, 0.2, 1), background 0.35s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  whiteSpace: "nowrap",
                }}
              >
                <span style={{
                  fontFamily: "var(--font-telegraf), sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  lineHeight: 1,
                  letterSpacing: "0.02em",
                  color: deepThoughtsActive ? "#ffffff" : "#0C0D1F",
                  userSelect: "none",
                  transition: "color 0.35s",
                }}>
                  {deepThoughtsActive ? "Pretty pictures" : "Deep thoughts"}
                </span>
              </span>
            </span>
          </button>
          </div>
        </div>
      )}
    </>
  );
}
