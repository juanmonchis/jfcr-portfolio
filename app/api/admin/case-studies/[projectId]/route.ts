import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-static";

interface RouteContext {
  params: Promise<{ projectId: string }>;
}

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const { projectId } = await params;
  const id = parseInt(projectId, 10);

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid projectId" }, { status: 400 });
  }

  const caseStudy = await prisma.caseStudy.findUnique({
    where: { projectId: id },
  });

  return NextResponse.json({ caseStudy: caseStudy ?? null });
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  const { projectId } = await params;
  const id = parseInt(projectId, 10);

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid projectId" }, { status: 400 });
  }

  const body = await req.json() as { slug: string; teamMembers: string[]; blocks: unknown[]; description?: string; ctaLabel?: string; ctaUrl?: string };
  const { slug, teamMembers, blocks, description, ctaLabel, ctaUrl } = body;

  if (!slug) {
    return NextResponse.json({ error: "slug is required" }, { status: 400 });
  }

  try {
    const caseStudy = await prisma.caseStudy.upsert({
      where: { projectId: id },
      create: {
        projectId: id,
        slug,
        teamMembers: JSON.stringify(teamMembers ?? []),
        blocks: JSON.stringify(blocks ?? []),
        description: description ?? null,
        ctaLabel: ctaLabel ?? null,
        ctaUrl: ctaUrl ?? null,
      },
      update: {
        slug,
        teamMembers: JSON.stringify(teamMembers ?? []),
        blocks: JSON.stringify(blocks ?? []),
        description: description ?? null,
        ctaLabel: ctaLabel ?? null,
        ctaUrl: ctaUrl ?? null,
      },
    });
    return NextResponse.json({ caseStudy });
  } catch (err) {
    console.error("[case-study PUT]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export function generateStaticParams() { return []; }
