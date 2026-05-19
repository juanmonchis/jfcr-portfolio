import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProjectForm from "@/components/admin/ProjectForm";
import CaseStudyEditorClient from "./case-study/CaseStudyEditorClient";

export const dynamic = "force-dynamic";
export function generateStaticParams() { return []; }

interface Props {
  params: Promise<{ id: string }>;
}

function parseTags(tags: string): string {
  try {
    const arr = JSON.parse(tags) as string[];
    return arr.join(", ");
  } catch {
    return tags;
  }
}

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id: parseInt(id) },
    include: { caseStudy: true },
  });

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* ── Card info ── */}
      <div>
        <h1 className="text-3xl font-black text-[#0C0D1F] mb-1">Edit Project</h1>
        <p className="text-gray-500 text-sm">{project.title}</p>
      </div>

      <div className="bg-white rounded-2xl p-6">
        <ProjectForm
          mode="edit"
          initialData={{
            id: project.id,
            title: project.title,
            subtitle: project.subtitle,
            tags: parseTags(project.tags),
            description: project.description,
            ctaLabel: project.ctaLabel,
            ctaHref: project.ctaHref,
            thumbnailUrl: project.thumbnailUrl ?? "",
            cardColor: project.cardColor,
            size: project.size as "default" | "small" | "xsmall",
            showThumbnailOnMobile: project.showThumbnailOnMobile,
            order: project.order,
          }}
        />
      </div>

      {/* ── Case study ── */}
      <div>
        <h2 className="text-2xl font-black text-[#0C0D1F] mb-1">Case Study</h2>
        <p className="text-gray-500 text-sm mb-4">Content blocks for the public case study page</p>
      </div>

      <div className="bg-[#F4F5FF] rounded-2xl p-6">
        <CaseStudyEditorClient
          projectId={project.id}
          projectTitle={project.title}
          initialSlug={
            project.caseStudy?.slug ??
            project.title
              .toLowerCase()
              .replace(/[^a-z0-9\s-]/g, "")
              .trim()
              .replace(/\s+/g, "-")
          }
          initialTeamMembers={
            project.caseStudy
              ? (JSON.parse(project.caseStudy.teamMembers) as string[])
              : []
          }
          initialBlocks={project.caseStudy ? project.caseStudy.blocks : "[]"}
          initialDescription={project.caseStudy?.description ?? ""}
          initialCtaLabel={project.caseStudy?.ctaLabel ?? ""}
          initialCtaUrl={project.caseStudy?.ctaUrl ?? ""}
          existingSlug={project.caseStudy?.slug ?? null}
        />
      </div>
    </div>
  );
}
