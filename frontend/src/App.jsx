import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "react-hot-toast";

import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/public/Home";
import About from "./pages/public/About";
import Programs from "./pages/public/Programs";
import Contact from "./pages/public/Contact";
import Gallery from "./pages/public/Gallery";
import Notices from "./pages/public/Notices";

import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminPrograms from "./pages/admin/Programs";
import AdminGallery from "./pages/admin/Gallery";
import AdminNotices from "./pages/admin/Notices";
import AdminDonations from "./pages/admin/Donations";
import AdminContacts from "./pages/admin/Contacts";
import AdminChangePassword from "./pages/admin/ChangePassword";
import QuizRegistration from "./pages/public/QuizRegistration";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          {/* Public routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/notices" element={<Notices />} />
            <Route path="/quiz" element={<QuizRegistration />} />
          </Route>

          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/programs" element={<AdminPrograms />} />
              <Route path="/admin/gallery" element={<AdminGallery />} />
              <Route path="/admin/notices" element={<AdminNotices />} />
              <Route path="/admin/donations" element={<AdminDonations />} />
              <Route path="/admin/contacts" element={<AdminContacts />} />
              <Route path="/admin/change-password" element={<AdminChangePassword />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
