import { useState } from 'react';
import { Link } from 'react-router-dom';
import { pickupAPI } from '../services/api';
import { useToast } from '../components/Toast';
import Card from '../components/Card';
import Button from '../components/Button';

const minFuture = () => new Date(Date.now() + 3600000).toISOString().slice(0, 16);

const PickupRequestPage = () => {
  const toast                        = useToast();
  const [address,    setAddress]     = useState('');
  const [pickupDate, setPickupDate]  = useState('');
  const [loading,    setLoading]     = useState(false);
  const [error,      setError]       = useState('');
  const [success,    setSuccess]     = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const trimmed = address.trim();
    if (trimmed.length < 5)   { setError('Address must be at least 5 characters'); return; }
    if (trimmed.length > 255) { setError('Address must be under 255 characters'); return; }
    if (!pickupDate)          { setError('Please select a pickup date and time'); return; }
    if (new Date(pickupDate) <= new Date()) { setError('Pickup date must be in the future'); return; }

    setLoading(true);
    try {
      const res = await pickupAPI.createPickup({
        address: trimmed,
        pickupDate: new Date(pickupDate).toISOString().replace('Z', ''),
      });
      setSuccess(res.data);
      setAddress(''); setPickupDate('');
      toast.success('Pickup scheduled successfully!');
    } catch (err) {
      const d = err.response?.data;
      setError(typeof d === 'object' ? Object.values(d).join(', ') : (d?.error || 'Failed to schedule pickup.'));
    } finally { setLoading(false); }
  };

  return (
    <div className="page-wrapper">
      <div className="container--md">

        <div className="page-header">
          <div>
            <h1 className="page-header__title">🚚 Schedule Pickup</h1>
            <p className="page-header__subtitle">We'll collect your waste right from your doorstep.</p>
          </div>
        </div>

        {/* Success */}
        {success && (
          <Card>
            <Card.Body>
              <div style={{ fontSize: 32, marginBottom: 'var(--space-2)' }}>✅</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--eco-primary)', marginBottom: 'var(--space-4)' }}>
                Pickup Scheduled!
              </div>
              <div className="flex-col gap-2 mb-5">
                {[
                  { label: 'Pickup ID',   value: `#${success.id}` },
                  { label: 'Address',     value: success.address },
                  { label: 'Date & Time', value: new Date(success.pickupDate).toLocaleString('en-IN') },
                  { label: 'Status',      value: success.status },
                ].map(item => (
                  <div key={item.label} className="flex-between" style={{ padding: 'var(--space-2) var(--space-4)', background: 'var(--eco-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--eco-border)', fontSize: 'var(--text-sm)' }}>
                    <span style={{ color: 'var(--eco-text-muted)' }}>{item.label}</span>
                    <span style={{ fontWeight: 600, color: item.label === 'Status' ? 'var(--eco-warning)' : 'var(--eco-text)' }}>{item.value}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <Button variant="primary" size="md" onClick={() => setSuccess(null)}>Schedule Another</Button>
                <Link to="/pickup-history" className="btn btn--secondary btn--md">View History</Link>
              </div>
            </Card.Body>
          </Card>
        )}

        {!success && (
          <>
            <Card>
              <Card.Header title="Pickup Details" />
              <Card.Body>
                {error && <div className="alert alert-error">{error}</div>}
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label form-label--required" htmlFor="address">Pickup Address</label>
                    <textarea id="address" className="form-input" rows={3}
                      placeholder="Enter full address including house number, street, area, city..."
                      value={address}
                      onChange={e => { setAddress(e.target.value); setError(''); }}
                      style={{ resize: 'vertical', minHeight: 80 }} />
                    <div className="form-help">{address.trim().length} / 255 characters (min 5)</div>
                  </div>
                  <div className="form-group">
                    <label className="form-label form-label--required" htmlFor="pickupDate">
                      Preferred Date &amp; Time
                    </label>
                    <input id="pickupDate" type="datetime-local" className="form-input"
                      min={minFuture()} value={pickupDate}
                      onChange={e => { setPickupDate(e.target.value); setError(''); }} />
                    <div className="form-help">Must be at least 1 hour from now</div>
                  </div>

                  {/* Checklist */}
                  <div style={{ padding: 'var(--space-4)', background: 'var(--eco-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--eco-border)', marginBottom: 'var(--space-5)' }}>
                    <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--eco-primary)', marginBottom: 'var(--space-2)' }}>📋 What to prepare:</div>
                    <ul style={{ paddingLeft: 'var(--space-5)', fontSize: 'var(--text-sm)', color: 'var(--eco-text-secondary)', lineHeight: 1.8 }}>
                      <li>Segregate waste into Dry / Wet / E-Waste</li>
                      <li>Pack waste securely in bags or boxes</li>
                      <li>Be available at the scheduled time</li>
                    </ul>
                  </div>

                  <Button type="submit" variant="primary" size="lg" full loading={loading}>🚚 Schedule Pickup</Button>
                </form>
              </Card.Body>
            </Card>

            <div style={{ marginTop: 'var(--space-4)', textAlign: 'center' }}>
              <Link to="/pickup-history" style={{ fontSize: 'var(--text-sm)', color: 'var(--eco-primary)' }}>
                View my pickup history →
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PickupRequestPage;
