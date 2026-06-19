import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getDonations, updateDonationStatus } from "../../api/donations";
import StatusBadge from "../../components/admin/StatusBadge";

export default function AdminDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  const load = () => {
    setLoading(true);
    getDonations(filter || undefined)
      .then((res) => setDonations(res.data))
      .catch(() => toast.error("Failed to load donations"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filter]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateDonationStatus(id, newStatus);
      toast.success("Status updated");
      load();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Donations</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Donor</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Amount</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Date</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {donations.map((d) => (
                <tr key={d.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800">{d.donor_name}</p>
                    <p className="text-xs text-gray-500">{d.email || d.phone || "—"}</p>
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-800">
                    ₹{Number(d.amount).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={d.status} />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{formatDate(d.created_at)}</td>
                  <td className="px-4 py-3 text-right">
                    <select
                      value={d.status}
                      onChange={(e) => handleStatusChange(d.id, e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="failed">Failed</option>
                    </select>
                  </td>
                </tr>
              ))}
              {donations.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    No donations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
