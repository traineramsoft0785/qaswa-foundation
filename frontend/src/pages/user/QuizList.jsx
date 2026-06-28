import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useUserAuth } from "../../contexts/UserAuthContext";
import {
  getActiveQuizzes,
  enrollInQuiz,
  getMyEnrollments,
  downloadAdmitCard,
} from "../../api/quizzes";
import {
  HiOutlineCalendar,
  HiOutlineLocationMarker,
  HiOutlineClock,
  HiOutlineDownload,
  HiOutlineCheckCircle,
} from "react-icons/hi";

export default function QuizList() {
  const { user } = useUserAuth();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(null);
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const quizRes = await getActiveQuizzes();
        setQuizzes(quizRes.data);
        if (user) {
          const enrollRes = await getMyEnrollments();
          setEnrollments(enrollRes.data);
        }
      } catch {
        toast.error("Failed to load quizzes");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const getEnrollment = (quizId) =>
    enrollments.find((e) => e.quiz_id === quizId);

  const handleEnroll = async (quizId) => {
    if (!user) {
      navigate("/user/login");
      return;
    }
    setEnrolling(quizId);
    try {
      const res = await enrollInQuiz(quizId);
      const quiz = quizzes.find((q) => q.id === quizId);
      setEnrollments([...enrollments, { ...res.data, quiz }]);
      toast.success(`Enrolled! Roll Number: ${res.data.roll_number}`);
    } catch (error) {
      const message =
        error?.response?.data?.detail || "Failed to enroll";
      toast.error(message);
    } finally {
      setEnrolling(null);
    }
  };

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
    } catch {
      toast.error("Failed to download admit card");
    } finally {
      setDownloading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-green-700 px-4 py-8 text-white">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-3xl font-bold">Quizzes</h1>
          <p className="mt-2 text-green-100">
            Browse and enroll in upcoming quizzes
          </p>
        </div>
      </div>

      <div className="px-4 py-8">
        <div className="mx-auto max-w-5xl">
          {quizzes.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-700">
                No Quizzes Available
              </h2>
              <p className="mt-2 text-gray-500">
                Check back later for upcoming quizzes.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {quizzes.map((quiz) => {
                const enrollment = getEnrollment(quiz.id);
                const isEnrolled = !!enrollment;

                return (
                  <div
                    key={quiz.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-800">
                        {quiz.title}
                      </h3>
                      {quiz.description && (
                        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                          {quiz.description}
                        </p>
                      )}

                      <div className="mt-4 space-y-2 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <HiOutlineCalendar className="w-4 h-4" />
                          <span>{quiz.exam_date}</span>
                          {quiz.exam_time && <span>at {quiz.exam_time}</span>}
                        </div>
                        {quiz.venue && (
                          <div className="flex items-center gap-2">
                            <HiOutlineLocationMarker className="w-4 h-4" />
                            <span>{quiz.venue}</span>
                          </div>
                        )}
                        {quiz.duration_minutes && (
                          <div className="flex items-center gap-2">
                            <HiOutlineClock className="w-4 h-4" />
                            <span>{quiz.duration_minutes} minutes</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="border-t px-6 py-4 bg-gray-50">
                      {isEnrolled ? (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-green-700">
                            <HiOutlineCheckCircle className="w-5 h-5" />
                            <span className="text-sm font-medium">
                              Enrolled &mdash; {enrollment.roll_number}
                            </span>
                          </div>
                          <button
                            onClick={() =>
                              handleDownload(
                                enrollment.id,
                                enrollment.roll_number
                              )
                            }
                            disabled={downloading === enrollment.id}
                            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
                          >
                            <HiOutlineDownload className="w-4 h-4" />
                            {downloading === enrollment.id
                              ? "Downloading..."
                              : "Admit Card"}
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEnroll(quiz.id)}
                          disabled={enrolling === quiz.id}
                          className="w-full bg-green-700 text-white py-2 rounded-lg text-sm font-semibold hover:bg-green-800 transition disabled:opacity-50"
                        >
                          {enrolling === quiz.id
                            ? "Enrolling..."
                            : user
                            ? "Enroll Now"
                            : "Login to Enroll"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
