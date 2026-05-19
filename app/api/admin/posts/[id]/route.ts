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
  const { title, slug, excerpt, coverImage, blocks, published } = await request.json();

  try {
    const post = await prisma.post.update({
      where: { id: parseInt(id) },
      data: {
        title,
        slug,
        excerpt,
        coverImage: coverImage || null,
        blocks: Array.isArray(blocks) ? JSON.stringify(blocks) : (blocks ?? "[]"),
        published,
      },
    });
    return NextResponse.json(post);
  } catch {
    return NextResponse.json({ error: "DB error" }, { status: 400 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.post.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ success: true });
}

export function generateStaticParams() { return []; }
