/*
 * ════════════════════════════════════════════════════════════════════════════
 * FILE: app/page.tsx
 * ════════════════════════════════════════════════════════════════════════════
 * WHAT IT DOES:
 *   The homepage (route: /). Fetches all projects and bordered items from the
 *   database and renders them in sections. This is a Server Component — it
 *   runs on the server and has no client-side interactivity of its own.
 *
 * 🎨 DESIGN — things to edit here:
 *   - Section background colors  → bg-[#0C0D1F] (dark), bg-white, etc.
 *   - Section padding/spacing    → py-20, px-6, gap-6, mb-12, etc.
 *   - Max-width containers       → max-w-[1200px] (all content), max-w-[1000px] (cards)
 *   - Section headings           → the <h2> text and Tailwind classes
 *   - Footer text and links      → bottom of the file
 *
 * ✏️  CONTENT — things to edit here:
 *   - Section heading copy       → "These are the latest products..."
 *   - Footer tagline             → "Thanks for stopping by! 🐸"
 *   - Social links               → Instagram, LinkedIn, Letterboxd hrefs
 *
 * ℹ️  STRUCTURE:
 *   Cards and bordered items are managed via the admin panel (/admin),
 *   not hardcoded here. The page just renders whatever is in the database.
 *   Cards are split by size: default (full width), small (2-col), xsmall (3-col).
 * ════════════════════════════════════════════════════════════════════════════
 */

import { prisma } from "@/lib/prisma";
import Hero from "@/components/Hero";
import ProjectCard from "@/components/ProjectCard";
import BorderedItemComponent from "@/components/BorderedItem";
import Link from "next/link";
import PillMarquee from "@/components/PillMarquee";



export default async function HomePage() {
  const [projects, borderedItems] = await Promise.all([
    prisma.project.findMany({
      orderBy: { order: "asc" },
      include: { caseStudy: { select: { slug: true } } },
    }),
    prisma.borderedItem.findMany({ orderBy: { order: "asc" } }),
  ]);

  const defaultProjects = projects.filter((p: any) => p.size === "default").sort((a: any, b: any) => a.order - b.order);
  const smallProjects = projects.filter((p: any) => p.size === "small").sort((a: any, b: any) => a.order - b.order);
  const xsmallProjects = projects.filter((p: any) => p.size === "xsmall").sort((a: any, b: any) => a.order - b.order);

  function parseTags(tags: string): string[] {
    try {
      return JSON.parse(tags);
    } catch {
      return [];
    }
  }

  return (
    <main className="bg-[#DDED3C]">
      {/* Hero */}
      <Hero />

      {/* Projects Section */}
      <section id="projects" className="bg-[#0C0D1F] py-20 px-6 md:px-12 lg:px-20">
        <div className="max-w-[1200px] mx-auto">
        <h2 className="type-case-subtitle mb-12 max-w-2xl" style={{ fontWeight: 400, color: "white" }}>
          These are the latest products and brands I&apos;ve worked on:
        </h2>

        {/* Default (full width) projects */}
        {defaultProjects.length > 0 && (
          <div className="flex flex-col gap-6 mb-6 max-w-[1000px] mx-auto">
            {defaultProjects.map((project: any) => (
              <ProjectCard
                key={project.id}
                title={project.title}
                subtitle={project.subtitle}
                tags={parseTags(project.tags)}
                description={project.description}
                ctaLabel={project.ctaLabel}
                ctaHref={project.ctaHref}
                thumbnailUrl={project.thumbnailUrl ?? undefined}
                cardColor={project.cardColor}
                size="default"
                showThumbnailOnMobile={project.showThumbnailOnMobile}
                caseStudySlug={project.caseStudy?.slug}
              />
            ))}
          </div>
        )}

        {/* Small (2-col) projects */}
        {smallProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 max-w-[1000px] mx-auto">
            {smallProjects.map((project: any) => (
              <ProjectCard
                key={project.id}
                title={project.title}
                subtitle={project.subtitle}
                tags={parseTags(project.tags)}
                description={project.description}
                ctaLabel={project.ctaLabel}
                ctaHref={project.ctaHref}
                thumbnailUrl={project.thumbnailUrl ?? undefined}
                cardColor={project.cardColor}
                size="small"
                showThumbnailOnMobile={project.showThumbnailOnMobile}
                caseStudySlug={project.caseStudy?.slug}
              />
            ))}
          </div>
        )}

        {/* XSmall (3-col) projects */}
        {xsmallProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1000px] mx-auto">
            {xsmallProjects.map((project: any) => (
              <ProjectCard
                key={project.id}
                title={project.title}
                subtitle={project.subtitle}
                tags={parseTags(project.tags)}
                description={project.description}
                ctaLabel={project.ctaLabel}
                ctaHref={project.ctaHref}
                thumbnailUrl={project.thumbnailUrl ?? undefined}
                cardColor={project.cardColor}
                size="xsmall"
                showThumbnailOnMobile={project.showThumbnailOnMobile}
                caseStudySlug={project.caseStudy?.slug}
              />
            ))}
          </div>
        )}

        {projects.length === 0 && (
          <p className="text-white/40 text-sm">No projects yet. Add some in the admin panel.</p>
        )}
        </div>
      </section>

      {/* Pill marquee */}
      <PillMarquee />

      {/* Footer */}
      <footer className="bg-[#0C0D1F] rounded-tl-2xl rounded-tr-2xl" style={{ padding: "clamp(48px, 8vw, 96px) clamp(24px, 6vw, 80px)" }}>
        <div style={{ position: "relative", border: "1px solid #DDED3C", borderRadius: 4, padding: "clamp(48px, 6vw, 80px) clamp(24px, 4vw, 60px)", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.75rem" }}>

          {/* Corner star decorations */}
          {([
            { style: { top: 0,    left: 0    }, t: "translate(-50%, -50%)" },
            { style: { top: 0,    right: 0   }, t: "translate(50%,  -50%)" },
            { style: { bottom: 0, right: 0   }, t: "translate(50%,   50%)" },
            { style: { bottom: 0, left: 0    }, t: "translate(-50%,  50%)" },
          ]).map(({ style: corner, t }, i) => (
            <svg key={i} width="36" height="36" viewBox="0 0 117 117" fill="none" style={{ position: "absolute", transform: t, ...corner }}>
              <path d="M58.157 116.314L60.8792 62.526L60.7942 60.5742L116.314 58.157L60.5833 55.7306L58.157 0L55.7398 55.5197L53.7879 55.4347L0 58.157L53.7879 60.8792L55.5097 60.8042L55.4347 62.526L58.157 116.314Z" fill="#DDED3C"/>
            </svg>
          ))}

          {/* Tagline */}
          <p style={{ fontFamily: "var(--font-migra), serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 400, color: "#DDED3C", textAlign: "center", lineHeight: 1.1, margin: 0 }}>
            Thanks for stopping by!
          </p>

          {/* Social links */}
          <div style={{ display: "flex", gap: "clamp(1.5rem, 4vw, 3rem)", alignItems: "center" }}>
            {[
              { label: "Instagram", href: "https://instagram.com/" },
              { label: "LinkedIn",  href: "https://linkedin.com/" },
              { label: "Letterboxd", href: "https://letterboxd.com/" },
            ].map(({ label, href }) => (
              <Link key={label} href={href} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--font-telegraf), sans-serif", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#F2EBD9", textDecoration: "none" }}
                className="hover:opacity-60 transition-opacity">
                {label}
              </Link>
            ))}
          </div>

          {/* Copyright */}
          <p style={{ fontFamily: "var(--font-telegraf), sans-serif", fontSize: 11, letterSpacing: "0.08em", color: "rgba(242,235,217,0.25)", margin: 0 }}>JFCR 2025</p>
        </div>
      </footer>
    </main>
  );
}
