import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getQuizRegistrations } from "../../api/quiz";
import DeleteConfirmDialog from "../../components/admin/DeleteConfirmDialog";

export default function AdminQuizRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  const load = () => {
    setLoading(true);
    getQuizRegistrations()
      .then((res) => setRegistrations(res.data))
      .catch(() => toast.error("Failed to load registrations"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateOfBirth = (dateStr) => {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quiz Registrations</h1>
        <span className="text-sm text-gray-500">
          Total: <span className="font-semibold">{registrations.length}</span>
        </span>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700"></div>
        </div>
      ) : registrations.length > 0 ? (
        <div className="space-y-3">
          {registrations.map((reg) => (
            <div
              key={reg.id}
              className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow"
            >
              <div
                className="flex justify-between items-center px-4 py-3 cursor-pointer hover:bg-gray-50"
                onClick={() => setExpanded(expanded === reg.id ? null : reg.id)}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div>
                    <span className="font-medium text-gray-800">{reg.name}</span>
                    <span className="text-gray-400 mx-2">·</span>
                    <span className="text-sm text-gray-500">{reg.phone}</span>
                  </div>
                </div>
                <span className="text-xs text-gray-400">{formatDate(reg.created_at)}</span>
              </div>

              {expanded === reg.id && (
                <div className="px-4 pb-4 border-t bg-gray-50">
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-600 uppercase">
                        Name
                      </label>
                      <p className="text-gray-800">{reg.name}</p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 uppercase">
                        Phone
                      </label>
                      <p className="text-gray-800">{reg.phone}</p>
                    </div>
                    {reg.email && (
                      <div>
                        <label className="text-xs font-semibold text-gray-600 uppercase">
                          Email
                        </label>
                        <p className="text-gray-800 break-all">{reg.email}</p>
                      </div>
                    )}
                    {reg.school && (
                      <div>
                        <label className="text-xs font-semibold text-gray-600 uppercase">
                          School
                        </label>
                        <p className="text-gray-800">{reg.school}</p>
                      </div>
                    )}
                    {reg.class_name && (
                      <div>
                        <label className="text-xs font-semibold text-gray-600 uppercase">
                          Class
                        </label>
                        <p className="text-gray-800">{reg.class_name}</p>
                      </div>
                    )}
                    {reg.date_of_birth && (
                      <div>
                        <label className="text-xs font-semibold text-gray-600 uppercase">
                          Date of Birth
                        </label>
                        <p className="text-gray-800">{formatDateOfBirth(reg.date_of_birth)}</p>
                      </div>
                    )}
                    <div>
                      <label className="text-xs font-semibold text-gray-600 uppercase">
                        Registered
                      </label>
                      <p className="text-gray-800">{formatDate(reg.created_at)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">No quiz registrations yet</p>
        </div>
      )}
    </div>
  );
}
