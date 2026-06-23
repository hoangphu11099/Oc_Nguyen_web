import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { menuApi } from "../lib/api";
import type { MenuItem } from "../types";
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=1200&q=80";

export default function SignatureCarousel() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    menuApi
      .getAll()
      .then((data) => {
        const signatures = data.filter(
          (item) => item.isSignature && item.isAvailable,
        );
        setItems(signatures);
      })
      .catch(() => setItems([]));
  }, []);

  const activeItem = useMemo(() => {
    if (items.length === 0) return null;
    return items[activeIndex % items.length];
  }, [items, activeIndex]);

  useEffect(() => {
    if (items.length <= 1) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [items.length]);

  const goPrev = () => {
    if (items.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const goNext = () => {
    if (items.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % items.length);
  };

  if (!activeItem) {
    return (
      <div className="hero-card floating-card signature-carousel">
        <img
          src="https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=1200&q=80"
          alt="Ốc Nguyễn"
        />
        <div>
          <span>Món được yêu thích</span>
          <h3>Càng ghẹ rang me</h3>
          <p>Sốt me chua ngọt, thơm vị biển tươi.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="hero-card floating-card signature-carousel">
      <div className="signature-image-frame" key={activeItem.id}>
        <img
          src={activeItem.imageUrl ?? FALLBACK_IMAGE}
          alt={activeItem.name}
          className="signature-slide-image"
        />
      </div>

      <div className="signature-info-card">
        <span>
          <Sparkles size={15} />
          Món nổi bật hôm nay
        </span>

        <h3>{activeItem.name}</h3>

        <p>{activeItem.description}</p>

        <strong>{activeItem.price.toLocaleString("vi-VN")} đ</strong>
      </div>

      {items.length > 1 && (
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
            {items.map((item, index) => (
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
    </div>
  );
}
