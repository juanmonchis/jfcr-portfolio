import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: Params) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const data = await request.json();

  try {
    const project = await prisma.project.update({
      where: { id: parseInt(id) },
      data: {
        title: data.title,
        subtitle: data.subtitle,
        tags: data.tags,
        description: data.description,
        ctaLabel: data.ctaLabel,
        ctaHref: data.ctaHref,
        thumbnailUrl: data.thumbnailUrl || null,
        cardColor: data.cardColor,
        size: data.size,
        showThumbnailOnMobile: data.showThumbnailOnMobile,
        order: data.order,
      },
    });
    return NextResponse.json(project);
  } catch {
    return NextResponse.json({ error: "DB error" }, { status: 400 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.project.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ success: true });
}

export function generateStaticParams() { return []; }
