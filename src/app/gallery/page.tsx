"use client";

import { useState, useEffect } from "react";
import MediaCard from "@/components/MediaCard";

export default function GalleryPage() {
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit States
  const [editingItem, setEditingItem] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Fetch media on mount
  useEffect(() => {
    async function fetchMedia() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
        const response = await fetch(`${baseUrl}/api/media`, { cache: "no-store" });
        if (response.ok) {
          const data = await response.json();
          setMediaItems(data);
        }
      } catch (error) {
        console.error("Failed to fetch media:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMedia();
  }, []);

  // --- DELETE LOGIC ---
  const handleDelete = async (id: string, fileName: string) => {
    const confirmDelete = confirm("Delete this media?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `/api/media/${id}?fileName=${fileName}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Delete failed");

      setMediaItems((prev) => prev.filter((item) => item.id !== id));
      alert("Media deleted successfully");
    } catch (error) {
      console.error(error);
      alert("Error deleting media");
    }
  };

  // --- EDIT & UPDATE LOGIC ---
  const handleEdit = (item: any) => {
    setEditingItem(item);
    setTitle(item.title || item.fileName || "");
    setDescription(item.description || "");
  };

  const handleUpdate = async () => {
    if (!editingItem) return;

    try {
      const response = await fetch(
        `/api/media/${editingItem.id}/update`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, description }),
        }
      );

      if (!response.ok) throw new Error("Update failed");

      const data = await response.json();

      setMediaItems((prev) =>
        prev.map((item) => (item.id === editingItem.id ? data.media : item))
      );

      alert("Media updated successfully");
      setEditingItem(null);
    } catch (error) {
      console.error(error);
      alert("Error updating media");
    }
  };

  if (loading) return <div className="text-center py-20">Loading Gallery...</div>;

  return (
    <section className="py-5 bg-light min-vh-100">
      <div className="container">
        <div className="text-center mb-5">
          <h1 className="fw-bold">Media Gallery</h1>
          <p className="text-muted">Browse and manage uploaded multimedia content</p>
        </div>

        {/* Edit Form Section */}
        {editingItem && (
          <div className="card p-4 mb-4 shadow-sm border-warning">
            <h3 className="mb-3">Edit Media</h3>
            <div className="mb-3">
              <label className="form-label text-sm font-bold">Title</label>
              <input
                className="form-control"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label text-sm font-bold">Description</label>
              <textarea
                className="form-control"
                placeholder="Description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button className="btn btn-success" onClick={handleUpdate}>
                Save Changes
              </button>
              <button className="btn btn-secondary" onClick={() => setEditingItem(null)}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {mediaItems.length === 0 && (
          <div className="alert alert-info text-center">No media uploaded yet.</div>
        )}

        <div className="row g-4">
          {mediaItems.map((media: any) => (
            <div key={media.id} className="col-md-6 col-lg-4 flex flex-col">
              <MediaCard
                title={media.title || media.fileName}
                type={media.mediaType}
                url={media.blobUrl}
              />
              
              <div className="flex gap-2">
                <button
                  className="btn btn-warning mt-2 flex-grow-1"
                  onClick={() => handleEdit(media)}
                >
                  Edit
                </button>
                
                <button
                  onClick={() => handleDelete(media.id, media.fileName)}
                  className="mt-2 flex-grow-1 cursor-pointer rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-800 active:scale-95"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}