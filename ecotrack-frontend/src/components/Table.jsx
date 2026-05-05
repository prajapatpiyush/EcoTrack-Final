import Loader from './Loader';
import EmptyState from './EmptyState';

/**
 * Table — standardized data table for all EcoTrack admin pages.
 *
 * Props:
 *   columns  — [{ key, label, style? }]
 *   rows     — array of objects (keyed by column.key) or render functions
 *   loading  — boolean
 *   empty    — { icon, title, subtitle, actionLabel, onAction }
 *   caption  — optional accessible caption
 *
 * Usage:
 *   <Table
 *     columns={[{ key: 'id', label: 'ID' }, { key: 'name', label: 'Name' }]}
 *     rows={data.map(d => ({ id: `#${d.id}`, name: d.name }))}
 *     loading={loading}
 *     empty={{ icon:'📭', title:'No items' }}
 *   />
 *
 * For custom cell rendering, pass a `render` function per column:
 *   { key: 'status', label: 'Status', render: (val, row) => <StatusBadge status={val} /> }
 */

const Table = ({
  columns = [],
  rows    = [],
  loading = false,
  empty   = {},
  caption,
  title,
  action,
  count,
}) => (
  <div className="card" style={{ overflow: 'hidden' }}>
    {/* Optional card header */}
    {title && (
      <div className="card__header">
        <span>{title}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {count !== undefined && (
            <span className="chip chip--count">{count}</span>
          )}
          {action}
        </div>
      </div>
    )}

    <div className="table-wrapper" style={{ borderRadius: 0, border: 'none', boxShadow: 'none' }}>
      {loading ? (
        <Loader text="Loading..." />
      ) : rows.length === 0 ? (
        <EmptyState
          icon={empty.icon}
          title={empty.title}
          subtitle={empty.subtitle}
          actionLabel={empty.actionLabel}
          onAction={empty.onAction}
          actionTo={empty.actionTo}
        />
      ) : (
        <table className="table" aria-label={caption || title}>
          {caption && <caption className="visually-hidden">{caption}</caption>}
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col.key} style={col.headerStyle}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIdx) => (
              <tr key={row._key || rowIdx}>
                {columns.map(col => (
                  <td
                    key={col.key}
                    className={col.cellClass || ''}
                    style={col.cellStyle}
                  >
                    {col.render
                      ? col.render(row[col.key], row, rowIdx)
                      : row[col.key] ?? '—'
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  </div>
);

export default Table;
