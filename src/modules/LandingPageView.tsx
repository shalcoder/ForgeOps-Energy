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
      desc: 'The prototype evaluates a Belgaum foundry demonstration fixture with deterministic baseline and safety rules. Live Modbus telemetry is an integration target, not connected in this deployment.',
      tag: 'EDGE ENGINE',
      badge: 'Synthetic fixture',
    },
    {
      num: '02',
      title: 'Investigate (System 2)',
      subtitle: '4-Agent Multi-MCP Synthesis',
      desc: 'Planner, Research, Analysis, and Execution agents assemble evidence from configured MCP tools or deterministic fallback fixtures. No live plant feeds are connected in this deployment.',
      tag: 'MULTI-AGENT',
      badge: '6 Data Streams',
    },
    {
      num: '03',
      title: 'Simulate (Physics + Economics)',
      subtitle: 'Counterfactual What-If Sandbox',
      desc: 'Thermodynamic sonic orifice and isentropic curves evaluate 3 alternative repair scenarios, verifying throughput (≥10.2 t/h) and pressure (≥5.5 bar) constraints.',
      tag: 'THERMODYNAMICS',
      badge: 'Modelled scenario',
    },
    {
      num: '04',
      title: 'Approve & Execute',
      subtitle: 'Human-in-the-Loop Decision Gate',
      desc: 'The operator reviews a ranked scenario and can record an approval in the prototype. Work-order dispatch is simulated; the application does not control plant equipment or connect to a live CMMS.',
      tag: 'GOVERNANCE',
      badge: 'Simulated approval',
    },
    {
      num: '05',
      title: 'Verify & Normalise',
      subtitle: 'Measurement & verification workflow',
      desc: 'The local verification model compares a stated baseline with scenario inputs and reports a modelled result. Field measurement and independent verification are required before calling savings verified.',
      tag: 'VERIFICATION',
      badge: 'Modelled estimate',
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
            <span className="provenance-badge provenance-simulated" style={{ marginLeft: '10px' }}>
              Prototype · demo data
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
          ForgeOps is an industrial energy decision-support prototype for foundry SMEs. It combines a four-role agent workflow,
          deterministic physics and economics models, operator review, and a measurement plan to help teams investigate
          <strong> Specific Energy Consumption (SEC)</strong> while keeping throughput, quality, and safety constraints visible.
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

        {/* Demonstration scenario metrics */}
        <div className="landing-ticker-bar">
          <div className="ticker-item">
            <span className="ticker-label">DEMO SEC</span>
            <div className="ticker-val">
              <strong>9.8</strong> <small>kWh/t</small>
            </div>
            <span className="ticker-delta">Reference fixture · not field measured</span>
          </div>

          <div className="ticker-divider" />

          <div className="ticker-item">
            <span className="ticker-label">MODELLED OPPORTUNITY</span>
            <div className="ticker-val">
              <strong>₹6,240</strong> <small>/ demo day</small>
            </div>
            <span className="ticker-delta">Scenario estimate · assumptions apply</span>
          </div>

          <div className="ticker-divider" />

          <div className="ticker-item">
            <span className="ticker-label">DEMO PAYBACK</span>
            <div className="ticker-val">
              <strong>1.8</strong> <small>months</small>
            </div>
            <span className="ticker-delta">Calculated from fixture inputs</span>
          </div>

          <div className="ticker-divider" />

          <div className="ticker-item">
            <span className="ticker-label">SYSTEM 1 MODE</span>
            <div className="ticker-val">
              <strong>Rules</strong> <small>fallback</small>
            </div>
            <span className="ticker-delta">Sol-2B weights not loaded</span>
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
              <span className="provenance-badge provenance-simulated">Demo fixture</span>
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
                  <div><span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>DEMO POWER:</span> <strong>61 kW</strong></div>
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
                  <span className="provenance-badge provenance-simulated">App constraints pass for scenario</span>
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Action: <strong>Repair braided coupling on Line 2 Moulding bank drop #4</strong> &bull; Scheduled shift changeover (42 min) &bull; Zero production line stop.
                </p>
              </div>
            )}

            {activeInteractiveStep === 4 && (
              <div className="preview-widget">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600 }}>Illustrative scenario output</span>
                  <span className="provenance-badge provenance-simulated">Modelled</span>
                </div>
                <div style={{ display: 'flex', gap: '16px', fontSize: '11.5px' }}>
                  <div>Scenario SEC: <strong style={{ color: '#5e7e60' }}>9.8 kWh/t</strong> (illustrative)</div>
                  <div>Power Restored: <strong style={{ color: '#5e7e60' }}>49 kW</strong> (Was 61)</div>
                  <div>Data source: <span className="font-mono">synthetic demo fixture</span></div>
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
            A retrofit-oriented workflow could reduce the cost and effort of finding energy waste. Deployment cost and payback depend on plant equipment, tariffs, and field measurements.
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
      &bull; Scenario opportunity varies by duty cycle, leakage, tariff, and repair cost; validate at site
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
              Load-shifting analysis can compare a plant’s tariff periods and renewable availability against furnace, batch, and quality constraints. No tariff, dispatch schedule, or production result is connected in this prototype.
            </p>
            <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid var(--glass-border)', fontSize: '11px', color: '#5e7e60', fontWeight: 600 }}>
              &bull; Savings depend on the local DISCOM tariff and an operations-approved schedule
            </div>
          </div>

          <div className="card-clean" style={{ padding: '24px' }}>
            <span className="kicker-tag" style={{ border: '1px solid #d4e4d2', background: '#edf4ec', color: '#3b663b' }}>
              BEE ADEETIE PROJECT-INPUT SUPPORT
            </span>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', margin: '10px 0 6px' }}>
              Audit Preparation Support
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              ForgeOps can organize baseline and project inputs for review by an SME and its qualified energy auditor. Scheme eligibility and any loan benefit are decided by BEE and the lender; this prototype does not produce an approved audit dossier.
            </p>
            <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid var(--glass-border)', fontSize: '11px', color: '#5e7e60', fontWeight: 600 }}>
              &bull; Helps organize project inputs; scheme eligibility requires independent review
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
            Deterministic safety and physics checks are kept separate from optional model-assisted reasoning. This prototype currently runs System 1 with its calibrated rules fallback.
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
                System 1 currently uses a calibrated deterministic fallback for routing and screening. Transformers, Hugging Face Hub, and tokenizers are installed, but Decision-2.0-Sol-2B weights are not present in the configured runtime. Safety checks remain explicit deterministic rules.
              </p>
              <ul style={{ margin: '14px 0', paddingLeft: '18px', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                <li>Hard deterministic safety interlocks (Pressure &ge; 5.5 bar, Temp &le; 1460&deg;C)</li>
                <li>Equipment-specific baseline envelope validation</li>
                <li>Instant filtering of sensor noise vs genuine anomalies</li>
              </ul>
              <span className="provenance-badge provenance-estimated">Native model: not loaded</span>
            </div>

            <div style={{ borderLeft: '1px solid var(--glass-border)', paddingLeft: '30px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span className="status-dot" style={{ background: '#bd6249' }} />
                <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: '20px' }}>System 2: Deep 4-Agent Pipeline</h3>
              </div>
              <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                The backend coordinates four bounded agent roles. Live provider calls depend on deployment configuration; otherwise the pipeline uses deterministic fallback behavior. MCP research tools are read-only:
              </p>
              <ul style={{ margin: '14px 0', paddingLeft: '18px', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                <li><strong>Planner:</strong> Formulates hypothesis test plan & retrieves CMMS context</li>
                <li><strong>Research:</strong> Retrieves available MCP evidence or demo fixtures</li>
                <li><strong>Analysis:</strong> Competing Bayesian hypotheses + thermodynamic physics</li>
                <li><strong>Execution:</strong> Ranks scenario options and prepares a proposed action for human review</li>
              </ul>
              <span className="provenance-badge provenance-modelled">4-agent prototype</span>
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
          Explore the Belgaum Foundry demonstration workspace. Test the what-if simulator, inspect evidence provenance, and review simulated approvals. No live plant controls are connected.
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
          <div>&copy; 2026 ForgeOps Energy · Industrial energy decision-support prototype</div>
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
