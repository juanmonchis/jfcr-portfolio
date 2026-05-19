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
    const item = await prisma.borderedItem.update({
      where: { id: parseInt(id) },
      data: {
        title: data.title,
        tags: data.tags,
        href: data.href,
        bgColor: data.bgColor,
        textColor: data.textColor,
        tagColor: data.tagColor,
        glowColor: data.glowColor,
        order: data.order,
      },
    });
    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: "DB error" }, { status: 400 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.borderedItem.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ success: true });
}

export function generateStaticParams() { return []; }
