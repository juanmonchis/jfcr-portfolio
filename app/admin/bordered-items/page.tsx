import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import DeleteButton from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

async function deleteBorderedItem(formData: FormData) {
  "use server";
  const id = parseInt(formData.get("id") as string);
  await prisma.borderedItem.delete({ where: { id } });
  revalidatePath("/admin/bordered-items");
  redirect("/admin/bordered-items");
}

function parseTags(tags: string): string[] {
  try {
    return JSON.parse(tags);
  } catch {
    return [];
  }
}

export default async function AdminBorderedItemsPage() {
  const items = await prisma.borderedItem.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black text-[#0C0D1F]">Bordered Items</h1>
          <p className="text-gray-500 text-sm mt-1">{items.length} item{items.length !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/admin/bordered-items/new"
          className="bg-[#0C0D1F] text-white font-semibold px-5 py-2 rounded-xl hover:opacity-80 transition-opacity text-sm"
        >
          + New Item
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center">
          <p className="text-gray-400 text-lg mb-4">No bordered items yet</p>
          <Link href="/admin/bordered-items/new" className="text-sm font-semibold text-[#0C0D1F] underline">
            Create your first item
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {items.map((item: any) => (
            <div key={item.id} className="bg-white rounded-2xl p-5 flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-xl flex-shrink-0 border-2"
                style={{
                  backgroundColor: item.bgColor === "transparent" ? "#f9f9f9" : item.bgColor,
                  borderColor: item.textColor,
                }}
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-[#0C0D1F] text-sm mb-1">{item.title}</h3>
                <div className="flex flex-wrap gap-1">
                  {parseTags(item.tags).slice(0, 4).map((tag) => (
                    <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <Link
                  href={`/admin/bordered-items/${item.id}`}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Edit
                </Link>
                <form action={deleteBorderedItem}>
                  <input type="hidden" name="id" value={item.id} />
                  <DeleteButton label="Delete this item?" />
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
