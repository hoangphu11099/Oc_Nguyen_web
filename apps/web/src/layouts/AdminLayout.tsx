import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Home,
  LayoutDashboard,
  LogOut,
  UtensilsCrossed,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import AdminNotificationLink from "../components/AdminNotificationLink";
import AdminRealtimeNotification from "../components/AdminRealtimeNotification";

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="admin-shell">
      {/* Không hiển thị UI, chỉ giữ kết nối Socket cho toàn bộ khu vực admin. */}
      <AdminRealtimeNotification />

      <aside className="admin-sidebar">
        <Link className="admin-brand" to="/admin">
          <span>Ốc Nguyễn</span>
          <small>Admin Suite</small>
        </Link>

        <nav className="admin-nav">
          <NavLink to="/admin" end>
            <LayoutDashboard size={18} /> Tổng quan
          </NavLink>

          <AdminNotificationLink />

          <NavLink to="/admin/menu">
            <UtensilsCrossed size={18} /> Quản lý món
          </NavLink>

          <NavLink to="/admin/reservations">
            <CalendarDays size={18} /> Đặt bàn
          </NavLink>

          <NavLink to="/">
            <Home size={18} /> Về trang chủ
          </NavLink>
        </nav>

        <div className="admin-profile">
          <strong>{user?.name}</strong>
          <small>{user?.email}</small>

          <button type="button" onClick={handleLogout}>
            <LogOut size={16} /> Đăng xuất
          </button>
        </div>
      </aside>

      <section className="admin-content">
        <Outlet />
      </section>
    </div>
  );
}
