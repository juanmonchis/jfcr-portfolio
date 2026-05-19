import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import DeleteButton from "@/components/admin/DeleteButton";

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
  const projects = await prisma.project.findMany({ orderBy: { order: "asc" } });

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
        <div className="grid grid-cols-1 gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-2xl p-5 flex items-center gap-4"
            >
              <div
                className="w-12 h-12 rounded-xl flex-shrink-0"
                style={{ backgroundColor: project.cardColor }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-[#0C0D1F] text-sm">{project.title}</h3>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full capitalize">
                    {project.size}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-1">{project.subtitle}</p>
                <div className="flex flex-wrap gap-1">
                  {parseTags(project.tags).slice(0, 4).map((tag) => (
                    <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <Link
                  href={`/admin/projects/${project.id}`}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Edit
                </Link>
                <form action={deleteProject}>
                  <input type="hidden" name="id" value={project.id} />
                  <DeleteButton label="Delete this project?" />
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
