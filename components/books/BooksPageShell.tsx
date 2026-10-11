"use client"

import { Suspense, useCallback, useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
import { BookData } from "./types"
import BooksSceneFallback from "./BooksSceneFallback"
import BookInfoPanel from "./BookInfoPanel"
import SiteHeader from "@/components/SiteHeader"
import LogoIcon from "@/components/LogoIcon"

const BooksScene = dynamic(() => import("./BooksScene"), {
  ssr: false,
  loading: () => <BooksSceneFallback />,
})

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(true)
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)")
    setIsDesktop(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])
  return isDesktop
}

// 3 x 3 grid. Card size depends on width only; the page scrolls when the rows are taller than the viewport.
const GRID_GAP = "clamp(8px, 1.2vw, 18px)"

export default function BooksPageShell({ books }: { books: BookData[] }) {
  const [selectedBook,  setSelectedBook]  = useState<BookData | null>(null)
  const [hoveredBookId, setHoveredBookId] = useState<number | null>(null)
  const [coverVisible,  setCoverVisible]  = useState(false)
  const mouseNDCRef       = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const cardCenterNDCRef  = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const coverTimerRef     = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isDesktop   = useIsDesktop()

  const handleSelect = useCallback((book: BookData) => {
    setSelectedBook((prev) => (prev?.id === book.id ? null : book))
    setHoveredBookId(null)
    setCoverVisible(false)
    if (coverTimerRef.current) clearTimeout(coverTimerRef.current)
    coverTimerRef.current = setTimeout(() => setCoverVisible(true), 580)
  }, [])

  useEffect(() => {
    if (!selectedBook) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = prev }
  }, [selectedBook])

  const handleDismiss = useCallback(() => {
    setSelectedBook(null)
    setCoverVisible(false)
  }, [])

  if (isDesktop) {
    return (
      <div className="relative w-full min-h-screen overflow-x-clip bg-[#0C0D1F]">
        <SiteHeader
          logoVariant="light"
          showLogo={false}
          color="#F2EBD9"
          mobileOverlayColor="#0C0D1F"
          mobileNavColor="#F2EBD9"
          mobileLogoVariant="light"
          navHoverBg="#DDED3C"
          navHoverText="#0C0D1F"
        />

        {/* Three.js canvas — purely visual, no pointer events */}
        <div style={{ position: "fixed", inset: 0, zIndex: 70, pointerEvents: "none" }}>
          <Suspense fallback={<BooksSceneFallback />}>
            <BooksScene
              books={books}
              selectedBookId={selectedBook?.id ?? null}
              hoveredBookId={hoveredBookId}
              mouseNDCRef={mouseNDCRef}
              cardCenterNDCRef={cardCenterNDCRef}
              onSelectBook={handleSelect}
            />
          </Suspense>
        </div>

        {/* Two-column layout: left info panel + right book grid */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            // content stays centered and never wider than 1400px on large screens
            width: "100%",
            maxWidth: 1400,
            marginLeft: "auto",
            marginRight: "auto",
            boxSizing: "border-box",
            paddingLeft: "clamp(24px, 5vw, 80px)",
            paddingRight: "clamp(24px, 5vw, 80px)",
          }}
        >
          {/* Left column: icon + title + description */}
          <div
            style={{
              width: "33%",
              flexShrink: 0,
              // stays put (vertically centered in the viewport) while the grid scrolls
              position: "sticky",
              top: 0,
              height: "100vh",
              boxSizing: "border-box",
              paddingTop: 80,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "1.5rem",
              paddingRight: "2rem",
            }}
          >
            <div style={{ filter: "brightness(0) saturate(100%) invert(95%) sepia(60%) saturate(500%) hue-rotate(18deg) brightness(1.05)" }}>
              <LogoIcon variant="light" size={100} cropPx={10} alwaysPlay />
            </div>
            <div>
              <h1 className="type-case-title" style={{ color: "#F2EBD9", margin: 0 }}>Book Recs</h1>
              <p className="type-paragraph" style={{ color: "rgba(242,235,217,0.5)", marginTop: "0.5rem" }}>
                Books that I want more people to read. These have shaped the way I think and experience my everyday.
              </p>
            </div>
          </div>

          {/* Right column: interactive book grid */}
          <div
            style={{
              flex: 1,
              minHeight: "100vh",
              boxSizing: "border-box",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              paddingTop: 240, // keeps the grid clear of the fixed nav
              paddingBottom: 80,
              opacity: selectedBook ? 0 : 1,
              pointerEvents: selectedBook ? "none" : "auto",
              transition: "opacity 0.45s ease",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: GRID_GAP,
                width: "100%",
                maxWidth: "min(56vw, 640px)",
              }}
            >
              {books.map((book) => {
                const isHoveredCell = hoveredBookId === book.id
                return (
                  <div
                    key={book.id}
                    onMouseEnter={(e) => {
                      setHoveredBookId(book.id)
                      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
                      cardCenterNDCRef.current = {
                        x:  ((rect.left + rect.width  / 2) / window.innerWidth)  * 2 - 1,
                        y: -(((rect.top  + rect.height / 2) / window.innerHeight) * 2 - 1),
                      }
                    }}
                    onMouseLeave={() => setHoveredBookId(null)}
                    onMouseMove={(e) => {
                      mouseNDCRef.current = {
                        x:  (e.clientX / window.innerWidth)  * 2 - 1,
                        y: -(e.clientY / window.innerHeight) * 2 + 1,
                      }
                    }}
                    onClick={() => handleSelect(book)}
                  >
                    <div
                      style={{
                        aspectRatio: "2 / 3",
                        border: `1px solid ${isHoveredCell ? "#DDED3C" : "rgba(242,235,217,0.12)"}`,
                        borderRadius: 16,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem",
                        padding: "0.5rem",
                        cursor: "pointer",
                        transition: "border-color 0.25s ease, background 0.25s ease",
                        background: isHoveredCell ? "rgba(242,235,217,0.04)" : "transparent",
                        userSelect: "none",
                      }}
                    >
                      <p
                        style={{
                          color: isHoveredCell ? "#DDED3C" : "#F2EBD9",
                          textAlign: "center",
                          fontFamily: "var(--font-migra), serif",
                          fontWeight: 800,
                          fontSize: "clamp(calc(0.85rem + 2px), calc(1.45vw + 2px), calc(1.3rem + 2px))",
                          lineHeight: 1.1,
                          letterSpacing: "-0.01em",
                          transition: "color 0.2s ease",
                        }}
                      >
                        {book.title}
                      </p>
                      <p
                        style={{
                          color: isHoveredCell ? "#DDED3C" : "rgba(242,235,217,0.4)",
                          textAlign: "center",
                          fontFamily: "var(--font-telegraf), sans-serif",
                          fontWeight: 400,
                          fontSize: "clamp(calc(0.5rem + 5px), calc(0.75vw + 5px), calc(0.72rem + 5px))",
                          transition: "color 0.2s ease",
                        }}
                      >
                        {book.author}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <ul aria-label="Book list" className="sr-only">
          {books.map((book) => (
            <li key={book.id}>
              <button onClick={() => handleSelect(book)}>{book.title} by {book.author}</button>
            </li>
          ))}
        </ul>

        <BookInfoPanel book={selectedBook} onDismiss={handleDismiss} coverVisible={coverVisible} />
      </div>
    )
  }

  // ── Mobile: flat scrollable grid ──────────────────────────────────────────
  return (
    <div className="relative min-h-screen bg-[#0C0D1F]">
      <SiteHeader
        logoVariant="light"
        color="#F2EBD9"
        mobileOverlayColor="#0C0D1F"
        mobileNavColor="#F2EBD9"
        mobileLogoVariant="light"
        navHoverBg="#DDED3C"
        navHoverText="#0C0D1F"
      />

      <main className="px-6 pt-40 pb-20">
        <h1 className="type-case-title !text-[#F2EBD9] mb-4">Book Recs</h1>
        <p className="type-paragraph !text-[#F2EBD9]/60 mb-10">
          Books that I want more people to read. These have shaped the way I think and experience my everyday.
        </p>

        <div style={{ display: "flex", gap: "1.25rem" }}>
          {[books.filter((_, i) => i % 2 === 0), books.filter((_, i) => i % 2 === 1)].map((col, colIdx) => (
            <div
              key={colIdx}
              style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1rem", marginTop: colIdx === 1 ? "6rem" : 0 }}
            >
              {col.map((book) => {
                const isSelected = selectedBook?.id === book.id
                return (
                  <button
                    key={book.id}
                    onClick={() => handleSelect(book)}
                    className="relative text-left focus:outline-none"
                    aria-label={`${book.title} by ${book.author}`}
                    style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
                  >
                    <div
                      className="relative overflow-hidden"
                      style={{
                        aspectRatio: "2 / 3",
                        borderRadius: 6,
                        boxShadow: isSelected
                          ? `0 24px 60px rgba(0,0,0,0.7), 0 0 0 2px ${book.spineColor}`
                          : "0 12px 36px rgba(0,0,0,0.5)",
                        transition: "box-shadow 0.3s ease",
                      }}
                    >
                      <Image src={book.coverUrl} alt={book.title} fill sizes="50vw" className="object-cover" />
                    </div>
                    <div className="mt-2 px-0.5">
                      <p
                        className="text-white/80 text-xs font-medium leading-snug"
                        style={{ fontFamily: "var(--font-telegraf), sans-serif" }}
                      >
                        {book.title}
                      </p>
                      <p className="text-white/35 text-xs mt-0.5">{book.author}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      </main>

      <BookInfoPanel book={selectedBook} onDismiss={handleDismiss} />
    </div>
  )
}
