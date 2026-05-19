import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const ext = path.extname(file.name).toLowerCase();
  const allowed = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif", ".svg", ".mp4"];
  if (!allowed.includes(ext)) {
    return NextResponse.json({ error: "File type not allowed" }, { status: 400 });
  }

  const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  const imagesDir = path.join(process.cwd(), "public", "images");

  await mkdir(imagesDir, { recursive: true });
  await writeFile(path.join(imagesDir, safeName), Buffer.from(await file.arrayBuffer()));

  return NextResponse.json({ url: `/images/${safeName}` });
}
