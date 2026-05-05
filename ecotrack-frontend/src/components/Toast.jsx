import { createContext, useContext, useState, useCallback, useEffect } from 'react';

// ─── Context ──────────────────────────────────────────────────────────────────
const ToastContext = createContext(null);

// ─── Individual Toast item ────────────────────────────────────────────────────
const TOAST_COLORS = {
  success: { bg: '#f0fdf4', border: '#86efac', color: '#166534', icon: '✅' },
  error:   { bg: '#fef2f2', border: '#fca5a5', color: '#991b1b', icon: '❌' },
  info:    { bg: '#eff6ff', border: '#93c5fd', color: '#1e40af', icon: 'ℹ️' },
  warning: { bg: '#fffbeb', border: '#fcd34d', color: '#92400e', icon: '⚠️' },
};

// Dark mode overrides
const TOAST_COLORS_DARK = {
  success: { bg: '#0d2018', border: '#16a34a', color: '#86efac', icon: '✅' },
  error:   { bg: '#2d1515', border: '#dc2626', color: '#fca5a5', icon: '❌' },
  info:    { bg: '#0d1b3e', border: '#2563eb', color: '#93c5fd', icon: 'ℹ️' },
  warning: { bg: '#2d1f00', border: '#d97706', color: '#fcd34d', icon: '⚠️' },
};

const ToastItem = ({ toast, onRemove }) => {
  const isDark  = document.documentElement.getAttribute('data-theme') === 'dark';
  const palette = isDark ? TOAST_COLORS_DARK : TOAST_COLORS;
  const style   = palette[toast.type] || palette.info;

  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), toast.duration || 4000);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
      padding: '14px 16px',
      borderRadius: 12,
      border: `1px solid ${style.border}`,
      background: style.bg,
      color: style.color,
      boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
      minWidth: 280,
      maxWidth: 420,
      animation: 'slideIn 0.25s ease',
      fontFamily: 'var(--font-body)',
    }}>
      <span style={{ fontSize: 17, flexShrink: 0, marginTop: 1 }}>{style.icon}</span>
      <div style={{ flex: 1, fontSize: 14, lineHeight: 1.5 }}>
        {toast.title && (
          <div style={{ fontWeight: 600, marginBottom: 2 }}>{toast.title}</div>
        )}
        <div style={{ opacity: toast.title ? 0.85 : 1 }}>{toast.message}</div>
      </div>
      <button onClick={() => onRemove(toast.id)} style={{
        background: 'none', border: 'none', cursor: 'pointer',
        fontSize: 16, color: style.color, opacity: 0.6,
        padding: '0 2px', lineHeight: 1, flexShrink: 0,
      }}>×</button>
    </div>
  );
};

// ─── Provider ─────────────────────────────────────────────────────────────────
let _idCounter = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const add = useCallback((message, type = 'info', options = {}) => {
    const id = ++_idCounter;
    setToasts(prev => [...prev, { id, message, type, ...options }]);
    return id;
  }, []);

  // Listen for global API 5xx errors emitted by axios interceptor
  useEffect(() => {
    const handler = (e) => {
      add(e.detail.message, 'error', { title: 'Server Error' });
    };
    window.addEventListener('eco:apierror', handler);
    return () => window.removeEventListener('eco:apierror', handler);
  }, [add]);

  // Convenience methods
  const toast = {
    success: (msg, opts) => add(msg, 'success', opts),
    error:   (msg, opts) => add(msg, 'error',   opts),
    info:    (msg, opts) => add(msg, 'info',     opts),
    warning: (msg, opts) => add(msg, 'warning',  opts),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast container — fixed bottom-right */}
      <div style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        pointerEvents: 'none',
      }}>
        <style>{`
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to   { transform: translateX(0);    opacity: 1; }
          }
        `}</style>
        {toasts.map(t => (
          <div key={t.id} style={{ pointerEvents: 'all' }}>
            <ToastItem toast={t} onRemove={remove} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

export default ToastProvider;
