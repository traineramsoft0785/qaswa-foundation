import { useState, useEffect } from "react";
import { getActivePrograms } from "../../api/programs";

export default function Programs() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActivePrograms()
      .then((res) => setPrograms(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-blue-700">Our Programs</h1>
      <p className="mt-2 text-gray-600">
        Explore the programs we offer to support education and skill development
        in our community.
      </p>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700"></div>
        </div>
      ) : programs.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {programs.map((p) => (
            <div
              key={p.id}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition"
            >
              {p.image_url && (
                <img
                  src={p.image_url}
                  alt={p.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-5">
                <h3 className="font-bold text-lg text-gray-800">{p.title}</h3>
                <p className="text-gray-600 mt-2">{p.description}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p>Programs will be listed here soon. Check back later!</p>
        </div>
      )}
    </div>
  );
}
