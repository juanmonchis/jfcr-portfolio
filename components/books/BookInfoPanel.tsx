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
        zIndex: 60,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1.25rem",
        padding: "0 5vw",
        background: visible ? "rgba(242,235,217,0.4)" : "rgba(242,235,217,0)",
        backdropFilter: visible ? "blur(12px)" : "blur(0px)",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transition: "opacity 0.45s ease, background 0.45s ease, backdrop-filter 0.45s ease",
      }}
    >
      {book && (
        <>
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
            padding: isMobile ? "2.25rem 1.75rem" : "1.75rem",
            background: "rgba(12,13,31,0.96)",
            backdropFilter: "blur(16px)",
            width: "min(90vw, 728px)",
            ...(isMobile ? { maxHeight: "80vh", overflowY: "auto" } : {}),
            transform: visible ? "translateY(0) scale(1)" : "translateY(16px) scale(0.97)",
            transition: "transform 0.45s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          {/* Cover image — large */}
          <div
            style={{
              flexShrink: 0,
              width: isMobile ? "100%" : 260,
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
            }}
          >
            <h2
              id={titleId}
              style={{
                fontFamily: "var(--font-migra), serif",
                fontSize: isMobile ? "clamp(26px, 5vw, 36px)" : 40,
                fontWeight: 800,
                color: "#F2EBD9",
                lineHeight: 1.0,
                letterSpacing: "-0.02em",
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
                  fontSize: 16,
                  color: "rgba(242,235,217,0.55)",
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                {book.notes}
              </p>
            )}

          </div>
        </div>

        {/* Close button — below modal, mobile only */}
        {isMobile && (
          <button
            ref={dismissRef}
            onClick={onDismiss}
            aria-label="Close"
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              border: "none",
              background: "#DDED3C",
              color: "#0C0D1F",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: 18,
              flexShrink: 0,
            }}
          >
            ✕
          </button>
        )}

        {/* Hidden dismiss for desktop keyboard nav */}
        {!isMobile && (
          <button ref={dismissRef} onClick={onDismiss} style={{ position: "absolute", opacity: 0, pointerEvents: "none", width: 0, height: 0 }} aria-label="Deselect book" tabIndex={-1} />
        )}
        </>
      )}
    </div>
  )
}
