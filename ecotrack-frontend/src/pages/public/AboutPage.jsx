import { Link } from 'react-router-dom';

const VALUES = [
  { icon: '🔍', title: 'Transparency',  desc: 'Every transaction, reward, and batch movement is tracked and visible.' },
  { icon: '🤝', title: 'Partnership',   desc: 'We grow with citizens, companies, and recyclers — together.' },
  { icon: '🌱', title: 'Sustainability',desc: 'Every decision we make is guided by long-term environmental impact.' },
  { icon: '💡', title: 'Innovation',    desc: 'We use technology to solve real problems at scale.' },
];

// Added static data to showcase platform impact
const IMPACT_STATS = [
  { id: 1, label: 'Waste Managed', value: '15,000+ kg', suffix: 'monthly' },
  { id: 2, label: 'Active Users', value: '2,500+', suffix: 'citizens & admins' },
  { id: 3, label: 'Carbon Offset', value: '45+ Tons', suffix: 'CO2 equivalent' },
  { id: 4, label: 'Recycling Partners', value: '12', suffix: 'verified facilities' },
];

const AboutPage = () => (
  <div style={{ background: 'var(--eco-bg)', minHeight: '100vh' }}>

    <div className="section-header" style={{ textAlign: 'center', padding: 'var(--space-12) var(--space-6)', background: 'var(--eco-surface)', borderBottom: '1px solid var(--eco-border)' }}>
      <h1 className="section-header__title" style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: 800, marginBottom: 'var(--space-3)' }}>About EcoTrack</h1>
      <p className="section-header__subtitle" style={{ fontSize: 'var(--text-lg)', color: 'var(--eco-text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
        We're on a mission to make India cleaner, one kilogram at a time, through smart collection and carbon tracking.
      </p>
    </div>

    <div className="container--lg" style={{ padding: 'var(--space-12) var(--space-6)', maxWidth: '1200px', margin: '0 auto' }}>

      {/* The Problem We Solve Section */}
      <div className="mb-16" style={{ marginBottom: 'var(--space-16)', textAlign: 'center', maxWidth: '800px', margin: '0 auto var(--space-16) auto' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>Why We Started</h2>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--eco-text-secondary)', lineHeight: 1.8, marginBottom: 'var(--space-4)' }}>
          Traditional waste collection methods are often fragmented and inefficient, leading to overflowing bins and high carbon footprints from unoptimized transport routes.
        </p>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--eco-text-secondary)', lineHeight: 1.8 }}>
          EcoTrack was built to bridge this gap. By utilizing smart tracking and data-driven insights, we optimize the entire lifecycle of waste—from the moment it leaves a household to its arrival at a recycling facility—drastically reducing logistical emissions and ensuring proper disposal.
        </p>
      </div>

      {/* Mission + Vision */}
      <div className="grid mb-16" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-8)', marginBottom: 'var(--space-16)' }}>
        <div className="card" style={{ padding: 'var(--space-8)', background: 'var(--eco-surface)', borderRadius: 'var(--radius-lg)', borderTop: '4px solid var(--eco-primary)', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: 40, marginBottom: 'var(--space-4)' }}>🎯</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 'var(--space-3)', color: 'var(--eco-primary)' }}>Our Mission</h2>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--eco-text-secondary)', lineHeight: 1.8 }}>
            To build India's most trusted waste management ecosystem by connecting citizens, companies, and recyclers on a single transparent platform — making responsible disposal easy, rewarding, and impactful.
          </p>
        </div>
        <div className="card" style={{ padding: 'var(--space-8)', background: 'var(--eco-surface)', borderRadius: 'var(--radius-lg)', borderTop: '4px solid var(--eco-info)', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: 40, marginBottom: 'var(--space-4)' }}>🌄</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 'var(--space-3)', color: 'var(--eco-info)' }}>Our Vision</h2>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--eco-text-secondary)', lineHeight: 1.8 }}>
            A zero-waste future where every household, business, and institution participates in a circular economy — where waste is not an end, but a beginning of new value.
          </p>
        </div>
      </div>

      {/* Impact Stats (Static Data) */}
      <div className="mb-16" style={{ marginBottom: 'var(--space-16)', background: 'var(--eco-primary)', color: 'white', borderRadius: 'var(--radius-lg)', padding: 'var(--space-10) var(--space-6)', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--space-8)' }}>Our Impact So Far</h2>
        <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-6)' }}>
          {IMPACT_STATS.map(stat => (
            <div key={stat.id}>
              <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, marginBottom: 'var(--space-2)' }}>{stat.value}</div>
              <div style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>{stat.label}</div>
              <div style={{ fontSize: 'var(--text-sm)', opacity: 0.8 }}>{stat.suffix}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Values */}
      <div className="mb-16" style={{ marginBottom: 'var(--space-16)' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--space-8)', textAlign: 'center' }}>Our Core Values</h2>
        <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-6)' }}>
          {VALUES.map(v => (
            <div key={v.title} style={{ padding: 'var(--space-6)', background: 'var(--eco-surface)', border: '1px solid var(--eco-border)', borderRadius: 'var(--radius-lg)', textAlign: 'center', transition: 'transform 0.2s', cursor: 'default' }}>
              <div style={{ fontSize: 36, marginBottom: 'var(--space-3)' }}>{v.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 'var(--text-lg)', marginBottom: 'var(--space-2)' }}>{v.title}</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--eco-text-secondary)', lineHeight: 1.6 }}>{v.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="cta-banner" style={{ textAlign: 'center', padding: 'var(--space-12)', background: 'var(--eco-surface)', border: '2px dashed var(--eco-border)', borderRadius: 'var(--radius-lg)' }}>
        <h3 className="cta-banner__title" style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>Be Part of the Change</h3>
        <p className="cta-banner__subtitle" style={{ fontSize: 'var(--text-base)', color: 'var(--eco-text-secondary)', marginBottom: 'var(--space-6)' }}>Join the movement to build a greener, cleaner environment today.</p>
        <Link to="/register" className="btn btn--primary btn--lg" style={{ display: 'inline-block', padding: 'var(--space-3) var(--space-8)', background: 'var(--eco-primary)', color: 'white', textDecoration: 'none', borderRadius: 'var(--radius-full)', fontWeight: 600 }}>
          Join EcoTrack →
        </Link>
      </div>

    </div>
  </div>
);

export default AboutPage;