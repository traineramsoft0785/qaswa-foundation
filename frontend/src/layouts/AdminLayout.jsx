import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  HiOutlineHome,
  HiOutlineBookOpen,
  HiOutlinePhotograph,
  HiOutlineSpeakerphone,
  HiOutlineCurrencyRupee,
  HiOutlineMail,
  HiOutlineLogout,
  HiOutlineLockClosed,
  HiOutlineClipboardList,
} from "react-icons/hi";

const navItems = [
  { path: "/admin", label: "Dashboard", icon: HiOutlineHome },
  { path: "/admin/programs", label: "Programs", icon: HiOutlineBookOpen },
  { path: "/admin/gallery", label: "Gallery", icon: HiOutlinePhotograph },
  { path: "/admin/notices", label: "Notices", icon: HiOutlineSpeakerphone },
  { path: "/admin/quiz-registrations", label: "Quiz Registrations", icon: HiOutlineClipboardList },
  { path: "/admin/donations", label: "Donations", icon: HiOutlineCurrencyRupee },
  { path: "/admin/contacts", label: "Contacts", icon: HiOutlineMail },
  { path: "/admin/change-password", label: "Change Password", icon: HiOutlineLockClosed },
];

export default function AdminLayout() {
  const { admin, logoutAdmin } = useAuth();
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-lg font-bold">Qaswa Admin</h1>
          <p className="text-sm text-gray-400">{admin?.name}</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button
            onClick={logoutAdmin}
            className="flex items-center gap-3 px-3 py-2 w-full text-gray-300 hover:bg-gray-700 rounded transition-colors"
          >
            <HiOutlineLogout className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
