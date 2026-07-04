import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineLocationMarker,
  HiOutlineMail,
  HiOutlinePhone,
} from "react-icons/hi";
import { getPageContent } from "../api/siteContent";

const quickLinks = [
  { to: "/about", label: "About Us" },
  { to: "/programs", label: "Programs" },
  { to: "/gallery", label: "Gallery" },
  { to: "/notices", label: "Notices" },
  { to: "/contact", label: "Contact" },
];

const FALLBACK = {
  footer_branding: {
    logo_url: "",
    heading: "The Qaswa Foundation",
    tagline: "Education for All",
    description:
      "A charitable trust working to provide education, skills, and opportunities to underprivileged children.",
  },
  contact_info: {
    address: "Laxmipur, Raxaul, Bihar",
    email: "theqaswafoundation@gmail.com",
    phone: "+91 9470601414",
  },
};

export default function Footer() {
  const [content, setContent] = useState(FALLBACK);

  useEffect(() => {
    getPageContent("global")
      .then((res) => {
        const bySection = {};
        res.data.forEach((row) => {
          bySection[row.section_key] = row.data;
        });
        setContent((prev) => ({ ...prev, ...bySection }));
      })
      .catch(() => {});
  }, []);

  const { footer_branding, contact_info } = content;

  return (
    <footer className="border-t border-emerald-100 bg-stone-900 text-white">
      <div className="site-container grid gap-8 py-10 md:grid-cols-3">
        <div>
          {footer_branding.logo_url && (
            <img
              src={footer_branding.logo_url}
              alt={footer_branding.heading}
              className="h-12 w-auto object-contain"
            />
          )}
          <h3 className="text-lg font-bold">{footer_branding.heading}</h3>
          <p className="mt-1 text-sm font-medium text-emerald-300">
            {footer_branding.tagline}
          </p>
          <p className="mt-3 text-sm leading-6 text-stone-300">
            {footer_branding.description}
          </p>
        </div>

        <div>
          <h3 className="font-bold">Quick Links</h3>
          <div className="mt-3 grid gap-2">
            {quickLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm text-stone-300 transition hover:text-emerald-300"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-bold">Contact</h3>
          <div className="mt-3 space-y-3 text-sm text-stone-300">
            <p className="flex items-start gap-2">
              <HiOutlineLocationMarker className="mt-0.5 h-5 w-5 text-emerald-300" />
              {contact_info.address}
            </p>
            <p className="flex items-start gap-2">
              <HiOutlineMail className="mt-0.5 h-5 w-5 text-emerald-300" />
              {contact_info.email}
            </p>
            <p className="flex items-start gap-2">
              <HiOutlinePhone className="mt-0.5 h-5 w-5 text-emerald-300" />
              {contact_info.phone}
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-sm text-stone-400">
        Copyright {new Date().getFullYear()} The Qaswa Foundation. All rights
        reserved.
      </div>
    </footer>
  );
}
