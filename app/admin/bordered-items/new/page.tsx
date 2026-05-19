import BorderedItemForm from "@/components/admin/BorderedItemForm";

export default function NewBorderedItemPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-black text-[#0C0D1F]">New Bordered Item</h1>
        <p className="text-gray-500 text-sm mt-1">Add a new bordered item to the portfolio</p>
      </div>
      <div className="bg-white rounded-2xl p-6">
        <BorderedItemForm mode="create" />
      </div>
    </div>
  );
}
