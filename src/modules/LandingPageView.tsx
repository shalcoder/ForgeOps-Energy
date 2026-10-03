import React, { useState } from 'react';
import {
  ZapIcon,
  ShieldCheckIcon,
  ActivityIcon,
  CpuIcon,
  ArrowRightIcon,
  BarChartIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  SlidersIcon,
  CheckIcon,
  LayersIcon,
} from '../components/Icons';

type LandingPageProps = {
  onEnterApp: (view?: string) => void;
  onLogin: () => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
};

export function LandingPageView({ onEnterApp, onLogin, theme, setTheme }: LandingPageProps) {
  const [activeInteractiveStep, setActiveInteractiveStep] = useState<number>(0);
  const [simPressure, setSimPressure] = useState<number>(6.5);
  const [simLeakage, setSimLeakage] = useState<number>(85);

  // Dynamic preview calculations based on sliders
  const previewSec = (11.2 - (simLeakage * 0.015) - (7.2 - simPressure) * 0.25).toFixed(1);
  const previewSavings = Math.round(48000 * (simLeakage / 85));
  const previewPayback = (8500 / ((previewSavings / 30) * 30)).toFixed(1);

  const loopSteps = [
    {
      num: '01',
      title: 'Sense & Detect (System 1)',
      subtitle: 'Deterministic Submetering Edge Triage',
      desc: 'Edge gateways continuously monitor 1-sec Modbus telemetry. Detects abnormal SEC spikes (+16.8% on CMP-01 compressor) while verifying safety interlocks within <30ms.',
      tag: 'EDGE ENGINE',
      badge: 'Latency: 28ms',
    },
    {
      num: '02',
      title: 'Investigate (System 2)',
      subtitle: '4-Agent Multi-MCP Synthesis',
      desc: 'Planner, Research, and Analysis agents correlate 6 live data sources (power, pressure, flow, MES production, CMMS leak complaints, and metallurgical scrap rates).',
      tag: 'MULTI-AGENT',
      badge: '6 Data Streams',
    },
    {
      num: '03',
      title: 'Simulate (Physics + Economics)',
      subtitle: 'Counterfactual What-If Sandbox',
      desc: 'Thermodynamic sonic orifice and isentropic curves evaluate 3 alternative repair scenarios, verifying throughput (≥10.2 t/h) and pressure (≥5.5 bar) constraints.',
      tag: 'THERMODYNAMICS',
      badge: 'BEE ADEETIE Ready',
    },
    {
      num: '04',
      title: 'Approve & Execute',
      subtitle: 'Human-in-the-Loop Decision Gate',
      desc: 'Plant Manager signs off on Pareto-optimal Scenario A. Work order WO-ENG-7922 is automatically created and dispatched to maintenance shift crew with zero throughput loss.',
      tag: 'GOVERNANCE',
      badge: 'CMMS Dispatched',
    },
    {
      num: '05',
      title: 'Verify & Normalise',
      subtitle: 'IPMVP Option B Bankable Savings',
      desc: 'Post-intervention telemetry confirms SEC dropped from 11.2 → 9.8 kWh/t. Normalizes for weather (+3.5°C) and production variations for audit-grade bankable savings.',
      tag: 'VERIFICATION',
      badge: '₹48k/mo Verified',
    },
  ];

  return (
    <div className="landing-wrapper">
      {/* ── Public Navbar ── */}
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <div className="landing-logo" onClick={() => onEnterApp('overview')} style={{ cursor: 'pointer' }}>
            <span className="brand-mark">
              <span>F</span>
            </span>
            <span className="brand-title">
              ForgeOps<span>Energy</span>
            </span>
            <span className="provenance-badge provenance-measured" style={{ marginLeft: '10px' }}>
              v2.4 Production
            </span>
          </div>

          <div className="landing-nav-links">
            <a href="#how-it-works">How It Works</a>
            <a href="#decision-2">Decision 2.0 AI</a>
            <a href="#economics">Foundry Economics</a>
            <a href="#architecture">Architecture</a>
          </div>

          <div className="landing-nav-actions">
            <button
              className="theme-toggle-segmented"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              title="Toggle Theme"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              {theme === 'light' ? (
                <>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                  <span>Dark</span>
                </>
              ) : (
                <>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
                  <span>Light</span>
                </>
              )}
            </button>

            <button className="btn-secondary-action" onClick={onLogin}>
              Sign In
            </button>

            <button className="btn-primary-action" onClick={() => onEnterApp('overview')}>
              <span>Enter Plant Operations &rarr;</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <header className="landing-hero">
        <div className="landing-hero-kicker">
          <span className="kicker-tag" style={{ border: '1px solid #d4dcd6', background: 'var(--bg-elevated)', color: 'var(--brand-primary)' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: '-1px', marginRight: '6px' }}>
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            ACTIVE INDUSTRIAL DECISION INTELLIGENCE
          </span>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Empowering Indian Manufacturing Foundries & SMEs
          </span>
        </div>

        <h1 className="landing-hero-title">
          The Autonomous Energy Operating System <br />
          <span>for Heavy Manufacturing.</span>
        </h1>

        <p className="landing-hero-lead">
          ForgeOps transforms passive energy meters into an active decision-intelligence engine. Continuously reduces
          <strong> Specific Energy Consumption (SEC)</strong> while strictly preserving throughput, metallurgical quality,
          and deterministic safety interlocks.
        </p>

        <div className="landing-hero-cta-row">
          <button className="btn-primary-action" style={{ padding: '12px 24px', fontSize: '14px' }} onClick={() => onEnterApp('overview')}>
            <ZapIcon size={16} />
            <span>Launch Plant Operations Cockpit</span>
            <ArrowRightIcon size={15} />
          </button>

          <button className="btn-secondary-action" style={{ padding: '12px 22px', fontSize: '14px' }} onClick={onLogin}>
            <span>Select Role Persona (Vaishak - Plant Mgr)</span>
          </button>
        </div>

        {/* Live Metrics Ticker Bar */}
        <div className="landing-ticker-bar">
          <div className="ticker-item">
            <span className="ticker-label">CURRENT SEC</span>
            <div className="ticker-val">
              <strong>9.8</strong> <small>kWh/t</small>
            </div>
            <span className="ticker-delta good">&darr; 8.4% vs baseline</span>
          </div>

          <div className="ticker-divider" />

          <div className="ticker-item">
            <span className="ticker-label">IDENTIFIED SAVINGS</span>
            <div className="ticker-val">
              <strong>₹3.8L</strong> <small>/ month</small>
            </div>
            <span className="ticker-delta">12 live opportunities</span>
          </div>

          <div className="ticker-divider" />

          <div className="ticker-item">
            <span className="ticker-label">AVERAGE PAYBACK</span>
            <div className="ticker-val">
              <strong>1.8</strong> <small>months</small>
            </div>
            <span className="ticker-delta good">BEE ADEETIE Eligible</span>
          </div>

          <div className="ticker-divider" />

          <div className="ticker-item">
            <span className="ticker-label">DECISION LATENCY</span>
            <div className="ticker-val">
              <strong>&lt; 30</strong> <small>ms</small>
            </div>
            <span className="ticker-delta good">System 1 Fast Triage</span>
          </div>
        </div>
      </header>

      {/* ── Section: The Five-Question Operational Journey ── */}
      <section id="how-it-works" className="landing-section">
        <div className="landing-section-header">
          <p className="eyebrow">INDUSTRIAL INFORMATION ARCHITECTURE</p>
          <h2>Built for the Plant Engineer’s Job, Not an AI Demo</h2>
          <p className="section-sub">
            The user answers five vital operational questions within seconds:
            <em> What is happening? &rarr; What needs attention? &rarr; Why is it happening? &rarr; What can I do? &rarr; What happened after I did it?</em>
          </p>
        </div>

        {/* Interactive Step Navigator */}
        <div className="interactive-loop-container card-clean">
          <div className="loop-step-nav">
            {loopSteps.map((step, idx) => (
              <button
                key={idx}
                className={`loop-nav-item ${activeInteractiveStep === idx ? 'active' : ''}`}
                onClick={() => setActiveInteractiveStep(idx)}
              >
                <span className="step-num">{step.num}</span>
                <div style={{ textAlign: 'left' }}>
                  <strong>{step.title}</strong>
                  <small>{step.tag}</small>
                </div>
              </button>
            ))}
          </div>

          <div className="loop-step-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span className="kicker-tag" style={{ border: '1px solid #d4e4d2', background: '#edf4ec', color: '#3b663b' }}>
                {loopSteps[activeInteractiveStep].tag} &bull; {loopSteps[activeInteractiveStep].badge}
              </span>
              <span className="provenance-badge provenance-measured">ISO 50001 Calibrated</span>
            </div>

            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', margin: '0 0 8px', color: 'var(--text-primary)' }}>
              {loopSteps[activeInteractiveStep].title}
            </h3>
            <h4 style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)', margin: '0 0 16px' }}>
              {loopSteps[activeInteractiveStep].subtitle}
            </h4>
            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '22px' }}>
              {loopSteps[activeInteractiveStep].desc}
            </p>

            {/* Interactive Preview Box based on Step */}
            {activeInteractiveStep === 0 && (
              <div className="preview-widget">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600 }}>Feeder F-03 / CMP-01 Telemetry</span>
                  <span style={{ fontSize: '11px', color: '#bd6249', fontWeight: 700 }}>+16.8% Above Baseline Envelope</span>
                </div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'baseline' }}>
                  <div><span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>MEASURED POWER:</span> <strong>61 kW</strong></div>
                  <div><span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>EXPECTED ENVELOPE:</span> <strong>47–53 kW</strong></div>
                  <div><span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>PRESSURE:</span> <strong>6.5 bar (Stable)</strong></div>
                </div>
              </div>
            )}

            {activeInteractiveStep === 1 && (
              <div className="preview-widget">
                <div style={{ fontSize: '11px', fontWeight: 600, marginBottom: '8px' }}>Active 4-Agent Multi-MCP Synthesis</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', fontSize: '11px' }}>
                  <div style={{ padding: '8px', borderRadius: '4px', background: 'var(--bg-surface)', border: '1px solid var(--glass-border)' }}>✓ Planner (INV-1024)</div>
                  <div style={{ padding: '8px', borderRadius: '4px', background: 'var(--bg-surface)', border: '1px solid var(--glass-border)' }}>✓ Research (6 sources)</div>
                  <div style={{ padding: '8px', borderRadius: '4px', background: '#edf4ec', border: '1px solid #d4e4d2', color: '#3b663b', fontWeight: 600 }}>● Analysis (Air Leak 82%)</div>
                  <div style={{ padding: '8px', borderRadius: '4px', background: 'var(--bg-surface)', border: '1px solid var(--glass-border)' }}>○ Execution (Gate Ready)</div>
                </div>
              </div>
            )}

            {activeInteractiveStep === 2 && (
              <div className="preview-widget">
                <div style={{ fontSize: '11px', fontWeight: 600, marginBottom: '10px' }}>
                  Interactive What-If Simulation Sandbox
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '12px' }}>
                  <div>
                    <label style={{ fontSize: '11px', display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                      <span>Target Pressure:</span> <strong>{simPressure} bar</strong>
                    </label>
                    <input
                      type="range"
                      min="6.0"
                      max="7.5"
                      step="0.1"
                      value={simPressure}
                      onChange={(e) => setSimPressure(parseFloat(e.target.value))}
                      style={{ width: '100%', accentColor: '#bd6249', marginTop: '4px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                      <span>Leakage Elimination:</span> <strong>{simLeakage}%</strong>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={simLeakage}
                      onChange={(e) => setSimLeakage(parseInt(e.target.value, 10))}
                      style={{ width: '100%', accentColor: '#5e7e60', marginTop: '4px' }}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '14px', fontSize: '11px', background: 'var(--bg-surface)', padding: '8px 12px', borderRadius: '6px' }}>
                  <span>Simulated SEC: <strong style={{ color: '#5e7e60' }}>{previewSec} kWh/t</strong></span>
                  <span>Projected Savings: <strong style={{ color: '#5e7e60' }}>₹{previewSavings.toLocaleString('en-IN')}/mo</strong></span>
                  <span>Est. Payback: <strong>{previewPayback} mo</strong></span>
                </div>
              </div>
            )}

            {activeInteractiveStep === 3 && (
              <div className="preview-widget">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600 }}>Work Order WO-ENG-7922 Prepared</span>
                  <span className="provenance-badge provenance-measured">Safety Interlocks PASS</span>
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Action: <strong>Repair braided coupling on Line 2 Moulding bank drop #4</strong> &bull; Scheduled shift changeover (42 min) &bull; Zero production line stop.
                </p>
              </div>
            )}

            {activeInteractiveStep === 4 && (
              <div className="preview-widget">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600 }}>IPMVP Option B Verified Results</span>
                  <span className="provenance-badge provenance-verified">Verified</span>
                </div>
                <div style={{ display: 'flex', gap: '16px', fontSize: '11.5px' }}>
                  <div>Measured SEC: <strong style={{ color: '#5e7e60' }}>9.8 kWh/t</strong> (Was 11.2)</div>
                  <div>Power Restored: <strong style={{ color: '#5e7e60' }}>49 kW</strong> (Was 61)</div>
                  <div>Audit Ledger: <span className="font-mono">SHA-256 #89c4</span></div>
                </div>
              </div>
            )}

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                className="btn-primary-action"
                style={{ padding: '8px 16px', fontSize: '12px' }}
                onClick={() => onEnterApp(activeInteractiveStep === 0 ? 'overview' : activeInteractiveStep === 1 ? 'investigations' : activeInteractiveStep === 2 ? 'investigations' : activeInteractiveStep === 3 ? 'actions' : 'verification')}
              >
                <span>Jump to this Live View in App &rarr;</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section: The Indian SME Market Bottleneck & Solution ── */}
      <section id="economics" className="landing-section" style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)', padding: '60px 0' }}>
        <div className="landing-section-header">
          <p className="eyebrow">THE REALITY OF 63 MILLION INDIAN MSMES</p>
          <h2>Overcoming High Tariffs and Fragmented Floors</h2>
          <p className="section-sub">
            In Indian foundries, energy represents 15–30% of total plant operational expenditure.
            Traditional SCADA systems cost ₹25L–₹50L and take 9 months to deploy. ForgeOps delivers positive ROI in &lt;60 days.
          </p>
        </div>

        <div className="landing-grid-3">
          <div className="card-clean" style={{ padding: '24px' }}>
            <span className="kicker-tag" style={{ border: '1px solid #ebd0c9', background: '#fbf2ef', color: '#a75743' }}>
              CHRONIC COMPRESSED AIR LEAKS
            </span>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', margin: '10px 0 6px' }}>
              20% to 40% Power Wasted
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Compressors run continuously on-load to overcome distribution drop. ForgeOps identifies micro-leaks via sonic orifice equations without manual ultrasonic audits.
            </p>
            <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid var(--glass-border)', fontSize: '11px', color: '#5e7e60', fontWeight: 600 }}>
              &bull; Typical recovery: ₹35,000–₹65,000 / month per compressor
            </div>
          </div>

          <div className="card-clean" style={{ padding: '24px' }}>
            <span className="kicker-tag" style={{ border: '1px solid #e2d9cc', background: '#f5eee3', color: '#82592b' }}>
              DISCOM HT-2A TARIFF ARBITRAGE
            </span>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', margin: '10px 0 6px' }}>
              Time-of-Day (ToD) Surcharge Avoidance
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Peak tariffs (₹10.80/kWh during 18:00–22:00) inflate casting costs. ForgeOps aligns heavy melting cycles with solar off-peak windows (₹6.20/kWh) with zero throughput hit.
            </p>
            <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid var(--glass-border)', fontSize: '11px', color: '#5e7e60', fontWeight: 600 }}>
              &bull; Up to 18% reduction in monthly DISCOM demand charges
            </div>
          </div>

          <div className="card-clean" style={{ padding: '24px' }}>
            <span className="kicker-tag" style={{ border: '1px solid #d4e4d2', background: '#edf4ec', color: '#3b663b' }}>
              BEE ADEETIE SCHEME ALIGNED
            </span>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', margin: '10px 0 6px' }}>
              Bankable Investment Audits
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Government subsidies under BEE ADEETIE require standardized baseline normalization. ForgeOps produces tamper-evident audit dossiers meeting IPMVP criteria.
            </p>
            <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid var(--glass-border)', fontSize: '11px', color: '#5e7e60', fontWeight: 600 }}>
              &bull; Unlocks up to 30% capital subsidy on energy-efficient retrofits
            </div>
          </div>
        </div>
      </section>

      {/* ── Section: Dual-Process AI Architecture ── */}
      <section id="decision-2" className="landing-section">
        <div className="landing-section-header">
          <p className="eyebrow">DECISION 2.0 INTELLIGENCE ARCHITECTURE</p>
          <h2>Dual-Process Industrial AI: System 1 & System 2</h2>
          <p className="section-sub">
            Moving beyond passive dashboards and noisy text LLMs. Calibrated edge models guarantee deterministic safety, backed by multi-agent causal reasoning.
          </p>
        </div>

        <div className="architecture-dual-box card-clean" style={{ padding: '28px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span className="status-dot" style={{ background: '#5e7e60' }} />
                <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: '20px' }}>System 1: Edge Fast Triage</h3>
              </div>
              <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Local non-autoregressive decision models (Decision-2.0 Sol-2B / CLM-8B) running on DIN-rail edge hardware. Evaluates 100% of telemetry in &lt;30ms with zero parsing errors.
              </p>
              <ul style={{ margin: '14px 0', paddingLeft: '18px', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                <li>Hard deterministic safety interlocks (Pressure &ge; 5.5 bar, Temp &le; 1460&deg;C)</li>
                <li>Equipment-specific baseline envelope validation</li>
                <li>Instant filtering of sensor noise vs genuine anomalies</li>
              </ul>
              <span className="provenance-badge provenance-measured">Edge Gateway: 28ms Latency</span>
            </div>

            <div style={{ borderLeft: '1px solid var(--glass-border)', paddingLeft: '30px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span className="status-dot" style={{ background: '#bd6249' }} />
                <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: '20px' }}>System 2: Deep 4-Agent Pipeline</h3>
              </div>
              <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Cloud/On-prem agentic orchestrator triggered only when System 1 confirms an anomaly. Coordinates 4 specialized agents over Model Context Protocol (MCP):
              </p>
              <ul style={{ margin: '14px 0', paddingLeft: '18px', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                <li><strong>Planner:</strong> Formulates hypothesis test plan & retrieves CMMS context</li>
                <li><strong>Research:</strong> Pulls Modbus, SCADA, and MES telemetry via 16 MCP tools</li>
                <li><strong>Analysis:</strong> Competing Bayesian hypotheses + thermodynamic physics</li>
                <li><strong>Execution:</strong> Prepares Pareto-optimal dispatch orders for human approval</li>
              </ul>
              <span className="provenance-badge provenance-modelled">4-Agent LangGraph Pipeline</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final Call to Action ── */}
      <footer className="landing-footer-cta">
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', margin: '0 0 12px', color: 'var(--text-primary)' }}>
          Ready to optimize your foundry’s specific energy?
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 24px' }}>
          Explore the live Belgaum Foundry Complex workspace. Test the interactive what-if simulator, inspect multi-agent evidence, and sign off on real-world interventions.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px' }}>
          <button className="btn-primary-action" style={{ padding: '13px 28px', fontSize: '14px' }} onClick={() => onEnterApp('overview')}>
            <span>Launch Plant Operations Cockpit &rarr;</span>
          </button>
          <button className="btn-secondary-action" style={{ padding: '13px 22px', fontSize: '14px' }} onClick={onLogin}>
            <span>Sign In / Switch Role</span>
          </button>
        </div>

        <div style={{ marginTop: '48px', paddingTop: '20px', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--text-muted)', flexWrap: 'wrap', gap: '10px' }}>
          <div>&copy; 2026 ForgeOps Energy Inc. Aligned with Bureau of Energy Efficiency (BEE ADEETIE) and ISO 50001.</div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span style={{ cursor: 'pointer' }} onClick={() => onEnterApp('settings')}>System Health</span>
            <span style={{ cursor: 'pointer' }} onClick={() => onEnterApp('reports')}>Audit Dossiers</span>
            <span style={{ cursor: 'pointer' }} onClick={onLogin}>User Login</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
