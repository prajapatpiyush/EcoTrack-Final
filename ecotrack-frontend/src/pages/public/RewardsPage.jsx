import { Link } from 'react-router-dom';
import Card from '../../components/Card';

const RATES = [
  { type: 'Dry Waste', icon: '📦', rate: '₹2', unit: 'per kg', color: 'var(--eco-info)',    bg: 'var(--eco-info-bg)',    examples: 'Paper, plastic, metal, cardboard, glass' },
  { type: 'Wet Waste', icon: '🍃', rate: '₹1', unit: 'per kg', color: 'var(--eco-success)', bg: 'var(--eco-success-bg)', examples: 'Food scraps, vegetable peels, organic matter' },
  { type: 'E-Waste',   icon: '💻', rate: '₹5', unit: 'per kg', color: 'var(--eco-warning)', bg: 'var(--eco-warning-bg)', examples: 'Batteries, phones, cables, circuit boards' },
];

const WALLET_INFO = [
  { icon: '⬆️', title: 'Earn on Submission', desc: 'Rewards credited instantly when you log waste or complete a pickup.' },
  { icon: '📊', title: 'Track Everything',    desc: 'See your full transaction history with timestamps and amounts.' },
  { icon: '🏆', title: 'Points System',       desc: '1 point per kg submitted. Redeem in future features.' },
];

const EXAMPLE = [
  { label: '3 kg Dry Waste', value: '+₹6.00' },
  { label: '2 kg Wet Waste', value: '+₹2.00' },
  { label: '1 kg E-Waste',   value: '+₹5.00' },
  { label: 'Total Earned',   value: '₹13.00 + 6 pts', hi: true },
];

const RewardsPage = () => (
  <div style={{ background: 'var(--eco-bg)', minHeight: '100vh' }}>

    <div className="section-header">
      <h1 className="section-header__title">💰 Earn Real Rewards</h1>
      <p className="section-header__subtitle">Every kilogram of waste you submit earns you money and eco-points — credited instantly to your EcoTrack wallet.</p>
    </div>

    <div className="container--lg" style={{ padding: 'var(--space-16) var(--space-6)' }}>

      {/* Rate Cards */}
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 'var(--space-6)' }}>Reward Rates</h2>
      <div className="grid grid--auto mb-16">
        {RATES.map(r => (
          <div key={r.type} className="card" style={{ padding: 'var(--space-6)', borderTop: `4px solid ${r.color}` }}>
            <div style={{ fontSize: 40, marginBottom: 'var(--space-3)' }}>{r.icon}</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-1)' }}>{r.type}</h3>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: 800, color: r.color, marginBottom: 'var(--space-1)' }}>
              {r.rate} <span style={{ fontSize: 'var(--text-base)', fontWeight: 500, color: 'var(--eco-text-muted)' }}>{r.unit}</span>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--eco-text-secondary)', marginBottom: 'var(--space-4)', lineHeight: 1.5 }}>{r.examples}</p>
            <span className="badge" style={{ background: r.bg, color: r.color }}>🏆 +1 point per kg</span>
          </div>
        ))}
      </div>

      {/* Wallet Explanation */}
      <Card>
        <Card.Body>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 'var(--space-5)' }}>💳 How the Wallet Works</h2>
          <div className="grid grid--auto-sm">
            {WALLET_INFO.map(w => (
              <div key={w.title} style={{ padding: 'var(--space-5)', background: 'var(--eco-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--eco-border)' }}>
                <div style={{ fontSize: 28, marginBottom: 'var(--space-2)' }}>{w.icon}</div>
                <div style={{ fontWeight: 600, fontSize: 'var(--text-base)', marginBottom: 'var(--space-1)' }}>{w.title}</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--eco-text-secondary)', lineHeight: 1.6 }}>{w.desc}</div>
              </div>
            ))}
          </div>
        </Card.Body>
      </Card>

      {/* Example */}
      <div className="cta-banner mt-8" style={{ marginTop: 'var(--space-8)' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>📱 Example Calculation</h3>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
          {EXAMPLE.map(e => (
            <div key={e.label} style={{ padding: 'var(--space-3) var(--space-4)', background: e.hi ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.12)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: 'var(--text-xs)', opacity: 0.8, marginBottom: 3 }}>{e.label}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 700, color: 'white' }}>{e.value}</div>
            </div>
          ))}
        </div>
        <Link to="/register" className="btn btn--white btn--lg">Start Earning Now →</Link>
      </div>
    </div>
  </div>
);

export default RewardsPage;
