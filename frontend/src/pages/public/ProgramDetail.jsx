import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getProgramBySlug } from "../../api/programs";
import DOMPurify from "dompurify";

export default function ProgramDetail() {
  const { slug } = useParams();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getProgramBySlug(slug)
      .then((res) => setProgram(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Program Not Found</h1>
        <p className="mt-2 text-gray-600">
          The program you're looking for doesn't exist or has been removed.
        </p>
        <Link
          to="/programs"
          className="inline-block mt-6 text-blue-700 font-semibold hover:underline"
        >
          &larr; Back to Programs
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <nav className="mb-6 text-sm">
        <Link to="/programs" className="text-blue-700 hover:underline">
          Programs
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-600">{program.title}</span>
      </nav>

      {program.image_url && (
        <img
          src={program.image_url}
          alt={program.title}
          className="w-full h-64 md:h-80 object-cover rounded-lg mb-8"
        />
      )}

      <h1 className="text-3xl font-bold text-blue-700">{program.title}</h1>
      <p className="mt-3 text-gray-600 text-lg">{program.description}</p>

      {program.content && (
        <div
          className="mt-8 prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(program.content),
          }}
        />
      )}

      <div className="mt-12">
        <Link
          to="/programs"
          className="text-blue-700 font-semibold hover:underline"
        >
          &larr; Back to Programs
        </Link>
      </div>
    </div>
  );
}
