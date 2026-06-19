import { useState, useEffect } from "react";
import { getGallery, getCategories } from "../../api/gallery";

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    getCategories().then((res) => setCategories(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    getGallery(activeCategory)
      .then((res) => setItems(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [activeCategory]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-blue-700">Gallery</h1>
      <p className="mt-2 text-gray-600">
        Moments from our events, programs, and community activities.
      </p>

      {/* Category filter */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-6">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              !activeCategory
                ? "bg-blue-700 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                activeCategory === cat
                  ? "bg-blue-700 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700"></div>
        </div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
          {items.map((item) => (
            <div
              key={item.id}
              className="cursor-pointer group relative overflow-hidden rounded-lg shadow hover:shadow-lg transition"
              onClick={() => setLightbox(item)}
            >
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-end">
                <p className="text-white p-3 font-medium opacity-0 group-hover:opacity-100 transition">
                  {item.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p>Gallery photos will appear here soon!</p>
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={lightbox.image_url}
              alt={lightbox.title}
              className="w-full max-h-[80vh] object-contain rounded"
            />
            <p className="text-white text-center mt-3 text-lg">
              {lightbox.title}
            </p>
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
