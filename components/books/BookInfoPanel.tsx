"use client"

import { useEffect, useId, useRef, useState } from "react"
import { BookData } from "./types"
import { assetPath } from "@/lib/assetPath"

function useIsMobile() {
  const [mobile, setMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)")
    setMobile(mq.matches)
    const h = (e: MediaQueryListEvent) => setMobile(e.matches)
    mq.addEventListener("change", h)
    return () => mq.removeEventListener("change", h)
  }, [])
  return mobile
}

interface BookInfoPanelProps {
  book: BookData | null
  onDismiss: () => void
}

export default function BookInfoPanel({ book, onDismiss }: BookInfoPanelProps) {
  const titleId    = useId()
  const dismissRef = useRef<HTMLButtonElement>(null)
  const isMobile   = useIsMobile()
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
      const t = setTimeout(() => dismissRef.current?.focus({ preventScroll: true }), 50)
      return () => clearTimeout(t)
    }
  }, [visible])

  return (
    // Full-screen backdrop — click outside card to dismiss
    <div
      onClick={onDismiss}
      style={{
        position: "fixed",
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
            flexDirection: isMobile ? "column" : "row",
            gap: "1.5rem",
            border: "1px solid rgba(242,235,217,0.18)",
            borderRadius: 20,
            padding: "1.75rem",
            background: "rgba(12,13,31,0.96)",
            backdropFilter: "blur(16px)",
            width: "min(90vw, 520px)",
            transform: visible ? "translateY(0) scale(1)" : "translateY(16px) scale(0.97)",
            transition: "transform 0.45s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          {/* Cover image — large */}
          <div
            style={{
              flexShrink: 0,
              width: isMobile ? "100%" : 200,
              maxWidth: isMobile ? 240 : undefined,
              borderRadius: 10,
              overflow: "hidden",
              alignSelf: isMobile ? "center" : "flex-start",
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
              maxWidth: isMobile ? "none" : 220,
            }}
          >
            <h2
              id={titleId}
              style={{
                fontFamily: "var(--font-migra), serif",
                fontSize: isMobile ? "clamp(26px, 5vw, 36px)" : "clamp(18px, 2vw, 28px)",
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
                  fontSize: isMobile ? "clamp(17px, 4vw, 19px)" : "clamp(13px, 1vw, 15px)",
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
