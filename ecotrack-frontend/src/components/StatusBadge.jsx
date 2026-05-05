/**
 * StatusBadge — renders a coloured pill for any status in EcoTrack.
 *
 * Props:
 *   status  — string key: PENDING, ASSIGNED, COMPLETED, CANCELLED,
 *              CREATED, PROCESSED, CITIZEN, COMPANY, ADMIN,
 *              BASIC, PREMIUM, or any custom label
 *   size    — 'sm' | 'md' (default 'md')
 *   dot     — show a dot indicator before the label
 */

const CONFIG = {
  // Pickup / Batch statuses
  PENDING:   { label: '⏳ Pending',   cls: 'badge--pending'   },
  ASSIGNED:  { label: '🚚 Assigned',  cls: 'badge--assigned'  },
  COMPLETED: { label: '✅ Completed', cls: 'badge--completed' },
  CANCELLED: { label: '❌ Cancelled', cls: 'badge--cancelled' },
  CREATED:   { label: '🆕 Created',   cls: 'badge--created'   },
  PROCESSED: { label: '✅ Processed', cls: 'badge--processed' },

  // User roles
  ADMIN:     { label: '⚙️ Admin',   cls: 'badge--error'   },
  COMPANY:   { label: '🏢 Company', cls: 'badge--info'    },
  CITIZEN:   { label: '🧑 Citizen', cls: 'badge--success' },

  // Subscription
  BASIC:     { label: '🥈 Basic',   cls: 'badge--neutral' },
  PREMIUM:   { label: '🥇 Premium', cls: 'badge--warning' },

  // Generic
  UPCOMING:  { label: '🟢 Upcoming', cls: 'badge--success' },
  PAST:      { label: '⏸ Past',      cls: 'badge--neutral' },
  FULL:      { label: '🔴 Full',      cls: 'badge--error'  },
  JOINED:    { label: '✓ Joined',    cls: 'badge--info'   },
};

const SIZE_STYLES = {
  sm: { fontSize: 10, padding: '2px 8px' },
  md: { fontSize: 11, padding: '3px 10px' },
};

const StatusBadge = ({ status, size = 'md', dot = false, label: overrideLabel }) => {
  const cfg   = CONFIG[status?.toUpperCase()] || {
    label: status || '—',
    cls:   'badge--neutral',
  };
  const label = overrideLabel || cfg.label;
  const sz    = SIZE_STYLES[size] || SIZE_STYLES.md;

  return (
    <span
      className={`badge ${cfg.cls}`}
      style={{ fontSize: sz.fontSize, padding: sz.padding }}
    >
      {dot && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', display: 'inline-block', flexShrink: 0 }} />}
      {label}
    </span>
  );
};

export default StatusBadge;
