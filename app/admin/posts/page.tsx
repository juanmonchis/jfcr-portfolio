import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import DeleteButton from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

async function deletePost(formData: FormData) {
  "use server";
  const id = parseInt(formData.get("id") as string);
  await prisma.post.delete({ where: { id } });
  revalidatePath("/admin/posts");
  redirect("/admin/posts");
}

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black text-[#0C0D1F]">Blog Posts</h1>
          <p className="text-gray-500 text-sm mt-1">{posts.length} post{posts.length !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="bg-[#0C0D1F] text-white font-semibold px-5 py-2 rounded-xl hover:opacity-80 transition-opacity text-sm"
        >
          + New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center">
          <p className="text-gray-400 text-lg mb-4">No posts yet</p>
          <Link
            href="/admin/posts/new"
            className="text-sm font-semibold text-[#0C0D1F] underline"
          >
            Create your first post
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Title</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 hidden md:table-cell">Slug</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 hidden md:table-cell">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 hidden md:table-cell">Date</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {posts.map((post: any) => (
                <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-[#0C0D1F] text-sm">{post.title}</p>
                    <p className="text-gray-400 text-xs mt-0.5 line-clamp-1">{post.excerpt}</p>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {post.slug}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        post.published
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400 hidden md:table-cell">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/posts/${post.id}`}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Edit
                      </Link>
                      <form action={deletePost}>
                        <input type="hidden" name="id" value={post.id} />
                        <DeleteButton label="Delete this post?" />
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
