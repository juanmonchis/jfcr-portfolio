"use client"

import { useEffect, useId } from "react"
import { BookData } from "./types"

interface BookInfoPanelProps {
  book: BookData | null
  onDismiss: () => void
}

export default function BookInfoPanel({ book, onDismiss }: BookInfoPanelProps) {
  const titleId = useId()
  const visible = book !== null

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && visible) onDismiss()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [visible, onDismiss])

  return (
    <div
      role={visible ? "complementary" : undefined}
      aria-labelledby={visible ? titleId : undefined}
      className="absolute inset-y-0 right-0 flex items-center pointer-events-none"
      style={{
        width: "clamp(280px, 38%, 480px)",
        paddingRight: "5vw",
        paddingLeft: "2rem",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(12px)",
        transition: "opacity 0.45s cubic-bezier(0.4,0,0.2,1), transform 0.45s cubic-bezier(0.4,0,0.2,1)",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      {book && (
        <div className="flex flex-col gap-5 w-full">
          {/* Genre tag */}
          {book.genre && (
            <span
              className="type-tag text-xs self-start px-3 py-1 rounded-full border"
              style={{ borderColor: `${book.spineColor}55`, color: book.spineColor, letterSpacing: "0.1em" }}
            >
              {book.genre.toUpperCase()}
            </span>
          )}

          {/* Title */}
          <h2
            id={titleId}
            className="text-white leading-tight"
            style={{
              fontFamily: "var(--font-migra), serif",
              fontSize: "clamp(22px, 2.4vw, 36px)",
              fontWeight: 800,
              lineHeight: 1.1,
            }}
          >
            {book.title}
          </h2>

          {/* Author */}
          <p
            className="type-tag tracking-widest"
            style={{ color: "rgba(255,255,255,0.45)", fontSize: 12 }}
          >
            {book.author.toUpperCase()}
          </p>

          {/* Divider */}
          <div style={{ height: 1, background: "rgba(255,255,255,0.07)" }} />

          {/* Notes */}
          {book.notes && (
            <p
              style={{
                fontFamily: "var(--font-telegraf), sans-serif",
                fontSize: "clamp(13px, 1.2vw, 16px)",
                color: "rgba(255,255,255,0.55)",
                lineHeight: 1.7,
              }}
            >
              {book.notes}
            </p>
          )}

          {/* Dismiss hint */}
          <button
            onClick={onDismiss}
            className="self-start type-tag text-xs tracking-widest transition-opacity duration-200 hover:opacity-80"
            style={{ color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em", marginTop: 4 }}
            aria-label="Deselect book"
          >
            ← BACK
          </button>
        </div>
      )}
    </div>
  )
}
