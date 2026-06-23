import { useEffect, useState } from "react";
import { Bell, CheckCheck, RefreshCw, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import { notificationApi } from "../../lib/api";
import type { AdminNotification } from "../../types";

const typeLabel: Record<string, string> = {
  RESERVATION: "Đặt bàn",
  REVIEW: "Đánh giá",
  PROMOTION: "Khuyến mãi",
  SYSTEM: "Hệ thống",
};

const notifyUnreadCountChanged = () => {
  window.dispatchEvent(new Event("admin-notifications-changed"));
};

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await notificationApi.getAll();
      setNotifications(data);
    } catch {
      setError("Không tải được danh sách thông báo");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadNotifications();

    const handleNotificationChanged = () => {
      void loadNotifications();
    };

    window.addEventListener(
      "admin-notifications-changed",
      handleNotificationChanged,
    );

    return () => {
      window.removeEventListener(
        "admin-notifications-changed",
        handleNotificationChanged,
      );
    };
  }, []);

  const markAsRead = async (id: number) => {
    try {
      await notificationApi.markAsRead(id);
      await loadNotifications();
      notifyUnreadCountChanged();
    } catch {
      setError("Không đánh dấu được thông báo");
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      await loadNotifications();
      notifyUnreadCountChanged();
    } catch {
      setError("Không đánh dấu được tất cả thông báo");
    }
  };

  const remove = async (id: number) => {
    const ok = window.confirm("Xoá thông báo này?");
    if (!ok) return;

    try {
      await notificationApi.remove(id);
      await loadNotifications();
      notifyUnreadCountChanged();
    } catch {
      setError("Không xoá được thông báo");
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-heading">
        <span>Notifications</span>
        <h1>Thông báo quản trị</h1>
      </div>

      <div className="center-actions" style={{ marginBottom: 24 }}>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => void loadNotifications()}
        >
          <RefreshCw size={18} />
          Tải lại
        </button>

        <button
          type="button"
          className="btn"
          onClick={() => void markAllAsRead()}
        >
          <CheckCheck size={18} />
          Đánh dấu đã đọc tất cả
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {loading ? (
        <div className="screen-loader">Đang tải thông báo...</div>
      ) : notifications.length === 0 ? (
        <div className="admin-panel">
          <h2>Chưa có thông báo</h2>
          <p>Khi khách đặt bàn, thông báo sẽ xuất hiện tại đây.</p>
        </div>
      ) : (
        <div className="notification-list">
          {notifications.map((item) => (
            <article
              className={
                item.isRead ? "notification-card" : "notification-card unread"
              }
              key={item.id}
            >
              <div className="notification-icon">
                <Bell size={20} />
              </div>

              <div className="notification-content">
                <span>{typeLabel[item.type] ?? "Thông báo"}</span>
                <h3>{item.title}</h3>
                <p>{item.message}</p>
                <small>{new Date(item.createdAt).toLocaleString("vi-VN")}</small>
              </div>

              <div className="notification-actions">
                {item.link && (
                  <Link className="btn btn-small" to={item.link}>
                    Xem
                  </Link>
                )}

                {!item.isRead && (
                  <button
                    type="button"
                    className="btn btn-ghost btn-small"
                    onClick={() => void markAsRead(item.id)}
                  >
                    Đã đọc
                  </button>
                )}

                <button
                  type="button"
                  className="danger"
                  onClick={() => void remove(item.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
