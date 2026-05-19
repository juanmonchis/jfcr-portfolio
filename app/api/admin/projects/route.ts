import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await request.json();

  if (!data.title || !data.subtitle || !data.description || !data.ctaLabel || !data.ctaHref) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const project = await prisma.project.create({
      data: {
        title: data.title,
        subtitle: data.subtitle,
        tags: data.tags || "[]",
        description: data.description,
        ctaLabel: data.ctaLabel,
        ctaHref: data.ctaHref,
        thumbnailUrl: data.thumbnailUrl || null,
        cardColor: data.cardColor || "#B8C8FF",
        size: data.size || "default",
        showThumbnailOnMobile: data.showThumbnailOnMobile ?? true,
        order: data.order ?? 0,
      },
    });
    return NextResponse.json(project);
  } catch {
    return NextResponse.json({ error: "DB error" }, { status: 400 });
  }
}
