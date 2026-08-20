"use client"

import { Suspense, useCallback, useEffect, useState } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
import { BookData } from "./types"
import BooksSceneFallback from "./BooksSceneFallback"
import BookInfoPanel from "./BookInfoPanel"
import SiteHeader from "@/components/SiteHeader"

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

export default function BooksPageShell({ books }: { books: BookData[] }) {
  const [selectedBook, setSelectedBook] = useState<BookData | null>(null)
  const isDesktop = useIsDesktop()

  const handleSelect = useCallback((book: BookData) => {
    setSelectedBook((prev) => (prev?.id === book.id ? null : book))
  }, [])

  const handleDismiss = useCallback(() => {
    setSelectedBook(null)
  }, [])

  if (isDesktop) {
    return (
      <div className="relative w-full h-screen overflow-hidden bg-[#0C0D1F]">
        <SiteHeader
          logoVariant="light"
          color="#F2EBD9"
          mobileOverlayColor="#0C0D1F"
          mobileNavColor="#F2EBD9"
          mobileLogoVariant="light"
          navHoverBg="#DDED3C"
          navHoverText="#0C0D1F"
        />

        <Suspense fallback={<BooksSceneFallback />}>
          <BooksScene
            books={books}
            selectedBookId={selectedBook?.id ?? null}
            onSelectBook={handleSelect}
          />
        </Suspense>

        {/* Title overlay */}
        <div
          className="absolute pointer-events-none"
          style={{ top: "clamp(80px, 12vh, 130px)", left: "clamp(24px, 5vw, 80px)" }}
        >
          <h1 className="type-case-title !text-[#F2EBD9] mb-2">Book Recs</h1>
          <p className="type-paragraph !text-[#F2EBD9]/50">Books that shaped how I think.</p>
        </div>

        <ul aria-label="Book list" className="sr-only">
          {books.map((book) => (
            <li key={book.id}>
              <button onClick={() => handleSelect(book)}>{book.title} by {book.author}</button>
            </li>
          ))}
        </ul>

        <BookInfoPanel book={selectedBook} onDismiss={handleDismiss} />
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

      <main className="px-6 pt-28 pb-20">
        <h1 className="type-case-title !text-[#F2EBD9] mb-4">Book Recs</h1>
        <p className="type-paragraph !text-[#F2EBD9]/60 mb-10">Books that shaped how I think about design, engineering, and the world.</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
          {books.map((book) => {
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
                  <Image
                    src={book.coverUrl}
                    alt={book.title}
                    fill
                    sizes="50vw"
                    className="object-cover"
                  />
                </div>
                <div className="mt-2 px-0.5">
                  <p className="text-white/80 text-xs font-medium leading-snug" style={{ fontFamily: "var(--font-telegraf), sans-serif" }}>
                    {book.title}
                  </p>
                  <p className="text-white/35 text-xs mt-0.5">{book.author}</p>
                </div>
              </button>
            )
          })}
        </div>
      </main>

      <BookInfoPanel book={selectedBook} onDismiss={handleDismiss} />
    </div>
  )
}
