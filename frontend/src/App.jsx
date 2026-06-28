import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { UserAuthProvider } from "./contexts/UserAuthContext";
import { Toaster } from "react-hot-toast";

import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import UserProtectedRoute from "./components/UserProtectedRoute";

import Home from "./pages/public/Home";
import About from "./pages/public/About";
import Programs from "./pages/public/Programs";
import ProgramDetail from "./pages/public/ProgramDetail";
import Contact from "./pages/public/Contact";
import Gallery from "./pages/public/Gallery";
import Notices from "./pages/public/Notices";
import UserLogin from "./pages/public/UserLogin";
import UserRegister from "./pages/public/UserRegister";

import QuizList from "./pages/user/QuizList";
import UserDashboard from "./pages/user/Dashboard";
import UserProfile from "./pages/user/UserProfile";

import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminPrograms from "./pages/admin/Programs";
import AdminGallery from "./pages/admin/Gallery";
import AdminNotices from "./pages/admin/Notices";
import AdminQuizzes from "./pages/admin/Quizzes";
import AdminDonations from "./pages/admin/Donations";
import AdminContacts from "./pages/admin/Contacts";
import AdminChangePassword from "./pages/admin/ChangePassword";
import AdminAdvisors from "./pages/admin/Advisors";
import BoardAdvisors from "./pages/public/BoardAdvisors";

export default function App() {
  return (
    <AuthProvider>
      <UserAuthProvider>
        <BrowserRouter>
          <Toaster position="top-right" />
          <Routes>
            {/* Public routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/programs" element={<Programs />} />
              <Route path="/programs/:slug" element={<ProgramDetail />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/notices" element={<Notices />} />
              <Route path="/board-of-advisors" element={<BoardAdvisors />} />
              <Route path="/quizzes" element={<QuizList />} />
              <Route path="/user/login" element={<UserLogin />} />
              <Route path="/user/register" element={<UserRegister />} />

              {/* User-protected routes */}
              <Route element={<UserProtectedRoute />}>
                <Route path="/user/dashboard" element={<UserDashboard />} />
                <Route path="/user/profile" element={<UserProfile />} />
              </Route>
            </Route>

            {/* Admin routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/programs" element={<AdminPrograms />} />
                <Route path="/admin/gallery" element={<AdminGallery />} />
                <Route path="/admin/notices" element={<AdminNotices />} />
                <Route path="/admin/quizzes" element={<AdminQuizzes />} />
                <Route path="/admin/donations" element={<AdminDonations />} />
                <Route path="/admin/contacts" element={<AdminContacts />} />
                <Route path="/admin/advisors" element={<AdminAdvisors />} />
                <Route path="/admin/change-password" element={<AdminChangePassword />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </UserAuthProvider>
    </AuthProvider>
  );
}
