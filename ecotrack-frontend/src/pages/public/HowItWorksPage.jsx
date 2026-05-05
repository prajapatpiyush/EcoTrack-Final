import { Link } from 'react-router-dom';
import Card from '../../components/Card';

const STEPS = [
  {
    step: '01',
    icon: '📱',
    title: 'Digital Logging & Categorization',
    desc: 'Users access the EcoTrack dashboard to register waste. Our AI-assisted categorization helps you distinguish between recyclables, compostables, and hazardous items to ensure maximum reward value.',
    details: ['Source segregation guide', 'Photo-based verification', 'Instant slot booking'],
  },
  {
    step: '02',
    icon: '⚖️',
    title: 'Smart Weighing & Payout',
    desc: 'Our "Eco-Agents" arrive at your location with IoT-enabled weighing scales. The weight data is synced instantly to your profile, triggering an automated payment to your Eco-Wallet based on current market rates.',
    details: ['Transparent IoT weighing', 'Zero-wait digital payout', 'Audit-ready receipts'],
  },
  {
    step: '03',
    icon: '🏭',
    title: 'Batching & Circular Logistics',
    desc: 'Collected waste is transported to our Material Recovery Facilities (MRF). Here, waste is baled into industrial-sized batches, reducing transport emissions by 40% before heading to the processing plant.',
    details: ['Optimized route planning', 'Material grade sorting', 'Baling & compaction'],
  },
  {
    step: '04',
    icon: '♻️',
    title: 'End-of-Life Processing',
    desc: 'We work exclusively with PCB-certified partners. Whether it is turning plastic into pellets or organic waste into high-grade compost, we ensure a zero-landfill outcome with full digital traceability.',
    details: ['Traceable Batch IDs', 'Pollution Control certified', 'Sustainability reporting'],
  }
];

const REWARD_RATES = [
  { type: 'Dry Waste', examples: 'Paper, PET Bottles, Cardboard', rate: '₹2.50 / kg', points: '+1 pt', color: 'var(--eco-info)' },
  { type: 'Wet Waste', examples: 'Kitchen Scraps, Garden Waste', rate: '₹1.50 / kg', points: '+1 pt', color: 'var(--eco-success)' },
  { type: 'E-Waste', examples: 'Cables, Motherboards, Batteries', rate: '₹6.00 / kg', points: '+5 pt', color: 'var(--eco-warning)' },
  { type: 'Metals', examples: 'Aluminium Cans, Copper, Iron', rate: '₹14.00 / kg', points: '+10 pt', color: 'var(--eco-primary)' },
  { type: 'Textiles', examples: 'Old Clothes, Fabric Scraps', rate: '₹3.00 / kg', points: '+2 pt', color: 'var(--eco-secondary)' },
];

const TREATMENT_DATA = [
  {
    type: 'Normal (Household) Waste',
    focus: 'Daily Consumption Recovery',
    process: 'Focuses on volume-based segregation. We take mixed household dry waste and sort it into 12 different sub-categories (LDPE, HDPE, Paper grades) to feed back into local manufacturing.',
    impact: 'Reduces municipal load by 60%.'
  },
  {
    type: 'Industrial & Office Waste',
    focus: 'Compliance & Resource Recovery',
    process: 'Highly specialized. We handle bulk paper shredding, e-waste dismantling, and packaging waste from warehouses. This involves specialized destruction certificates and heavy-duty transport.',
    impact: '100% Legal & Green compliance.'
  }
];

const HowItWorksPage = () => (
  <div style={{ background: 'var(--eco-bg)', minHeight: '100vh', paddingBottom: 'var(--space-16)' }}>

    {/* Hero Section */}
    <div className="section-header" style={{ textAlign: 'center', padding: 'var(--space-12) var(--space-6)', background: 'var(--eco-surface)', borderBottom: '1px solid var(--eco-border)' }}>
      <h1 className="section-header__title" style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: 800, marginBottom: 'var(--space-3)' }}>
        The EcoTrack Methodology
      </h1>
      <p className="section-header__subtitle" style={{ fontSize: 'var(--text-lg)', color: 'var(--eco-text-secondary)', maxWidth: '700px', margin: '0 auto' }}>
        Learn how we bridge the gap between waste generation and professional recycling through data-driven logistics.
      </p>
    </div>

    <div className="container--lg" style={{ padding: 'var(--space-12) var(--space-6)', maxWidth: '1000px', margin: '0 auto' }}>

      {/* Main Operational Steps */}
      <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-10)', fontSize: 'var(--text-2xl)', fontWeight: 700 }}>Our 4-Step Ecosystem</h2>
      <div className="flex-col gap-8" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-10)', marginBottom: 'var(--space-20)' }}>
        {STEPS.map((s, i) => (
          <div key={s.step} style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 'var(--space-6)', alignItems: 'start' }}>
            <div style={{ textAlign: 'center', position: 'relative', height: '100%' }}>
              <div className="step-dot" style={{ margin: '0 auto', background: 'var(--eco-primary)', color: 'white', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem', zIndex: 2, position: 'relative' }}>
                {s.step}
              </div>
              {i < STEPS.length - 1 && (
                <div className="step-connector" style={{ position: 'absolute', top: '48px', bottom: '-40px', left: '50%', width: '2px', background: 'var(--eco-border)', transform: 'translateX(-50%)', zIndex: 1 }} />
              )}
            </div>

            <Card style={{ background: 'var(--eco-surface)', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid var(--eco-border)' }}>
              <Card.Body style={{ padding: 'var(--space-6)' }}>
                <div className="flex gap-4 mb-4" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                  <span style={{ fontSize: 40 }}>{s.icon}</span>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--eco-text)' }}>{s.title}</h2>
                </div>
                <p style={{ color: 'var(--eco-text-secondary)', fontSize: 'var(--text-base)', lineHeight: 1.7, marginBottom: 'var(--space-5)' }}>
                  {s.desc}
                </p>
                <div className="flex gap-2" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                  {s.details.map(d => (
                    <span key={d} className="chip" style={{ background: 'var(--eco-bg)', color: 'var(--eco-primary)', border: '1px solid var(--eco-border-strong)', padding: '4px 12px', borderRadius: '999px', fontSize: 'var(--text-sm)', fontWeight: 500 }}>
                      ✓ {d}
                    </span>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>

      {/* NEW SECTION: Waste Treatment Comparison */}
      <div className="mb-20" style={{ marginBottom: 'var(--space-20)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-4)', fontSize: 'var(--text-2xl)', fontWeight: 700 }}>Waste Treatment Deep-Dive</h2>
        <p style={{ textAlign: 'center', color: 'var(--eco-text-secondary)', marginBottom: 'var(--space-10)', maxWidth: '600px', margin: '0 auto var(--space-10)' }}>
          Understanding the difference between how we handle your home trash versus large-scale factory waste.
        </p>

        <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 'var(--space-8)' }}>
          {TREATMENT_DATA.map((item, idx) => (
            <Card key={idx} style={{ background: 'var(--eco-surface)', border: '1px solid var(--eco-border)' }}>
              <Card.Body style={{ padding: 'var(--space-8)' }}>
                <h3 style={{ color: 'var(--eco-primary)', fontWeight: 800, marginBottom: 'var(--space-2)' }}>{item.type}</h3>
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--eco-text-muted)', marginBottom: 'var(--space-4)' }}>
                   Primary Goal: {item.focus}
                </div>
                <p style={{ fontSize: 'var(--text-sm)', lineHeight: 1.8, color: 'var(--eco-text-secondary)', marginBottom: 'var(--space-4)' }}>
                  {item.process}
                </p>
                <div style={{ padding: 'var(--space-3)', background: 'var(--eco-bg)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                  🍃 Environmental Impact: {item.impact}
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>

      {/* Reward Matrix Section */}
      <div className="mb-16" style={{ marginBottom: 'var(--space-16)' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--space-2)', textAlign: 'center' }}>
          Real-Time Reward Matrix
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--eco-text-secondary)', marginBottom: 'var(--space-8)' }}>
          We use dynamic market pricing to ensure you get the best value for your recyclables.
        </p>

        <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>
          {REWARD_RATES.map((rate, index) => (
            <div key={index} style={{ background: 'var(--eco-surface)', borderTop: `4px solid ${rate.color}`, padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', border: '1px solid var(--eco-border)' }}>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-1)' }}>{rate.type}</h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--eco-text-secondary)', marginBottom: 'var(--space-4)', minHeight: '40px' }}>{rate.examples}</p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--eco-border)', paddingTop: 'var(--space-4)' }}>
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', color: 'var(--eco-text-secondary)', letterSpacing: '0.05em' }}>Market Rate</div>
                  <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--eco-text)' }}>{rate.rate}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', color: 'var(--eco-text-secondary)', letterSpacing: '0.05em' }}>Loyalty</div>
                  <div style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--eco-primary)' }}>{rate.points}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="cta-banner mt-8" style={{ background: 'var(--eco-primary)', color: 'white', padding: 'var(--space-12)', borderRadius: 'var(--radius-xl)', textAlign: 'center' }}>
        <h3 className="cta-banner__title" style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
          Ready to Monetize Your Waste?
        </h3>
        <p style={{ fontSize: 'var(--text-base)', opacity: 0.9, marginBottom: 'var(--space-8)' }}>
          Whether you are a single household or a multinational factory, we have the tools to make your waste management 100% circular.
        </p>
        <Link to="/register" className="btn btn--white btn--lg" style={{ background: 'white', color: 'var(--eco-primary)', padding: 'var(--space-3) var(--space-8)', borderRadius: 'var(--radius-full)', fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}>
          Start Logging Now →
        </Link>
      </div>

    </div>
  </div>
);

export default HowItWorksPage;