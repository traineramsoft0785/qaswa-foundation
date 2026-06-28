import { useState, useEffect } from "react";
import { getActiveAdvisors } from "../../api/advisors";

export default function BoardAdvisors() {
  const [advisors, setAdvisors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActiveAdvisors()
      .then((res) => setAdvisors(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-blue-700">Board of Advisors</h1>
        <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
          Meet the distinguished members of our advisory board who guide The Qaswa Foundation
          with their expertise and vision.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700"></div>
        </div>
      ) : advisors.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {advisors.map((advisor) => (
            <div
              key={advisor.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-center pt-8">
                {advisor.image_url ? (
                  <img
                    src={advisor.image_url}
                    alt={advisor.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-4xl font-bold">
                    {advisor.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-gray-800">{advisor.name}</h3>
                <p className="text-blue-600 font-medium mt-1">{advisor.designation}</p>
                {advisor.bio && (
                  <p className="mt-3 text-gray-600 text-sm leading-relaxed">{advisor.bio}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          Advisory board information coming soon.
        </div>
      )}
    </div>
  );
}
