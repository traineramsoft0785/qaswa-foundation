import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  getAllQuizzes,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  getQuizEnrollments,
  downloadEnrollmentAdmitCard,
} from "../../api/adminQuizzes";
import FormModal from "../../components/admin/FormModal";
import DeleteConfirmDialog from "../../components/admin/DeleteConfirmDialog";
import StatusBadge from "../../components/admin/StatusBadge";

const emptyForm = {
  title: "",
  description: "",
  exam_date: "",
  exam_time: "",
  venue: "",
  duration_minutes: "",
  is_active: true,
};

export default function AdminQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleting, setDeleting] = useState(null);
  const [saving, setSaving] = useState(false);
  const [viewingEnrollments, setViewingEnrollments] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [enrollmentsLoading, setEnrollmentsLoading] = useState(false);
  const [downloadingAdmitCard, setDownloadingAdmitCard] = useState(null);

  const load = () => {
    setLoading(true);
    getAllQuizzes()
      .then((res) => setQuizzes(res.data))
      .catch(() => toast.error("Failed to load quizzes"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setForm(emptyForm);
    setEditing("new");
  };

  const openEdit = (q) => {
    setForm({
      title: q.title,
      description: q.description || "",
      exam_date: q.exam_date || "",
      exam_time: q.exam_time || "",
      venue: q.venue || "",
      duration_minutes: q.duration_minutes || "",
      is_active: q.is_active,
    });
    setEditing(q.id);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form };
    if (payload.duration_minutes) {
      payload.duration_minutes = Number(payload.duration_minutes);
    } else {
      delete payload.duration_minutes;
    }
    if (!payload.description) delete payload.description;
    if (!payload.exam_time) delete payload.exam_time;
    if (!payload.venue) delete payload.venue;
    try {
      if (editing === "new") {
        await createQuiz(payload);
        toast.success("Quiz created");
      } else {
        await updateQuiz(editing, payload);
        toast.success("Quiz updated");
      }
      setEditing(null);
      load();
    } catch {
      toast.error("Failed to save quiz");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteQuiz(deleting);
      toast.success("Quiz deleted");
      setDeleting(null);
      load();
    } catch {
      toast.error("Failed to delete quiz");
    }
  };

  const viewEnrollments = async (quiz) => {
    setViewingEnrollments(quiz);
    setEnrollmentsLoading(true);
    try {
      const res = await getQuizEnrollments(quiz.id);
      setEnrollments(res.data);
    } catch {
      toast.error("Failed to load enrollments");
    } finally {
      setEnrollmentsLoading(false);
    }
  };

  const handleDownloadAdmitCard = async (enrollment) => {
    setDownloadingAdmitCard(enrollment.id);
    try {
      const res = await downloadEnrollmentAdmitCard(
        viewingEnrollments.id,
        enrollment.id
      );
      const url = URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = `admit-card-${enrollment.roll_number}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Failed to download admit card");
    } finally {
      setDownloadingAdmitCard(null);
    }
  };

  const downloadEnrollmentsCSV = () => {
    const headers = ["Roll No.", "Name", "Email", "Phone", "School", "Class"];
    const rows = enrollments.map((e) => [
      e.roll_number,
      e.user_name,
      e.user_email,
      e.user_phone,
      e.user_school,
      e.user_class,
    ]);
    const escape = (val) => `"${String(val ?? "").replace(/"/g, '""')}"`;
    const csv = [headers, ...rows]
      .map((row) => row.map(escape).join(","))
      .join("\r\n");

    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${viewingEnrollments.title.replace(/[^a-z0-9]+/gi, "_")}_enrollments.csv`;
    link.click();
    URL.revokeObjectURL(url);
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
        <h1 className="text-2xl font-bold text-gray-800">Quizzes</h1>
        <button
          onClick={openNew}
          className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition"
        >
          + Add Quiz
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
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">
                  Title
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">
                  Exam Date
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">
                  Enrollments
                </th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {quizzes.map((q) => (
                <tr key={q.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className="font-medium text-gray-800">{q.title}</span>
                    {q.venue && (
                      <span className="block text-xs text-gray-400">
                        {q.venue}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {formatDate(q.exam_date)}
                    {q.exam_time && (
                      <span className="block text-xs text-gray-400">
                        {q.exam_time}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      status={q.is_active ? "active" : "inactive"}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => viewEnrollments(q)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      {q.enrollment_count || 0} enrolled
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => openEdit(q)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleting(q.id)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {quizzes.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No quizzes yet. Click &quot;Add Quiz&quot; to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Quiz Form Modal */}
      {editing && (
        <FormModal
          title={editing === "new" ? "Add Quiz" : "Edit Quiz"}
          onClose={() => setEditing(null)}
        >
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={3}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Exam Date *
                </label>
                <input
                  type="date"
                  value={form.exam_date}
                  onChange={(e) =>
                    setForm({ ...form, exam_date: e.target.value })
                  }
                  required
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Exam Time
                </label>
                <input
                  type="time"
                  value={form.exam_time}
                  onChange={(e) =>
                    setForm({ ...form, exam_time: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Venue
                </label>
                <input
                  type="text"
                  value={form.venue}
                  onChange={(e) => setForm({ ...form, venue: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={form.duration_minutes}
                  onChange={(e) =>
                    setForm({ ...form, duration_minutes: e.target.value })
                  }
                  min={1}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) =>
                  setForm({ ...form, is_active: e.target.checked })
                }
                className="w-4 h-4"
              />
              <span className="text-sm font-medium text-gray-700">Active</span>
            </label>
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

      {/* Enrollments View Modal */}
      {viewingEnrollments && (
        <FormModal
          title={`Enrollments — ${viewingEnrollments.title}`}
          onClose={() => setViewingEnrollments(null)}
          size="4xl"
        >
          {enrollmentsLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
            </div>
          ) : enrollments.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No enrollments yet.
            </p>
          ) : (
            <div className="max-h-[65vh] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="text-left px-3 py-2 font-medium text-gray-500">
                      Roll No.
                    </th>
                    <th className="text-left px-3 py-2 font-medium text-gray-500">
                      Name
                    </th>
                    <th className="text-left px-3 py-2 font-medium text-gray-500">
                      Email
                    </th>
                    <th className="text-left px-3 py-2 font-medium text-gray-500">
                      Phone
                    </th>
                    <th className="text-left px-3 py-2 font-medium text-gray-500">
                      School
                    </th>
                    <th className="text-left px-3 py-2 font-medium text-gray-500">
                      Class
                    </th>
                    <th className="text-left px-3 py-2 font-medium text-gray-500">
                      Admit Card
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {enrollments.map((e) => (
                    <tr key={e.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 font-medium">
                        {e.roll_number}
                      </td>
                      <td className="px-3 py-2">{e.user_name || "—"}</td>
                      <td className="px-3 py-2">{e.user_email || "—"}</td>
                      <td className="px-3 py-2">{e.user_phone || "—"}</td>
                      <td className="px-3 py-2">{e.user_school || "—"}</td>
                      <td className="px-3 py-2">{e.user_class || "—"}</td>
                      <td className="px-3 py-2">
                        <button
                          onClick={() => handleDownloadAdmitCard(e)}
                          disabled={downloadingAdmitCard === e.id}
                          className="text-blue-600 hover:underline disabled:opacity-50"
                        >
                          {downloadingAdmitCard === e.id
                            ? "Downloading..."
                            : "Download"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="flex justify-end gap-2 pt-4">
            {enrollments.length > 0 && (
              <button
                onClick={downloadEnrollmentsCSV}
                className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
              >
                Download CSV
              </button>
            )}
            <button
              onClick={() => setViewingEnrollments(null)}
              className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </FormModal>
      )}

      {/* Delete Confirm */}
      {deleting && (
        <DeleteConfirmDialog
          message="Are you sure you want to delete this quiz? All enrollments will also be deleted."
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}
