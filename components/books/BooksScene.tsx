"use client"

import { MutableRefObject, Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { Preload } from "@react-three/drei"
import { BookData } from "./types"
import BookshelfArrangement from "./BookshelfArrangement"
import BookshelfLighting from "./BookshelfLighting"
import { useReducedMotion } from "@/hooks/useReducedMotion"

interface BooksSceneProps {
  books: BookData[]
  selectedBookId: number | null
  hoveredBookId: number | null
  mouseNDCRef: MutableRefObject<{ x: number; y: number }>
  cardCenterNDCRef: MutableRefObject<{ x: number; y: number }>
  onSelectBook: (book: BookData) => void
}

export default function BooksScene({ books, selectedBookId, hoveredBookId, mouseNDCRef, cardCenterNDCRef, onSelectBook }: BooksSceneProps) {
  const reducedMotion = useReducedMotion()

  return (
    <Canvas
      role="img"
      aria-label="Interactive 3D bookshelf"
      style={{ width: "100%", height: "100vh" }}
      dpr={[1, 2]}
      gl={{ antialias: true }}
      camera={{ position: [0, 0, 1.4], fov: 62 }}
    >
      <BookshelfLighting />
      <Suspense fallback={null}>
        <BookshelfArrangement
          books={books}
          selectedBookId={selectedBookId}
          hoveredBookId={hoveredBookId}
          mouseNDCRef={mouseNDCRef}
          cardCenterNDCRef={cardCenterNDCRef}
          onSelectBook={onSelectBook}
          reducedMotion={reducedMotion}
        />
        <Preload all />
      </Suspense>
    </Canvas>
  )
}
