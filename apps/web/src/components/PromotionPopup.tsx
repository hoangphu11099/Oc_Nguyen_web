import { useEffect, useState } from "react";
import { Gift, X } from "lucide-react";
import { promotionApi } from "../lib/api";
import type { Promotion } from "../types";

export default function PromotionPopup() {
  const [promotion, setPromotion] = useState<Promotion | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    promotionApi
      .getActive()
      .then((data) => {
        if (!data) return;

        const seenKey = `oc-nguyen-promo-seen-${data.id}`;
        const seen = sessionStorage.getItem(seenKey);

        if (!seen) {
          setPromotion(data);
          setOpen(true);
        }
      })
      .catch(() => undefined);
  }, []);

  const closePopup = () => {
    if (promotion) {
      sessionStorage.setItem(`oc-nguyen-promo-seen-${promotion.id}`, "true");
    }

    setOpen(false);
  };

  if (!open || !promotion) return null;

  return (
    <div className="promo-overlay">
      <div className="promo-popup">
        <button className="promo-close" onClick={closePopup}>
          <X size={20} />
        </button>

        <div className="promo-image-wrap">
          <img src={promotion.imageUrl} alt={promotion.title} />
        </div>

        <div className="promo-content">
          <span className="promo-eyebrow">
            <Gift size={18} />
            Khuyến mãi hôm nay
          </span>

          {promotion.highlightText && (
            <strong className="promo-highlight">
              {promotion.highlightText}
            </strong>
          )}

          <h2>{promotion.title}</h2>

          <p>{promotion.description}</p>

          {promotion.ctaText && promotion.ctaLink && (
            <a className="btn promo-btn" href={promotion.ctaLink}>
              {promotion.ctaText}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
