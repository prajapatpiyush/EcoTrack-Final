import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { publicAPI, eventAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toast';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import Button from '../../components/Button';
import Card from '../../components/Card';

/**
 * 🇮🇳 IndiaFlag Component
 * Keeps branding consistent across the platform
 */
const IndiaFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="14" viewBox="0 0 301 201" style={{ borderRadius: '2px', display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }}>
    <g fill="none">
      <path fill="#f93" d="M.5.5h300v200H.5z" />
      <path fill="#fff" d="M.5 67.166h300v66.667H.5z" />
      <path fill="#128807" d="M.5 133.833h300V200.5H.5z" />
      <circle cx="150.5" cy="100.5" r="26.667" fill="#008" />
      <circle cx="150.5" cy="100.5" r="23.333" fill="#fff" />
      <circle cx="150.5" cy="100.5" r="4.667" fill="#008" />
    </g>
  </svg>
);

const EVENT_CATEGORIES = ['ALL', 'CLEANUP', 'WORKSHOP', 'SEMINAR', 'TREE_PLANTATION'];

const EventsPage = () => {
  // ── Auth & Notification Hooks ──
  const { isAuthenticated } = useAuth();
  const toast               = useToast();

  // ── State Management ──
  const [events, setEvents]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [joining, setJoining]       = useState(null);
  const [error, setError]           = useState('');
  const [category, setCategory]     = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  // ── Effect: Data Fetching ──
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await publicAPI.getEvents();
        // Assuming API returns array, if not handle res.data.content
        setEvents(Array.isArray(res.data) ? res.data : (res.data.content || []));
      } catch (err) {
        setError('Failed to load events. Please check your internet connection.');
        console.error('Event Load Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // ── Logic: Event Joining ──
  const handleJoin = async (eventId) => {
    if (!isAuthenticated) {
      toast.error('Please login to participate in events.');
      return;
    }

    setJoining(eventId);
    try {
      const res = await eventAPI.joinEvent(eventId);
      setEvents(prev => prev.map(e => e.id === eventId ? res.data : e));
      toast.success('Successfully registered for the event!', { title: 'Joined ✅' });
    } catch (err) {
      const msg = err.response?.data?.error || 'Could not join event.';
      toast.error(msg, { title: 'Registration Failed' });
    } finally {
      setJoining(null);
    }
  };

  // ── Logic: Filtering & Searching ──
  const filteredEvents = useMemo(() => {
    let result = [...events];

    if (category !== 'ALL') {
      result = result.filter(e => e.type === category || e.category === category);
    }

    if (searchTerm) {
      const query = searchTerm.toLowerCase();
      result = result.filter(e =>
        e.title.toLowerCase().includes(query) ||
        e.location.toLowerCase().includes(query)
      );
    }

    return result;
  }, [events, category, searchTerm]);

  // ── Logic: Impact Calculation ──
  const totalImpact = useMemo(() => {
    return events.reduce((acc, curr) => acc + (curr.currentParticipants || 0), 0);
  }, [events]);

  return (
    <div style={{ background: 'var(--eco-bg)', minHeight: '100vh' }}>

      {/* ── Section 1: Page Header ── */}
      <div className="section-header">
        <div style={{ marginBottom: 'var(--space-2)' }}>
          <IndiaFlag />
        </div>
        <h1 className="section-header__title">📅 Eco-Events</h1>
        <p className="section-header__subtitle">
          Sustainability events and workshops across India. Join to make a collective impact.
        </p>
      </div>

      <div className="container" style={{ padding: 'var(--space-10) var(--space-6)' }}>

        {/* ── Section 2: Alert & Info ── */}
        {!isAuthenticated && (
          <div className="alert alert-info" style={{ marginBottom: 'var(--space-8)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '20px' }}>🔒</span>
            <span>
              <strong>Member Exclusive:</strong> <Link to="/login" style={{ color: 'var(--eco-primary)', fontWeight: 700 }}>Sign in</Link> to join events, earn "Green Points", and get participation certificates.
            </span>
          </div>
        )}

        {error && <div className="alert alert-error" style={{ marginBottom: 'var(--space-6)' }}>{error}</div>}

        {/* ── Section 3: Toolbar (Filter & Search) ── */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-10)',
          padding: 'var(--space-4)',
          background: 'var(--eco-surface)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--eco-border)'
        }}>
          <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
            {EVENT_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`btn btn--sm ${category === cat ? 'btn--primary' : 'btn--ghost'}`}
                style={{ borderRadius: '20px', textTransform: 'capitalize' }}
              >
                {cat.toLowerCase().replace('_', ' ')}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '10px', flex: '1', justifyContent: 'flex-end', minWidth: '280px' }}>
            <input
              type="text"
              placeholder="Search by city or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--eco-border)',
                outline: 'none',
                width: '100%',
                maxWidth: '250px',
                fontSize: '14px'
              }}
            />
          </div>
        </div>

        {/* ── Section 4: Main Content Grid ── */}
        {loading ? (
          <div style={{ padding: 'var(--space-20) 0' }}>
            <Loader text="Loading upcoming sustainability events..." />
          </div>
        ) : filteredEvents.length === 0 ? (
          <EmptyState
            icon="📅"
            title="No events found"
            subtitle="Try changing your filters or check back later for new schedules."
          />
        ) : (
          <div className="grid grid--auto" style={{ gap: 'var(--space-8)' }}>
            {filteredEvents.map(event => {
              const pct = (event.currentParticipants / event.maxParticipants) * 100;
              const isFull = event.currentParticipants >= event.maxParticipants;

              return (
                <Card key={event.id} style={{ display: 'flex', flexDirection: 'column' }}>
                  <Card.Body style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

                    {/* Event Status Badges */}
                    <div className="flex gap-2 mb-4" style={{ flexWrap: 'wrap' }}>
                      <span className={`badge ${isFull ? 'badge--error' : 'badge--success'}`} style={{ fontWeight: 700 }}>
                        {isFull ? '🔴 House Full' : `🟢 ${event.maxParticipants - event.currentParticipants} spots left`}
                      </span>
                      {event.joined && (
                        <span className="badge" style={{ background: 'var(--eco-primary-subtle)', color: 'var(--eco-primary)', fontWeight: 700 }}>
                          ✓ Registered
                        </span>
                      )}
                    </div>

                    <h3 style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      marginBottom: 'var(--space-2)',
                      lineHeight: 1.3,
                      color: 'var(--eco-text)'
                    }}>
                      {event.title}
                    </h3>

                    <p style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--eco-text-secondary)',
                      lineHeight: 1.6,
                      marginBottom: 'var(--space-4)',
                      flex: 1
                    }}>
                      {event.description?.slice(0, 150)}...
                    </p>

                    <div className="flex-col gap-2 mb-5" style={{ fontSize: '13px', color: 'var(--eco-text-muted)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>📍</span> <span>{event.location}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>📅</span>
                        <span>{new Date(event.date).toLocaleString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        })}</span>
                      </div>
                    </div>

                    {/* Registration Progress */}
                    <div className="mb-5" style={{ background: 'var(--eco-surface-2)', padding: '12px', borderRadius: '8px' }}>
                      <div className="flex-between mb-2" style={{ fontSize: '12px', fontWeight: 600 }}>
                        <span style={{ color: 'var(--eco-text-secondary)' }}>Capacity Status</span>
                        <span style={{ color: 'var(--eco-text)' }}>{event.currentParticipants} / {event.maxParticipants}</span>
                      </div>
                      <div className="progress" style={{ height: '6px', background: '#e2e8f0' }}>
                        <div className="progress__bar" style={{
                          width: `${pct}%`,
                          transition: 'width 0.5s ease-in-out',
                          background: pct >= 90 ? '#ef4444' : pct >= 70 ? '#f59e0b' : 'var(--eco-primary)',
                        }} />
                      </div>
                    </div>

                    {/* Action Button Logic */}
                    {isAuthenticated ? (
                      event.joined ? (
                        <div style={{
                          textAlign: 'center',
                          padding: '10px',
                          background: 'var(--eco-bg)',
                          color: 'var(--eco-primary)',
                          borderRadius: 'var(--radius-sm)',
                          fontWeight: 700,
                          fontSize: '14px',
                          border: '1px dashed var(--eco-primary)'
                        }}>
                          🎉 You are going!
                        </div>
                      ) : (
                        <Button
                          variant="primary"
                          size="md"
                          full
                          loading={joining === event.id}
                          disabled={isFull}
                          onClick={() => handleJoin(event.id)}
                        >
                          {isFull ? 'Event Full' : 'Confirm Registration'}
                        </Button>
                      )
                    ) : (
                      <Link to="/login" className="btn btn--secondary btn--md btn--full" style={{ textAlign: 'center' }}>
                        Login to Participate
                      </Link>
                    )}
                  </Card.Body>
                </Card>
              );
            })}
          </div>
        )}
{/* ── Section 5: Swachh Bharat Impact Footer ── */}
<div style={{
  marginTop: 'var(--space-20)',
  padding: 'var(--space-12) var(--space-6)',
  background: 'var(--eco-surface-3)', // Uses surface-3 to stand out in both modes
  borderRadius: 'var(--radius-lg)',
  border: '1px solid var(--eco-border)',
  textAlign: 'center'
}}>
  <h2 style={{
    fontSize: '28px',
    fontWeight: 800,
    marginBottom: 'var(--space-4)',
    color: 'var(--eco-text)' // Adapts to mode
  }}>
    Collective Impact Tracker
  </h2>
  <p style={{
    color: 'var(--eco-text-secondary)',
    maxWidth: '600px',
    margin: '0 auto var(--space-10)',
    lineHeight: 1.6
  }}>
    Every event you attend contributes to the national goal of a cleaner India. Join hands with
    thousands of volunteers making a difference today.
  </p>

  <div className="grid grid--auto" style={{ gap: 'var(--space-6)' }}>
    {/* Impact Box 1 */}
    <div style={{
      padding: 'var(--space-6)',
      background: 'var(--eco-surface)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--eco-border)',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--eco-primary)', marginBottom: '4px' }}>
        {totalImpact}
      </div>
      <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, color: 'var(--eco-text-muted)' }}>
        Participants Mobilized
      </div>
    </div>

    {/* Impact Box 2 */}
    <div style={{
      padding: 'var(--space-6)',
      background: 'var(--eco-surface)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--eco-border)',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--eco-primary)', marginBottom: '4px' }}>
        {events.length}
      </div>
      <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, color: 'var(--eco-text-muted)' }}>
        Live Events
      </div>
    </div>

    {/* Impact Box 3 */}
    <div style={{
      padding: 'var(--space-6)',
      background: 'var(--eco-surface)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--eco-border)',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--eco-primary)', marginBottom: '4px' }}>
        12+
      </div>
      <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, color: 'var(--eco-text-muted)' }}>
        Partner Cities
      </div>
    </div>
  </div>

  <div style={{ marginTop: 'var(--space-10)' }}>
    <button
      onClick={() => setShowLeaderboard(!showLeaderboard)}
      className="btn btn--ghost"
      style={{ fontWeight: 600 }}
    >
      {showLeaderboard ? 'Hide Leaderboard' : 'View Top Volunteers'}
    </button>
  </div>

  {showLeaderboard && (
    <div style={{
      marginTop: '30px',
      maxWidth: '500px',
      margin: '30px auto 0',
      textAlign: 'left',
      background: 'var(--eco-surface)', // White in light mode, Dark in dark mode
      color: 'var(--eco-text)',
      padding: '24px',
      borderRadius: '12px',
      border: '1px solid var(--eco-border)',
      boxShadow: 'var(--shadow-lg)'
    }}>
       <h4 style={{
         marginBottom: '15px',
         borderBottom: '1px solid var(--eco-border)',
         paddingBottom: '10px',
         display: 'flex',
         alignItems: 'center',
         gap: '8px'
       }}>
         🏆 <span style={{ fontWeight: 800 }}>Top Change-Makers</span>
       </h4>
       <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          <li className="flex-between" style={{ padding: '10px 0', borderBottom: '1px solid var(--eco-surface-2)' }}>
            <span style={{ fontWeight: 500 }}>1. Rahul Sharma</span>
            <span style={{ color: 'var(--eco-primary)', fontWeight: 700 }}>42 Events</span>
          </li>
          <li className="flex-between" style={{ padding: '10px 0', borderBottom: '1px solid var(--eco-surface-2)' }}>
            <span style={{ fontWeight: 500 }}>2. Ananya Iyer</span>
            <span style={{ color: 'var(--eco-primary)', fontWeight: 700 }}>38 Events</span>
          </li>
          <li className="flex-between" style={{ padding: '10px 0' }}>
            <span style={{ fontWeight: 500 }}>3. Amit Verma</span>
            <span style={{ color: 'var(--eco-primary)', fontWeight: 700 }}>31 Events</span>
          </li>
       </ul>
    </div>
  )}
</div>

        {/* Final Branding Badge */}
        <div style={{ textAlign: 'center', marginTop: 'var(--space-12)', opacity: 0.6 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <IndiaFlag />
            <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              EcoTrack Event Management System
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EventsPage;