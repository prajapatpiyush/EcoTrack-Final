import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/Card';

/**
 * DATA CONSTANTS
 * Expanded to provide professional depth and industrial-grade information.
 */

const TRUST_STATS = [
  { value: '42,500+', label: 'kg Waste Diverted', icon: '⚖️' },
  { value: '2,800+',  label: 'Active Citizens',    icon: '🧑' },
  { value: '35+',     label: 'Verified Partners',  icon: '♻️' },
  { value: '₹8.2L+',  label: 'Rewards Disbursed',  icon: '💵' },
  { value: '110+',    label: 'Tonnes CO2 Saved',   icon: '☁️' },
  { value: '4.2M',    label: 'Liters Water Saved', icon: '💧' },
  { value: '18+',     label: 'Wards Covered',      icon: '📍' },
  { value: '99.2%',   label: 'Traceability Rate',  icon: '🔍' },
];

const PROBLEMS = [
  {
    icon: '🚮',
    title: '31M Tonnes Landfilled',
    desc: 'Out of India\'s 62M tonnes of annual waste, nearly 50% ends up in unmanaged landfills. These sites create "Garbage Mountains" like those in Ghazipur, which release massive amounts of methane—a greenhouse gas 28x more potent than CO2.'
  },
  {
    icon: '☠️',
    title: '4.3M Tonnes E-Waste',
    desc: 'India is now the 3rd largest e-waste producer globally. 95% is handled by the informal sector using primitive acid-stripping methods, which leak lead, mercury, and cadmium into the urban soil and groundwater table.'
  },
  {
    icon: '💸',
    title: 'Economic Value Loss',
    desc: 'Estimates suggest India loses over $15 Billion annually due to inefficient waste management. Recyclable materials like high-grade PET and Aluminium are buried instead of being reintroduced into the manufacturing cycle.'
  },
  {
    icon: '🌊',
    title: 'Microplastic Contamination',
    desc: 'Unmanaged plastic waste breaks down into microplastics (<5mm). These particles have now entered the human food chain through water systems, with the average person ingesting approximately a credit card\'s worth of plastic every week.'
  },
  {
    icon: '🔥',
    title: 'Spontaneous Combustion',
    desc: 'Accumulated organic waste in landfills generates heat and methane. This leads to spontaneous fires that are nearly impossible to extinguish, releasing carcinogenic dioxins and furans into the air breathed by nearby residents.'
  },
  {
    icon: '📉',
    title: 'Informal Sector Vulnerability',
    desc: 'Over 1.5 million waste pickers in India work without protective gear, social security, or fixed income. The lack of a digital ledger means they are often exploited by middlemen in the recycling value chain.'
  },
];

const SOLUTIONS = [
  {
    icon: '🎁',
    title: 'Real-Time Valuation Engine',
    desc: 'Our Java-based backend tracks global secondary raw material prices. This ensures users receive fair market value (₹2–₹15/kg) for their waste, paid instantly to digital wallets via secure API gateways.'
  },
  {
    icon: '🚚',
    title: 'AI-Driven Logistics',
    desc: 'We use genetic algorithms for route optimization, reducing the fuel consumption of our collection fleet by 30%. Every pickup is timed to minimize idle engine hours and maximize collection density per ward.'
  },
  {
    icon: '🔗',
    title: 'Industrial Traceability',
    desc: 'Every gram of waste is assigned a unique Batch ID. We partner exclusively with Pollution Control Board (PCB) authorized units, providing a transparent digital audit trail from your doorstep to the final recycling plant.'
  },
  {
    icon: '📊',
    title: 'Carbon Offset Analytics',
    desc: 'EcoTrack quantifies your environmental impact. Our platform calculates energy saved (kWh) and CO2 avoided for every transaction, allowing users and corporates to download verified ESG impact reports.'
  },
  {
    icon: '🏢',
    title: 'B2B Compliance (EPR)',
    desc: 'We help businesses meet Extended Producer Responsibility (EPR) targets. By using EcoTrack, companies can legally document their waste recovery efforts to satisfy government environmental mandates and audits.'
  },
  {
    icon: '🛡️',
    title: 'Formalization of Labor',
    desc: 'We integrate local "Eco-Agents" into a formal system. They receive digital training, safety equipment, and fair commissions, transforming the informal waste-picking sector into a professional green workforce.'
  },
];

const MATERIAL_GRADES = [
  { name: 'PET Bottles', value: 'High', recycle_rate: '90%', reward: '₹12/kg', impact: 'Saves 3.8 barrels of oil per tonne' },
  { name: 'HDPE Plastic', value: 'High', recycle_rate: '85%', reward: '₹8/kg', impact: 'Used in high-quality piping' },
  { name: 'Mixed Paper', value: 'Medium', recycle_rate: '65%', reward: '₹4/kg', impact: 'Prevents deforestation' },
  { name: 'Aluminium', value: 'Very High', recycle_rate: '98%', reward: '₹15/kg', impact: 'Saves 95% energy vs virgin metal' },
  { name: 'Cardboard', value: 'Medium', recycle_rate: '70%', reward: '₹5/kg', impact: 'Primary packaging feedstock' },
  { name: 'Glass', value: 'Low', recycle_rate: '100%', reward: '₹2/kg', impact: 'Infinitely recyclable' },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    icon: '📦',
    title: 'Systematic Segregation',
    desc: 'The process starts at the source. Users separate waste into Dry (Plastic, Paper, Metal), Wet (Organic/Food), and Domestic Hazardous (E-Waste, Batteries). Proper segregation increases the value of your rewards.'
  },
  {
    step: '02',
    icon: '📱',
    title: 'Digital Logging',
    desc: 'Log into the EcoTrack dashboard to report your waste volume. Our system generates a secure collection token and assigns the nearest Eco-Agent based on real-time GPS location and vehicle capacity.'
  },
  {
    step: '03',
    icon: '⚖️',
    title: 'IoT-Verified Weighing',
    desc: 'Our agents arrive with IoT-integrated digital scales. The weight is synced via Bluetooth to the mobile app, eliminating manual entry errors and ensuring you are paid for every single gram collected.'
  },
  {
    step: '04',
    icon: '💰',
    title: 'Instant Wallet Credit',
    desc: 'Upon verification, the reward is calculated based on the day\'s material index. Funds are instantly moved to your Eco-Wallet, which can be withdrawn via UPI, IMPS, or donated to local green charities.'
  },
  {
    step: '05',
    icon: '🚛',
    title: 'Batch Consolidation',
    desc: 'Collected waste is transported to our Material Recovery Facilities (MRF). Here, items are baled into industrial-sized units to optimize the carbon footprint of transport to the final processing plants.'
  },
  {
    step: '06',
    icon: '♻️',
    title: 'Certified Processing',
    desc: 'The baled materials reach our PCB-authorized partners. Plastic is pelletized, paper is pulped, and metals are smelted. You receive a final notification when your waste has been officially recycled.'
  },
];

const FEATURES = [
  { icon: '♻️', title: '18+ Material Classes', desc: 'Categorization for everything from LDPE film to copper wiring.' },
  { icon: '🎁', title: 'Multi-Channel Payout', desc: 'Withdraw earnings via UPI, Bank Transfer, or Retail Vouchers.' },
  { icon: '🚚', title: 'On-Demand Scheduling', desc: 'Request pickups within 24 hours or set recurring weekly slots.' },
  { icon: '📊', title: 'Environmental Ledger', desc: 'Track your lifetime CO2 savings and trees-equivalent impact.' },
  { icon: '🏢', title: 'Corporate Dashboard', desc: 'Bulk management tools for offices, malls, and housing societies.' },
  { icon: '🌍', title: 'Community Heatmaps', desc: 'Contribute to Indore\'s city-wide waste reduction goals.' },
  { icon: '🛡️', title: 'Data Security', desc: 'All transactions and user data are encrypted via AES-256 standards.' },
  { icon: '📜', title: 'Tax Incentives', desc: 'Get certificates for your contributions to sustainable initiatives.' },
  { icon: '🤝', title: 'Eco-Agent Support', desc: 'Direct chat support with our localized collection personnel.' },
];

const FAQS = [
  {
    q: "What materials does EcoTrack NOT accept?",
    a: "We currently do not accept sanitary waste, medical waste (needles/syringes), or construction debris (bricks/concrete). These require specialized bio-hazard or C&D processing which is outside our current circular loop."
  },
  {
    q: "How are the waste prices determined?",
    a: "Our prices are dynamic. They are updated daily based on the 'Secondary Raw Material Index' from major recycling hubs in India. Factors include material purity, current demand for recycled pellets, and logistics costs."
  },
  {
    q: "Is there a minimum weight for pickup?",
    a: "For individual households, we recommend a minimum of 5kg of dry waste to optimize the carbon footprint of our vehicles. However, housing societies have no such restriction for their daily consolidated pickups."
  },
  {
    q: "How do I know my waste is actually recycled?",
    a: "Transparency is our core. Every pickup generates a 'Chain of Custody' digital receipt. Once the recycler processes the batch, the status in your app updates from 'Collected' to 'Recycled' with a link to the partner facility."
  },
  {
    q: "Can I use EcoTrack for my office or business?",
    a: "Yes. We offer 'EcoTrack Enterprise' which includes monthly sustainability audits, GST-compliant invoicing for your waste sales, and formal documentation for your Corporate Social Responsibility (CSR) reporting."
  },
  {
    q: "How does the referral program work?",
    a: "When you refer a neighbor or friend, you earn 'Eco-Points' for their first 5 successful pickups. These points can be used to unlock higher reward tiers or redeemed for eco-friendly products in our marketplace."
  },
  {
    q: "What is the Carbon Offset Certificate?",
    a: "It is a downloadable PDF that quantifies how much energy you saved and how much landfill space you prevented. Many of our users use these for their academic portfolios or company annual reports."
  },
  {
    q: "Are the payments taxable?",
    a: "The rewards paid for household waste are generally considered as 'Sale of Scrap' and are typically below the threshold for personal income tax for individuals, but we recommend consulting a professional for bulk commercial sales."
  }
];

/**
 * COMPONENT LOGIC
 */
 // Indian Flag SVG component for reuse
  const IndiaFlag = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="14" viewBox="0 0 301 201" style={{ borderRadius: '2px' }}>
      <g fill="none">
        <path fill="#f93" d="M.5.5h300v200H.5z" />
        <path fill="#fff" d="M.5 67.166h300v66.667H.5z" />
        <path fill="#128807" d="M.5 133.833h300V200.5H.5z" />
        <circle cx="150.5" cy="100.5" r="26.667" fill="#008" />
        <circle cx="150.5" cy="100.5" r="23.333" fill="#fff" />
        <circle cx="150.5" cy="100.5" r="4.667" fill="#008" />
        <circle cx="173.634" cy="103.546" r="1.167" fill="#008" />
        <path fill="#008" d="m150.5 123.833l.8-14l-.8-6.667l-.8 6.667z" />
        <circle cx="172.057" cy="109.429" r="1.167" fill="#008" />
        <path fill="#008" d="m144.461 123.038l4.396-13.316l.953-6.647l-2.498 6.232z" />
        <circle cx="169.012" cy="114.704" r="1.167" fill="#008" />
        <path fill="#008" d="m138.834 120.707l7.693-11.724l2.641-6.174l-4.026 5.373z" />
        <circle cx="164.705" cy="119.011" r="1.167" fill="#008" />
        <path fill="#008" d="m134.001 116.999l10.465-9.334l4.148-5.28l-5.28 4.148z" />
        <circle cx="159.429" cy="122.057" r="1.167" fill="#008" />
        <path fill="#008" d="m130.293 112.166l12.525-6.307l5.373-4.026l-6.174 2.641z" />
        <circle cx="153.546" cy="123.634" r="1.167" fill="#008" />
        <path fill="#008" d="m127.962 106.539l13.73-2.851l6.232-2.498l-6.647.953z" />
        <circle cx="147.454" cy="123.634" r="1.167" fill="#008" />
        <path fill="#008" d="m127.167 100.5l14 .8l6.667-.8l-6.667-.8z" />
        <circle cx="141.571" cy="122.057" r="1.167" fill="#008" />
        <path fill="#008" d="m127.962 94.461l13.316 4.396l6.647.953l-6.232-2.498z" />
        <circle cx="136.296" cy="119.011" r="1.167" fill="#008" />
        <path fill="#008" d="m130.293 88.833l11.724 7.693l6.174 2.64l-5.373-4.026z" />
        <circle cx="131.989" cy="114.704" r="1.167" fill="#008" />
        <path fill="#008" d="m134.001 84.001l9.334 10.465l5.28 4.148l-4.148-5.28z" />
        <circle cx="128.943" cy="109.429" r="1.167" fill="#008" />
        <path fill="#008" d="m138.834 80.293l6.307 12.524l4.026 5.374l-2.641-6.174z" />
        <circle cx="127.366" cy="103.546" r="1.167" fill="#008" />
        <path fill="#008" d="m144.461 77.962l2.851 13.73l2.498 6.232l-.953-6.646z" />
        <circle cx="127.366" cy="97.454" r="1.167" fill="#008" />
        <path fill="#008" d="m150.5 77.166l-.8 14l.8 6.667l.8-6.667z" />
        <circle cx="128.943" cy="91.57" r="1.167" fill="#008" />
        <path fill="#008" d="m156.539 77.962l-4.396 13.316l-.953 6.646l2.498-6.232z" />
        <circle cx="131.989" cy="86.295" r="1.167" fill="#008" />
        <path fill="#008" d="m162.167 80.293l-7.693 11.724l-2.64 6.174l4.026-5.374z" />
        <circle cx="136.296" cy="81.988" r="1.167" fill="#008" />
        <path fill="#008" d="m166.999 84.001l-10.465 9.334l-4.148 5.28l5.28-4.148z" />
        <circle cx="141.571" cy="78.943" r="1.167" fill="#008" />
        <path fill="#008" d="m170.707 88.833l-12.524 6.307l-5.373 4.026l6.174-2.64z" />
        <circle cx="147.454" cy="77.366" r="1.167" fill="#008" />
        <path fill="#008" d="m173.038 94.461l-13.73 2.851l-6.232 2.498l6.646-.953z" />
        <circle cx="153.546" cy="77.366" r="1.167" fill="#008" />
        <path fill="#008" d="m173.834 100.5l-14-.8l-6.667.8l6.667.8z" />
        <circle cx="159.429" cy="78.943" r="1.167" fill="#008" />
        <path fill="#008" d="m173.038 106.539l-13.316-4.396l-6.646-.953l6.232 2.498z" />
        <circle cx="164.705" cy="81.988" r="1.167" fill="#008" />
        <path fill="#008" d="m170.707 112.166l-11.724-7.693l-6.174-2.641l5.373 4.026z" />
        <circle cx="169.012" cy="86.295" r="1.167" fill="#008" />
        <path fill="#008" d="m166.999 116.999l-9.334-10.465l-5.28-4.148l4.148 5.28z" />
        <circle cx="172.057" cy="91.57" r="1.167" fill="#008" />
        <path fill="#008" d="m162.167 120.707l-6.307-12.525l-4.026-5.373l2.64 6.174z" />
        <circle cx="173.634" cy="97.454" r="1.167" fill="#008" />
        <path fill="#008" d="m156.539 123.038l-2.851-13.73l-2.498-6.232l.953 6.647z" />
      </g>
    </svg>
  );

const PublicHomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div style={{ background: 'var(--eco-bg)' }}>

      {/* ── Section 1: Hero ── */}
      <section style={{
        minHeight: '94vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 'var(--space-20) var(--space-6)',
        background: 'linear-gradient(135deg, var(--eco-bg) 0%, var(--eco-success-bg) 100%)',
        textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position:'absolute', width:500, height:500, top:-150, right:-150, borderRadius:'50%', background:'var(--eco-primary)', opacity:.06, pointerEvents:'none' }} />
        <div style={{ position:'absolute', width:300, height:300, bottom:-100, left:-100, borderRadius:'50%', background:'var(--eco-primary)', opacity:.05, pointerEvents:'none' }} />

        <div style={{ maxWidth: 850, position: 'relative', zIndex: 1 }}>
          <span
            className="badge"
            style={{
              marginBottom: 'var(--space-5)',
              fontSize: '32px',
              padding: '8px 20px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '15px',
              fontFamily: "'Teko', sans-serif", // Professional modern Hindi font
              letterSpacing: '1px',
              textTransform: 'uppercase',
              background: 'rgba(var(--eco-primary-rgb), 0.1)', // Soft background
              border: '1px solid var(--eco-primary)',
              borderRadius: '50px', // Pill shape for a "cool" look
              boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
            }}
          >
             <IndiaFlag />
             <span style={{
               background: 'linear-gradient(90deg, #FF9933, #128807)', // Saffron to Green gradient
               WebkitBackgroundClip: 'text',
               WebkitTextFillColor: 'transparent',
               fontWeight: 600
             }}>
               स्वच्छ भारत सुंदर भारत
             </span>
             <IndiaFlag />
          </span>

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(38px,6.5vw,68px)', fontWeight: 700, lineHeight: 1.08, marginBottom: 'var(--space-5)', letterSpacing: '-1px' }}>
            Transforming Waste into a <br />
            <span style={{ color: 'var(--eco-primary)', position: 'relative' }}>Traceable Asset Class</span>
          </h1>

          <p style={{ fontSize: 'clamp(16px,2vw,20px)', color: 'var(--eco-text-secondary)', marginBottom: 'var(--space-4)', lineHeight: 1.65, maxWidth: 650, margin: '0 auto var(--space-4)' }}>
            EcoTrack is an end-to-end digital ecosystem connecting 2,800+ households with certified industrial recyclers. We provide the infrastructure for a zero-waste lifestyle through data, transparency, and financial incentives.
          </p>

          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--eco-text-muted)', marginBottom: 'var(--space-10)' }}>
            "Clean India Green India" is a national campaign combining the Swachh Bharat Abhiyan (Clean India Mission) and environmental protection initiatives, launched officially on October 2, 2014.
          </p>

          <div className="flex-center gap-4" style={{ flexWrap: 'wrap' }}>
            {isAuthenticated
              ? <Link to="/dashboard" className="btn btn--primary btn--xl">Access Personal Dashboard →</Link>
              : <>
                  <Link to="/register" className="btn btn--primary btn--xl">🌱 Join the Movement</Link>
                  <Link to="/how-it-works" className="btn btn--secondary btn--xl">Technical Methodology</Link>
                </>
            }
          </div>

          <div className="grid mt-8" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 'var(--space-6)',
            maxWidth: 800,
            margin: 'var(--space-12) auto 0',
            borderTop: '1px solid var(--eco-border)',
            paddingTop: 'var(--space-8)'
          }}>
            {TRUST_STATS.map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, marginBottom: 'var(--space-1)' }}>{s.icon}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(16px,2vw,22px)', fontWeight: 800, color: 'var(--eco-primary)', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--eco-text-muted)', marginTop: 5 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 2: Problem Deep-Dive ── */}
      <section style={{ padding: 'var(--space-20) var(--space-6)', background: 'var(--eco-surface)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-16)' }}>
            <span className="badge badge--error" style={{ marginBottom: 'var(--space-3)' }}>🚨 The Environmental Reality</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,4vw,42px)', fontWeight: 700, marginBottom: 'var(--space-3)' }}>
              The Hidden Cost of "Throwing Away"
            </h2>
            <p style={{ color: 'var(--eco-text-secondary)', fontSize: 'var(--text-md)', maxWidth: 650, margin: '0 auto' }}>
              Waste management is no longer just about cleanliness; it is about resource security and public health. Every unsegregated bag is a missed economic opportunity.
            </p>
          </div>
          <div className="grid grid--auto" style={{ gap: 'var(--space-8)' }}>
            {PROBLEMS.map(p => (
              <div key={p.title} className="card" style={{ padding: 'var(--space-8)', borderTop: '4px solid var(--eco-error)', transition: 'transform 0.3s ease' }}>
                <div style={{ fontSize: 42, marginBottom: 'var(--space-4)' }}>{p.icon}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-3)' }}>{p.title}</h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--eco-text-secondary)', lineHeight: 1.8 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: The Solution ── */}
      <section style={{ padding: 'var(--space-20) var(--space-6)', background: 'var(--eco-bg)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-16)' }}>
            <span className="badge badge--success" style={{ marginBottom: 'var(--space-3)' }}>✅ The EcoTrack Architecture</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,4vw,42px)', fontWeight: 700, marginBottom: 'var(--space-3)' }}>
              Engineering a Zero-Waste Future
            </h2>
            <p style={{ color: 'var(--eco-text-secondary)', fontSize: 'var(--text-md)', maxWidth: 650, margin: '0 auto' }}>
              We apply full-stack Java engineering and data science to solve the world\'s oldest logistics problem: What to do with what we don\'t want.
            </p>
          </div>
          <div className="grid grid--auto" style={{ gap: 'var(--space-8)' }}>
            {SOLUTIONS.map(s => (
              <div key={s.title} className="card" style={{ padding: 'var(--space-8)', borderTop: '4px solid var(--eco-primary)' }}>
                <div style={{ fontSize: 42, marginBottom: 'var(--space-4)' }}>{s.icon}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-3)' }}>{s.title}</h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--eco-text-secondary)', lineHeight: 1.8 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 4: Material Index ── */}
      <section style={{ padding: 'var(--space-20) var(--space-6)', background: 'var(--eco-surface)' }}>
        <div className="container--lg">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px,4vw,38px)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
              Current Material Valuation
            </h2>
            <p style={{ color: 'var(--eco-text-secondary)', fontSize: 'var(--text-md)' }}>
              Dynamic rates updated as of {new Date().toLocaleDateString()}. Based on secondary raw material demand.
            </p>
          </div>

          <div style={{ overflowX: 'auto', background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--eco-border)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
              <thead style={{ background: 'var(--eco-bg)' }}>
                <tr>
                  <th style={{ padding: 'var(--space-4)', color: '#fffff', fontSize: 'var(--text-xs)', textTransform: 'uppercase' }}>Material Type</th>
                  <th style={{ padding: 'var(--space-4)', color: '#fffff', fontSize: 'var(--text-xs)', textTransform: 'uppercase' }}>Reward Rate</th>
                  <th style={{ padding: 'var(--space-4)', color: '#fffff', fontSize: 'var(--text-xs)', textTransform: 'uppercase' }}>Recyclability</th>
                  <th style={{ padding: 'var(--space-4)', color: '#fffff', fontSize: 'var(--text-xs)', textTransform: 'uppercase' }}>Environmental Impact</th>
                </tr>
              </thead>
             <tbody>
               {MATERIAL_GRADES.map((m, i) => (
                 <tr
                   key={i}
                   style={{
                     borderTop: '1px solid var(--eco-border)',
                     color: 'var(--eco-bg)' // Applies dark green to the entire row
                   }}
                 >
                   <td style={{
                     padding: 'var(--space-4)',
                     fontWeight: 600,
                     color: '#064e3b'
                   }}>
                     {m.name}
                   </td>
                   <td style={{
                     padding: 'var(--space-4)',
                     color: '#065f46', // Slightly brighter forest green for the reward value
                     fontWeight: 700
                   }}>
                     {m.reward}
                   </td>
                   <td style={{ padding: 'var(--space-4)' }}>
                     <span style={{
                       padding: '2px 8px',
                       borderRadius: '4px',
                       background: '#dcfce7', // Light mint background
                       color: '#064e3b',       // Dark green text
                       fontSize: '11px',
                       fontWeight: 700
                     }}>
                       {m.recycle_rate}
                     </span>
                   </td>
                   <td style={{
                     padding: 'var(--space-4)',
                     fontSize: 'var(--text-sm)',
                     color: '#14532d' // Deep moss green for the impact description
                   }}>
                     {m.impact}
                   </td>
                 </tr>
               ))}
             </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Section 5: Detailed Process ── */}
      <section style={{ padding: 'var(--space-20) var(--space-6)', background: 'var(--eco-bg)' }}>
        <div className="container--lg">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-16)' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,4vw,42px)', fontWeight: 700, marginBottom: 'var(--space-3)' }}>
              The Lifecycle of a Pickup
            </h2>
            <p style={{ color: 'var(--eco-text-secondary)', fontSize: 'var(--text-md)' }}>
              From the moment you log a bag to the moment it becomes a new product—transparency is our promise.
            </p>
          </div>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px,1fr))', gap: 'var(--space-10)' }}>
            {HOW_IT_WORKS.map((s, i) => (
              <div key={s.step} style={{ textAlign: 'center', padding: 'var(--space-4)', position: 'relative' }}>
                <div style={{
                  width: 70, height: 70, borderRadius: '24px', background: 'var(--eco-primary)',
                  color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 700,
                  margin: '0 auto var(--space-6)', transform: 'rotate(-5deg)'
                }}>
                  {s.step}
                </div>
                <div style={{ fontSize: 40, marginBottom: 'var(--space-4)' }}>{s.icon}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-3)' }}>{s.title}</h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--eco-text-secondary)', lineHeight: 1.8 }}>{s.desc}</p>

                {i < HOW_IT_WORKS.length - 1 && (
                  <div style={{
                    position: 'absolute', right: '-15%', top: '35px', fontSize: '30px',
                    color: 'var(--eco-border-strong)', display: 'none'
                  }} className="desktop-arrow">→</div>
                )}
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 'var(--space-12)' }}>
            <Link to="/how-it-works" className="btn btn--secondary btn--lg">Explore Full Operations Logistics →</Link>
          </div>
        </div>
      </section>

      {/* ── Section 6: Features ── */}
      <section style={{ padding: 'var(--space-20) var(--space-6)', background: 'var(--eco-surface)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-16)' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,4vw,42px)', fontWeight: 700, marginBottom: 'var(--space-3)' }}>
              Built for Scale & Impact
            </h2>
            <p style={{ color: 'var(--eco-text-secondary)', fontSize: 'var(--text-md)' }}>
              Proprietary features designed to make waste management as simple as ordering a pizza.
            </p>
          </div>
          <div className="grid grid--auto" style={{ gap: 'var(--space-6)' }}>
            {FEATURES.map(f => (
              <Card key={f.title} hover>
                <Card.Body style={{ padding: 'var(--space-8)' }}>
                  <div style={{ fontSize: 42, marginBottom: 'var(--space-4)' }}>{f.icon}</div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>{f.title}</h3>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--eco-text-secondary)', lineHeight: 1.6 }}>{f.desc}</p>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      </section>

{/* ── Section 7: Detailed FAQ ── */}
<section style={{ padding: 'var(--space-20) var(--space-6)', background: 'var(--eco-bg)' }}>
  <div className="container--sm">
    <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 700 }}>Frequently Asked Questions</h2>
      <p style={{ color: 'var(--eco-text-secondary)' }}>Clear answers for responsible citizens.</p>
    </div>

    {/* Changed from display: flex to display: grid */}
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)', // This creates two equal columns
      gap: 'var(--space-6)'
    }}>
      {FAQS.map((faq, idx) => (
        <div key={idx} style={{
          background: 'var(--eco-surface)',
          padding: 'var(--space-6)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--eco-border)',
          display: 'flex',
          flexDirection: 'column',
          height: '100%' // Ensures pairs have the same height if content differs
        }}>
          <h4 style={{ fontWeight: 700, marginBottom: 'var(--space-2)', display: 'flex', gap: '10px' }}>
            <span style={{ color: 'var(--eco-primary)' }}>Q:</span> {faq.q}
          </h4>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--eco-text-secondary)', lineHeight: 1.7, paddingLeft: '28px' }}>
            {faq.a}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>



    </div>
  );
};

export default PublicHomePage;