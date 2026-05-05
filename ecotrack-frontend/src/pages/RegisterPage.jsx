import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';

const ROLES = [
  { value: 'CITIZEN', emoji: '🧑', label: 'Citizen', desc: 'Submit waste, earn rewards' },
  { value: 'COMPANY', emoji: '🏢', label: 'Company', desc: 'Bulk pickups, subscriptions' },
];

const RegisterPage = () => {
  const { login }   = useAuth();
  const navigate    = useNavigate();
  const [form,    setForm]    = useState({ name: '', email: '', password: '', role: 'CITIZEN' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true); setError('');
    try {
      const res = await authAPI.register(form);
      login(res.data);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const d = err.response?.data;
      if (typeof d === 'object' && d !== null) {
        setError(Object.values(d).join(', '));
      } else {
        setError(d?.error || 'Registration failed. Please try again.');
      }
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - var(--navbar-h))', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-10) var(--space-4)', background: 'var(--eco-bg)' }}>
      <div style={{ width: '100%', maxWidth: 480 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <div style={{ fontSize: 40, marginBottom: 'var(--space-3)' }}>🌱</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
            Join EcoTrack
          </h1>
          <p style={{ color: 'var(--eco-text-secondary)', fontSize: 'var(--text-base)' }}>
            Create your account and start making a difference
          </p>
        </div>

        <Card>
          <Card.Body>
            {error && <div className="alert alert-error">{error}</div>}

            {/* Role Selector */}
            <div className="form-group">
              <label className="form-label">I want to join as</label>
              <div className="grid grid--2" style={{ gap: 'var(--space-3)' }}>
                {ROLES.map(role => (
                  <button key={role.value} type="button"
                    onClick={() => setForm(p => ({ ...p, role: role.value }))}
                    style={{
                      padding: 'var(--space-4) var(--space-3)',
                      borderRadius: 'var(--radius-md)',
                      border: `2px solid ${form.role === role.value ? 'var(--eco-primary)' : 'var(--eco-border)'}`,
                      background: form.role === role.value ? 'var(--eco-primary-subtle)' : 'var(--eco-surface)',
                      cursor: 'pointer', textAlign: 'center',
                      transition: 'all var(--transition)',
                      boxShadow: form.role === role.value ? `0 0 0 3px var(--eco-primary-subtle)` : 'none',
                    }}>
                    <div style={{ fontSize: 20, marginBottom: 'var(--space-1)' }}>{role.emoji}</div>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: form.role === role.value ? 'var(--eco-primary)' : 'var(--eco-text)' }}>
                      {role.label}
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--eco-text-muted)', marginTop: 2 }}>
                      {role.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="name">Full name</label>
                <input id="name" name="name" type="text" className="form-input"
                  placeholder="Arjun Sharma" value={form.name}
                  onChange={handleChange} required autoComplete="name" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="email">Email address</label>
                <input id="email" name="email" type="email" className="form-input"
                  placeholder="you@example.com" value={form.email}
                  onChange={handleChange} required autoComplete="email" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="password">
                  Password
                </label>
                <input id="password" name="password" type="password" className="form-input"
                  placeholder="••••••••" value={form.password}
                  onChange={handleChange} required autoComplete="new-password" minLength={6} />
                <div className="form-help">Minimum 6 characters</div>
              </div>

              <Button type="submit" variant="primary" size="lg" full loading={loading}>
                Create {form.role === 'CITIZEN' ? 'Citizen' : 'Company'} Account
              </Button>
            </form>

            <p style={{ textAlign: 'center', fontSize: 'var(--text-sm)', color: 'var(--eco-text-secondary)', marginTop: 'var(--space-5)' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: 'var(--eco-primary)', fontWeight: 600 }}>Sign in</Link>
            </p>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
