"use client"

import { Suspense, useCallback, useState } from "react"
import dynamic from "next/dynamic"
import { BookData } from "./types"
import BooksSceneFallback from "./BooksSceneFallback"
import BookInfoPanel from "./BookInfoPanel"
import SiteHeader from "@/components/SiteHeader"

const BooksScene = dynamic(() => import("./BooksScene"), {
  ssr: false,
  loading: () => <BooksSceneFallback />,
})

export default function BooksPageShell({ books }: { books: BookData[] }) {
  const [selectedBook, setSelectedBook] = useState<BookData | null>(null)

  const handleSelect = useCallback((book: BookData) => {
    // Toggle: clicking the selected book deselects it
    setSelectedBook((prev) => (prev?.id === book.id ? null : book))
  }, [])

  const handleDismiss = useCallback(() => {
    setSelectedBook(null)
  }, [])

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0C0D1F]">
      <SiteHeader
        logoVariant="light"
        color="#FFFFFF"
        mobileOverlayColor="#0C0D1F"
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

      {/* Keyboard-accessible hidden list */}
      <ul aria-label="Book list" className="sr-only">
        {books.map((book) => (
          <li key={book.id}>
            <button onClick={() => handleSelect(book)}>
              {book.title} by {book.author}
            </button>
          </li>
        ))}
      </ul>

      <BookInfoPanel book={selectedBook} onDismiss={handleDismiss} />
    </div>
  )
}
