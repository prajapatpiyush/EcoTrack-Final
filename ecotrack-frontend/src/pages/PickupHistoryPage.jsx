import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { pickupAPI } from '../services/api';
import Card from '../components/Card';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/Button';

const PickupHistoryPage = () => {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    pickupAPI.getUserPickups()
      .then(res => setPickups(res.data))
      .catch(() => setError('Failed to load pickup history.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader fullPage text="Loading pickups..." />;

  return (
    <div className="page-wrapper">
      <div className="container--lg">

        <div className="page-header">
          <div>
            <h1 className="page-header__title">🚚 Pickup History</h1>
            <p className="page-header__subtitle">Track all your scheduled waste pickups.</p>
          </div>
          <Link to="/pickup-request" className="btn btn--primary btn--md">+ New Pickup</Link>
        </div>

        {/* Status legend */}
        <div className="flex gap-2 mb-6" style={{ flexWrap: 'wrap' }}>
          {['PENDING', 'ASSIGNED', 'COMPLETED', 'CANCELLED'].map(s => (
            <StatusBadge key={s} status={s} />
          ))}
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {pickups.length === 0 && !error ? (
          <Card>
            <EmptyState
              icon="🚛"
              title="No pickups scheduled yet"
              subtitle="Schedule your first pickup and we'll collect waste from your door."
              actionLabel="Schedule First Pickup"
              actionTo="/pickup-request"
            />
          </Card>
        ) : (
          <div className="flex-col gap-4">
            {pickups.map(pickup => (
              <Card key={pickup.id}>
                <Card.Body>
                  <div className="flex-between" style={{ flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div className="flex gap-3 mb-4" style={{ alignItems: 'center' }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'var(--text-base)' }}>
                          Pickup #{pickup.id}
                        </span>
                        <StatusBadge status={pickup.status} />
                      </div>
                      <div className="flex-col gap-1">
                        <div className="info-row">
                          <span className="info-row__label">📍 Address</span>
                          <span className="info-row__value">{pickup.address}</span>
                        </div>
                        <div className="info-row">
                          <span className="info-row__label">📅 Pickup</span>
                          <span className="info-row__value">
                            {new Date(pickup.pickupDate).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="info-row">
                          <span className="info-row__label">🕐 Requested</span>
                          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--eco-text-muted)' }}>{new Date(pickup.createdAt).toLocaleDateString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PickupHistoryPage;
