import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { CalendarCheck } from "lucide-react";
import toast from "react-hot-toast";

import { menuApi, reservationApi } from "../lib/api";
import type { MenuItem, ReservationPayload } from "../types";

const initialForm: ReservationPayload = {
  customerName: "",
  phone: "",
  email: "",
  numberOfGuests: 2,
  reservationDate: "",
  note: "",
};

type SelectedMenuItem = {
  menuItemId: number;
  quantity: number;
  name: string;
  price: number;
};

export default function ReservationForm() {
  const [form, setForm] = useState<ReservationPayload>(initialForm);
  const [loading, setLoading] = useState(false);

  const [tableType, setTableType] = useState<"NORMAL" | "VIP">("NORMAL");

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<SelectedMenuItem[]>([]);

  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    menuApi
      .getAll()
      .then((items) => {
        setMenuItems(items.filter((item) => item.isAvailable));
      })
      .catch(() => {
        toast.error("Không tải được danh sách món ăn.");
      });
  }, []);

  const filteredMenu = menuItems.filter((item) =>
    item.name.toLowerCase().includes(search.trim().toLowerCase()),
  );

  const totalQuantity = selectedItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const totalPrice = selectedItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const getQuantity = (menuItemId: number) =>
    selectedItems.find((item) => item.menuItemId === menuItemId)?.quantity ?? 0;

  const increaseQuantity = (menuItem: MenuItem) => {
    setSelectedItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.menuItemId === menuItem.id,
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.menuItemId === menuItem.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item,
        );
      }

      return [
        ...currentItems,
        {
          menuItemId: menuItem.id,
          quantity: 1,
          name: menuItem.name,
          price: menuItem.price,
        },
      ];
    });
  };

  const decreaseQuantity = (menuItemId: number) => {
    setSelectedItems((currentItems) =>
      currentItems
        .map((item) =>
          item.menuItemId === menuItemId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.customerName.trim()) {
      toast.error("Vui lòng nhập họ tên.");
      return;
    }

    if (!form.phone.trim()) {
      toast.error("Vui lòng nhập số điện thoại.");
      return;
    }

    if (!form.reservationDate) {
      toast.error("Vui lòng chọn ngày giờ đặt bàn.");
      return;
    }

    setLoading(true);

    try {
      const createdReservation = await reservationApi.create({
        ...form,
        customerName: form.customerName.trim(),
        phone: form.phone.trim(),
        email: form.email?.trim() || undefined,
        numberOfGuests: Number(form.numberOfGuests),
        reservationDate: new Date(form.reservationDate).toISOString(),
        tableType,

        // Chỉ gửi các trường backend cần.
        preOrderItems: selectedItems.map((item) => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
        })),
      });

      toast.success(
        () => (
          <div className="booking-success-toast">
            <strong>Đặt bàn thành công!</strong>

            <p>
              Cảm ơn <b>{form.customerName}</b> đã lựa chọn Ốc Nguyễn.
            </p>

            {createdReservation.bookingCode && (
              <p>
                Mã đặt bàn: <b>{createdReservation.bookingCode}</b>
              </p>
            )}

            <small>
              Nhà hàng sẽ liên hệ với bạn để xác nhận trong thời gian sớm nhất.
            </small>
          </div>
        ),
        {
          duration: 6000,
          style: {
            maxWidth: "420px",
            background: "#17120d",
            color: "#fff7e8",
            border: "1px solid rgba(246, 213, 141, 0.55)",
            borderRadius: "14px",
            padding: "14px 16px",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.45)",
          },
          iconTheme: {
            primary: "#f6d58d",
            secondary: "#17120d",
          },
        },
      );

      setForm(initialForm);
      setSelectedItems([]);
      setTableType("NORMAL");
      setSearch("");
      setMenuOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Đặt bàn thất bại, vui lòng thử lại.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reservation-wrapper">
      <form
        className="reservation-form glass-panel reveal-up"
        onSubmit={handleSubmit}>
        <div className="form-heading">
          <CalendarCheck color="#ffd67a" />

          <div>
            <h3>Đặt bàn trước</h3>
            <p>Giữ chỗ đẹp cho buổi hẹn hải sản của bạn.</p>
          </div>
        </div>

        <div className="form-grid">
          <label>
            Họ tên
            <input
              value={form.customerName}
              onChange={(event) =>
                setForm({
                  ...form,
                  customerName: event.target.value,
                })
              }
              placeholder="Nhập họ tên"
              required
            />
          </label>

          <label>
            Số điện thoại
            <input
              value={form.phone}
              onChange={(event) =>
                setForm({
                  ...form,
                  phone: event.target.value,
                })
              }
              placeholder="Nhập số điện thoại"
              required
            />
          </label>

          <label>
            Email
            <input
              type="email"
              value={form.email ?? ""}
              onChange={(event) =>
                setForm({
                  ...form,
                  email: event.target.value,
                })
              }
              placeholder="Nhập email nếu có"
            />
          </label>

          <label>
            Số khách
            <input
              type="number"
              min={1}
              max={40}
              value={form.numberOfGuests}
              onChange={(event) =>
                setForm({
                  ...form,
                  numberOfGuests: Number(event.target.value),
                })
              }
              required
            />
          </label>

          <label>
            Ngày giờ đặt bàn
            <input
              type="datetime-local"
              value={form.reservationDate}
              onChange={(event) =>
                setForm({
                  ...form,
                  reservationDate: event.target.value,
                })
              }
              required
            />
          </label>

          <label>
            Ghi chú
            <textarea
              value={form.note ?? ""}
              onChange={(event) =>
                setForm({
                  ...form,
                  note: event.target.value,
                })
              }
              placeholder="Sinh nhật, ghế trẻ em, bàn gần sân khấu..."
            />
          </label>

          <label className="full">
            Loại bàn
            <select
              value={tableType}
              onChange={(event) =>
                setTableType(event.target.value as "NORMAL" | "VIP")
              }>
              <option value="NORMAL">Bàn thường</option>
              <option value="VIP">Bàn VIP</option>
            </select>
          </label>
        </div>

        <div className="reservation-action-bar">
          <button
            type="button"
            className="preorder-btn"
            onClick={() => setMenuOpen(true)}>
            Đặt món trước
          </button>

          <div className="order-summary">
            <span className="count">{totalQuantity} phần đã chọn</span>

            <span className="price">
              Tạm tính: {totalPrice.toLocaleString("vi-VN")} đ
            </span>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Đang gửi..." : "Gửi đặt bàn"}
          </button>
        </div>
      </form>

      {menuOpen && (
        <div className="modal-overlay" onClick={() => setMenuOpen(false)}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-label="Chọn món đặt trước"
            onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3>Chọn món đặt trước</h3>
                <p>Chọn số lượng món nhà hàng cần chuẩn bị.</p>
              </div>

              <input
                type="search"
                placeholder="Tìm món ăn..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <div className="menu-list">
              {filteredMenu.length > 0 ? (
                filteredMenu.map((item) => (
                  <div className="menu-item" key={item.id}>
                    <div className="menu-info">
                      <strong>{item.name}</strong>

                      <span>{item.price.toLocaleString("vi-VN")} đ</span>
                    </div>

                    <div className="qty">
                      <button
                        type="button"
                        aria-label={`Giảm ${item.name}`}
                        disabled={getQuantity(item.id) === 0}
                        onClick={() => decreaseQuantity(item.id)}>
                        −
                      </button>

                      <span>{getQuantity(item.id)}</span>

                      <button
                        type="button"
                        aria-label={`Tăng ${item.name}`}
                        onClick={() => increaseQuantity(item)}>
                        +
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="empty-state">Không tìm thấy món phù hợp.</p>
              )}
            </div>

            <div className="modal-footer">
              <div className="modal-total">
                <span>{totalQuantity} phần đã chọn</span>

                <strong>{totalPrice.toLocaleString("vi-VN")} đ</strong>
              </div>

              <div className="actions">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setMenuOpen(false)}>
                  Đóng
                </button>

                <button
                  type="button"
                  className="btn primary"
                  onClick={() => setMenuOpen(false)}>
                  Xác nhận món
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
