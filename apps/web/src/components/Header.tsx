import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  ShieldCheck,
  UserPlus,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const [open, setOpen] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const closeMenu = () => setOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/");
  };

  return (
    <header className="header glass-panel">
      <Link to="/" className="brand brand-with-logo" onClick={closeMenu}>
        <span className="brand-logo-wrap">
          <img
            className="brand-logo"
            src="/images/logo.webp"
            alt="Logo Ốc Nguyễn"
          />
        </span>

        <span className="brand-text">
          <strong>Ốc Nguyễn</strong>
          <small>Quán đặc sản ốc</small>
        </span>
      </Link>
      <button
        className="menu-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-label="Mở menu">
        <Menu />
      </button>

      <nav className={open ? "nav open" : "nav"}>
        <NavLink to="/" onClick={closeMenu}>
          Trang chủ
        </NavLink>

        <NavLink to="/menu" onClick={closeMenu}>
          Menu
        </NavLink>

        {user && (
          <NavLink to={isAdmin ? "/admin" : "/dashboard"} onClick={closeMenu}>
            {isAdmin ? (
              <ShieldCheck size={18} />
            ) : (
              <LayoutDashboard size={18} />
            )}
            Dashboard
          </NavLink>
        )}

        {user ? (
          <>
            <span className="nav-user-label">
              <UserRound size={18} />
              {user.name}
            </span>

            <button className="nav-user nav-logout" onClick={handleLogout}>
              <LogOut size={18} />
              Đăng xuất
            </button>
          </>
        ) : (
          <div className="nav-auth">
            <NavLink className="nav-login" to="/login" onClick={closeMenu}>
              <LogIn size={18} />
              Đăng nhập
            </NavLink>

            <NavLink
              className="btn btn-small"
              to="/register"
              onClick={closeMenu}>
              <UserPlus size={18} />
              Đăng ký
            </NavLink>
          </div>
        )}
      </nav>
    </header>
  );
}
