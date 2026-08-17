import { Metadata } from "next"
import BooksPageShell from "@/components/books/BooksPageShell"
import { BOOKS } from "@/components/books/data"

export const metadata: Metadata = {
  title: "Books — Juan Felipe",
  description: "Books that shaped how I think about design, engineering, and the world.",
}

export default function BooksPage() {
  return <BooksPageShell books={BOOKS} />
}
