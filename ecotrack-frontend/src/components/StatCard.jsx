import { Link } from 'react-router-dom';

/**
 * StatCard — KPI metric card used across all dashboards.
 *
 * Props:
 *   icon     — emoji string
 *   label    — stat label (uppercase small text)
 *   value    — main big number/string
 *   sub      — secondary subtitle
 *   accent   — CSS color for value (default: var(--eco-text))
 *   to       — optional Link destination on click
 */
const StatCard = ({ icon, label, value, sub, accent, to }) => {
  const inner = (
    <div
      className="stat-card"
      style={{ transition: to ? 'transform 0.15s, box-shadow 0.15s' : undefined }}
      onMouseEnter={e => { if (to) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}}
      onMouseLeave={e => { if (to) { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ flex: 1 }}>
          <div className="stat-card__label">{label}</div>
          <div className="stat-card__value" style={{ color: accent || 'var(--eco-text)' }}>
            {value}
          </div>
          {sub && <div className="stat-card__sub">{sub}</div>}
        </div>
        <div className="stat-card__icon">{icon}</div>
      </div>
    </div>
  );

  return to
    ? <Link to={to} style={{ textDecoration: 'none' }}>{inner}</Link>
    : inner;
};

export default StatCard;
