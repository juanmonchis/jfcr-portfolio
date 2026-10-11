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
    month: "short",
    day: "numeric",
  });

  return (
    <Link href={`/notes/${slug}`} className="group flex flex-1 flex-col px-6 py-12 transition-colors duration-300 hover:bg-[#DDED3C]">
      <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-[#DDED3C] transition-colors duration-300 group-hover:bg-[#F2EBD9]">
        {coverImage ? (
          <Image
            src={assetPath(coverImage)}
            alt={title}
            fill
            sizes="(min-width: 1280px) 260px, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <span
            aria-hidden
            className="absolute inset-0 flex items-center justify-center text-[#0C0D1F]/80"
            style={{ fontFamily: "var(--font-migra), serif", fontSize: 120, fontWeight: 800 }}
          >
            {title.charAt(0)}
          </span>
        )}
      </div>
      <div className="pt-4">
        <p className="type-tag !text-[#0C0D1F]/50 mb-2">{formattedDate}</p>
        <h2 className="type-card-title !text-[22px] !leading-[28px] !text-[#0C0D1F] mb-2 underline decoration-transparent decoration-2 underline-offset-4 group-hover:decoration-[#0C0D1F] transition-colors">
          {title}
        </h2>
        <p className="type-card-description !text-[#0C0D1F]/60 line-clamp-5 md:line-clamp-4 md:!text-[14px] md:!leading-[18px]">{excerpt}</p>
        {/* Mobile CTA — same pill as the home page project cards (ProjectCard.tsx) */}
        <span className="sm:hidden mt-3 flex w-fit ml-auto items-center gap-1 text-sm font-semibold border border-[#0C0D1F] text-[#0C0D1F] px-4 py-2 rounded-full type-cta group-hover:bg-[#0C0D1F] group-hover:text-[#DDED3C] group-active:bg-[#0C0D1F] group-active:text-[#DDED3C] transition-colors duration-300 ease-in-out">
          Read →
        </span>
      </div>
    </Link>
  );
}
