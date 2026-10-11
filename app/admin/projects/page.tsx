import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import SortableProjectList from "@/components/admin/SortableProjectList";
import { isUpcoming } from "@/lib/upcomingProjects";

export const dynamic = "force-dynamic";

async function deleteProject(formData: FormData) {
  "use server";
  const id = parseInt(formData.get("id") as string);
  await prisma.project.delete({ where: { id } });
  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}

function parseTags(tags: string): string[] {
  try {
    return JSON.parse(tags);
  } catch {
    return [];
  }
}

export default async function AdminProjectsPage() {
  const sizeRank: Record<string, number> = { default: 0, small: 1, xsmall: 2 };
  const upcoming = (p: any) => isUpcoming(p.caseStudy?.slug);
  // Same grouping the homepage uses: finished projects first, coming-soon ones last;
  // within each, full-width, then 2-col, then 3-col; by order within each size
  const projects = (
    await prisma.project.findMany({
      orderBy: [{ order: "asc" }, { id: "asc" }],
      include: { caseStudy: { select: { slug: true } } },
    })
  ).sort(
    (a: any, b: any) =>
      Number(upcoming(a)) - Number(upcoming(b)) ||
      (sizeRank[a.size] ?? 3) - (sizeRank[b.size] ?? 3)
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black text-[#0C0D1F]">Projects</h1>
          <p className="text-gray-500 text-sm mt-1">{projects.length} project{projects.length !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="bg-[#0C0D1F] text-white font-semibold px-5 py-2 rounded-xl hover:opacity-80 transition-opacity text-sm"
        >
          + New Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center">
          <p className="text-gray-400 text-lg mb-4">No projects yet</p>
          <Link href="/admin/projects/new" className="text-sm font-semibold text-[#0C0D1F] underline">
            Create your first project
          </Link>
        </div>
      ) : (
        <SortableProjectList
          deleteAction={deleteProject}
          initialProjects={projects.map((p: any) => ({
            id: p.id,
            title: p.title,
            subtitle: p.subtitle,
            tags: parseTags(p.tags),
            size: p.size,
            cardColor: p.cardColor,
            upcoming: upcoming(p),
          }))}
        />
      )}
    </div>
  );
}
