import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, slug, excerpt, coverImage, blocks, published } = await request.json();

  if (!title || !slug || !excerpt) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const post = await prisma.post.create({
      data: {
        title,
        slug,
        excerpt,
        coverImage: coverImage || null,
        blocks: Array.isArray(blocks) ? JSON.stringify(blocks) : (blocks ?? "[]"),
        published: published ?? false,
      },
    });
    return NextResponse.json(post);
  } catch {
    return NextResponse.json({ error: "Slug already exists or DB error" }, { status: 400 });
  }
}
