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
import Link from "next/link";
import BlockRenderer, { Block } from "@/components/CaseStudy/BlockRenderer";
import SiteHeader from "@/components/SiteHeader";
import ProjectCard from "@/components/ProjectCard";
import LogoIcon from "@/components/LogoIcon";

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

            {/* Description + Team side by side, both top-aligned */}
            <div className="flex flex-col md:flex-row gap-8 md:items-start">
              <div className="flex-1">
                {/* Role */}
                {heroRole && (
                  <p className="type-tag text-[#0C0D1F]/50 mb-4 tracking-widest uppercase">
                    {heroRole}
                  </p>
                )}
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

      {/* Footer */}
      <footer className="rounded-tl-2xl rounded-tr-2xl" style={{ padding: "clamp(48px, 8vw, 96px) clamp(24px, 6vw, 80px)", backgroundColor: "#0C0D1F", backgroundImage: "url('/images/footer-gradient.svg')", backgroundRepeat: "no-repeat", backgroundPosition: "center bottom", backgroundSize: "100% auto" }}>
        <div style={{ position: "relative", border: "1px solid #DDED3C", borderRadius: 4, padding: "clamp(48px, 6vw, 80px) clamp(24px, 4vw, 60px)", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.75rem" }}>
          {([
            { style: { top: 0,    left: 0    }, t: "translate(-50%, -50%)" },
            { style: { top: 0,    right: 0   }, t: "translate(50%,  -50%)" },
            { style: { bottom: 0, right: 0   }, t: "translate(50%,   50%)" },
            { style: { bottom: 0, left: 0    }, t: "translate(-50%,  50%)" },
          ]).map(({ style: corner, t }, i) => (
            <svg key={i} width="72" height="72" viewBox="0 0 117 117" fill="none" style={{ position: "absolute", transform: t, ...corner }}>
              <path d="M58.157 116.314L60.8792 62.526L60.7942 60.5742L116.314 58.157L60.5833 55.7306L58.157 0L55.7398 55.5197L53.7879 55.4347L0 58.157L53.7879 60.8792L55.5097 60.8042L55.4347 62.526L58.157 116.314Z" fill="#DDED3C"/>
            </svg>
          ))}
          <div style={{ filter: "brightness(0) saturate(100%) invert(95%) sepia(60%) saturate(500%) hue-rotate(18deg) brightness(1.05)" }}>
            <LogoIcon variant="light" size={80} cropPx={12} noLink alwaysPlay />
          </div>
          <p style={{ fontFamily: "var(--font-migra), serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 400, color: "#DDED3C", textAlign: "center", lineHeight: 1.1, margin: 0 }}>
            Thanks for stopping by!
          </p>
          <div style={{ display: "flex", gap: "clamp(1.5rem, 4vw, 3rem)", alignItems: "center" }}>
            {[
              { label: "Instagram",  href: "https://www.instagram.com/jfcr_/" },
              { label: "LinkedIn",   href: "https://www.linkedin.com/in/jfcrco/" },
              { label: "Letterboxd", href: "https://letterboxd.com/jfcr/" },
            ].map(({ label, href }) => (
              <Link key={label} href={href} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--font-telegraf), sans-serif", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#F2EBD9", textDecoration: "none" }}
                className="hover:opacity-60 transition-opacity">
                {label}
              </Link>
            ))}
          </div>
          <p style={{ fontFamily: "var(--font-telegraf), sans-serif", fontSize: 11, letterSpacing: "0.08em", color: "rgba(242,235,217,0.25)", margin: 0 }}>JFCR 2025</p>
        </div>
      </footer>
    </main>
  );
}
