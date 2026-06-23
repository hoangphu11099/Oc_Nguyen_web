import { useEffect } from "react";
import { Bell, ChevronRight, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

import { notificationApi } from "../lib/api";
import type { AdminNotification } from "../types";

const apiUrl =
  import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

const socketUrl =
  import.meta.env.VITE_SOCKET_URL ?? apiUrl.replace(/\/api\/?$/, "");

const dispatchAdminRefreshEvents = (notification?: AdminNotification) => {
  window.dispatchEvent(
    new CustomEvent("admin-notifications-changed", {
      detail: notification,
    }),
  );

  window.dispatchEvent(
    new CustomEvent("admin-dashboard-refresh", {
      detail: notification,
    }),
  );
};

export default function AdminRealtimeNotification() {
  const navigate = useNavigate();

  useEffect(() => {
    const socket = io(socketUrl, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });

    const handleNewNotification = (notification: AdminNotification) => {
      dispatchAdminRefreshEvents(notification);

      toast.custom(
        (toastItem) => (
          <div
            className={`admin-live-toast ${
              toastItem.visible
                ? "admin-live-toast-show"
                : "admin-live-toast-hide"
            }`}
          >
            <div className="admin-live-toast-icon">
              <Bell size={22} />
            </div>

            <div className="admin-live-toast-body">
              <span>THÔNG BÁO MỚI</span>
              <strong>Bạn có 1 khách đặt bàn mới</strong>
              <p>{notification.message}</p>

              <button
                type="button"
                onClick={async () => {
                  try {
                    await notificationApi.markAsRead(notification.id);
                  } catch (error) {
                    console.error("Không đánh dấu được thông báo:", error);
                  }

                  toast.dismiss(toastItem.id);
                  dispatchAdminRefreshEvents(notification);
                  navigate("/admin/notifications");
                }}
              >
                Xem thông báo
                <ChevronRight size={16} />
              </button>
            </div>

            <button
              type="button"
              className="admin-live-toast-close"
              aria-label="Đóng thông báo"
              onClick={() => toast.dismiss(toastItem.id)}
            >
              <X size={17} />
            </button>
          </div>
        ),
        {
          id: `admin-notification-${notification.id}`,
          duration: 12000,
          position: "top-right",
        },
      );
    };

    socket.on("connect", () => {
      console.log("✅ Admin đã kết nối Socket:", socket.id);
    });

    socket.on("admin_notification", handleNewNotification);

    socket.on("connect_error", (error) => {
      console.error("❌ Không kết nối được Socket:", error.message);
    });

    return () => {
      socket.off("admin_notification", handleNewNotification);
      socket.disconnect();
    };
  }, [navigate]);

  return null;
}
