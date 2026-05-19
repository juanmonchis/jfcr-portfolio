import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await request.json();

  if (!data.title || !data.href) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const item = await prisma.borderedItem.create({
      data: {
        title: data.title,
        tags: data.tags || "[]",
        href: data.href,
        bgColor: data.bgColor || "transparent",
        textColor: data.textColor || "#0C0D1F",
        tagColor: data.tagColor || "#0C0D1F",
        glowColor: data.glowColor || "#0C0D1F",
        order: data.order ?? 0,
      },
    });
    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: "DB error" }, { status: 400 });
  }
}
