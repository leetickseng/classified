"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Upload, X, Loader2 } from "lucide-react";

export default function PublishPage() {
  const sessionData = useSession();
  const status = sessionData?.status || "loading";
  const router = useRouter();

  const [categories, setCategories] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: "",
    locationId: "",
    address: "",
    contact: "",
    workingHours: "",
    priceRange: "",
    selectedTags: [] as string[],
  });

  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }

    // Fetch options
    const fetchOptions = async () => {
      const [catRes, locRes, tagRes] = await Promise.all([
        fetch("/api/categories"),
        fetch("/api/locations"),
        fetch("/api/tags"),
      ]);
      if (catRes.ok) setCategories(await catRes.json());
      if (locRes.ok) setLocations(await locRes.json());
      if (tagRes.ok) setTags(await tagRes.json());
    };
    fetchOptions();
  }, [status, router]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (images.length + files.length > 5) {
      alert("Max 5 images allowed");
      return;
    }

    setUploading(true);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.url) {
          setImages(prev => [...prev, data.url]);
        }
      } catch (err) {
        console.error("Upload error", err);
      }
    }
    setUploading(false);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId) {
      alert("Please select a category");
      return;
    }
    setSubmitting(true);

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          tags: formData.selectedTags,
          images,
        }),
      });

      if (res.ok) {
        router.push("/my/posts");
      } else {
        alert("Failed to publish post");
      }
    } catch (err) {
      alert("An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "loading") return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4 md:py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Publish New Information</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-sm">
        {/* Images */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Images (Max 5)</label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {images.map((url, i) => (
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden border">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {images.length < 5 && (
              <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                <Upload className="w-6 h-6 text-gray-400" />
                <span className="text-[10px] text-gray-400 mt-1">Upload</span>
                <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageUpload} disabled={uploading} />
              </label>
            )}
          </div>
          {uploading && <div className="flex items-center text-xs text-green-600 mt-2"><Loader2 className="w-3 h-3 animate-spin mr-1" /> Uploading...</div>}
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
          <input
            type="text"
            required
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-500 outline-none"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Delicious Nasi Lemak in KL"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
            <select
              required
              className="w-full border rounded-lg p-2 outline-none"
              value={formData.categoryId}
              onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
            >
              <option value="">Select Category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Location</label>
            <select
              className="w-full border rounded-lg p-2 outline-none"
              value={formData.locationId}
              onChange={e => setFormData({ ...formData, locationId: e.target.value })}
            >
              <option value="">Select Location</option>
              {locations.map(l => <option key={l.id} value={l.id}>{l.city} ({l.state})</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
          <textarea
            required
            rows={5}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-500 outline-none"
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Contact</label>
            <input
              type="text"
              required
              className="w-full border rounded-lg p-2 outline-none"
              value={formData.contact}
              onChange={e => setFormData({ ...formData, contact: e.target.value })}
              placeholder="Phone number"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Price Range</label>
            <input
              type="text"
              className="w-full border rounded-lg p-2 outline-none"
              value={formData.priceRange}
              onChange={e => setFormData({ ...formData, priceRange: e.target.value })}
              placeholder="e.g. RM10 - RM50"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting || uploading}
          className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition disabled:bg-gray-300"
        >
          {submitting ? "Publishing..." : "Publish Now"}
        </button>
      </form>
    </div>
  );
}
