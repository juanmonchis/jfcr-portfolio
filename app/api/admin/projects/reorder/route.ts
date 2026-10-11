import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

export async function PUT(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { ids } = await request.json();

  if (!Array.isArray(ids) || !ids.every((id) => Number.isInteger(id))) {
    return NextResponse.json({ error: "Invalid ids" }, { status: 400 });
  }

  try {
    await prisma.$transaction(
      ids.map((id: number, index: number) =>
        prisma.project.update({ where: { id }, data: { order: index } })
      )
    );
    revalidatePath("/");
    revalidatePath("/admin/projects");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "DB error" }, { status: 400 });
  }
}
