import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getActiveQuizAnnouncement } from "../../api/notices";
import { submitQuizRegistration } from "../../api/quiz";

export default function QuizRegistration() {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    school: "",
    class_name: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getActiveQuizAnnouncement()
      .then((res) => setQuiz(res.data))
      .catch(() => setQuiz(null))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitQuizRegistration(form);
      toast.success("Quiz registration submitted successfully.");
      setForm({ name: "", email: "", phone: "", school: "", class_name: "" });
    } catch (error) {
      const message = error?.response?.data?.detail || "Failed to submit registration.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-20">
        <div className="max-w-2xl text-center bg-white rounded-xl shadow-lg p-10">
          <h1 className="text-3xl font-bold text-gray-800">No Quiz Announcement</h1>
          <p className="mt-4 text-gray-600">
            There is no quiz announced right now. Please check back later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="bg-blue-700 px-8 py-10 text-white">
            <h1 className="text-3xl font-bold">Quiz Registration</h1>
            <p className="mt-3 text-blue-100 leading-7">
              {quiz.title}
            </p>
          </div>
          <div className="p-8">
            <div className="rounded-2xl bg-blue-50 p-6 mb-8">
              <h2 className="text-xl font-semibold text-blue-800">Announcement</h2>
              <p className="mt-3 text-gray-700">{quiz.content}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="mt-2 w-full rounded-2xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="mt-2 w-full rounded-2xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    className="mt-2 w-full rounded-2xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">School</label>
                  <input
                    type="text"
                    name="school"
                    value={form.school}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-2xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Class</label>
                <select
                  name="class_name"
                  value={form.class_name}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Class</option>
                  <option value="Nursery">Nursery</option>
                  <option value="LKG">LKG</option>
                  <option value="UKG">UKG</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10</option>
                  <option value="11">11</option>
                  <option value="12">12</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-2xl bg-blue-700 px-6 py-3 text-white font-semibold hover:bg-blue-800 transition disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Register for Quiz"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
