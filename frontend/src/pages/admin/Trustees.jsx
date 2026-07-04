import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getAllTrustees, createTrustee, updateTrustee, deleteTrustee } from "../../api/trustees";
import FormModal from "../../components/admin/FormModal";
import DeleteConfirmDialog from "../../components/admin/DeleteConfirmDialog";
import StatusBadge from "../../components/admin/StatusBadge";
import ImageUpload from "../../components/admin/ImageUpload";

const emptyForm = {
  name: "", designation: "", bio: "",
  image_url: "", is_active: true, sort_order: 0,
};

export default function AdminTrustees() {
  const [trustees, setTrustees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleting, setDeleting] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    getAllTrustees()
      .then((res) => setTrustees(res.data))
      .catch(() => toast.error("Failed to load trustees"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setForm(emptyForm);
    setEditing("new");
  };

  const openEdit = (t) => {
    setForm({
      name: t.name,
      designation: t.designation,
      bio: t.bio || "",
      image_url: t.image_url || "",
      is_active: t.is_active,
      sort_order: t.sort_order,
    });
    setEditing(t.id);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        ...form,
        image_url: form.image_url || null,
        bio: form.bio || null,
      };
      if (editing === "new") {
        await createTrustee(data);
        toast.success("Trustee added");
      } else {
        await updateTrustee(editing, data);
        toast.success("Trustee updated");
      }
      setEditing(null);
      load();
    } catch (err) {
      const detail = err.response?.data?.detail;
      toast.error(detail || "Failed to save trustee");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTrustee(deleting);
      toast.success("Trustee deleted");
      setDeleting(null);
      load();
    } catch {
      toast.error("Failed to delete trustee");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Board of Trustees</h1>
        <button
          onClick={openNew}
          className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition"
        >
          + Add Trustee
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Trustee</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Designation</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Order</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {trustees.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {t.image_url ? (
                        <img src={t.image_url} alt="" className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                          {t.name.charAt(0)}
                        </div>
                      )}
                      <span className="font-medium text-gray-800">{t.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{t.designation}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={t.is_active ? "active" : "inactive"} />
                  </td>
                  <td className="px-4 py-3 text-gray-600">{t.sort_order}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => openEdit(t)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleting(t.id)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {trustees.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    No trustees yet. Click "Add Trustee" to add one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <FormModal
          title={editing === "new" ? "Add Trustee" : "Edit Trustee"}
          onClose={() => setEditing(null)}
        >
          <form onSubmit={handleSave} className="space-y-4">
            <ImageUpload
              bucket="advisor-images"
              currentUrl={form.image_url}
              onUpload={(url) => setForm({ ...form, image_url: url })}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
              <input
                type="text"
                value={form.designation}
                onChange={(e) => setForm({ ...form, designation: e.target.value })}
                required
                placeholder="e.g., Chairman, Secretary, Treasurer"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio / Profile</label>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                rows={4}
                placeholder="Short biography or profile description"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium text-gray-700">Active</span>
                </label>
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={() => setEditing(null)}
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
          message="Are you sure you want to delete this trustee?"
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}
