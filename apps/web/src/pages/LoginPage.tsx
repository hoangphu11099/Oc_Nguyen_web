import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const loggedUser = await login(email, password);
      navigate(loggedUser.role === "ADMIN" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <form
        className="auth-card glass-panel reveal-up"
        onSubmit={handleSubmit}
        autoComplete="off">
        <span className="eyebrow">Welcome back</span>

        <h1>Đăng nhập</h1>

        <p>
          Đăng nhập để đặt bàn nhanh hơn hoặc vào khu admin nếu bạn là quản trị
          viên.
        </p>

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email của bạn"
            autoComplete="off"
            required
          />
        </label>

        <label>
          Mật khẩu
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nhập mật khẩu"
            autoComplete="new-password"
            required
          />
        </label>

        {error && <p className="error-message">{error}</p>}

        <button className="btn" disabled={loading}>
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>

        <small>
          Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
        </small>
      </form>
    </section>
  );
}
