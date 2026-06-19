import { useState } from "react";
import toast from "react-hot-toast";
import { submitContact } from "../../api/contacts";
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from "react-icons/hi";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitContact(form);
      toast.success("Message sent successfully!");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-blue-700">Contact Us</h1>

      <div className="grid md:grid-cols-2 gap-12 mt-8">
        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message *
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition disabled:opacity-50"
          >
            {submitting ? "Sending..." : "Send Message"}
          </button>
        </form>

        {/* Contact Info */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Get in Touch
            </h2>
            <p className="text-gray-600">
              Have questions or want to support our cause? Reach out to us
              and we'll get back to you as soon as possible.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <HiOutlineLocationMarker className="w-6 h-6 text-blue-700 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-800">Address</h3>
                <p className="text-gray-600">Laxmipur, Raxaul, Bihar</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <HiOutlineMail className="w-6 h-6 text-blue-700 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-800">Email</h3>
                <p className="text-gray-600">theqaswafoundation@gmail.com</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <HiOutlinePhone className="w-6 h-6 text-blue-700 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-800">Phone</h3>
                <p className="text-gray-600">+91 9876543210</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
