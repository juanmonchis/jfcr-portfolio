import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import BorderedItemForm from "@/components/admin/BorderedItemForm";

export const dynamic = "force-dynamic";
export function generateStaticParams() { return []; }

interface Props {
  params: Promise<{ id: string }>;
}

function parseTags(tags: string): string {
  try {
    const arr = JSON.parse(tags) as string[];
    return arr.join(", ");
  } catch {
    return tags;
  }
}

export default async function EditBorderedItemPage({ params }: Props) {
  const { id } = await params;
  const item = await prisma.borderedItem.findUnique({ where: { id: parseInt(id) } });

  if (!item) {
    notFound();
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-black text-[#0C0D1F]">Edit Bordered Item</h1>
        <p className="text-gray-500 text-sm mt-1">{item.title}</p>
      </div>
      <div className="bg-white rounded-2xl p-6">
        <BorderedItemForm
          mode="edit"
          initialData={{
            id: item.id,
            title: item.title,
            tags: parseTags(item.tags),
            href: item.href,
            bgColor: item.bgColor,
            textColor: item.textColor,
            tagColor: item.tagColor,
            glowColor: item.glowColor,
            order: item.order,
          }}
        />
      </div>
    </div>
  );
}
