import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import CaseStudyEditorClient from "./CaseStudyEditorClient";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CaseStudyEditorPage({ params }: Props) {
  const { id } = await params;
  const projectId = parseInt(id, 10);

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { caseStudy: true },
  });

  if (!project) {
    notFound();
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-black text-[#0C0D1F]">Case Study Editor</h1>
        <p className="text-gray-500 text-sm mt-1">{project.title}</p>
      </div>
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
        initialBlocks={project.caseStudy?.blocks ?? "[]"}
        initialDescription={project.caseStudy?.description ?? ""}
        initialCtaLabel={project.caseStudy?.ctaLabel ?? ""}
        initialCtaUrl={project.caseStudy?.ctaUrl ?? ""}
        existingSlug={project.caseStudy?.slug ?? null}
      />
    </div>
  );
}
