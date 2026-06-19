import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getGallery, createGalleryItem, deleteGalleryItem } from "../../api/gallery";
import FormModal from "../../components/admin/FormModal";
import DeleteConfirmDialog from "../../components/admin/DeleteConfirmDialog";
import ImageUpload from "../../components/admin/ImageUpload";

export default function AdminGallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", image_url: "", category: "" });
  const [deleting, setDeleting] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    getGallery()
      .then((res) => setItems(res.data))
      .catch(() => toast.error("Failed to load gallery"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.image_url) {
      toast.error("Please upload an image");
      return;
    }
    setSaving(true);
    try {
      await createGalleryItem({
        ...form,
        category: form.category || null,
      });
      toast.success("Photo added to gallery");
      setShowForm(false);
      setForm({ title: "", image_url: "", category: "" });
      load();
    } catch {
      toast.error("Failed to add photo");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteGalleryItem(deleting);
      toast.success("Photo deleted");
      setDeleting(null);
      load();
    } catch {
      toast.error("Failed to delete photo");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gallery</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition"
        >
          + Add Photo
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700"></div>
        </div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden group relative">
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-3">
                <p className="font-medium text-sm text-gray-800 truncate">{item.title}</p>
                {item.category && (
                  <span className="text-xs text-gray-500">{item.category}</span>
                )}
              </div>
              <button
                onClick={() => setDeleting(item.id)}
                className="absolute top-2 right-2 bg-red-600 text-white w-7 h-7 rounded-full text-sm opacity-0 group-hover:opacity-100 transition"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow">
          No photos yet. Click "Add Photo" to upload one.
        </div>
      )}

      {/* Add Photo Modal */}
      {showForm && (
        <FormModal title="Add Photo" onClose={() => setShowForm(false)}>
          <form onSubmit={handleSave} className="space-y-4">
            <ImageUpload
              bucket="gallery-images"
              currentUrl={form.image_url}
              onUpload={(url) => setForm({ ...form, image_url: url })}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input
                type="text"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="e.g., Events, Classes, Ceremonies"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </FormModal>
      )}

      {deleting && (
        <DeleteConfirmDialog
          message="Are you sure you want to delete this photo?"
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}
