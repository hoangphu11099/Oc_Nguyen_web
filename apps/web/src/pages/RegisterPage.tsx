import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <form className="auth-card glass-panel reveal-up" onSubmit={handleSubmit}>
        <span className="eyebrow">Join Ốc Nguyễn</span>
        <h1>Đăng ký</h1>
        <p>Tạo tài khoản khách hàng để trải nghiệm đặt bàn nhanh hơn.</p>
        <label>Họ tên<input value={name} onChange={(e) => setName(e.target.value)} required /></label>
        <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
        <label>Mật khẩu<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required /></label>
        {error && <p className="error-message">{error}</p>}
        <button className="btn" disabled={loading}>{loading ? 'Đang tạo...' : 'Tạo tài khoản'}</button>
        <small>Đã có tài khoản? <Link to="/login">Đăng nhập</Link></small>
      </form>
    </section>
  );
}
