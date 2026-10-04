import React, { useState } from 'react';
import {
  ActivityIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  ShieldCheckIcon,
  ClockIcon,
  ArrowRightIcon,
  SlidersIcon,
  FileTextIcon,
  ZapIcon,
  CheckIcon,
  XIcon,
} from '../components/Icons';

type InvestigationProps = {
  investigationId?: string;
  onNavigate: (view: string, detailId?: string) => void;
};

type InvestigationTab = 'summary' | 'evidence' | 'timeline' | 'hypotheses' | 'scenarios' | 'decision';

export function InvestigationWorkspace({
  investigationId = 'INV-1024',
  onNavigate,
}: InvestigationProps) {
  const [activeTab, setActiveTab] = useState<InvestigationTab>('summary');
  const [selectedEvidenceId, setSelectedEvidenceId] = useState('E1');
  const [reasoningDrawerOpen, setReasoningDrawerOpen] = useState(false);
  const [selectedScenarioId, setSelectedScenarioId] = useState<'A' | 'B' | 'C'>('A');
  const [decisionState, setDecisionState] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [selectedDecisionOption, setSelectedDecisionOption] = useState<'repair_leak' | 'reduce_pressure' | 'automate_idle'>('repair_leak');

  // Interactive Counterfactual Simulation States (Section 20 & 21 of Spec)
  const [customPressure, setCustomPressure] = useState<number>(6.5);
  const [customLeakMitigation, setCustomLeakMitigation] = useState<number>(85);
  const [customIdleDelay, setCustomIdleDelay] = useState<number>(45);

  // Timeline filter states
  const [filterTelemetry, setFilterTelemetry] = useState(true);
  const [filterProduction, setFilterProduction] = useState(true);
  const [filterMaintenance, setFilterMaintenance] = useState(true);
  const [filterAgent, setFilterAgent] = useState(true);

  const evidenceSources = [
    {
      id: 'E1',
      title: 'E1 Power trend telemetry',
      summary: 'Power increased from 49 kW to 61 kW (+16.8%) on Feeder F-03 submeter.',
      detail: 'Measured continuously on Schneider PM8000 submeter. Normal operating band for CMP-01 is 45–53 kW. Machine entered continuous on-load modulation at 08:34 AM.',
      provenance: 'Measured',
      timestamp: '08:34 AM',
    },
    {
      id: 'E2',
      title: 'E2 Pressure transducer trend',
      summary: 'Header pressure remained stable at 6.5 bar (±0.1 bar).',
      detail: 'Pressure sensor PT-02 at main receiver header showed no supply starvation. Confirms that compressor worked harder to maintain nominal setpoint.',
      provenance: 'Measured',
      timestamp: '08:37 AM',
    },
    {
      id: 'E3',
      title: 'E3 Air flow meter trend',
      summary: 'Flow remained constant at 397 CFM into Moulding Line 2.',
      detail: 'Flow meter FT-01 measured nominal consumption. The delta power is not explained by increased legitimate pneumatic tool usage.',
      provenance: 'Measured',
      timestamp: '08:38 AM',
    },
    {
      id: 'E4',
      title: 'E4 MES production throughput',
      summary: 'Line 2 production demand unchanged at 10.2 tons/hour.',
      detail: 'MES ERP job orders confirmed mold cycle count remained at nominal rate of 42 molds/hr. Zero production demand surge.',
      provenance: 'Verified',
      timestamp: '08:40 AM',
    },
    {
      id: 'E5',
      title: 'E5 CMMS maintenance history',
      summary: '3 leakage complaints logged in CMMS over past 14 days on Line 2 Moulding Bank.',
      detail: 'Work request WR-6891 flagged worn flexible braided coupling on manifold drop #4. Temporary clamp installed last Tuesday has loosened.',
      provenance: 'Verified',
      timestamp: '08:48 AM',
    },
    {
      id: 'E6',
      title: 'E6 Quality inspection log',
      summary: 'Zero scrap rate increase or casting defect correlation.',
      detail: 'Quality station confirmed metallurgical density 97.6% and dimensional tolerance compliant. Problem is purely energetic waste.',
      provenance: 'Verified',
      timestamp: '08:50 AM',
    },
  ];

  const timelineEvents = [
    { time: '08:20 AM', type: 'production', label: 'Production cycle started (10.2 t/h)', source: 'MES' },
    { time: '08:34 AM', type: 'telemetry', label: 'CMP-01 power draw escalated: 49 kW → 61 kW', source: 'PM8000' },
    { time: '08:37 AM', type: 'telemetry', label: 'Header pressure transducer confirmed stable at 6.5 bar', source: 'PT-02' },
    { time: '08:41 AM', type: 'telemetry', label: 'Power deviation detected (+16.8% over baseline envelope)', source: 'L1 Baseline' },
    { time: '08:45 AM', type: 'agent', label: 'System 1 triggered investigation (Safety interlocks checked: PASS)', source: 'Sol-2B' },
    { time: '08:46 AM', type: 'agent', label: 'System 2 Planner agent initiated evidence synthesis', source: 'Planner' },
    { time: '08:48 AM', type: 'maintenance', label: 'CMMS maintenance record retrieved: WR-6891 coupling leak', source: 'CMMS' },
    { time: '08:51 AM', type: 'agent', label: 'Thermodynamic physics sonic orifice test completed (PASS)', source: 'Physics' },
  ];

  const filteredTimeline = timelineEvents.filter((ev) => {
    if (ev.type === 'telemetry' && !filterTelemetry) return false;
    if (ev.type === 'production' && !filterProduction) return false;
    if (ev.type === 'maintenance' && !filterMaintenance) return false;
    if (ev.type === 'agent' && !filterAgent) return false;
    return true;
  });

  const selectedEvidence = evidenceSources.find((e) => e.id === selectedEvidenceId) || evidenceSources[0];

  return (
    <div className="page-container">
      {/* ── Page Header (Section 14 of Spec) ── */}
      <header className="page-header-clean">
        <div>
          <div className="page-kicker">
            <span className="kicker-tag">INVESTIGATION WORKSPACE</span>
            <span>Case Reference: {investigationId}</span>
          </div>
          <h1 className="page-title">CMP-01 Abnormal Energy Consumption</h1>
          <p className="page-subtitle">
            Autonomous multi-source causal investigation, thermodynamic physics validation, and counterfactual scenario evaluation.
          </p>
        </div>

        <div className="header-controls-group">
          <button className="btn-secondary-action" onClick={() => onNavigate('opportunities')}>
            &larr; Opportunities
          </button>
          <button className="btn-primary-action" onClick={() => setActiveTab('decision')}>
            <span>Decision Gate &rarr;</span>
          </button>
        </div>
      </header>

      {/* ── 4-Agent Bounded Pipeline Progress (Section 14 of Spec) ── */}
      <div className="card-clean" style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            4-AGENT PIPELINE
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#5e7e60', fontWeight: 600 }}>
            <CheckCircleIcon size={14} />
            <span>Planner</span>
          </div>
          <div style={{ width: '16px', height: '1px', background: 'var(--glass-border)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#5e7e60', fontWeight: 600 }}>
            <CheckCircleIcon size={14} />
            <span>Research</span>
          </div>
          <div style={{ width: '16px', height: '1px', background: 'var(--glass-border)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#bd6249', fontWeight: 700 }}>
            <span className="loop-dot active" />
            <span>Analysis</span>
          </div>
          <div style={{ width: '16px', height: '1px', background: 'var(--glass-border)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', border: '1.5px solid var(--text-muted)' }} />
            <span>Execution</span>
          </div>
        </div>

        <span className="provenance-badge provenance-measured">Latency: 280ms • MCP Connected</span>
      </div>

      {/* ── Sub-Navigation Tabs ── */}
      <nav style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px', flexWrap: 'wrap' }}>
        <button className={`btn-subtab ${activeTab === 'summary' ? 'active' : ''}`} onClick={() => setActiveTab('summary')}>
          1. Summary
        </button>
        <button className={`btn-subtab ${activeTab === 'evidence' ? 'active' : ''}`} onClick={() => setActiveTab('evidence')}>
          2. Evidence Inspector (6)
        </button>
        <button className={`btn-subtab ${activeTab === 'timeline' ? 'active' : ''}`} onClick={() => setActiveTab('timeline')}>
          3. Synchronized Timeline
        </button>
        <button className={`btn-subtab ${activeTab === 'hypotheses' ? 'active' : ''}`} onClick={() => setActiveTab('hypotheses')}>
          4. Competing Hypotheses & Physics
        </button>
        <button className={`btn-subtab ${activeTab === 'scenarios' ? 'active' : ''}`} onClick={() => setActiveTab('scenarios')}>
          5. Counterfactual Scenarios (3)
        </button>
        <button className={`btn-subtab ${activeTab === 'decision' ? 'active' : ''}`} onClick={() => setActiveTab('decision')}>
          6. Decision & Approval Gate
        </button>
      </nav>

      {/* ── TAB 1: Summary (Section 15 of Spec) ── */}
      {activeTab === 'summary' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: '16px', alignItems: 'start' }}>
          <div className="card-clean" style={{ padding: '22px' }}>
            <h3 style={{ margin: '0 0 10px', fontFamily: 'var(--font-serif)', fontSize: '19px', fontWeight: 500, color: 'var(--text-primary)' }}>
              Primary Finding
            </h3>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Compressed-air distribution leakage on the Assembly Line 2 manifold drop is the leading explanation for elevated CMP-01 power draw. The compressor is working continuously on-load to overcome the pressure delta.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '10px', marginTop: '20px' }}>
              <div style={{ padding: '12px', borderRadius: '7px', background: 'var(--bg-ground)', border: '1px solid var(--glass-border)' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Confidence</span>
                <div style={{ fontSize: '17px', fontWeight: 700, color: '#5e7e60', marginTop: '2px' }}>82%</div>
                <span className="provenance-badge provenance-modelled" style={{ marginTop: '4px' }}>Calibrated</span>
              </div>
              <div style={{ padding: '12px', borderRadius: '7px', background: 'var(--bg-ground)', border: '1px solid var(--glass-border)' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Evidence</span>
                <div style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>6 sources</div>
                <span className="provenance-badge provenance-measured" style={{ marginTop: '4px' }}>Correlated</span>
              </div>
              <div style={{ padding: '12px', borderRadius: '7px', background: 'var(--bg-ground)', border: '1px solid var(--glass-border)' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Production Impact</span>
                <div style={{ fontSize: '14px', fontWeight: 650, color: '#5e7e60', marginTop: '4px' }}>None detected</div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>10.2 t/h intact</span>
              </div>
              <div style={{ padding: '12px', borderRadius: '7px', background: 'var(--bg-ground)', border: '1px solid var(--glass-border)' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Safety Interlocks</span>
                <div style={{ fontSize: '14px', fontWeight: 650, color: '#5e7e60', marginTop: '4px' }}>PASS</div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>P &ge; 5.5 bar</span>
              </div>
            </div>

            <div style={{ marginTop: '22px', paddingTop: '18px', borderTop: '1px solid var(--glass-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Ready to test counterfactual remediation options against plant constraints?
                </span>
                <button className="btn-primary-action" onClick={() => setActiveTab('scenarios')}>
                  <span>Compare Scenarios &rarr;</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sensor Correlation Mini Card ("Why ForgeOps Believes This") */}
          <div className="card-clean" style={{ padding: '20px' }}>
            <h4 style={{ margin: '0 0 12px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Why ForgeOps Believes This
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 12px', borderRadius: '6px', background: 'var(--bg-ground)', border: '1px solid var(--glass-border)' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-primary)' }}>Power Draw</span>
                <strong style={{ color: '#bd6249', fontSize: '12px' }}>&uarr; Elevated (+16.8%)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 12px', borderRadius: '6px', background: 'var(--bg-ground)', border: '1px solid var(--glass-border)' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-primary)' }}>Header Pressure</span>
                <strong style={{ color: '#5e7e60', fontSize: '12px' }}>&harr; Stable (6.5 bar)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 12px', borderRadius: '6px', background: 'var(--bg-ground)', border: '1px solid var(--glass-border)' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-primary)' }}>Delivery Air Flow</span>
                <strong style={{ color: '#5e7e60', fontSize: '12px' }}>&harr; Nominal (397 CFM)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 12px', borderRadius: '6px', background: 'var(--bg-ground)', border: '1px solid var(--glass-border)' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-primary)' }}>Production Demand</span>
                <strong style={{ color: '#5e7e60', fontSize: '12px' }}>&harr; Constant (10.2 t/h)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 12px', borderRadius: '6px', background: '#edf4ec', border: '1px solid #d4e4d2' }}>
                <span style={{ fontSize: '12px', color: '#3b663b', fontWeight: 600 }}>CMMS Leak History</span>
                <strong style={{ color: '#3b663b', fontSize: '12px' }}>&check; Confirmed (WR-6891)</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: Evidence Inspector (Section 16 of Spec) ── */}
      {activeTab === 'evidence' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1.4fr)', gap: '16px' }}>
          {/* Left Column: Evidence Sources List */}
          <div className="card-clean" style={{ padding: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px' }}>
              Evidence Sources ({evidenceSources.length})
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {evidenceSources.map((ev) => (
                <div
                  key={ev.id}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: selectedEvidenceId === ev.id ? '1px solid #bd6249' : '1px solid var(--glass-border)',
                    background: selectedEvidenceId === ev.id ? 'var(--brand-subtle)' : 'var(--bg-surface)',
                    cursor: 'pointer',
                    transition: 'all .12s ease',
                  }}
                  onClick={() => setSelectedEvidenceId(ev.id)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '12px', color: 'var(--text-primary)' }}>{ev.title}</strong>
                    <span className="provenance-badge provenance-measured">{ev.provenance}</span>
                  </div>
                  <p style={{ margin: '4px 0 0', fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {ev.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Evidence Detail View */}
          <div className="card-clean" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <span className="kicker-tag" style={{ border: '1px solid var(--glass-border)', background: 'var(--bg-ground)' }}>
                  {selectedEvidence.id} DETAIL
                </span>
                <h3 style={{ margin: '6px 0 2px', fontFamily: 'var(--font-serif)', fontSize: '17px', color: 'var(--text-primary)' }}>
                  {selectedEvidence.title}
                </h3>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Recorded at {selectedEvidence.timestamp}</span>
            </div>

            <div style={{ padding: '14px', borderRadius: '8px', background: 'var(--bg-ground)', border: '1px solid var(--glass-border)', marginTop: '12px' }}>
              <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                {selectedEvidence.detail}
              </p>
            </div>

            <div style={{ marginTop: '20px', padding: '14px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-surface)' }}>
              <div style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                Statistical Confidence
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <strong style={{ fontSize: '20px', color: '#5e7e60' }}>0.94</strong>
                <small style={{ color: 'var(--text-muted)' }}>/ 1.00 (p &lt; 0.01)</small>
              </div>
              <p style={{ margin: '4px 0 0', fontSize: '10.5px', color: 'var(--text-secondary)' }}>
                Correlated against 72h historical ring buffer with zero parsing errors.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: Synchronized Timeline (Section 17 of Spec) ── */}
      {activeTab === 'timeline' && (
        <div className="card-clean" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: '17px', color: 'var(--text-primary)' }}>
                Synchronized Event & Telemetry Timeline
              </h3>
              <p style={{ margin: '3px 0 0', fontSize: '11px', color: 'var(--text-secondary)' }}>
                Correlated chronological reconstruction of shopfloor events, agent inference, and physics validation.
              </p>
            </div>

            {/* Filter Toggle Buttons (Section 17 of Spec) */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <button className={`btn-subtab ${filterTelemetry ? 'active' : ''}`} onClick={() => setFilterTelemetry(!filterTelemetry)}>
                Telemetry
              </button>
              <button className={`btn-subtab ${filterProduction ? 'active' : ''}`} onClick={() => setFilterProduction(!filterProduction)}>
                Production
              </button>
              <button className={`btn-subtab ${filterMaintenance ? 'active' : ''}`} onClick={() => setFilterMaintenance(!filterMaintenance)}>
                Maintenance
              </button>
              <button className={`btn-subtab ${filterAgent ? 'active' : ''}`} onClick={() => setFilterAgent(!filterAgent)}>
                Agent Events
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filteredTimeline.map((ev, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '11px 14px',
                  borderRadius: '7px',
                  background: 'var(--bg-ground)',
                  border: '1px solid var(--glass-border)',
                }}
              >
                <span className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)', width: '75px', flexShrink: 0 }}>
                  {ev.time}
                </span>

                <span className={`loop-dot ${ev.type === 'telemetry' ? 'active' : ev.type === 'agent' ? 'green' : 'amber'}`} />

                <span style={{ fontSize: '12px', color: 'var(--text-primary)', flex: 1 }}>
                  {ev.label}
                </span>

                <span className="provenance-badge provenance-modelled">
                  {ev.source}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 4: Competing Hypotheses & Physics (Section 18 & 19 of Spec) ── */}
      {activeTab === 'hypotheses' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="section-heading-row" style={{ marginBottom: 0 }}>
            <div>
              <p className="eyebrow">AGENT 3 REASONING</p>
              <h2>Competing explanations</h2>
            </div>
            <span className="section-aside">Tested against thermodynamic physics invariants</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '14px' }}>
            {/* Hypothesis 1: Air leakage (82% PASS) */}
            <div className="card-clean" style={{ padding: '18px', border: '1px solid #5e7e60', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>Air leakage</strong>
                <span style={{ fontSize: '16px', fontWeight: 700, color: '#5e7e60' }}>82%</span>
              </div>
              <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                Supported by power elevation + stable pressure + constant tool demand.
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', paddingTop: '8px', borderTop: '1px solid var(--glass-border)' }}>
                <span>Physics check: <strong style={{ color: '#5e7e60' }}>PASS</strong></span>
                <span style={{ color: 'var(--text-muted)' }}>Evidence: E1 E2 E5</span>
              </div>
              <button className="btn-secondary-action" style={{ padding: '6px 10px', fontSize: '11px', marginTop: '4px' }} onClick={() => setReasoningDrawerOpen(true)}>
                <span>View reasoning &rarr;</span>
              </button>
            </div>

            {/* Hypothesis 2: Mechanical degradation (15% PASS) */}
            <div className="card-clean" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>Mechanical degradation</strong>
                <span style={{ fontSize: '16px', fontWeight: 700, color: '#a8793e' }}>15%</span>
              </div>
              <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                Screw element friction or motor bearing wear. Vibration telemetry within envelope (1.7 mm/s).
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', paddingTop: '8px', borderTop: '1px solid var(--glass-border)' }}>
                <span>Physics check: <strong style={{ color: '#5e7e60' }}>PASS</strong></span>
                <span style={{ color: 'var(--text-muted)' }}>Evidence incomplete</span>
              </div>
            </div>

            {/* Hypothesis 3: Excessive setpoint (8% REJECTED) */}
            <div className="card-clean" style={{ padding: '18px', border: '1px solid var(--alert-border)', background: 'var(--alert-subtle)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>Excessive pressure setpoint</strong>
                <span style={{ fontSize: '16px', fontWeight: 700, color: '#bd6249' }}>8%</span>
              </div>
              <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                Hypothesis that setpoint was inadvertently bumped up.
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', paddingTop: '8px', borderTop: '1px solid var(--glass-border)' }}>
                <span>Physics check: <strong style={{ color: '#bd6249' }}>REJECTED</strong></span>
                <span style={{ color: 'var(--text-muted)' }}>Contradicted by PT-02</span>
              </div>
            </div>
          </div>

          {/* Reasoning Drawer Modal (Section 19 of Spec) */}
          {reasoningDrawerOpen && (
            <div className="command-palette-backdrop" onClick={() => setReasoningDrawerOpen(false)} role="dialog" aria-modal="true">
              <div className="command-palette-modal" style={{ maxWidth: '580px' }} onClick={(e) => e.stopPropagation()}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: '17px', color: 'var(--text-primary)' }}>
                    Why This Hypothesis? (Air Leakage 82%)
                  </h3>
                  <button className="header-icon-btn" onClick={() => setReasoningDrawerOpen(false)}>
                    <XIcon size={14} />
                  </button>
                </div>

                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>EVIDENCE</span>
                    <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--text-primary)' }}>
                      E1 (Power +16.8%) + E2 (Pressure 6.5 bar constant) + E5 (CMMS WR-6891 coupling leak).
                    </p>
                  </div>

                  <div>
                    <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>CAUSAL RELATIONSHIP</span>
                    <div style={{ padding: '10px 12px', borderRadius: '6px', background: 'var(--bg-ground)', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-primary)', marginTop: '4px' }}>
                      Leak &rarr; additional flow demand &rarr; compressor on-load &rarr; power increase
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>PHYSICS VALIDATION</span>
                    <div style={{ padding: '10px 12px', borderRadius: '6px', background: 'var(--bg-ground)', fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                      <div>Expected additional flow: <strong>14.2 CFM</strong> (Sonic orifice eq)</div>
                      <div>Expected power impact: <strong>+11.8 kW</strong> (Isentropic curve)</div>
                      <div>Observed power impact: <strong>+12.0 kW</strong> (Measured delta)</div>
                    </div>
                  </div>

                  <div style={{ padding: '10px 12px', borderRadius: '6px', background: '#edf4ec', border: '1px solid #d4e4d2' }}>
                    <span style={{ fontSize: '11.5px', color: '#3b663b', fontWeight: 600 }}>
                      Result: Consistent with observed telemetry within 1.7% margin.
                    </span>
                  </div>
                </div>

                <div style={{ padding: '12px 20px', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'flex-end' }}>
                  <button className="btn-secondary-action" onClick={() => setReasoningDrawerOpen(false)}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 5: Counterfactual Scenarios (Section 20, 21, 22 of Spec) ── */}
      {activeTab === 'scenarios' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="section-heading-row" style={{ marginBottom: 0 }}>
            <div>
              <p className="eyebrow">COUNTERFACTUAL SIMULATION</p>
              <h2>What happens if we intervene?</h2>
            </div>
            <span className="provenance-badge provenance-measured">Current Baseline: 11.2 kWh/t</span>
          </div>

          {/* Interactive What-If Simulation Sandbox */}
          <div className="card-clean" style={{ padding: '22px', background: 'var(--bg-surface)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <span className="kicker-tag" style={{ border: '1px solid #ebd0c9', background: '#fbf2ef', color: '#a75743' }}>
                  ROLE 3 COUNTERFACTUAL ENGINE • THERMODYNAMICS
                </span>
                <h3 style={{ margin: '6px 0 2px', fontFamily: 'var(--font-serif)', fontSize: '18px', color: 'var(--text-primary)' }}>
                  Interactive Intervention Tuning Sandbox
                </h3>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Adjust operating parameters in real-time to compute the simulated SEC curve and financial ROI.
                </p>
              </div>

              {/* Preset buttons */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn-subtab"
                  style={{ fontSize: '11px', padding: '5px 10px' }}
                  onClick={() => { setCustomPressure(6.5); setCustomLeakMitigation(85); setCustomIdleDelay(45); }}
                >
                  Preset A (Full Leak Repair)
                </button>
                <button
                  className="btn-subtab"
                  style={{ fontSize: '11px', padding: '5px 10px' }}
                  onClick={() => { setCustomPressure(6.1); setCustomLeakMitigation(20); setCustomIdleDelay(45); }}
                >
                  Preset B (Throttle Pressure)
                </button>
                <button
                  className="btn-subtab"
                  style={{ fontSize: '11px', padding: '5px 10px' }}
                  onClick={() => { setCustomPressure(6.5); setCustomLeakMitigation(15); setCustomIdleDelay(30); }}
                >
                  Preset C (Standby Idle)
                </button>
              </div>
            </div>

            {/* Range Sliders */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px', padding: '16px', background: 'var(--bg-ground)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
              <div>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  <span>Header Pressure Setpoint</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{customPressure} bar</strong>
                </label>
                <input
                  type="range"
                  min="6.0"
                  max="7.5"
                  step="0.1"
                  value={customPressure}
                  onChange={(e) => setCustomPressure(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: '#bd6249', marginTop: '6px' }}
                />
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Safety minimum clamp guardrail: &ge; 5.5 bar</span>
              </div>

              <div>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  <span>Pneumatic Leak Mitigation</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{customLeakMitigation}%</strong>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={customLeakMitigation}
                  onChange={(e) => setCustomLeakMitigation(parseInt(e.target.value, 10))}
                  style={{ width: '100%', accentColor: '#5e7e60', marginTop: '6px' }}
                />
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Sonic orifice leak flow elimination</span>
              </div>

              <div>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  <span>Standby Unload Delay</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{customIdleDelay}s</strong>
                </label>
                <input
                  type="range"
                  min="30"
                  max="300"
                  step="15"
                  value={customIdleDelay}
                  onChange={(e) => setCustomIdleDelay(parseInt(e.target.value, 10))}
                  style={{ width: '100%', accentColor: '#c28535', marginTop: '6px' }}
                />
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Time to switch from load to off-load</span>
              </div>
            </div>

            {/* Real-time Simulated Outputs Banner */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginTop: '14px' }}>
              <div style={{ padding: '12px', borderRadius: '6px', background: 'var(--bg-surface)', border: '1px solid var(--glass-border)' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Simulated SEC</span>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#5e7e60', marginTop: '2px' }}>
                  {(11.2 - (customLeakMitigation * 0.015) - (7.2 - customPressure) * 0.28).toFixed(1)} <small style={{ fontSize: '11px', color: 'var(--text-muted)' }}>kWh/t</small>
                </div>
                <small style={{ color: '#5e7e60', fontSize: '10.5px' }}>
                  -{(((11.2 - (11.2 - (customLeakMitigation * 0.015) - (7.2 - customPressure) * 0.28)) / 11.2) * 100).toFixed(1)}% vs baseline
                </small>
              </div>

              <div style={{ padding: '12px', borderRadius: '6px', background: 'var(--bg-surface)', border: '1px solid var(--glass-border)' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Projected Savings</span>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#5e7e60', marginTop: '2px' }}>
                  ₹{Math.round(48000 * (customLeakMitigation / 85) + (7.2 - customPressure) * 8000).toLocaleString('en-IN')} <small style={{ fontSize: '11px', color: 'var(--text-muted)' }}>/ mo</small>
                </div>
                <small style={{ color: 'var(--text-secondary)', fontSize: '10.5px' }}>At DISCOM ₹7.8/kWh</small>
              </div>

              <div style={{ padding: '12px', borderRadius: '6px', background: 'var(--bg-surface)', border: '1px solid var(--glass-border)' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Simple Payback</span>
                <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                  {((customLeakMitigation > 50 ? 8500 : 2500) / ((Math.max(1000, 48000 * (customLeakMitigation / 85) + (7.2 - customPressure) * 8000) / 30) * 30)).toFixed(1)} <small style={{ fontSize: '11px', color: 'var(--text-muted)' }}>months</small>
                </div>
                <small style={{ color: '#5e7e60', fontSize: '10.5px', fontWeight: 600 }}>&lt; 3.0 mo BEE Target</small>
              </div>

              <div style={{ padding: '12px', borderRadius: '6px', background: 'var(--bg-surface)', border: '1px solid var(--glass-border)' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Constraint Guardrails</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px', fontSize: '10.5px' }}>
                  <span style={{ color: '#5e7e60', fontWeight: 600 }}>✓ Pressure &ge; 5.5 bar: PASS</span>
                  <span style={{ color: '#5e7e60', fontWeight: 600 }}>✓ Throughput &ge; 10.2 t/h: PASS</span>
                  <span style={{ color: '#5e7e60', fontWeight: 600 }}>✓ Rejection &le; 2.4%: PASS</span>
                </div>
              </div>
            </div>
          </div>

          {/* Scenario Comparison Table (Section 21 of Spec) */}

          <div className="clean-table-wrap">
            <table className="clean-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Baseline</th>
                  <th>Scenario A (Repair leak)</th>
                  <th>Scenario B (Reduce pressure)</th>
                  <th>Scenario C (Optimize idle)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>SEC (kWh/t)</strong></td>
                  <td>11.2</td>
                  <td><strong style={{ color: '#5e7e60' }}>9.7 (-13.4%)</strong></td>
                  <td>10.4 (-7.1%)</td>
                  <td>10.1 (-9.8%)</td>
                </tr>
                <tr>
                  <td><strong>Throughput (t/h)</strong></td>
                  <td>10.2</td>
                  <td>10.2 (Preserved)</td>
                  <td>10.2 (Preserved)</td>
                  <td>10.2 (Preserved)</td>
                </tr>
                <tr>
                  <td><strong>Quality First-Pass</strong></td>
                  <td>97.6%</td>
                  <td>97.6%</td>
                  <td>97.5%</td>
                  <td>97.6%</td>
                </tr>
                <tr>
                  <td><strong>Monthly Energy Cost</strong></td>
                  <td>₹1.84L</td>
                  <td><strong style={{ color: '#5e7e60' }}>₹1.36L</strong></td>
                  <td>₹1.57L</td>
                  <td>₹1.49L</td>
                </tr>
                <tr>
                  <td><strong>Downtime Window</strong></td>
                  <td>—</td>
                  <td>42 min (Changeover)</td>
                  <td>0 min</td>
                  <td>15 min</td>
                </tr>
                <tr>
                  <td><strong>CAPEX / Parts</strong></td>
                  <td>—</td>
                  <td>₹8,500</td>
                  <td>₹0</td>
                  <td>₹2,500</td>
                </tr>
                <tr>
                  <td><strong>Simple Payback</strong></td>
                  <td>—</td>
                  <td><strong>1.8 months</strong></td>
                  <td>Immediate</td>
                  <td>0.6 months</td>
                </tr>
                <tr style={{ background: 'var(--bg-ground)' }}>
                  <td><strong>Constraints Gate</strong></td>
                  <td>—</td>
                  <td><span className="provenance-badge provenance-measured">ALL PASS</span></td>
                  <td><span className="provenance-badge provenance-measured">ALL PASS</span></td>
                  <td><span className="provenance-badge provenance-measured">ALL PASS</span></td>
                </tr>
                <tr>
                  <td><strong>Select Option</strong></td>
                  <td>—</td>
                  <td>
                    <button className="btn-primary-action" style={{ padding: '5px 12px', fontSize: '11px' }} onClick={() => setActiveTab('decision')}>
                      Use Scenario A &rarr;
                    </button>
                  </td>
                  <td>
                    <button className="btn-secondary-action" style={{ padding: '5px 12px', fontSize: '11px' }} onClick={() => setActiveTab('decision')}>
                      Use Scenario B
                    </button>
                  </td>
                  <td>
                    <button className="btn-secondary-action" style={{ padding: '5px 12px', fontSize: '11px' }} onClick={() => setActiveTab('decision')}>
                      Use Scenario C
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB 6: Decision & Approval Gate (Section 23, 24, 25 of Spec) ── */}
      {activeTab === 'decision' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Decision Brief Header */}
          <div className="card-clean" style={{ padding: '22px' }}>
            <span className="kicker-tag" style={{ border: '1px solid #ebd0c9', background: '#f8ebe8', color: '#a84d39' }}>
              DECISION REQUIRED • INCIDENT {investigationId}
            </span>
            <h2 style={{ margin: '8px 0 6px', fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: 500, color: 'var(--text-primary)' }}>
              CMP-01 Compressor Energy Anomaly
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '14px', marginTop: '16px' }}>
              <div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>PROBLEM</span>
                <p style={{ margin: '3px 0 0', fontSize: '11.5px', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                  Energy consumption is 16.8% above baseline envelope.
                </p>
              </div>
              <div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>LIKELY CAUSE</span>
                <p style={{ margin: '3px 0 0', fontSize: '11.5px', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                  Pneumatic leakage on Line 2 distribution coupling.
                </p>
              </div>
              <div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>RECOMMENDED ACTION</span>
                <p style={{ margin: '3px 0 0', fontSize: '11.5px', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                  Repair identified leakage during planned mold changeover.
                </p>
              </div>
              <div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>EXPECTED OUTCOME</span>
                <p style={{ margin: '3px 0 0', fontSize: '11.5px', color: '#5e7e60', fontWeight: 600, lineHeight: 1.4 }}>
                  Lower SEC to 9.7 kWh/t while preserving 10.2 t/h throughput.
                </p>
              </div>
            </div>
          </div>

          {/* 3 Alternatives Side-by-Side (Section 24 of Spec) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '14px' }}>
            {/* Option 1: Repair Leak (Recommended) */}
            <div
              className="card-clean"
              style={{
                padding: '18px',
                border: selectedDecisionOption === 'repair_leak' ? '1.5px solid #bd6249' : '1px solid var(--glass-border)',
                background: selectedDecisionOption === 'repair_leak' ? 'var(--brand-subtle)' : 'var(--bg-surface)',
                cursor: 'pointer',
              }}
              onClick={() => setSelectedDecisionOption('repair_leak')}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '13px', color: 'var(--text-primary)' }}>REPAIR LEAK</strong>
                <span className="best-tag">RECOMMENDED</span>
              </div>
              <div style={{ padding: '10px 0', borderBlock: '1px solid var(--glass-border)', margin: '10px 0', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>SEC Delta:</span><strong>-1.5 kWh/t</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Cost:</span><strong>₹8,500 parts</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Downtime:</span><strong>42 min</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Risk:</span><strong style={{ color: '#5e7e60' }}>Low</strong></div>
              </div>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Under configured plant objective: maximizes annualized savings</span>
            </div>

            {/* Option 2: Reduce Pressure */}
            <div
              className="card-clean"
              style={{
                padding: '18px',
                border: selectedDecisionOption === 'reduce_pressure' ? '1.5px solid #bd6249' : '1px solid var(--glass-border)',
                background: selectedDecisionOption === 'reduce_pressure' ? 'var(--brand-subtle)' : 'var(--bg-surface)',
                cursor: 'pointer',
              }}
              onClick={() => setSelectedDecisionOption('reduce_pressure')}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '13px', color: 'var(--text-primary)' }}>REDUCE PRESSURE</strong>
                <span className="provenance-badge provenance-modelled">ALTERNATIVE</span>
              </div>
              <div style={{ padding: '10px 0', borderBlock: '1px solid var(--glass-border)', margin: '10px 0', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>SEC Delta:</span><strong>-0.7 kWh/t</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Cost:</span><strong>₹0</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Downtime:</span><strong>0 min</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Risk:</span><strong style={{ color: '#a8793e' }}>Medium</strong></div>
              </div>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Zero capex, but clamp actuation speed may drop</span>
            </div>

            {/* Option 3: Automate Idle */}
            <div
              className="card-clean"
              style={{
                padding: '18px',
                border: selectedDecisionOption === 'automate_idle' ? '1.5px solid #bd6249' : '1px solid var(--glass-border)',
                background: selectedDecisionOption === 'automate_idle' ? 'var(--brand-subtle)' : 'var(--bg-surface)',
                cursor: 'pointer',
              }}
              onClick={() => setSelectedDecisionOption('automate_idle')}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '13px', color: 'var(--text-primary)' }}>AUTOMATE IDLE</strong>
                <span className="provenance-badge provenance-modelled">STANDALONE</span>
              </div>
              <div style={{ padding: '10px 0', borderBlock: '1px solid var(--glass-border)', margin: '10px 0', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>SEC Delta:</span><strong>-0.5 kWh/t</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Cost:</span><strong>₹2,500</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Downtime:</span><strong>15 min</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Risk:</span><strong style={{ color: '#5e7e60' }}>Low</strong></div>
              </div>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Auto blowdown timer retrofit</span>
            </div>
          </div>

          {/* Decision Approval Gate (Section 25 of Spec) */}
          <div className="card-clean" style={{ padding: '20px', border: '1px solid #5e7e60', background: 'var(--bg-surface)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
              <div>
                <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5e7e60' }}>
                  DECISION GATE • HUMAN IN THE LOOP
                </span>
                <div style={{ fontSize: '14px', fontWeight: 650, color: 'var(--text-primary)', marginTop: '2px' }}>
                  Selected option: <strong>{selectedDecisionOption === 'repair_leak' ? 'Repair pneumatic leak' : selectedDecisionOption === 'reduce_pressure' ? 'Reduce compressor pressure' : 'Automate idle'}</strong>
                </div>
                <div style={{ display: 'flex', gap: '14px', fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  <span>Expected: <strong>-1.5 kWh/t</strong></span>
                  <span>Savings: <strong>₹48k/mo est.</strong></span>
                  <span>Safety validation: <strong style={{ color: '#5e7e60' }}>PASS</strong></span>
                  <span>Engineering validation: <strong style={{ color: '#5e7e60' }}>PASS</strong></span>
                </div>
              </div>

              {decisionState === 'pending' && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className="btn-secondary-action"
                    style={{ color: '#bd6249', borderColor: 'var(--alert-border)' }}
                    onClick={() => setDecisionState('rejected')}
                  >
                    Reject
                  </button>
                  <button
                    className="btn-secondary-action"
                    onClick={() => setActiveTab('summary')}
                  >
                    Send back for investigation
                  </button>
                  <button
                    className="btn-primary-action"
                    onClick={() => {
                      setDecisionState('approved');
                      setTimeout(() => onNavigate('actions', 'WO-ENG-7922'), 600);
                    }}
                  >
                    <CheckIcon size={14} />
                    <span>Record demo approval</span>
                  </button>
                </div>
              )}

              {decisionState === 'approved' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#5e7e60', fontWeight: 650, fontSize: '13px' }}>
                  <CheckCircleIcon size={18} />
                  <span>Demo approval recorded • no live CMMS work order was created.</span>
                </div>
              )}

              {decisionState === 'rejected' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#bd6249', fontWeight: 650, fontSize: '13px' }}>
                  <XIcon size={18} />
                  <span>Rejected • Sent back for recalibration.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
