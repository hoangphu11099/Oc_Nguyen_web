import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PromotionPopup from "../components/PromotionPopup";

export default function PublicLayout() {
  return (
    <div className="site-shell">
      <Header />
      <PromotionPopup />
      <main className="site-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
