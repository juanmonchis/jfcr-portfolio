"use client"

import { useEffect, useId, useRef } from "react"
import { BookData } from "./types"
import { assetPath } from "@/lib/assetPath"

interface BookInfoPanelProps {
  book: BookData | null
  onDismiss: () => void
}

export default function BookInfoPanel({ book, onDismiss }: BookInfoPanelProps) {
  const titleId    = useId()
  const dismissRef = useRef<HTMLButtonElement>(null)
  const visible    = book !== null

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && visible) onDismiss()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [visible, onDismiss])

  // Focus dismiss button when panel opens
  useEffect(() => {
    if (visible) {
      const t = setTimeout(() => dismissRef.current?.focus(), 50)
      return () => clearTimeout(t)
    }
  }, [visible])

  return (
    // Full-screen backdrop — click outside card to dismiss
    <div
      onClick={onDismiss}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 5,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 5vw",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transition: "opacity 0.45s ease",
      }}
    >
      {book && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onClick={(e) => e.stopPropagation()}
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "2rem",
            border: "1px solid rgba(242,235,217,0.18)",
            borderRadius: 20,
            padding: "2rem",
            background: "rgba(12,13,31,0.96)",
            backdropFilter: "blur(16px)",
            width: "min(90vw, 620px)",
            transform: visible ? "translateY(0) scale(1)" : "translateY(16px) scale(0.97)",
            transition: "transform 0.45s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          {/* Cover image — 50% compact */}
          <div
            style={{
              flexShrink: 0,
              width: 120,
              borderRadius: 8,
              overflow: "hidden",
              alignSelf: "flex-start",
              aspectRatio: "2 / 3",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={assetPath(book.coverUrl)}
              alt={book.title}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>

          {/* Details */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "0.65rem",
              minWidth: 0,
            }}
          >
            {book.genre && (
              <span
                style={{
                  display: "inline-block",
                  padding: "2px 10px",
                  borderRadius: 999,
                  border: `1px solid ${book.spineColor}55`,
                  color: book.spineColor,
                  fontFamily: "var(--font-telegraf), sans-serif",
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  alignSelf: "flex-start",
                }}
              >
                {book.genre}
              </span>
            )}

            <h2
              id={titleId}
              style={{
                fontFamily: "var(--font-migra), serif",
                fontSize: "clamp(18px, 2vw, 28px)",
                fontWeight: 800,
                color: "#F2EBD9",
                lineHeight: 1.1,
                margin: 0,
              }}
            >
              {book.title}
            </h2>

            <p
              style={{
                fontFamily: "var(--font-telegraf), sans-serif",
                fontSize: 11,
                color: "rgba(242,235,217,0.45)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                margin: 0,
              }}
            >
              {book.author}
            </p>

            <div style={{ height: 1, background: "rgba(242,235,217,0.07)", marginTop: "0.25rem" }} />

            {book.notes && (
              <p
                style={{
                  fontFamily: "var(--font-telegraf), sans-serif",
                  fontSize: "clamp(13px, 1vw, 15px)",
                  color: "rgba(242,235,217,0.55)",
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                {book.notes}
              </p>
            )}

            <button
              ref={dismissRef}
              onClick={onDismiss}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
                fontFamily: "var(--font-telegraf), sans-serif",
                fontSize: 11,
                letterSpacing: "0.1em",
                color: "rgba(242,235,217,0.25)",
                textTransform: "uppercase",
                marginTop: "auto",
                paddingTop: "0.5rem",
                textAlign: "left",
              }}
              aria-label="Deselect book"
            >
              ← BACK
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
