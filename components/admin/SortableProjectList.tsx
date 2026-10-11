"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import DeleteButton from "@/components/admin/DeleteButton";

export interface SortableProject {
  id: number;
  title: string;
  subtitle: string;
  tags: string[];
  size: string;
  cardColor: string;
  /** Unfinished: shown last on the site with a "Coming soon" button. */
  upcoming: boolean;
}

// The site renders finished and coming-soon projects as separate groups, and each
// size within them as its own block, so dragging only works inside the same group.
const sameGroup = (a: SortableProject, b: SortableProject) =>
  a.size === b.size && a.upcoming === b.upcoming;

interface Props {
  initialProjects: SortableProject[];
  deleteAction: (formData: FormData) => void | Promise<void>;
}

export default function SortableProjectList({ initialProjects, deleteAction }: Props) {
  const [projects, setProjects] = useState(initialProjects);
  const [dragId, setDragId] = useState<number | null>(null);
  const [overId, setOverId] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function persist(next: SortableProject[], previous: SortableProject[]) {
    setStatus("saving");
    try {
      const res = await fetch("/api/admin/projects/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: next.map((p) => p.id) }),
      });
      if (!res.ok) throw new Error();
      setStatus("saved");
    } catch {
      setProjects(previous);
      setStatus("error");
    }
  }

  function handleDrop(targetId: number) {
    if (dragId === null || dragId === targetId) return;
    const from = projects.findIndex((p) => p.id === dragId);
    const to = projects.findIndex((p) => p.id === targetId);
    // Only reorder within a group (same size, same finished / coming-soon status)
    if (!sameGroup(projects[from], projects[to])) return;
    const next = [...projects];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    const previous = projects;
    setProjects(next);
    persist(next, previous);
  }

  return (
    <div>
      <p className="text-xs text-gray-400 mb-3 h-4">
        {status === "saving" && "Saving order…"}
        {status === "saved" && "Order saved"}
        {status === "error" && <span className="text-red-500">Couldn&apos;t save order — reverted</span>}
        {status === "idle" && "Shown in the same order as the site, coming-soon projects last. Drag to reorder within a size (default → small → xsmall)."}
      </p>
      <div className="grid grid-cols-1 gap-4">
        {projects.map((project, i) => (
          <Fragment key={project.id}>
          {project.upcoming && !projects[i - 1]?.upcoming && (
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mt-4">
              Coming soon — shown last on the site
            </p>
          )}
          <div
            draggable
            onDragStart={() => setDragId(project.id)}
            onDragOver={(e) => {
              e.preventDefault();
              const dragged = projects.find((p) => p.id === dragId);
              if (dragged && sameGroup(dragged, project) && overId !== project.id) setOverId(project.id);
            }}
            onDrop={(e) => {
              e.preventDefault();
              handleDrop(project.id);
              setDragId(null);
              setOverId(null);
            }}
            onDragEnd={() => {
              setDragId(null);
              setOverId(null);
            }}
            className={`bg-white rounded-2xl p-5 flex items-center gap-4 transition-opacity ${
              dragId === project.id ? "opacity-40" : project.upcoming ? "opacity-70" : ""
            } ${
              overId === project.id && dragId !== null && dragId !== project.id
                ? "ring-2 ring-[#0C0D1F]"
                : ""
            }`}
          >
            <span
              className="text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing select-none text-lg leading-none"
              aria-label="Drag to reorder"
              title="Drag to reorder"
            >
              ⠿
            </span>
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
                {project.upcoming && (
                  <span className="text-xs font-semibold text-[#0C0D1F] bg-[#DDED3C] px-2 py-0.5 rounded-full">
                    Coming soon
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mb-1">{project.subtitle}</p>
              <div className="flex flex-wrap gap-1">
                {project.tags.slice(0, 4).map((tag) => (
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
              <form action={deleteAction}>
                <input type="hidden" name="id" value={project.id} />
                <DeleteButton label="Delete this project?" />
              </form>
            </div>
          </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
