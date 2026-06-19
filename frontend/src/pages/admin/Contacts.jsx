import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getContacts, markContactRead, deleteContact } from "../../api/contacts";
import StatusBadge from "../../components/admin/StatusBadge";
import DeleteConfirmDialog from "../../components/admin/DeleteConfirmDialog";

export default function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const load = () => {
    setLoading(true);
    getContacts(unreadOnly)
      .then((res) => setContacts(res.data))
      .catch(() => toast.error("Failed to load contacts"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [unreadOnly]);

  const handleMarkRead = async (id) => {
    try {
      await markContactRead(id);
      toast.success("Marked as read");
      load();
    } catch {
      toast.error("Failed to update");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteContact(deleting);
      toast.success("Contact deleted");
      setDeleting(null);
      load();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Contact Messages</h1>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={unreadOnly}
            onChange={(e) => setUnreadOnly(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm text-gray-600">Unread only</span>
        </label>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700"></div>
        </div>
      ) : contacts.length > 0 ? (
        <div className="space-y-3">
          {contacts.map((c) => (
            <div
              key={c.id}
              className={`bg-white rounded-lg shadow overflow-hidden ${
                !c.is_read ? "border-l-4 border-blue-600" : ""
              }`}
            >
              <div
                className="flex justify-between items-center px-4 py-3 cursor-pointer hover:bg-gray-50"
                onClick={() => setExpanded(expanded === c.id ? null : c.id)}
              >
                <div className="flex items-center gap-3">
                  <StatusBadge status={c.is_read ? "read" : "unread"} />
                  <div>
                    <span className="font-medium text-gray-800">{c.name}</span>
                    <span className="text-gray-400 mx-2">·</span>
                    <span className="text-sm text-gray-500">{c.email}</span>
                  </div>
                </div>
                <span className="text-xs text-gray-400">{formatDate(c.created_at)}</span>
              </div>

              {expanded === c.id && (
                <div className="px-4 pb-4 border-t bg-gray-50">
                  {c.subject && (
                    <p className="text-sm font-medium text-gray-700 mt-3">
                      Subject: {c.subject}
                    </p>
                  )}
                  {c.phone && (
                    <p className="text-sm text-gray-500 mt-1">Phone: {c.phone}</p>
                  )}
                  <p className="mt-3 text-gray-700 whitespace-pre-line">{c.message}</p>
                  <div className="flex gap-3 mt-4">
                    {!c.is_read && (
                      <button
                        onClick={() => handleMarkRead(c.id)}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Mark as Read
                      </button>
                    )}
                    <button
                      onClick={() => setDeleting(c.id)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow">
          No contact messages found.
        </div>
      )}

      {deleting && (
        <DeleteConfirmDialog
          message="Are you sure you want to delete this message?"
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}
