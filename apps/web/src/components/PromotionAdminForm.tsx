import { FormEvent, useEffect, useState } from "react";
import { Eye, Gift, Save } from "lucide-react";
import { promotionApi } from "../lib/api";

const emptyForm = {
  title: "",
  highlightText: "",
  description: "",
  imageUrl: "",
  ctaText: "Đặt bàn ngay",
  ctaLink: "/#booking",
  isActive: true,
};

export default function PromotionAdminForm() {
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    promotionApi
      .getAdminCurrent()
      .then((data) => {
        if (!data) return;

        setForm({
          title: data.title,
          highlightText: data.highlightText ?? "",
          description: data.description,
          imageUrl: data.imageUrl,
          ctaText: data.ctaText ?? "",
          ctaLink: data.ctaLink ?? "",
          isActive: data.isActive,
        });
      })
      .catch(() => undefined);
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      setError("");
      setMessage("");

      await promotionApi.saveAdminCurrent(form);

      setMessage("Đã lưu popup khuyến mãi");
    } catch {
      setError("Không lưu được popup khuyến mãi");
    }
  };

  return (
    <div className="admin-panel promo-admin-panel">
      <div className="form-heading">
        <Gift />
        <div>
          <h3>Popup khuyến mãi</h3>
          <p>Điền nội dung popup sẽ hiện khi khách vừa vào website.</p>
        </div>
      </div>

      <form className="admin-form" onSubmit={handleSubmit}>
        <label>
          Tiêu đề chính
          <input
            value={form.title}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="Ví dụ: Ưu đãi khai trương cuối tuần"
            required
          />
        </label>

        <label>
          Chữ nổi
          <input
            value={form.highlightText}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, highlightText: e.target.value }))
            }
            placeholder="Ví dụ: Giảm 20% cho bàn từ 4 người"
          />
        </label>

        <label>
          Mô tả
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder="Nhập nội dung khuyến mãi..."
            required
          />
        </label>

        <label>
          Ảnh popup URL
          <input
            value={form.imageUrl}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, imageUrl: e.target.value }))
            }
            placeholder="https://..."
            required
          />
        </label>

        <div className="form-grid">
          <label>
            Chữ nút
            <input
              value={form.ctaText}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, ctaText: e.target.value }))
              }
              placeholder="Đặt bàn ngay"
            />
          </label>

          <label>
            Link nút
            <input
              value={form.ctaLink}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, ctaLink: e.target.value }))
              }
              placeholder="/#booking"
            />
          </label>
        </div>

        <label className="checkbox">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, isActive: e.target.checked }))
            }
          />
          Bật popup khuyến mãi
        </label>

        {form.imageUrl && (
          <div className="promo-admin-preview">
            <Eye size={18} />
            <img src={form.imageUrl} alt="Preview popup" />
            <div>
              <strong>{form.highlightText || "Chữ nổi khuyến mãi"}</strong>
              <p>{form.title || "Tiêu đề popup"}</p>
            </div>
          </div>
        )}

        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}

        <button className="btn" type="submit">
          <Save size={18} />
          Lưu popup
        </button>
      </form>
    </div>
  );
}
