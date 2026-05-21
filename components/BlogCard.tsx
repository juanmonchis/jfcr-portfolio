import Link from "next/link";
import Image from "next/image";
import { assetPath } from "@/lib/assetPath";

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
            src={assetPath(coverImage)}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <p className="type-tag !text-[#F2EBD9]/40 mb-2">{formattedDate}</p>
        <h2 className="type-card-title !text-[#F2EBD9] mb-2 group-hover:!text-[#DDED3C] transition-colors">
          {title}
        </h2>
        <p className="type-card-description !text-[#F2EBD9]/60 line-clamp-3">{excerpt}</p>
      </div>
    </Link>
  );
}
