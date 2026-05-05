import { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CONTACT_INFO = [
  { icon: '📍', title: 'Location',      value: 'Indore, Madhya Pradesh, India' },
  { icon: '📧', title: 'Email',         value: 'hello@ecotrack.in' },
  { icon: '🕐', title: 'Response Time', value: 'Within 24 hours' },
];

const ContactPage = () => {
  const [form,      setForm]      = useState({ name: '', email: '', message: '' });
  const [errors,    setErrors]    = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()    || form.name.trim().length < 2)    e.name    = 'Name must be at least 2 characters';
    if (!form.email.trim()   || !EMAIL_RE.test(form.email))     e.email   = 'Please enter a valid email address';
    if (!form.message.trim() || form.message.trim().length < 10) e.message = 'Message must be at least 10 characters';
    return e;
  };

  const handleChange = (field, value) => {
    setForm(p => ({ ...p, [field]: value }));
    if (errors[field]) setErrors(p => ({ ...p, [field]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    setTimeout(() => { setSubmitted(true); setLoading(false); }, 800);
  };

  return (
    <div style={{ background: 'var(--eco-bg)', minHeight: '100vh' }}>

      <div className="section-header">
        <h1 className="section-header__title">📬 Contact Us</h1>
        <p className="section-header__subtitle">Have questions? We'd love to hear from you.</p>
      </div>

      <div className="container--md" style={{ padding: 'var(--space-16) var(--space-6)' }}>

        {submitted ? (
          <Card>
            <Card.Body>
              <div style={{ textAlign: 'center', padding: 'var(--space-10) var(--space-6)' }}>
                <div style={{ fontSize: 52, marginBottom: 'var(--space-4)' }}>✅</div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--eco-primary)', marginBottom: 'var(--space-3)' }}>
                  Message Sent!
                </h2>
                <p style={{ color: 'var(--eco-text-secondary)', fontSize: 'var(--text-base)', marginBottom: 'var(--space-6)' }}>
                  Thank you for reaching out. We'll get back to you within 24 hours.
                </p>
                <Button variant="secondary" size="md"
                  onClick={() => { setSubmitted(false); setForm({ name: '', email: '', message: '' }); }}>
                  Send Another Message
                </Button>
              </div>
            </Card.Body>
          </Card>
        ) : (
          <div className="flex-col gap-6">
            <Card>
              <Card.Header title="Send us a message" />
              <Card.Body>
                <form onSubmit={handleSubmit} noValidate>
                  <div className="grid mb-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label form-label--required" htmlFor="name">Full Name</label>
                      <input id="name" className={`form-input${errors.name ? ' error' : ''}`}
                        placeholder="Arjun Sharma"
                        value={form.name} onChange={e => handleChange('name', e.target.value)} />
                      {errors.name && <div className="form-error">{errors.name}</div>}
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label form-label--required" htmlFor="email">Email Address</label>
                      <input id="email" type="email" className={`form-input${errors.email ? ' error' : ''}`}
                        placeholder="arjun@example.com"
                        value={form.email} onChange={e => handleChange('email', e.target.value)} />
                      {errors.email && <div className="form-error">{errors.email}</div>}
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label form-label--required" htmlFor="message">Message</label>
                    <textarea id="message" className={`form-input${errors.message ? ' error' : ''}`}
                      rows={5} placeholder="Tell us how we can help... (min 10 characters)"
                      value={form.message} onChange={e => handleChange('message', e.target.value)}
                      style={{ resize: 'vertical', minHeight: 120 }} />
                    {errors.message && <div className="form-error">{errors.message}</div>}
                    <div className="form-help" style={{ textAlign: 'right' }}>{form.message.length} / 10 min</div>
                  </div>
                  <Button type="submit" variant="primary" size="lg" full loading={loading}>
                    📬 Send Message
                  </Button>
                </form>
              </Card.Body>
            </Card>

            {/* Contact info */}
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)' }}>
              {CONTACT_INFO.map(info => (
                <div key={info.title} className="card" style={{ padding: 'var(--space-4) var(--space-5)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <div style={{ fontSize: 26 }}>{info.icon}</div>
                  <div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--eco-text-muted)', marginBottom: 2 }}>{info.title}</div>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--eco-text)' }}>{info.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactPage;
