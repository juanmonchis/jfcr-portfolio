"use client"

import { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { Preload } from "@react-three/drei"
import { BookData } from "./types"
import BookshelfArrangement from "./BookshelfArrangement"
import BookshelfLighting from "./BookshelfLighting"
import { useReducedMotion } from "@/hooks/useReducedMotion"

interface BooksSceneProps {
  books: BookData[]
  selectedBookId: number | null
  onSelectBook: (book: BookData) => void
}

export default function BooksScene({ books, selectedBookId, onSelectBook }: BooksSceneProps) {
  const reducedMotion = useReducedMotion()

  return (
    <Canvas
      role="img"
      aria-label="Interactive 3D bookshelf"
      style={{ width: "100%", height: "100vh" }}
      dpr={[1, 2]}
      gl={{ antialias: true }}
      camera={{ position: [0, 0.1, 3.8], fov: 45 }}
    >
      <BookshelfLighting />
      <Suspense fallback={null}>
        <BookshelfArrangement
          books={books}
          selectedBookId={selectedBookId}
          onSelectBook={onSelectBook}
          reducedMotion={reducedMotion}
        />
        <Preload all />
      </Suspense>
    </Canvas>
  )
}
