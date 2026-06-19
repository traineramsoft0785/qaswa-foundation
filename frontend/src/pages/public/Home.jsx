import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getActivePrograms } from "../../api/programs";
import { getActiveNotices } from "../../api/notices";

export default function Home() {
  const [programs, setPrograms] = useState([]);
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    getActivePrograms()
      .then((res) => setPrograms(res.data.slice(0, 3)))
      .catch(() => {});
    getActiveNotices()
      .then((res) => setNotices(res.data.slice(0, 3)))
      .catch(() => {});
  }, []);

  return (
    <div>
      {/* Latest notice banner */}
      {notices[0] && (
        <section className="bg-blue-700 text-white overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="font-semibold uppercase tracking-[0.2em] text-sm">
                Latest Notice
              </span>
              <div className="flex-1 overflow-hidden">
                <a
                  href={notices[0].url || "#"}
                  target={notices[0].url ? "_blank" : undefined}
                  rel={notices[0].url ? "noreferrer" : undefined}
                  className="inline-block whitespace-nowrap"
                  style={{ animation: "marquee 18s linear infinite" }}
                >
                  {`${notices[0].title}: ${notices[0].content}`}
                </a>
              </div>
            </div>
          </div>
          <style>{`
            @keyframes marquee {
              0% { transform: translateX(100%); }
              100% { transform: translateX(-100%); }
            }
          `}</style>
        </section>
      )}

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 to-blue-900 text-white text-center py-20 px-4">
        <h1 className="text-4xl md:text-5xl font-bold">The Qaswa Foundation</h1>
        <p className="mt-2 text-lg italic text-blue-200">
          التعليم للجميع (Education for All)
        </p>
        <p className="mt-4 max-w-xl mx-auto text-blue-100">
          A charitable trust in Laxmipur, Raxaul working to provide education,
          skills, and opportunities to underprivileged children.
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          <Link
            to="/contact"
            className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
          >
            Donate Now
          </Link>
          <Link
            to="/about"
            className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-16 px-4 text-center max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-blue-700">Who We Are</h2>
        <p className="mt-4 text-gray-600 text-lg">
          We believe education is the most powerful tool to transform lives. Our
          mission is to bring equal opportunities to every child regardless of
          their background or circumstances.
        </p>
      </section>

      {/* Programs */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-blue-700 text-center mb-8">
            Our Programs
          </h2>
          {programs.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
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
                    <h3 className="font-bold text-lg text-gray-800">
                      {p.title}
                    </h3>
                    <p className="text-gray-600 mt-2 line-clamp-2">
                      {p.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white shadow-md p-5 rounded-lg">
                <h3 className="font-bold text-lg">Free Education</h3>
                <p className="text-gray-600 mt-2">
                  Support and coaching for school students.
                </p>
              </div>
              <div className="bg-white shadow-md p-5 rounded-lg">
                <h3 className="font-bold text-lg">Scholarships</h3>
                <p className="text-gray-600 mt-2">
                  Helping deserving students continue education.
                </p>
              </div>
              <div className="bg-white shadow-md p-5 rounded-lg">
                <h3 className="font-bold text-lg">Digital Skills</h3>
                <p className="text-gray-600 mt-2">
                  Preparing youth for modern careers.
                </p>
              </div>
            </div>
          )}
          <div className="text-center mt-8">
            <Link
              to="/programs"
              className="text-blue-700 font-semibold hover:underline"
            >
              View All Programs →
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Notices */}
      {notices.length > 0 && (
        <section className="py-16 px-4 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-blue-700 text-center mb-8">
            Latest Notices
          </h2>
          <div className="space-y-4">
            {notices.map((n) => (
              <div
                key={n.id}
                className="bg-white shadow p-4 rounded-lg border-l-4 border-blue-700"
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-gray-800">{n.title}</h3>
                  {n.is_pinned && (
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                      Pinned
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mt-1 text-sm line-clamp-2">
                  {n.content}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link
              to="/notices"
              className="text-blue-700 font-semibold hover:underline"
            >
              View All Notices →
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
