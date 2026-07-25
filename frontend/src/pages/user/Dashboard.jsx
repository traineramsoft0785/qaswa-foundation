import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useUserAuth } from "../../contexts/UserAuthContext";
import { getMyEnrollments, downloadAdmitCard } from "../../api/quizzes";
import {
  HiOutlineAcademicCap,
  HiOutlineDownload,
  HiOutlineUser,
} from "react-icons/hi";

export default function UserDashboard() {
  const { user } = useUserAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    getMyEnrollments()
      .then((res) => setEnrollments(res.data))
      .catch(() => toast.error("Failed to load enrollments"))
      .finally(() => setLoading(false));
  }, []);

  const handleDownload = async (enrollmentId, rollNumber) => {
    setDownloading(enrollmentId);
    try {
      const response = await downloadAdmitCard(enrollmentId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `admit-card-${rollNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Admit card downloaded!");
    } catch {
      toast.error("Failed to download admit card");
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full">
                <HiOutlineUser className="w-8 h-8 text-green-700" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  {user?.name}
                </h1>
                <p className="text-sm text-gray-500">
                  {user?.email || user?.login_mobile || user?.phone}
                </p>
                {user?.school && (
                  <p className="text-sm text-gray-400">
                    {user.school}
                    {user.class_name ? ` | Class ${user.class_name}` : ""}
                  </p>
                )}
              </div>
            </div>
            <Link
              to="/user/profile"
              className="text-sm text-green-700 hover:underline"
            >
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Enrollments */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <HiOutlineAcademicCap className="w-5 h-5" />
              My Quiz Enrollments
            </h2>
            <Link
              to="/quizzes"
              className="text-sm bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition"
            >
              Browse Quizzes
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
            </div>
          ) : enrollments.length === 0 ? (
            <div className="text-center py-12">
              <HiOutlineAcademicCap className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">
                You haven&apos;t enrolled in any quizzes yet.
              </p>
              <Link
                to="/quizzes"
                className="text-green-700 hover:underline text-sm mt-2 inline-block"
              >
                Browse available quizzes
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {enrollments.map((enrollment) => (
                <div
                  key={enrollment.id}
                  className="border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                >
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {enrollment.quiz?.title || "Quiz"}
                    </h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-gray-500">
                      <span>
                        Roll Number:{" "}
                        <span className="font-medium text-gray-700">
                          {enrollment.roll_number}
                        </span>
                      </span>
                      {enrollment.quiz?.exam_date && (
                        <span>
                          Date:{" "}
                          <span className="font-medium text-gray-700">
                            {enrollment.quiz.exam_date}
                          </span>
                        </span>
                      )}
                      {enrollment.quiz?.venue && (
                        <span>Venue: {enrollment.quiz.venue}</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      handleDownload(enrollment.id, enrollment.roll_number)
                    }
                    disabled={downloading === enrollment.id}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50 shrink-0"
                  >
                    <HiOutlineDownload className="w-4 h-4" />
                    {downloading === enrollment.id
                      ? "Downloading..."
                      : "Admit Card"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
