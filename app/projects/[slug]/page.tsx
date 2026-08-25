/*
 * ════════════════════════════════════════════════════════════════════════════
 * FILE: app/projects/[slug]/page.tsx
 * ════════════════════════════════════════════════════════════════════════════
 * WHAT IT DOES:
 *   Public case study page (route: /projects/[slug]).
 *   Fetches the case study and its linked project from the database,
 *   then renders a hero section followed by the content blocks.
 *
 *   Projects with a "card deck" (image-grid) block skip the hero entirely —
 *   that block owns its own full-screen layout with logo + description.
 *   All other projects get the standard hero.
 *
 * 🎨 DESIGN — hero section things to edit here:
 *   - Hero padding             → py-12 px-6 md:px-12 lg:px-20
 *   - Hero background          → project.cardColor
 *   - Tags                     → type-tag, border, rounded-full
 *   - Title                    → type-case-main-title
 *   - Description              → type-paragraph
 *   - Team section width       → md:w-48
 *   - CTA                      → type-cta, rounded-full
 *   - Content max-width        → max-w-[1200px] (wraps blocks below hero)
 *   - Content padding          → px-6 md:px-12 py-12
 * ════════════════════════════════════════════════════════════════════════════
 */

import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import BlockRenderer, { Block } from "@/components/CaseStudy/BlockRenderer";
import SiteHeader from "@/components/SiteHeader";
import ProjectCard from "@/components/ProjectCard";

export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const caseStudies = await prisma.caseStudy.findMany({ select: { slug: true } });
    return caseStudies.map((cs) => ({ slug: cs.slug }));
  } catch {
    return [];
  }
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = await prisma.caseStudy.findUnique({ where: { slug }, include: { project: true } });
  if (!caseStudy) return {};
  const { project } = caseStudy;
  const description = caseStudy.description ?? project.description;
  const ogImage = slug === "trading-card-game"
    ? "https://www.jfcr.design/images/og-trading-cards.png"
    : undefined;
  return {
    title: project.title,
    description,
    openGraph: {
      title: project.title,
      description,
      url: `https://www.jfcr.design/projects/${slug}`,
      ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630 }] }),
    },
    ...(ogImage && { twitter: { card: "summary_large_image", images: [ogImage] } }),
  };
}

function parseBlocks(blocks: string): Block[] {
  try {
    return JSON.parse(blocks);
  } catch {
    return [];
  }
}

function parseJSON<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;

  const [caseStudy, allCaseStudies] = await Promise.all([
    prisma.caseStudy.findUnique({
      where: { slug },
      include: { project: true },
    }),
    prisma.caseStudy.findMany({
      include: { project: true },
      orderBy: { project: { order: "asc" } },
    }),
  ]);

  if (!caseStudy) notFound();

  // Pick 2 other projects for the footer, cycling from the current position
  const others = allCaseStudies.filter((cs) => cs.slug !== slug);
  const currentIdx = allCaseStudies.findIndex((cs) => cs.slug === slug);
  const footerProjects = [
    others[(currentIdx) % others.length],
    others[(currentIdx + 1) % others.length],
  ];

  const { project } = caseStudy;
  const blocks = parseBlocks(caseStudy.blocks);
  const teamMembers = parseJSON<string[]>(caseStudy.teamMembers, []);
  const heroDescription = caseStudy.description ?? project.description;
  const tags = parseJSON<string[]>(project.tags, []);
  const roleBlock = blocks.find((b) => b.type === "role");
  const heroRole = roleBlock && roleBlock.type === "role" ? roleBlock.text : null;
  const heroCtaLabel = caseStudy.ctaLabel;
  const heroCtaUrl = caseStudy.ctaUrl;

  const hasCardDeck = blocks.some((b) => b.type === "image-grid");

  return (
    <main>
      {hasCardDeck && (
        <SiteHeader
          logoSize={100}
          showLogo={false}
          color="#3E11E1"
          mobileOverlayColor={project.cardColor}
          navHoverBg="#3E11E1"
          navHoverText="#FFFFFF"
        />
      )}
      {!hasCardDeck && (
        <div className="relative">
          <SiteHeader logoSize={100} mobileOverlayColor={project.cardColor} />
        <section
          className="pt-[calc(20vw+64px)] pb-12 px-6 md:px-12 md:pt-56 md:pb-12"
          style={{ background: project.cardColor }}
        >
          <div className="max-w-[1000px] mx-auto w-full">
            {/* Title */}
            <h1 className="type-homepage-hero-left !text-[#0C0D1F] mb-4">
              {project.title}
            </h1>

            {/* Tags row — role replaces tags when set */}
            {heroRole ? (
              <p className="type-tag text-[#0C0D1F]/50 mb-8 tracking-widest uppercase">
                {heroRole}
              </p>
            ) : tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {tags.map((tag) => (
                  <span key={tag} className="type-tag border border-[#0C0D1F]/20 text-[#0C0D1F]/60 px-3 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Description + Team side by side, both top-aligned */}
            <div className="flex flex-col md:flex-row gap-8 md:items-start">
              <div className="flex-1">
                {heroDescription && (
                  <p className="type-paragraph text-[#0C0D1F]/70">
                    {heroDescription}
                  </p>
                )}
                {heroCtaLabel && heroCtaUrl && (
                  <a
                    href={heroCtaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="type-cta mt-8 inline-flex items-center gap-2 border border-[#0C0D1F] text-[#0C0D1F] px-6 py-3 rounded-full hover:bg-[#0C0D1F] hover:text-white transition-colors duration-300"
                  >
                    {heroCtaLabel} →
                  </a>
                )}
              </div>

              {/* Team — separated by a left border */}
              {teamMembers.length > 0 && (
                <div className="md:w-48 shrink-0 md:border-l md:border-[#0C0D1F]/20 md:pl-8">
                  <p className="type-tag text-[#0C0D1F]/40 mb-2">Team</p>
                  {teamMembers.map((member) => (
                    <p key={member} className="type-caption-sm text-[#0C0D1F]">
                      {member}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
        </div>
      )}

      <section className="bg-white">
        <BlockRenderer
          blocks={blocks}
          cardColor={project.cardColor}
          title={project.title}
          description={project.description ?? undefined}
          showLogo={hasCardDeck}
        />
      </section>

      {footerProjects.length > 0 && (
        <section className="bg-white border-t border-[#0C0D1F]/8 px-6 md:px-12 py-16">
          <div className="max-w-[1000px] mx-auto w-full">
            <p className="type-tag text-[#0C0D1F]/40 mb-8 uppercase tracking-widest">More work</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {footerProjects.map((cs) => {
                const p = cs.project;
                const pTags = (() => { try { return JSON.parse(p.tags); } catch { return []; } })();
                return (
                  <ProjectCard
                    key={cs.slug}
                    title={p.title}
                    subtitle={p.subtitle ?? ""}
                    tags={pTags}
                    description={p.description ?? ""}
                    ctaLabel={p.ctaLabel ?? "View project"}
                    ctaHref={p.ctaHref ?? "#"}
                    thumbnailUrl={p.thumbnailUrl ?? undefined}
                    cardColor={p.cardColor}
                    size="footer-card"
                    showThumbnailOnMobile={p.showThumbnailOnMobile}
                    caseStudySlug={cs.slug}
                  />
                );
              })}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
