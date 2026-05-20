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

export const dynamicParams = false;

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
    ? "https://www.jfcr.design/jfcr-portfolio/images/og-trading-cards.png"
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

  const caseStudy = await prisma.caseStudy.findUnique({
    where: { slug },
    include: { project: true },
  });

  if (!caseStudy) notFound();

  const { project } = caseStudy;
  const blocks = parseBlocks(caseStudy.blocks);
  const tags = parseJSON<string[]>(project.tags, []);
  const teamMembers = parseJSON<string[]>(caseStudy.teamMembers, []);
  const heroDescription = caseStudy.description ?? project.description;
  const heroCtaLabel = caseStudy.ctaLabel;
  const heroCtaUrl = caseStudy.ctaUrl;

  const hasCardDeck = blocks.some((b) => b.type === "image-grid");

  return (
    <main>
      {!hasCardDeck && (
        <div className="relative">
          <SiteHeader logoSize={100} />
        <section
          className="pt-[calc(20vw+48px)] pb-12 px-6 md:px-12 md:pt-32 md:pb-12"
          style={{ background: project.cardColor }}
        >
          <div className="max-w-[1000px] mx-auto w-full">
            <div className="flex flex-col md:flex-row gap-8 md:items-end">
              <div className="flex-1">
                {/* Tags */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="type-tag px-3 py-1 border border-[#0C0D1F]/30 rounded-full text-[#0C0D1F]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Title */}
                <h1 className="type-case-main-title text-[#0C0D1F]">
                  {project.title}
                </h1>

                {/* Description */}
                {heroDescription && (
                  <p className="type-paragraph text-[#0C0D1F]/70 mt-4">
                    {heroDescription}
                  </p>
                )}

                {/* CTA */}
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
    </main>
  );
}
