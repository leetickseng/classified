"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Megaphone } from "lucide-react";

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnn, setEditingAnn] = useState<any>(null);
  const [formData, setFormData] = useState({ content: "", isActive: true });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/announcements");
      const data = await res.json();
      setAnnouncements(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingAnn ? `/api/admin/announcements/${editingAnn.id}` : "/api/admin/announcements";
    const method = editingAnn ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsModalOpen(false);
        setEditingAnn(null);
        setFormData({ content: "", isActive: true });
        fetchAnnouncements();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/admin/announcements/${id}`, { method: "DELETE" });
      if (res.ok) fetchAnnouncements();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Announcements</h1>
        <button
          onClick={() => {
            setEditingAnn(null);
            setFormData({ content: "", isActive: true });
            setIsModalOpen(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700"
        >
          <Plus className="w-4 h-4" />
          <span>Add Announcement</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <p>Loading...</p>
        ) : announcements.map((ann) => (
          <div key={ann.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`p-2 rounded-lg ${ann.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                <Megaphone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-gray-800 font-medium">{ann.content}</p>
                <p className="text-xs text-gray-400">{new Date(ann.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setEditingAnn(ann);
                  setFormData({ content: ann.content, isActive: ann.isActive });
                  setIsModalOpen(true);
                }}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(ann.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4">
            <h2 className="text-xl font-bold">{editingAnn ? "Edit" : "Add"} Announcement</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full border rounded-lg p-2 mt-1 min-h-[100px]"
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-green-600 rounded"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Active</label>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
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
