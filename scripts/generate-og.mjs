// Generates the link-preview image (1200x630 PNG) for every published Notes post:
// article illustration + title + blurb. Output: public/og/<slug>.png (git-ignored,
// regenerated on every build, so it always matches the published content).
//
//   npm run og            # run by hand
//   npm run build / dev   # runs automatically first
//
// Uses satori (layout -> SVG) + resvg-wasm (SVG -> PNG) directly instead of next/og,
// whose bundled copy breaks on Windows. Fonts are lib/og-fonts/*.otf (converted from
// public/fonts/*.woff2, which satori can't read).
import pkg from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import satori from "satori";
import { initWasm, Resvg } from "@resvg/resvg-wasm";
import { createRequire } from "module";
import path from "path";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "fs";

const { PrismaClient } = pkg;
const root = process.cwd();
const outDir = path.join(root, "public", "og");

const NAVY = "#0C0D1F";
const CREAM = "#F2EBD9";
const LIME = "#DDED3C";
const WIDTH = 1200;
const HEIGHT = 630;

// Tiny element builder: satori accepts plain { type, props } objects, so no JSX/build step needed.
const h = (type, style, ...children) => ({
  type,
  props: { style, children: children.length === 1 ? children[0] : children },
});

function clamp(text, max) {
  const t = String(text ?? "").replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return t.slice(0, max).replace(/\s+\S*$/, "") + "…";
}

function coverDataUri(coverImage) {
  if (!coverImage || !coverImage.startsWith("/")) return null;
  const file = path.join(root, "public", coverImage);
  if (!existsSync(file)) return null;
  const ext = path.extname(file).toLowerCase();
  const mime = ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" : ext === ".webp" ? "image/webp" : "image/png";
  return `data:${mime};base64,${readFileSync(file).toString("base64")}`;
}

function card({ title, excerpt, date, cover }) {
  const titleSize = title.length > 48 ? 52 : title.length > 28 ? 62 : 74;
  return h(
    "div",
    { width: WIDTH, height: HEIGHT, display: "flex", boxSizing: "border-box", background: LIME, padding: 28 },
    h(
      "div",
      { flex: 1, display: "flex", boxSizing: "border-box", background: CREAM, borderRadius: 36, padding: 40, gap: 44 },
      // Text column
      h(
        "div",
        { flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", minWidth: 0 },
        h(
          "div",
          { display: "flex", flexDirection: "column" },
          h(
            "div",
            {
              display: "flex",
              fontFamily: "Telegraf",
              fontWeight: 700,
              fontSize: 22,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "rgba(12,13,31,0.55)",
            },
            date ? `Notes · ${date}` : "Notes",
          ),
          h(
            "div",
            { display: "flex", marginTop: 22, fontFamily: "Migra", fontWeight: 800, fontSize: titleSize, lineHeight: 1.04, color: NAVY },
            title,
          ),
          h(
            "div",
            { display: "flex", marginTop: 26, fontFamily: "Telegraf", fontWeight: 400, fontSize: 28, lineHeight: 1.35, color: "rgba(12,13,31,0.72)" },
            excerpt,
          ),
        ),
        h("div", { display: "flex", fontFamily: "Telegraf", fontWeight: 700, fontSize: 24, letterSpacing: 1, color: NAVY }, "jfcr.design/notes"),
      ),
      // Illustration (or a lime tile with the title's first letter when a post has no cover)
      h(
        "div",
        {
          width: 440,
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 28,
          overflow: "hidden",
          background: LIME,
          ...(cover ? { backgroundImage: `url(${cover})`, backgroundSize: "cover", backgroundPosition: "center" } : {}),
        },
        cover ? "" : h("div", { display: "flex", fontFamily: "Migra", fontWeight: 800, fontSize: 220, color: NAVY }, title.charAt(0)),
      ),
    ),
  );
}

async function main() {
  const dbPath = path.join(root, "dev.db");
  if (!existsSync(dbPath)) {
    console.warn(`[og] No database at ${dbPath}; skipping preview images.`);
    return;
  }

  const require = createRequire(import.meta.url);
  const wasmPath = require.resolve("@resvg/resvg-wasm/index_bg.wasm");
  await initWasm(readFileSync(wasmPath));

  const font = (file) => readFileSync(path.join(root, "lib", "og-fonts", file));
  const fonts = [
    { name: "Migra", data: font("Migra-Extrabold.otf"), weight: 800, style: "normal" },
    { name: "Telegraf", data: font("Telegraf-Regular.otf"), weight: 400, style: "normal" },
    { name: "Telegraf", data: font("Telegraf-Bold.otf"), weight: 700, style: "normal" },
  ];

  const prisma = new PrismaClient({ adapter: new PrismaBetterSqlite3({ url: `file:${dbPath}` }) });
  const posts = await prisma.post.findMany({ where: { published: true }, orderBy: { id: "asc" } });
  await prisma.$disconnect();

  rmSync(outDir, { recursive: true, force: true }); // drops images of unpublished/removed posts
  mkdirSync(outDir, { recursive: true });

  for (const post of posts) {
    const date = new Date(post.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    const svg = await satori(
      card({ title: post.title, excerpt: clamp(post.excerpt, 150), date, cover: coverDataUri(post.coverImage) }),
      { width: WIDTH, height: HEIGHT, fonts },
    );
    const png = new Resvg(svg, { fitTo: { mode: "width", value: WIDTH } }).render().asPng();
    writeFileSync(path.join(outDir, `${post.slug}.png`), png);
    console.log(`[og] ${post.slug}.png (${Math.round(png.length / 1024)} KB)`);
  }
  console.log(`[og] Generated ${posts.length} preview image(s) -> public/og/`);
}

main().catch((err) => {
  // Preview images are an enhancement: never block a dev start or a deploy build.
  console.warn("[og] Skipped preview image generation:", err?.message ?? err);
});
