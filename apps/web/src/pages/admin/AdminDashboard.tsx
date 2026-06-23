import { useEffect, useState } from "react";
import { CalendarDays, ChefHat, Crown } from "lucide-react";

import { menuApi, reservationApi } from "../../lib/api";
import type { MenuItem, Reservation } from "../../types";
import PromotionAdminForm from "../../components/PromotionAdminForm";

export default function AdminDashboard() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const loadDashboardData = async () => {
    try {
      const [menu, bookings] = await Promise.all([
        menuApi.getAll(),
        reservationApi.getAll(),
      ]);

      setItems(menu);
      setReservations(bookings);
    } catch (error) {
      console.error("Không tải được dữ liệu Dashboard:", error);
    }
  };

  useEffect(() => {
    void loadDashboardData();

    const handleDashboardRefresh = () => {
      void loadDashboardData();
    };

    window.addEventListener(
      "admin-dashboard-refresh",
      handleDashboardRefresh,
    );

    // Dự phòng nếu Socket tạm thời mất kết nối.
    const timer = window.setInterval(() => {
      void loadDashboardData();
    }, 30000);

    return () => {
      window.clearInterval(timer);
      window.removeEventListener(
        "admin-dashboard-refresh",
        handleDashboardRefresh,
      );
    };
  }, []);

  const pending = reservations.filter(
    (item) => item.status === "PENDING",
  ).length;

  return (
    <div className="admin-page">
      <div className="admin-heading">
        <span>Dashboard</span>
        <h1>Tổng quan vận hành</h1>
      </div>

      <div className="admin-stat-grid">
        <div className="admin-stat">
          <ChefHat />
          <span>Tổng món</span>
          <strong>{items.length}</strong>
        </div>

        <div className="admin-stat">
          <Crown />
          <span>Món signature</span>
          <strong>{items.filter((item) => item.isSignature).length}</strong>
        </div>

        <div className="admin-stat">
          <CalendarDays />
          <span>Đặt bàn chờ xác nhận</span>
          <strong>{pending}</strong>
        </div>
      </div>

      <PromotionAdminForm />

      <div className="admin-panel">
        <h2>Ghi chú quản trị</h2>
        <p>
          Trang này được thiết kế để mở rộng thêm báo cáo doanh thu, thống kê
          món bán chạy, quản lý nhân sự hoặc tích hợp thanh toán sau này.
        </p>
      </div>
    </div>
  );
}
