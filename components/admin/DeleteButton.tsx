"use client";

interface DeleteButtonProps {
  label?: string;
}

export default function DeleteButton({ label = "Delete this item?" }: DeleteButtonProps) {
  return (
    <button
      type="submit"
      className="text-sm text-red-500 hover:text-red-700 font-medium"
      onClick={(e) => {
        if (!confirm(label)) e.preventDefault();
      }}
    >
      Delete
    </button>
  );
}
