import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Bell } from "lucide-react";

import { notificationApi } from "../lib/api";

export default function AdminNotificationLink() {
  const [count, setCount] = useState(0);

  const loadCount = async () => {
    try {
      const unreadCount = await notificationApi.getUnreadCount();
      setCount(unreadCount);
    } catch (error) {
      console.error("Không tải được số thông báo:", error);
    }
  };

  useEffect(() => {
    void loadCount();

    const handleNotificationChanged = () => {
      void loadCount();
    };

    window.addEventListener(
      "admin-notifications-changed",
      handleNotificationChanged,
    );

    // Dự phòng trong trường hợp Socket tạm mất kết nối.
    const timer = window.setInterval(() => {
      void loadCount();
    }, 30000);

    return () => {
      window.clearInterval(timer);
      window.removeEventListener(
        "admin-notifications-changed",
        handleNotificationChanged,
      );
    };
  }, []);

  return (
    <NavLink
      to="/admin/notifications"
      className="admin-notification-link"
    >
      <span className="admin-bell-wrapper">
        <Bell size={18} />

        {count > 0 && (
          <span className="admin-notification-badge">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </span>

      <span>Thông báo</span>
    </NavLink>
  );
}
