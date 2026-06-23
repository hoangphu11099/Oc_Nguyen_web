import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Crown,
  MapPin,
  Music2,
  Radio,
  Shell,
  Sparkles,
  Users,
  Volume2,
} from "lucide-react";

import SectionTitle from "../components/SectionTitle";
import ReservationForm from "../components/ReservationForm";
import MenuCard from "../components/MenuCard";
import { menuApi } from "../lib/api";
import type { MenuItem } from "../types";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=1200&q=80";

const NORMAL_SPACE_IMAGE =
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=85";

const VIP_SPACE_IMAGE =
  "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1400&q=85";

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
      {/* HERO */}{" "}
      <section className="hero">
        {" "}
        <div className="hero-orb orb-one" />{" "}
        <div className="hero-orb orb-two" />
        <div className="hero-content reveal-up">
          <span className="eyebrow">
            <Sparkles size={16} />
            Hải sản tươi mỗi ngày
          </span>

          <h1>Ốc Nguyễn — vị biển sang trọng giữa trung tâm Chợ Quán.</h1>

          <p>
            Từ ốc hương, càng ghẹ đến những món nướng thơm lửa than, Ốc Nguyễn
            mang đến trải nghiệm hải sản đậm vị Sài Gòn tại 187 - 189 Lê Hồng
            Phong.
          </p>

          <div className="hero-actions">
            <Link className="btn" to="/menu">
              Xem menu
              <ArrowRight size={18} />
            </Link>

            <a className="btn btn-ghost" href="#booking">
              Đặt bàn ngay
            </a>
          </div>

          <div className="hero-stats">
            <span>
              <strong>30+</strong>
              Món hải sản
            </span>

            <span>
              <strong>19:00</strong>
              Mở cửa
            </span>

            <span>
              <strong>187-189</strong>
              Lê Hồng Phong, Chợ Quán, Hồ Chí Minh
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
                  <Sparkles size={15} />
                  Món nổi bật hôm nay
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
                    aria-label="Xem món trước">
                    <ChevronLeft size={20} />
                  </button>

                  <button
                    type="button"
                    className="signature-nav signature-next"
                    onClick={goNext}
                    aria-label="Xem món tiếp theo">
                    <ChevronRight size={20} />
                  </button>

                  <div className="signature-dots">
                    {signatureItems.map((item, index) => (
                      <button
                        key={item.id}
                        type="button"
                        className={index === activeIndex ? "active" : ""}
                        onClick={() => setActiveIndex(index)}
                        aria-label={`Xem món ${item.name}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <img src={FALLBACK_IMAGE} alt="Hải sản tại Ốc Nguyễn" />

              <div>
                <span>Món được yêu thích</span>
                <h3>Càng ghẹ rang me</h3>
                <p>Sốt me chua ngọt, thơm vị biển tươi.</p>
              </div>
            </>
          )}
        </div>
      </section>
      {/* GIỚI THIỆU */}
      <section className="section about-section">
        <SectionTitle
          eyebrow="Không gian & hương vị"
          title="Một điểm hẹn hải sản chỉn chu cho gia đình, bạn bè và đối tác."
          description="Không gian ấm cúng, ánh sáng vàng, món ăn phục vụ nhanh và căn bếp luôn giữ trọn độ tươi của từng nguyên liệu."
        />

        <div className="feature-grid">
          <div className="feature-card reveal-up">
            <Shell />

            <h3>Nguyên liệu tươi</h3>

            <p>
              Hải sản được chọn lọc mỗi ngày và chế biến vừa lửa để giữ trọn vị
              ngọt tự nhiên.
            </p>
          </div>

          <div className="feature-card reveal-up">
            <Award />

            <h3>Món ăn đậm vị</h3>

            <p>
              Công thức nước sốt riêng, phù hợp cho bữa tối gia đình lẫn những
              buổi tụ họp bạn bè.
            </p>
          </div>

          <div className="feature-card reveal-up">
            <MapPin />

            <h3>Vị trí thuận tiện</h3>

            <p>
              Nằm trên trục đường Lê Hồng Phong, dễ tìm và thuận tiện cho những
              cuộc hẹn sau giờ làm.
            </p>
          </div>
        </div>
      </section>
      {/* DJ NIGHT */}
      <section className="section dj-section">
        <div className="dj-glow dj-glow-one" />
        <div className="dj-glow dj-glow-two" />

        <div className="dj-content reveal-up">
          <span className="eyebrow">
            <Music2 size={16} />
            DJ Night mỗi ngày
          </span>

          <h2>21:00 lên nhạc — ăn ốc, chill cùng DJ sôi động.</h2>

          <p>
            Từ 21 giờ hằng ngày, Ốc Nguyễn mang đến không khí trẻ trung với âm
            nhạc DJ, ánh sáng ấm và những món hải sản đậm vị. Phù hợp cho nhóm
            bạn, sinh nhật, tụ họp sau giờ làm hoặc những buổi tối muốn đổi
            không khí.
          </p>

          <div className="dj-actions">
            <a className="btn" href="#booking">
              Đặt bàn tối nay
              <ArrowRight size={18} />
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
              Hải sản và âm nhạc
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
      {/* MÓN NỔI BẬT */}
      <section className="section dark-section">
        <SectionTitle
          eyebrow="Signature menu"
          title="Những món nên thử tại Ốc Nguyễn."
          description="Những món ăn nổi bật được nhiều thực khách yêu thích, chế biến từ hải sản tươi và công thức nước sốt riêng."
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
      {/* KHÔNG GIAN NHÀ HÀNG */}
      <section id="spaces" className="section space-section">
        <SectionTitle
          eyebrow="Không gian Ốc Nguyễn"
          title="Mỗi cuộc vui, một không gian phù hợp."
          description="Từ những buổi tụ họp sôi động đến các cuộc hẹn cần sự riêng tư, Ốc Nguyễn mang đến hai lựa chọn không gian phù hợp với từng trải nghiệm."
        />

        <div className="space-grid">
          {/* BÀN THƯỜNG */}
          <article className="space-card reveal-up">
            <div className="space-image-wrap">
              <img
                src={NORMAL_SPACE_IMAGE}
                alt="Không gian bàn thường tại Ốc Nguyễn"
              />

              <span className="space-floor-badge">Tầng dưới</span>
            </div>

            <div className="space-card-body">
              <span className="space-type">
                <Users size={18} />
                Khu bàn thường
              </span>

              <h3>Gần gũi, thoải mái và đầy không khí.</h3>

              <p>
                Khu bàn thường nằm tại tầng dưới với không gian rộng rãi, trẻ
                trung và sôi động. Đây là lựa chọn phù hợp cho gia đình, nhóm
                bạn, đồng nghiệp hoặc những buổi tụ họp cuối ngày.
              </p>

              <ul className="space-features">
                <li>
                  <CheckCircle2 size={17} />
                  Không gian gần gũi và thoải mái
                </li>

                <li>
                  <CheckCircle2 size={17} />
                  Phù hợp cho gia đình và nhóm bạn
                </li>

                <li>
                  <CheckCircle2 size={17} />
                  Gần khu vực âm nhạc và không khí sôi động
                </li>
              </ul>

              <a className="space-action" href="#booking">
                Đặt khu bàn thường
                <ArrowRight size={18} />
              </a>
            </div>
          </article>

          {/* PHÒNG VIP */}
          <article className="space-card space-card-vip reveal-up">
            <div className="space-image-wrap">
              <img
                src={VIP_SPACE_IMAGE}
                alt="Không gian VIP sang trọng tại Ốc Nguyễn"
              />

              <span className="space-floor-badge vip-badge">
                Không gian VIP
              </span>
            </div>

            <div className="space-card-body">
              <span className="space-type space-type-vip">
                <Crown size={18} />
                Khu VIP
              </span>

              <h3>Riêng tư, sang trọng và nâng tầm cuộc vui.</h3>

              <p>
                Khu VIP dành cho những vị khách yêu thích sự chỉn chu, riêng tư
                và khác biệt. Phù hợp cho sinh nhật, tiếp khách, gặp gỡ đối tác
                hoặc những buổi tiệc muốn tạo dấu ấn đặc biệt.
              </p>

              <ul className="space-features">
                <li>
                  <CheckCircle2 size={17} />
                  Không gian riêng tư và sang trọng
                </li>

                <li>
                  <CheckCircle2 size={17} />
                  Phù hợp cho sinh nhật và tiếp khách
                </li>

                <li>
                  <CheckCircle2 size={17} />
                  Trải nghiệm phục vụ chỉn chu hơn
                </li>
              </ul>

              <a className="space-action space-action-vip" href="#booking">
                Đặt khu VIP
                <ArrowRight size={18} />
              </a>
            </div>
          </article>
        </div>

        <p className="space-note">
          Không gian VIP đang được hoàn thiện và sẽ sớm phục vụ thực khách. Quý
          khách có thể ghi rõ nhu cầu tại phần ghi chú khi đặt bàn.
        </p>
      </section>
      {/* ĐẶT BÀN */}
      <section id="booking" className="section booking-section">
        <div>
          <SectionTitle
            eyebrow="Reservation"
            title="Đặt bàn nhanh để giữ chỗ đẹp."
            description="Đặt bàn trước để lựa chọn không gian phù hợp và tận hưởng trọn vẹn bữa tiệc hải sản cùng gia đình, bạn bè."
          />
        </div>

        <ReservationForm />
      </section>
    </>
  );
}
