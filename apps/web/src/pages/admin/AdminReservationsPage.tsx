import { useEffect, useMemo, useState } from "react";
import { ArrowDownUp, RefreshCw, Search, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import { reservationApi } from "../../lib/api";
import type { Reservation, ReservationStatus } from "../../types";

const statusLabel: Record<ReservationStatus, string> = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  CANCELLED: "Đã huỷ",
  DONE: "Hoàn tất",
};

type TableFilter = "ALL" | "VIP" | "NORMAL";
type SortOption = "NEWEST" | "OLDEST";

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<TableFilter>("ALL");

  // Mặc định khách vừa đặt mới nhất nằm trên cùng
  const [sort, setSort] = useState<SortOption>("NEWEST");

  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const loadReservations = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await reservationApi.getAll();
      setReservations(data);
    } catch (err) {
      console.error("Load reservations failed:", err);

      setError("Không tải được danh sách đặt bàn");

      toast.error(
        err instanceof Error ? err.message : "Không tải được danh sách đặt bàn",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadReservations();

    // Khi Socket báo có khách mới thì tải lại danh sách
    const handleRealtimeRefresh = () => {
      void loadReservations();
    };

    window.addEventListener("admin-dashboard-refresh", handleRealtimeRefresh);

    window.addEventListener(
      "admin-notifications-changed",
      handleRealtimeRefresh,
    );

    return () => {
      window.removeEventListener(
        "admin-dashboard-refresh",
        handleRealtimeRefresh,
      );

      window.removeEventListener(
        "admin-notifications-changed",
        handleRealtimeRefresh,
      );
    };
  }, []);

  const updateStatus = async (id: number, status: ReservationStatus) => {
    try {
      setUpdatingId(id);

      await reservationApi.updateStatus(id, status);

      setReservations((current) =>
        current.map((reservation) =>
          reservation.id === id
            ? {
                ...reservation,
                status,
              }
            : reservation,
        ),
      );

      toast.success(`Đã cập nhật: ${statusLabel[status]}`);
    } catch (err) {
      console.error("Update status failed:", err);

      toast.error(
        err instanceof Error ? err.message : "Không cập nhật được trạng thái",
      );

      await loadReservations();
    } finally {
      setUpdatingId(null);
    }
  };

  const remove = async (booking: Reservation) => {
    const bookingCode = booking.bookingCode || `đơn #${booking.id}`;

    const confirmed = window.confirm(
      `Bạn có chắc muốn xoá ${bookingCode} của khách ${booking.customerName} không?\n\nToàn bộ món đặt trước cũng sẽ bị xoá.`,
    );

    if (!confirmed) return;

    try {
      setDeletingId(booking.id);

      await reservationApi.remove(booking.id);

      setReservations((current) =>
        current.filter((reservation) => reservation.id !== booking.id),
      );

      toast.success(`Đã xoá ${bookingCode} thành công`);
    } catch (err) {
      console.error("Delete reservation failed:", err);

      toast.error(err instanceof Error ? err.message : "Không thể xoá đặt bàn");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredReservations = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return [...reservations]
      .filter((reservation) => {
        const matchesSearch =
          keyword.length === 0 ||
          reservation.bookingCode?.toLowerCase().includes(keyword) ||
          reservation.customerName.toLowerCase().includes(keyword) ||
          reservation.phone.toLowerCase().includes(keyword) ||
          reservation.email?.toLowerCase().includes(keyword);

        const matchesTableType =
          filter === "ALL" || reservation.tableType === filter;

        return Boolean(matchesSearch && matchesTableType);
      })
      .sort((a, b) => {
        /*
         * createdAt = thời điểm khách gửi đặt bàn.
         * reservationDate = ngày khách dự kiến đến.
         *
         * Nếu dữ liệu cũ chưa có createdAt,
         * dùng id để sắp xếp dự phòng.
         */
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : a.id;

        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : b.id;

        return sort === "NEWEST" ? timeB - timeA : timeA - timeB;
      });
  }, [reservations, search, filter, sort]);

  return (
    <div className="admin-page">
      <div className="admin-heading">
        <span>Reservations</span>

        <div className="admin-heading-row">
          <div>
            <h1>Quản lý đặt bàn</h1>

            <p>Theo dõi khách đặt bàn và các món cần chuẩn bị trước.</p>
          </div>

          <button
            type="button"
            className={`reservation-reload ${loading ? "is-loading" : ""}`}
            disabled={loading}
            onClick={() => void loadReservations()}>
            {" "}
            <RefreshCw
              size={17}
              className={loading ? "is-spinning" : ""}
            />{" "}
            <span>{loading ? "Đang tải..." : "Tải lại"}</span>{" "}
          </button>
        </div>
      </div>

      {/* BỘ TÌM KIẾM VÀ LỌC */}
      <div className="reservation-filter-bar">
        <label className="reservation-search">
          <Search size={17} />

          <input
            type="search"
            value={search}
            placeholder="Tìm mã đặt bàn, tên, SĐT..."
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>

        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value as TableFilter)}>
          <option value="ALL">Tất cả loại bàn</option>

          <option value="VIP">Bàn VIP</option>

          <option value="NORMAL">Bàn thường</option>
        </select>

        <label className="reservation-sort">
          <ArrowDownUp size={16} />

          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as SortOption)}>
            <option value="NEWEST">Khách đặt mới nhất</option>

            <option value="OLDEST">Khách đặt cũ nhất</option>
          </select>
        </label>
      </div>

      <p className="admin-result-count">
        Hiển thị <strong>{filteredReservations.length}</strong> trên{" "}
        <strong>{reservations.length}</strong> đặt bàn
      </p>

      {error && <p className="error-message">{error}</p>}

      {loading && reservations.length === 0 ? (
        <div className="admin-empty-state">Đang tải danh sách đặt bàn...</div>
      ) : filteredReservations.length === 0 ? (
        <div className="admin-empty-state">Không tìm thấy đặt bàn phù hợp.</div>
      ) : (
        <div className="reservation-list">
          {filteredReservations.map((booking) => {
            const isDeleting = deletingId === booking.id;

            const isUpdating = updatingId === booking.id;

            return (
              <article className="reservation-card" key={booking.id}>
                <div className="reservation-card-main">
                  <div className="reservation-card-header">
                    <span
                      className={`booking-status ${booking.status.toLowerCase()}`}>
                      {statusLabel[booking.status]}
                    </span>

                    <span
                      className={`table-type-badge ${
                        booking.tableType === "VIP" ? "vip" : "normal"
                      }`}>
                      {booking.tableType === "VIP" ? "Bàn VIP" : "Bàn thường"}
                    </span>
                  </div>

                  <h3>
                    {booking.bookingCode || `OC-${booking.id}`} —{" "}
                    {booking.customerName}
                  </h3>

                  <p>
                    {booking.phone}

                    {booking.email ? ` • ${booking.email}` : ""}
                  </p>

                  <p>
                    <strong>Ngày khách đến:</strong>{" "}
                    {new Date(booking.reservationDate).toLocaleString("vi-VN")}{" "}
                    • {booking.numberOfGuests} khách
                  </p>

                  {booking.createdAt && (
                    <p className="booking-created-time">
                      <strong>Khách gửi đặt bàn lúc:</strong>{" "}
                      {new Date(booking.createdAt).toLocaleString("vi-VN")}
                    </p>
                  )}

                  {booking.items && booking.items.length > 0 ? (
                    <div className="booking-preorders">
                      <strong>Món khách đặt trước:</strong>

                      <ul>
                        {booking.items.map((item) => (
                          <li key={item.id}>
                            <span>
                              {item.menuItem?.name || `Món #${item.menuItemId}`}
                            </span>

                            <strong>x{item.quantity}</strong>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="booking-no-preorder">
                      Khách không đặt món trước.
                    </p>
                  )}

                  {booking.note && (
                    <p className="booking-note">“{booking.note}”</p>
                  )}
                </div>

                <div className="booking-actions">
                  <select
                    value={booking.status}
                    disabled={isUpdating || isDeleting}
                    onChange={(event) =>
                      void updateStatus(
                        booking.id,
                        event.target.value as ReservationStatus,
                      )
                    }>
                    {Object.entries(statusLabel).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    className="danger"
                    disabled={isDeleting || isUpdating}
                    onClick={() => void remove(booking)}>
                    <Trash2 size={16} />

                    {isDeleting ? "Đang xoá..." : "Xoá"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
