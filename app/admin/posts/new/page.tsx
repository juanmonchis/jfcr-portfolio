import PostForm from "@/components/admin/PostForm";

export default function NewPostPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-black text-[#0C0D1F]">New Post</h1>
        <p className="text-gray-500 text-sm mt-1">Create a new blog post</p>
      </div>
      <div className="bg-white rounded-2xl p-6">
        <PostForm mode="create" />
      </div>
    </div>
  );
}
