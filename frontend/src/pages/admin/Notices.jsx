import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getAllNotices, createNotice, updateNotice, deleteNotice } from "../../api/notices";
import FormModal from "../../components/admin/FormModal";
import DeleteConfirmDialog from "../../components/admin/DeleteConfirmDialog";
import StatusBadge from "../../components/admin/StatusBadge";

const emptyForm = { title: "", content: "", url: "", is_pinned: false, is_active: true, is_quiz: false };

export default function AdminNotices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleting, setDeleting] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    getAllNotices()
      .then((res) => setNotices(res.data))
      .catch(() => toast.error("Failed to load notices"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setForm(emptyForm);
    setEditing("new");
  };

  const openEdit = (n) => {
    setForm({
      title: n.title,
      content: n.content,
      url: n.url || "",
      is_pinned: n.is_pinned,
      is_active: n.is_active,
      is_quiz: n.is_quiz,
    });
    setEditing(n.id);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form };
    if (!payload.url) {
      delete payload.url;
    }
    try {
      if (editing === "new") {
        await createNotice(payload);
        toast.success("Notice created");
      } else {
        await updateNotice(editing, payload);
        toast.success("Notice updated");
      }
      setEditing(null);
      load();
    } catch {
      toast.error("Failed to save notice");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteNotice(deleting);
      toast.success("Notice deleted");
      setDeleting(null);
      load();
    } catch {
      toast.error("Failed to delete notice");
    }
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Notices</h1>
        <button
          onClick={openNew}
          className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition"
        >
          + Add Notice
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
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Title</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Date</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {notices.map((n) => (
                <tr key={n.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className="font-medium text-gray-800">{n.title}</span>
                    {n.is_pinned && (
                      <StatusBadge status="pinned" />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={n.is_active ? "active" : "inactive"} />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{formatDate(n.created_at)}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button onClick={() => openEdit(n)} className="text-blue-600 hover:underline text-sm">Edit</button>
                    <button onClick={() => setDeleting(n.id)} className="text-red-600 hover:underline text-sm">Delete</button>
                  </td>
                </tr>
              ))}
              {notices.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    No notices yet. Click "Add Notice" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <FormModal
          title={editing === "new" ? "Add Notice" : "Edit Notice"}
          onClose={() => setEditing(null)}
        >
          <form onSubmit={handleSave} className="space-y-4">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
              <textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                required
                rows={6}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Link URL</label>
              <input
                type="url"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder="https://example.com"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.is_pinned}
                  onChange={(e) => setForm({ ...form, is_pinned: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium text-gray-700">Pinned</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium text-gray-700">Active</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.is_quiz}
                  onChange={(e) => setForm({ ...form, is_quiz: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium text-gray-700">Quiz Announcement</span>
              </label>
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50">Cancel</button>
              <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50">
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </FormModal>
      )}

      {deleting && (
        <DeleteConfirmDialog
          message="Are you sure you want to delete this notice?"
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}
