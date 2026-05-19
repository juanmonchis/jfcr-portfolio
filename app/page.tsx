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

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [projects, borderedItems] = await Promise.all([
    prisma.project.findMany({
      orderBy: { order: "asc" },
      include: { caseStudy: { select: { slug: true } } },
    }),
    prisma.borderedItem.findMany({ orderBy: { order: "asc" } }),
  ]);

  const defaultProjects = projects.filter((p) => p.size === "default").sort((a, b) => a.order - b.order);
  const smallProjects = projects.filter((p) => p.size === "small").sort((a, b) => a.order - b.order);
  const xsmallProjects = projects.filter((p) => p.size === "xsmall").sort((a, b) => a.order - b.order);

  function parseTags(tags: string): string[] {
    try {
      return JSON.parse(tags);
    } catch {
      return [];
    }
  }

  return (
    <main>
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
            {defaultProjects.map((project) => (
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
            {smallProjects.map((project) => (
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
            {xsmallProjects.map((project) => (
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

      {/* Other Projects Section */}
      <section className="bg-white py-20 px-6 md:px-12 lg:px-20">
        <div className="max-w-[1200px] mx-auto">
        <h2 className="text-[#0C0D1F] text-2xl md:text-3xl font-bold mb-12 max-w-2xl">
          These are some other projects not entirely related to product but that I really enjoyed working on
        </h2>
        {borderedItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {borderedItems.map((item) => (
              <BorderedItemComponent
                key={item.id}
                title={item.title}
                tags={parseTags(item.tags)}
                href={item.href}
                bgColor={item.bgColor}
                textColor={item.textColor}
                tagColor={item.tagColor}
                glowColor={item.glowColor}
              />
            ))}
          </div>
        ) : (
          <p className="text-[#0C0D1F]/40 text-sm">No items yet. Add some in the admin panel.</p>
        )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0C0D1F] py-16 px-6 md:px-12 lg:px-20">
        <div className="max-w-[1200px] mx-auto">
          <p className="text-white text-2xl font-bold mb-8">
            Thanks for stopping by! 🐸
          </p>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <Link
                href="https://instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white text-sm font-medium transition-colors"
              >
                Instagram
              </Link>
              <Link
                href="https://linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white text-sm font-medium transition-colors"
              >
                LinkedIn
              </Link>
              <Link
                href="https://letterboxd.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white text-sm font-medium transition-colors"
              >
                Letterboxd
              </Link>
            </div>
            <p className="text-white/30 text-sm">JFCR 2025</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
