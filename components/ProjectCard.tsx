/*
 * ════════════════════════════════════════════════════════════════════════════
 * FILE: components/ProjectCard.tsx
 * ════════════════════════════════════════════════════════════════════════════
 * WHAT IT DOES:
 *   Renders a single project card. Used on the homepage for all three sizes.
 *   Receives all its data as props — the actual content comes from the database
 *   via app/page.tsx.
 *
 * 🎨 DESIGN — things to edit here:
 *   - Card shape              → rounded-2xl, overflow-hidden
 *   - Hover glow              → onMouseEnter/Leave inline styles (color comes
 *                               from cardColor prop, opacity is the 66 suffix)
 *   - Hover scale             → hover:scale-[1.01]
 *   - Image area height       → h-56 (default) / h-36 (small & xsmall)
 *   - Image margin/padding    → mt-6 px-6 / md:mt-[50px] md:px-[50px]
 *   - Content padding         → px-6 pb-6 pt-6 / md:px-[50px] md:pb-[50px]
 *   - Divider between columns → w-px bg-black/10 (vertical) / h-px (mobile)
 *   - Tag pill style          → bg-black/20 rounded-full text-xs
 *   - CTA button style        → border, rounded-full, hover:bg-[#0C0D1F]
 *   - Text styles             → replace Tailwind font classes with .type-*
 *                               classes from globals.css for consistency
 *
 * ℹ️  SIZES:
 *   - "default"  → full width (rendered in app/page.tsx as a stacked column)
 *   - "small"    → 2 per row on desktop
 *   - "xsmall"   → 3 per row on desktop
 *   All three sizes collapse to full width on mobile.
 *
 * ℹ️  CASE STUDY LINK:
 *   If a case study exists for this project, the CTA links internally to
 *   /projects/[slug]. Otherwise it links to the external ctaHref.
 * ════════════════════════════════════════════════════════════════════════════
 */

"use client";

import Link from "next/link";
import Image from "next/image";
import { assetPath } from "@/lib/assetPath";

export type ProjectCardSize = "default" | "small" | "xsmall" | "footer-card";

interface ProjectCardProps {
  title: string;
  subtitle: string;
  tags: string[];
  description: string;
  ctaLabel: string;
  ctaHref: string;
  thumbnailUrl?: string;
  cardColor: string;
  size: ProjectCardSize;
  showThumbnailOnMobile: boolean;
  caseStudySlug?: string;
}

export default function ProjectCard({
  title,
  subtitle,
  tags,
  description,
  ctaLabel,
  ctaHref,
  thumbnailUrl,
  cardColor,
  size,
  showThumbnailOnMobile,
  caseStudySlug,
}: ProjectCardProps) {
  const hasOverride = ctaHref && ctaHref !== "#";
  const resolvedCtaHref = hasOverride ? ctaHref : (caseStudySlug ? `/projects/${caseStudySlug}` : "#");
  const resolvedTarget = hasOverride && !resolvedCtaHref.startsWith("/") ? "_blank" : undefined;
  const resolvedRel = caseStudySlug ? undefined : "noopener noreferrer";
  const glowStyle = {
    "--card-glow": `${cardColor}66`,
  } as React.CSSProperties;

  const baseCard = (
    <div
      className="group relative rounded-2xl overflow-hidden"
      style={{
        backgroundColor: cardColor,
        transition: "transform 500ms ease-in-out, box-shadow 500ms ease-in-out",
        ...glowStyle,
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.boxShadow = `0 0 40px 10px ${cardColor}66`;
        el.style.transform = "scale(1.01)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.boxShadow = "none";
        el.style.transform = "scale(1)";
      }}
    >
      {size === "default" ? (
        <div className="flex flex-col min-h-64">
          {/* Full-width image / placeholder */}
          <div className={`mt-6 px-6 md:mt-[50px] md:px-[50px] ${showThumbnailOnMobile ? "" : "hidden md:block"}`}>
            <div className="relative w-full h-[250px] md:h-[400px] overflow-hidden rounded-xl">
              {thumbnailUrl ? (
                <Image src={assetPath(thumbnailUrl)} alt={title} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-black/10">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-black/20">
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
                    <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          <div className={`flex flex-col md:flex-row flex-1 px-6 pb-6 md:px-[50px] md:pb-[50px] ${showThumbnailOnMobile ? "pt-6 md:pt-[50px]" : "pt-6 md:pt-[50px]"}`}>
          {/* Left column: subtitle, title, tags */}
          <div className="md:w-2/5 flex flex-col justify-center">
            <p className="type-card-synopsis text-[#0C0D1F]/60 mb-2">{subtitle}</p>
            <h3 className="type-card-title text-[#0C0D1F] mb-4">{title}</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="type-tag inline-flex items-center px-2 py-1 rounded-full bg-black/20 text-black/80 font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Vertical divider */}
          <div className="hidden md:block w-px bg-black/10 my-8" />
          <div className="block md:hidden h-px bg-black/10 my-4" />

          {/* Right column: description, CTA */}
          <div className="flex-1 flex flex-col justify-center gap-4 md:pl-10">
            <p className="text-[#0C0D1F]/80 leading-relaxed type-card-description">{description}</p>
            <div>
              <Link
                href={resolvedCtaHref}
                target={resolvedTarget}
                rel={resolvedRel}
                className="inline-flex items-center gap-1 text-sm font-semibold border border-[#0C0D1F] text-[#0C0D1F] px-4 py-2 rounded-full hover:bg-[#0C0D1F] hover:text-[#DDED3C] transition-colors duration-300 ease-in-out type-cta"
              >
                {ctaLabel} →
              </Link>
            </div>
          </div>
          </div>
        </div>
      ) : size === "footer-card" ? (
        <div className="flex flex-col flex-1 px-5 py-5">
          <h3 className="type-card-title text-[#0C0D1F] mb-2">{title}</h3>
          <p className="type-card-description text-[#0C0D1F]/80 flex-1">{description}</p>
          <Link
            href={resolvedCtaHref}
            target={resolvedTarget}
            rel={resolvedRel}
            className="inline-flex items-center gap-1 text-sm font-semibold border border-[#0C0D1F] text-[#0C0D1F] px-4 py-2 rounded-full hover:bg-[#0C0D1F] hover:text-[#DDED3C] transition-colors duration-300 ease-in-out type-cta mt-3 self-start"
          >
            {ctaLabel} →
          </Link>
        </div>
      ) : (
        <div className="flex flex-col">
          {/* Full-width image / placeholder */}
          <div className={`w-full ${size === "xsmall" || !showThumbnailOnMobile ? "hidden md:block" : ""}`}>
            {thumbnailUrl ? (
              <Image src={assetPath(thumbnailUrl)} alt={title} width={0} height={0} sizes="100vw" className="w-full h-auto" />
            ) : (
              <div className="w-full h-24 flex items-center justify-center bg-black/10">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-black/20">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
                  <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            )}
          </div>

          {/* Content */}
          {size === "xsmall" ? (
            <div className="flex flex-col flex-1 mt-5 px-5 pb-5">
              <p className="type-card-synopsis font-semibold text-[#0C0D1F]/60 mb-2">{subtitle}</p>
              <h3 className="type-card-title text-[#0C0D1F] mb-2">{title}</h3>
              <div className="flex flex-wrap gap-1 mb-3">
                {tags.map((tag) => (
                  <span key={tag} className="type-tag inline-flex items-center px-2 py-0.5 rounded-full bg-black/20 text-black/80">
                    {tag}
                  </span>
                ))}
              </div>
              <p className="type-card-description text-[#0C0D1F]/80 flex-1 overflow-hidden">{description}</p>
              <Link
                href={resolvedCtaHref}
                target={resolvedTarget}
                rel={resolvedRel}
                className="inline-flex items-center gap-1 text-sm font-semibold border border-[#0C0D1F] text-[#0C0D1F] px-4 py-2 rounded-full hover:bg-[#0C0D1F] hover:text-[#DDED3C] transition-colors duration-300 ease-in-out type-cta mt-3 self-start"
              >
                {ctaLabel} →
              </Link>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row flex-1 mt-5 px-5 pb-5">
              {/* Left: subtitle, title, tags */}
              <div className="md:w-2/5 flex flex-col justify-center">
                <p className="text-sm font-semibold text-[#0C0D1F]/60 mb-1">{subtitle}</p>
                <h3 className="type-card-title text-[#0C0D1F] mb-3">{title}</h3>
                <div className="flex flex-wrap gap-1">
                  {tags.map((tag) => (
                    <span key={tag} className="type-tag inline-flex items-center px-2 py-0.5 rounded-full bg-black/20 text-black/80">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Vertical divider */}
              <div className="hidden md:block w-px bg-black/10 my-2" />
              <div className="block md:hidden h-px bg-black/10 my-3" />

              {/* Right: description, CTA */}
              <div className="flex-1 flex flex-col justify-center gap-3 md:pl-6">
                <p className="type-card-description text-[#0C0D1F]/80">{description}</p>
                <div>
                  <Link
                    href={resolvedCtaHref}
                    target={resolvedTarget}
                    rel={resolvedRel}
                    className="inline-flex items-center gap-1 text-sm font-semibold border border-[#0C0D1F] text-[#0C0D1F] px-4 py-2 rounded-full hover:bg-[#0C0D1F] hover:text-[#DDED3C] transition-colors duration-300 ease-in-out type-cta"
                  >
                    {ctaLabel} →
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return baseCard;
}
