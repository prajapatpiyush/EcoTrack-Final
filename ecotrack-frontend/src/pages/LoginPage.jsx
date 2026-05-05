import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';

const LoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [form,    setForm]    = useState({ email: '', password: '' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';
  if (isAuthenticated) { navigate('/dashboard', { replace: true }); }

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await authAPI.login(form);
      login(res.data);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - var(--navbar-h))', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-10) var(--space-4)', background: 'var(--eco-bg)' }}>
      <div style={{ width: '100%', maxWidth: 440 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <div style={{ fontSize: 40, marginBottom: 'var(--space-3)' }}>🌿</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
            Welcome back
          </h1>
          <p style={{ color: 'var(--eco-text-secondary)', fontSize: 'var(--text-base)' }}>
            Sign in to your EcoTrack account
          </p>
        </div>

        <Card>
          <Card.Body>
            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="email">Email address</label>
                <input id="email" name="email" type="email" className="form-input"
                  placeholder="you@example.com" value={form.email}
                  onChange={handleChange} required autoComplete="email" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="password">Password</label>
                <input id="password" name="password" type="password" className="form-input"
                  placeholder="••••••••" value={form.password}
                  onChange={handleChange} required autoComplete="current-password" />
              </div>
              <Button type="submit" variant="primary" size="lg" full loading={loading}>
                Sign in
              </Button>
            </form>

            <div className="divider--label">or</div>

            <p style={{ textAlign: 'center', fontSize: 'var(--text-sm)', color: 'var(--eco-text-secondary)' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: 'var(--eco-primary)', fontWeight: 600 }}>Create one</Link>
            </p>
          </Card.Body>
        </Card>

        <div className="card mt-4" style={{ padding: 'var(--space-4) var(--space-5)' }}>
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--eco-text-secondary)' }}>
            <strong style={{ color: 'var(--eco-primary)' }}>💡 First time?</strong>{' '}
            Register a new account on the registration page to get started.
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
