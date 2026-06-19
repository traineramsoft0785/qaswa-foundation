const variants = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-gray-100 text-gray-600",
  read: "bg-gray-100 text-gray-600",
  unread: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  failed: "bg-red-100 text-red-700",
  pinned: "bg-yellow-100 text-yellow-700",
};

export default function StatusBadge({ status }) {
  const classes = variants[status] || "bg-gray-100 text-gray-600";
  return (
    <span className={`text-xs px-2 py-1 rounded font-medium ${classes}`}>
      {status}
    </span>
  );
}
