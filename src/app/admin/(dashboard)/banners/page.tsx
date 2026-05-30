"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, ExternalLink } from "lucide-react";
import Image from "next/image";

export default function BannersPage() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: "", imageUrl: "", link: "", position: "HOME_TOP" });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/banners");
      const data = await res.json();
      setBanners(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ title: "", imageUrl: "", link: "", position: "HOME_TOP" });
        fetchBanners();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/admin/banners/${id}`, { method: "DELETE" });
      if (res.ok) fetchBanners();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Banners & Ads</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700"
        >
          <Plus className="w-4 h-4" />
          <span>Add Banner</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p>Loading...</p>
        ) : banners.map((banner) => (
          <div key={banner.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 group">
            <div className="relative aspect-[21/9] bg-gray-100">
              <Image src={banner.imageUrl} alt={banner.title || ""} fill className="object-cover" />
              <button
                onClick={() => handleDelete(banner.id)}
                className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-gray-800">{banner.title || "Untitled Banner"}</h3>
                <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">
                  {banner.position}
                </span>
              </div>
              {banner.link && (
                <a href={banner.link} target="_blank" rel="noreferrer" className="text-sm text-blue-600 flex items-center hover:underline">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  {banner.link}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4">
            <h2 className="text-xl font-bold">Add Banner</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border rounded-lg p-2 mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Image URL</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full border rounded-lg p-2 mt-1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Link URL (Optional)</label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className="w-full border rounded-lg p-2 mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Position</label>
                <select
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full border rounded-lg p-2 mt-1"
                >
                  <option value="HOME_TOP">Home Top</option>
                  <option value="CATEGORY_TOP">Category Top</option>
                  <option value="LISTING">Listing Ad</option>
                </select>
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
