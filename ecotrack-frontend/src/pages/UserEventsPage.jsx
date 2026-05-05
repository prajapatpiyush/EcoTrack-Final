import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventAPI } from '../services/api';
import Card from '../components/Card';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';

const UserEventsPage = () => {
  const [events,  setEvents]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    eventAPI.getUserEvents()
      .then(res => setEvents(res.data))
      .catch(() => setError('Failed to load your events.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader fullPage text="Loading your events..." />;

  return (
    <div className="page-wrapper">
      <div className="container--lg">

        <div className="page-header">
          <div>
            <h1 className="page-header__title">📅 My Events</h1>
            <p className="page-header__subtitle">Events you have registered for.</p>
          </div>
          <Link to="/events" className="btn btn--primary btn--md">Browse Events</Link>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {events.length === 0 && !error ? (
          <Card>
            <EmptyState
              icon="📅" title="No events joined yet"
              subtitle="Browse upcoming events and register to participate."
              actionLabel="Browse Events →" actionTo="/events"
            />
          </Card>
        ) : (
          <div className="flex-col gap-4">
            {events.map(event => {
              const isPast = new Date(event.date) < new Date();
              const pct    = (event.currentParticipants / event.maxParticipants) * 100;
              return (
                <Card key={event.id}>
                  <Card.Body>
                    <div className="flex-between mb-4" style={{ flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                      <div style={{ flex: 1 }}>
                        <div className="flex gap-3 mb-2" style={{ alignItems: 'center', flexWrap: 'wrap' }}>
                          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)', fontWeight: 700 }}>
                            {event.title}
                          </h3>
                          <span className={`badge ${isPast ? 'badge--neutral' : 'badge--success'}`}>
                            {isPast ? '⏸ Past' : '🟢 Upcoming'}
                          </span>
                        </div>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--eco-text-secondary)', lineHeight: 1.6 }}>
                          {event.description}
                        </p>
                      </div>
                      <span className="badge badge--info">✓ Registered</span>
                    </div>

                    {/* Details */}
                    <div className="grid mb-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 'var(--space-3)' }}>
                      {[
                        { label: '📍 Location', value: event.location },
                        { label: '📅 Date', value: new Date(event.date).toLocaleString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) },
                      ].map(item => (
                        <div key={item.label} style={{ padding: 'var(--space-3) var(--space-4)', background: 'var(--eco-surface-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--eco-border)' }}>
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--eco-text-muted)', marginBottom: 3 }}>{item.label}</div>
                          <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{item.value}</div>
                        </div>
                      ))}
                    </div>

                    {/* Capacity bar */}
                    <div>
                      <div className="flex-between mb-2" style={{ fontSize: 'var(--text-xs)', color: 'var(--eco-text-muted)' }}>
                        <span>Participants</span>
                        <span>{event.currentParticipants} / {event.maxParticipants}</span>
                      </div>
                      <div className="progress">
                        <div className="progress__bar" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserEventsPage;
