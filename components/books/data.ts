import { BookData } from "./types"

export const BOOKS: BookData[] = [
  {
    id: 1,
    title: "The Design of Everyday Things",
    author: "Don Norman",
    coverUrl: "/images/books/design-everyday-things.jpg",
    spineColor: "#C0392B",
    rating: 5,
    readDate: "2024-03-10",
    genre: "Design",
    notes:
      "The bible of UX. Norman's concept of affordances and signifiers changed how I look at every object I interact with.",
  },
  {
    id: 2,
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    coverUrl: "/images/books/thinking-fast-slow.jpg",
    spineColor: "#2980B9",
    rating: 5,
    readDate: "2024-01-20",
    genre: "Psychology",
    notes:
      "System 1 vs System 2 is a framework I now apply everywhere — from design decisions to personal choices.",
  },
  {
    id: 3,
    title: "A Pattern Language",
    author: "Christopher Alexander",
    coverUrl: "/images/books/pattern-language.jpg",
    spineColor: "#27AE60",
    rating: 4,
    readDate: "2023-11-05",
    genre: "Architecture",
    notes:
      "Dense but extraordinary. The idea that patterns can be a shared language for design transcends architecture.",
  },
  {
    id: 4,
    title: "The Pragmatic Programmer",
    author: "Hunt & Thomas",
    coverUrl: "/images/books/pragmatic-programmer.jpg",
    spineColor: "#8E44AD",
    rating: 4,
    readDate: "2023-08-14",
    genre: "Engineering",
    notes:
      "The stone soup and broken windows metaphors alone are worth the read. A manual for being a better engineer.",
  },
  {
    id: 5,
    title: "Invisible Cities",
    author: "Italo Calvino",
    coverUrl: "/images/books/invisible-cities.jpg",
    spineColor: "#E67E22",
    rating: 5,
    readDate: "2024-05-01",
    genre: "Fiction",
    notes:
      "Not a story — a meditation. Each city is a metaphor for a different way of organizing meaning. Read slowly.",
  },
]
