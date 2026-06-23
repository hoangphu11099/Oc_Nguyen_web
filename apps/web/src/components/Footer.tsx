import { Link } from "react-router-dom";
import { MapPin, Phone, Clock3 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <img
          className="footer-logo"
          src="/images/logo.webp"
          alt="Logo Ốc Nguyễn"
        />

        <div>
          <h2>Ốc Nguyễn</h2>
          <p>Hải sản tươi, không gian sang trọng, vị ngon Sài Gòn.</p>
          <small className="footer-copy">
            © 2026 @Ốc Nguyễn Quán. All rights reserved.
          </small>
        </div>
      </div>

      <div className="footer-center">
        <h4>Thông tin</h4>

        <div className="footer-links">
          <Link to="/about">Về chúng tôi</Link>
          <Link to="/contact">Liên hệ ngay</Link>
        </div>
      </div>

      <div className="footer-grid">
        <span>
          <MapPin size={18} /> 187 - 189 Lê Hồng Phong, Chợ Quán, TP.HCM
        </span>

        <span>
          <Phone size={18} /> Hotline: 0900 000 189
        </span>

        <span>
          <Clock3 size={18} /> Mở cửa: 19:00 - 03:30
        </span>
      </div>
    </footer>
  );
}
