import type { ReactElement } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";
import HomePage from "./pages/HomePage";
import MenuPage from "./pages/MenuPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminMenuPage from "./pages/admin/AdminMenuPage";
import AdminReservationsPage from "./pages/admin/AdminReservationsPage";
import AdminNotificationsPage from "./pages/admin/AdminNotificationsPage";

// ✅ IMPORT TOAST
import { Toaster } from "react-hot-toast";

function AdminRoute({ children }: { children: ReactElement }) {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return <div className="screen-loader">Đang tải...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <>
      {/* 🔥 TOAST CONTAINER - GLOBAL */}
      <Toaster position="top-right" />

      <Routes>
        {/* PUBLIC */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }>
          <Route index element={<AdminDashboard />} />
          <Route path="menu" element={<AdminMenuPage />} />
          <Route path="reservations" element={<AdminReservationsPage />} />

          <Route path="notifications" element={<AdminNotificationsPage />} />
        </Route>

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
