import Link from "next/link";
import Image from "next/image";

interface BlogCardProps {
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string | null;
  createdAt: Date;
}

export default function BlogCard({
  title,
  slug,
  excerpt,
  coverImage,
  createdAt,
}: BlogCardProps) {
  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link
      href={`/blog/${slug}`}
      className="group block bg-[#13142B] rounded-2xl overflow-hidden hover:scale-[1.01] transition-all duration-300"
    >
      {coverImage && (
        <div className="relative w-full h-48">
          <Image
            src={coverImage}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <p className="text-xs text-white/40 mb-2">{formattedDate}</p>
        <h2 className="text-xl font-bold text-white mb-2 group-hover:text-[#DDED3C] transition-colors">
          {title}
        </h2>
        <p className="text-sm text-white/60 leading-relaxed line-clamp-3">{excerpt}</p>
      </div>
    </Link>
  );
}
