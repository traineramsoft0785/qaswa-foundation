import { useState } from "react";
import toast from "react-hot-toast";
import { submitContact } from "../../api/contacts";
import {
  HiOutlineLocationMarker,
  HiOutlineMail,
  HiOutlinePhone,
} from "react-icons/hi";

const contactDetails = [
  {
    icon: HiOutlineLocationMarker,
    title: "Address",
    value: "Laxmipur, Raxaul, Bihar",
  },
  {
    icon: HiOutlineMail,
    title: "Email",
    value: "theqaswafoundation@gmail.com",
  },
  {
    icon: HiOutlinePhone,
    title: "Phone",
    value: "+91 9470601414",
  },
];

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
    <div className="page-section">
      <div className="site-container">
        <div className="max-w-3xl">
          <p className="charity-eyebrow">Contact us</p>
          <h1 className="charity-title mt-3">
            Reach out to support, volunteer, or learn more.
          </h1>
          <p className="charity-copy">
            Have questions or want to support our cause? Send us a message and
            we will get back to you as soon as possible.
          </p>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <form onSubmit={handleSubmit} className="charity-card">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold text-stone-700">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="charity-input"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-stone-700">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="charity-input"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-stone-700">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="charity-input"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-stone-700">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  className="charity-input"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="mb-1 block text-sm font-semibold text-stone-700">
                Message *
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={5}
                className="charity-input resize-none"
              />
            </div>

            <button type="submit" disabled={submitting} className="charity-button mt-5">
              {submitting ? "Sending..." : "Send Message"}
            </button>
          </form>

          <div className="space-y-5">
            <div className="rounded-xl bg-emerald-800 p-6 text-white shadow-sm">
              <h2 className="text-xl font-bold">Get in Touch</h2>
              <p className="mt-3 leading-7 text-emerald-50">
                Your support can help a student continue learning, access
                guidance, and build confidence for the future.
              </p>
            </div>

            {contactDetails.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="charity-card flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-800">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-bold text-stone-900">{item.title}</h3>
                    <p className="mt-1 text-stone-600">{item.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
