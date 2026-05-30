"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function TagsPage() {
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<any>(null);
  const [formData, setFormData] = useState({ name: "", slug: "" });

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/tags");
      const data = await res.json();
      setTags(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingTag ? `/api/admin/tags/${editingTag.id}` : "/api/admin/tags";
    const method = editingTag ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsModalOpen(false);
        setEditingTag(null);
        setFormData({ name: "", slug: "" });
        fetchTags();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tag?")) return;
    try {
      const res = await fetch(`/api/admin/tags/${id}`, { method: "DELETE" });
      if (res.ok) fetchTags();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tags</h1>
        <button
          onClick={() => {
            setEditingTag(null);
            setFormData({ name: "", slug: "" });
            setIsModalOpen(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700"
        >
          <Plus className="w-4 h-4" />
          <span>Add Tag</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Slug</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Posts</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr><td colSpan={4} className="px-6 py-4 text-center">Loading...</td></tr>
            ) : tags.map((tag) => (
              <tr key={tag.id}>
                <td className="px-6 py-4 font-medium">{tag.name}</td>
                <td className="px-6 py-4 text-gray-500">{tag.slug}</td>
                <td className="px-6 py-4">{tag._count?.posts || 0}</td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingTag(tag);
                        setFormData({ name: tag.name, slug: tag.slug });
                        setIsModalOpen(true);
                      }}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(tag.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4">
            <h2 className="text-xl font-bold">{editingTag ? "Edit" : "Add"} Tag</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border rounded-lg p-2 mt-1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full border rounded-lg p-2 mt-1"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
