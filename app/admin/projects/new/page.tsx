import ProjectForm from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-black text-[#0C0D1F]">New Project</h1>
        <p className="text-gray-500 text-sm mt-1">Add a new project to your portfolio</p>
      </div>
      <div className="bg-white rounded-2xl p-6">
        <ProjectForm mode="create" />
      </div>
    </div>
  );
}
