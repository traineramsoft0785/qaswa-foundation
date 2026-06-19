import { useState, useEffect } from "react";
import { getActiveNotices } from "../../api/notices";

export default function Notices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActiveNotices()
      .then((res) => setNotices(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-blue-700">Notices</h1>
      <p className="mt-2 text-gray-600">
        Stay updated with the latest announcements and notices.
      </p>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700"></div>
        </div>
      ) : notices.length > 0 ? (
        <div className="space-y-4 mt-8">
          {notices.map((n) => (
            <div
              key={n.id}
              className={`bg-white shadow p-5 rounded-lg border-l-4 ${
                n.is_pinned ? "border-yellow-500" : "border-blue-700"
              }`}
            >
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg text-gray-800">{n.title}</h3>
                <div className="flex items-center gap-2">
                  {n.is_pinned && (
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                      Pinned
                    </span>
                  )}
                  <span className="text-xs text-gray-400">
                    {formatDate(n.created_at)}
                  </span>
                </div>
              </div>
              <p className="text-gray-600 mt-2 whitespace-pre-line">
                {n.content}
              </p>
              {n.url && (
                <a
                  href={n.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-block text-blue-700 font-medium hover:text-blue-900"
                >
                  Read more
                </a>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p>No notices at the moment. Check back later!</p>
        </div>
      )}
    </div>
  );
}
