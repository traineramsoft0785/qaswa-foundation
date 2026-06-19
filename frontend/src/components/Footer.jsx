import { Link } from "react-router-dom";
import {
  HiOutlineLocationMarker,
  HiOutlineMail,
  HiOutlinePhone,
} from "react-icons/hi";

const quickLinks = [
  { to: "/about", label: "About Us" },
  { to: "/programs", label: "Programs" },
  { to: "/gallery", label: "Gallery" },
  { to: "/notices", label: "Notices" },
  { to: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="border-t border-emerald-100 bg-stone-900 text-white">
      <div className="site-container grid gap-8 py-10 md:grid-cols-3">
        <div>
          <h3 className="text-lg font-bold">The Qaswa Foundation</h3>
          <p className="mt-1 text-sm font-medium text-emerald-300">
            Education for All
          </p>
          <p className="mt-3 text-sm leading-6 text-stone-300">
            A charitable trust working to provide education, skills, and
            opportunities to underprivileged children.
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
              Laxmipur, Raxaul, Bihar
            </p>
            <p className="flex items-start gap-2">
              <HiOutlineMail className="mt-0.5 h-5 w-5 text-emerald-300" />
              theqaswafoundation@gmail.com
            </p>
            <p className="flex items-start gap-2">
              <HiOutlinePhone className="mt-0.5 h-5 w-5 text-emerald-300" />
              +91 9470601414
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
