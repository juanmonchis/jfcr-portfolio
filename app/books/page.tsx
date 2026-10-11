import { Metadata } from "next"
import BooksPageShell from "@/components/books/BooksPageShell"
import { BOOKS } from "@/components/books/data"

export const metadata: Metadata = {
  title: "Books",
  description: "Books that I want more people to read. These have shaped the way I think and experience my everyday.",
}

export default function BooksPage() {
  return <BooksPageShell books={BOOKS} />
}
