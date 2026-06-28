import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import client from "../../api/client";
import {
  HiOutlineBookOpen,
  HiOutlinePhotograph,
  HiOutlineSpeakerphone,
  HiOutlineCurrencyRupee,
  HiOutlineMail,
  HiOutlineUserGroup,
} from "react-icons/hi";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client
      .get("/api/dashboard/stats")
      .then((res) => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  const cards = [
    {
      label: "Programs",
      value: stats?.total_programs || 0,
      icon: HiOutlineBookOpen,
      link: "/admin/programs",
      color: "bg-blue-500",
    },
    {
      label: "Gallery Photos",
      value: stats?.total_gallery || 0,
      icon: HiOutlinePhotograph,
      link: "/admin/gallery",
      color: "bg-purple-500",
    },
    {
      label: "Notices",
      value: stats?.total_notices || 0,
      icon: HiOutlineSpeakerphone,
      link: "/admin/notices",
      color: "bg-yellow-500",
    },
    {
      label: "Total Donations",
      value: `₹${(stats?.total_donations || 0).toLocaleString()}`,
      icon: HiOutlineCurrencyRupee,
      link: "/admin/donations",
      color: "bg-green-500",
    },
    {
      label: "Board Advisors",
      value: stats?.total_advisors || 0,
      icon: HiOutlineUserGroup,
      link: "/admin/advisors",
      color: "bg-indigo-500",
    },
    {
      label: "Unread Messages",
      value: stats?.unread_contacts || 0,
      icon: HiOutlineMail,
      link: "/admin/contacts",
      color: "bg-red-500",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.link}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
          >
            <div className="flex items-center gap-4">
              <div
                className={`${card.color} p-3 rounded-lg text-white`}
              >
                <card.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="text-2xl font-bold text-gray-800">
                  {card.value}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
