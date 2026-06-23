import { Link } from "react-router-dom";
import {
  ArrowRight,
  Award,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  Music2,
  Radio,
  Shell,
  Sparkles,
  Volume2,
} from "lucide-react";
import { useEffect, useState } from "react";
import SectionTitle from "../components/SectionTitle";
import ReservationForm from "../components/ReservationForm";
import MenuCard from "../components/MenuCard";
import { menuApi } from "../lib/api";
import type { MenuItem } from "../types";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=1200&q=80";

export default function HomePage() {
  const [signatureItems, setSignatureItems] = useState<MenuItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    menuApi
      .getAll()
      .then((items) => {
        const signatures = items
          .filter((item) => item.isSignature && item.isAvailable)
          .slice(0, 6);

        setSignatureItems(signatures);
        setActiveIndex(0);
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (signatureItems.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % signatureItems.length);
    }, 3500);

    return () => window.clearInterval(timer);
  }, [signatureItems.length]);

  const activeSignature = signatureItems[activeIndex];

  const goPrev = () => {
    if (signatureItems.length === 0) return;

    setActiveIndex((prev) => {
      return (prev - 1 + signatureItems.length) % signatureItems.length;
    });
  };

  const goNext = () => {
    if (signatureItems.length === 0) return;

    setActiveIndex((prev) => {
      return (prev + 1) % signatureItems.length;
    });
  };

  return (
    <>
      <section className="hero">
        <div className="hero-orb orb-one" />
        <div className="hero-orb orb-two" />

        <div className="hero-content reveal-up">
          <span className="eyebrow">
            <Sparkles size={16} /> Hải sản tươi mỗi ngày
          </span>

          <h1>Ốc Nguyễn — vị biển sang trọng giữa trung tâm Chợ Quán.</h1>

          <p>
            Từ ốc hương, càng ghẹ đến những món nướng thơm lửa than, Ốc Nguyễn
            mang đến trải nghiệm hải sản đậm vị Sài Gòn tại 187 - 189 Lê Hồng
            Phong.
          </p>

          <div className="hero-actions">
            <Link className="btn" to="/menu">
              Xem menu <ArrowRight size={18} />
            </Link>

            <a className="btn btn-ghost" href="#booking">
              Đặt bàn ngay
            </a>
          </div>

          <div className="hero-stats">
            <span>
              <strong>30+</strong> Món hải sản
            </span>

            <span>
              <strong>19:00</strong> Mở cửa
            </span>

            <span>
              <strong>187-189</strong> Lê Hồng Phong, Chợ Quán, Hồ Chí Minh
            </span>
          </div>
        </div>

        <div className="hero-card floating-card signature-carousel">
          {activeSignature ? (
            <>
              <img
                key={activeSignature.id}
                className="signature-slide-image"
                src={activeSignature.imageUrl ?? FALLBACK_IMAGE}
                alt={activeSignature.name}
              />

              <div
                className="signature-info-card"
                key={`info-${activeSignature.id}`}>
                <span>
                  <Sparkles size={15} /> Món nổi bật hôm nay
                </span>

                <h3>{activeSignature.name}</h3>

                <p>{activeSignature.description}</p>

                <strong>
                  {activeSignature.price.toLocaleString("vi-VN")} đ
                </strong>
              </div>

              {signatureItems.length > 1 && (
                <>
                  <button
                    type="button"
                    className="signature-nav signature-prev"
                    onClick={goPrev}
                    aria-label="Món trước">
                    <ChevronLeft size={20} />
                  </button>

                  <button
                    type="button"
                    className="signature-nav signature-next"
                    onClick={goNext}
                    aria-label="Món sau">
                    <ChevronRight size={20} />
                  </button>

                  <div className="signature-dots">
                    {signatureItems.map((item, index) => (
                      <button
                        key={item.id}
                        type="button"
                        className={index === activeIndex ? "active" : ""}
                        onClick={() => setActiveIndex(index)}
                        aria-label={`Xem ${item.name}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <img src={FALLBACK_IMAGE} alt="Hải sản Ốc Nguyễn" />

              <div>
                <span>Món được yêu thích</span>
                <h3>Càng ghẹ rang me</h3>
                <p>Sốt me chua ngọt, thơm vị biển tươi.</p>
              </div>
            </>
          )}
        </div>
      </section>

      <section className="section about-section">
        <SectionTitle
          eyebrow="Không gian & hương vị"
          title="Một điểm hẹn hải sản chỉn chu cho gia đình, bạn bè và đối tác."
          description="Thiết kế ấm, ánh sáng vàng, món ăn lên nhanh và bếp giữ trọn độ tươi của từng nguyên liệu."
        />

        <div className="feature-grid">
          <div className="feature-card reveal-up">
            <Shell />
            <h3>Nguyên liệu tươi</h3>
            <p>Chọn lọc mỗi ngày, chế biến vừa lửa để giữ vị ngọt tự nhiên.</p>
          </div>

          <div className="feature-card reveal-up">
            <Award />
            <h3>Món nổi bật</h3>
            <p>Công thức nước sốt riêng, hợp khẩu vị tiệc tối lẫn ăn nhẹ.</p>
          </div>

          <div className="feature-card reveal-up">
            <MapPin />
            <h3>Vị trí thuận tiện</h3>
            <p>
              Nằm trên trục Lê Hồng Phong, dễ tìm, phù hợp tụ họp sau giờ làm.
            </p>
          </div>
        </div>
      </section>

      <section className="section dj-section">
        <div className="dj-glow dj-glow-one" />
        <div className="dj-glow dj-glow-two" />

        <div className="dj-content reveal-up">
          <span className="eyebrow">
            <Music2 size={16} /> DJ Night mỗi ngày
          </span>

          <h2>21:00 lên nhạc — ăn ốc, chill cùng DJ sôi động.</h2>

          <p>
            Từ 21h hằng ngày, Ốc Nguyễn mang đến không khí trẻ trung với âm nhạc
            DJ, ánh sáng ấm và những món hải sản đậm vị. Phù hợp cho nhóm bạn,
            sinh nhật, tụ họp sau giờ làm hoặc những buổi tối muốn đổi mood.
          </p>

          <div className="dj-actions">
            <a className="btn" href="#booking">
              Đặt bàn tối nay <ArrowRight size={18} />
            </a>

            <Link className="btn btn-ghost" to="/menu">
              Xem món nhậu hợp vibe
            </Link>
          </div>
        </div>

        <div className="dj-card glass-panel">
          <div className="dj-badge">
            <Radio size={18} />
            Live DJ
          </div>

          <h3>DJ Set 21:00</h3>

          <div className="dj-info-grid">
            <span>
              <Clock3 size={18} />
              21:00 hằng ngày
            </span>

            <span>
              <Volume2 size={18} />
              Không khí sôi động
            </span>

            <span>
              <Sparkles size={18} />
              Hải sản + âm nhạc
            </span>
          </div>

          <div className="sound-bars">
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
        </div>
      </section>

      <section className="section dark-section">
        <SectionTitle
          eyebrow="Signature menu"
          title="Những món nên thử trước"
        />

        <div className="menu-grid">
          {signatureItems.slice(0, 3).map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>

        <div className="center-actions">
          <Link className="btn btn-ghost" to="/menu">
            Xem toàn bộ menu
          </Link>
        </div>
      </section>

      <section id="booking" className="section booking-section">
        <div>
          <SectionTitle
            eyebrow="Reservation"
            title="Đặt bàn nhanh để giữ chỗ đẹp."
            description="Bạn nhập thông tin, admin có thể xem và cập nhật trạng thái đặt bàn trong trang quản trị."
          />
        </div>

        <ReservationForm />
      </section>
    </>
  );
}
