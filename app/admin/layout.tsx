import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-[#0C0D1F] text-white px-6 py-4 flex items-center gap-6">
        <Link href="/admin" className="font-black text-[#DDED3C] tracking-widest text-sm uppercase">
          JFCR Admin
        </Link>
        <Link href="/admin/posts" className="text-sm text-white/60 hover:text-white transition-colors">
          Posts
        </Link>
        <Link href="/admin/projects" className="text-sm text-white/60 hover:text-white transition-colors">
          Projects
        </Link>
        <Link href="/admin/bordered-items" className="text-sm text-white/60 hover:text-white transition-colors">
          Bordered Items
        </Link>
        <Link href="/" className="text-sm text-white/60 hover:text-white transition-colors ml-auto">
          View Site ↗
        </Link>
        <form action="/api/admin/logout" method="POST">
          <button
            type="submit"
            className="text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            Logout
          </button>
        </form>
      </nav>
      <main className="p-6 max-w-6xl mx-auto">{children}</main>
    </div>
  );
}
