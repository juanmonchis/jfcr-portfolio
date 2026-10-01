// Dumps the local admin database (dev.db) to prisma/content.json.
// Commit that file: CI seeds the published site from it (see prisma/seed.ts).
// Run via: npm run content:export
import pkg from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";
import { writeFileSync, existsSync } from "fs";

const { PrismaClient } = pkg;

const dbPath = path.join(process.cwd(), "dev.db");
if (!existsSync(dbPath)) {
  console.error(`No database at ${dbPath}. Run the local admin first.`);
  process.exit(1);
}

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url: `file:${dbPath}` }),
});

const content = {
  projects: await prisma.project.findMany({ orderBy: { id: "asc" } }),
  caseStudies: await prisma.caseStudy.findMany({ orderBy: { id: "asc" } }),
  borderedItems: await prisma.borderedItem.findMany({ orderBy: { id: "asc" } }),
  posts: await prisma.post.findMany({ orderBy: { id: "asc" } }),
};

writeFileSync(
  path.join(process.cwd(), "prisma", "content.json"),
  JSON.stringify(content, null, 2) + "\n"
);
console.log(
  `Exported ${content.projects.length} projects, ${content.caseStudies.length} case studies, ` +
    `${content.borderedItems.length} bordered items, ${content.posts.length} posts -> prisma/content.json`
);
await prisma.$disconnect();
