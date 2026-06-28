import { Navigate, Outlet } from "react-router-dom";
import { useUserAuth } from "../contexts/UserAuthContext";

export default function UserProtectedRoute() {
  const { user, loading } = useUserAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
      </div>
    );
  }

  if (!user) return <Navigate to="/user/login" replace />;
  return <Outlet />;
}
