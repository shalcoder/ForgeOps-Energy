import { useEffect, useState } from 'react';
import { getSystemRuntimeStatus, type SystemRuntimeStatus } from '../integrations/forgeOpsClient';
import {
  ZapIcon,
  ActivityIcon,
  CpuIcon,
  LayersIcon,
  ShieldCheckIcon,
  SlidersIcon,
  FileTextIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  FactoryIcon,
  GaugeIcon,
  RefreshCwIcon,
  WrenchIcon,
  AlertTriangleIcon,
  TrendingDownIcon,
  ClockIcon,
} from '../components/Icons';

type TabView = 'architecture_map' | 'harness_overview' | 'flowchart' | 'system1_sandbox' | 'competing_hypotheses' | 'closed_loop_feedback' | 'failure_modes';

function ArchitectureMap() {
  const [runtime, setRuntime] = useState<SystemRuntimeStatus | null>(null);
  useEffect(() => {
    let mounted = true;
    getSystemRuntimeStatus().then((status) => { if (mounted) setRuntime(status); });
    return () => { mounted = false; };
  }, []);

  const layers = [
    { id: '01', title: 'People & roles', status: 'Implemented in prototype', body: 'Plant operator, energy manager, maintenance engineer, plant owner, sustainability and finance personas. Human review gates are represented in the UI.' },
    { id: '02', title: 'Web application', status: 'Implemented', body: 'React 18 + TypeScript workbench with overview, opportunities, investigation, simulation, approval, verification and reports.' },
    { id: '03', title: 'API & orchestration', status: 'Implemented', body: 'FastAPI REST endpoints, typed Pydantic contracts, pipeline orchestration, approval records and SSE pipeline updates.' },
    { id: '04', title: 'Agentic decision engine', status: runtime ? `System 1: ${runtime.system1.runtime}` : 'Checking runtime', body: `System 1 currently routes with a deterministic fallback unless a compatible local model snapshot is explicitly configured. System 2 has Planner, Research, Analysis and Execution roles; provider calls are optional. ${runtime?.system1.model ?? 'Decision-2.0-Sol-2B is the configured target; weights are not confirmed loaded.'}` },
    { id: '05', title: 'Data & model layer', status: 'Demo fixtures + deterministic models', body: `Belgaum plant data and MCP fixtures power the demonstration. Physics, tariff and economics calculations are deterministic. transformers ${runtime?.system1.packages.transformers ?? 'installed per local environment note'} · huggingface-hub ${runtime?.system1.packages['huggingface-hub'] ?? 'installed per local environment note'} · tokenizers ${runtime?.system1.packages.tokenizers ?? 'installed per local environment note'} · torch ${runtime?.system1.packages.torch ?? 'not installed in this runtime'}. Sol-2B weights: ${runtime?.system1.weights_present ? 'present locally' : 'not present in configured path'}.` },
    { id: '06', title: 'Integration layer', status: runtime?.integrations.remote_mcp.reachable ? `Remote MCP reachable (${runtime.integrations.remote_mcp.tool_count} tools)` : 'MCP fallback / unavailable', body: 'Remote MCP provides tool access when available. Live Modbus, OPC-UA, MQTT, MES, CMMS, QMS and ERP plant adapters are not connected in this deployment; integration protocols are design targets.' },
    { id: '07', title: 'Factory floor', status: 'Not connected · demo data', body: 'Meters, compressors, furnaces, motors, PLC/SCADA and plant systems are represented by synthetic demonstration records. No control path or physical actuation is enabled.' },
  ];

  return (
    <section className="card-clean" style={{ padding: '22px' }}>
      <div className="card-header-clean">
        <div>
          <h2 className="card-title-clean">ForgeOps full-stack architecture</h2>
          <p className="card-subtitle-clean">Current implementation and integration boundaries · runtime-aware, prototype status</p>
        </div>
        <span className="kpi-badge warning">No live plant OT connection</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '10px' }}>
        {layers.map((layer) => (
          <article key={layer.id} className="card-clean" style={{ padding: '14px', borderTop: '2px solid var(--brand-primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', alignItems: 'start' }}>
              <strong style={{ color: 'var(--text-primary)', fontSize: '13px' }}>{layer.id} · {layer.title}</strong>
              <span className="provenance-badge provenance-estimated">{layer.status}</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '11.5px', lineHeight: 1.55, margin: '10px 0 0' }}>{layer.body}</p>
          </article>
        ))}
      </div>
      <p style={{ color: 'var(--text-muted)', fontSize: '10.5px', margin: '14px 0 0' }}>
        Inference libraries being installed does not mean model weights are loaded. Native inference stays opt-in and local-only; deterministic safety checks and physics calculations remain separate from model output.
      </p>
    </section>
  );
}

export function ArchitectureView({ onOpenWorkbench }: { onOpenWorkbench: () => void }) {
  const [activeTab, setActiveTab] = useState<TabView>('architecture_map');
  const [simulatedPower, setSimulatedPower] = useState(61.0);
  const [simulatedPressure, setSimulatedPressure] = useState(6.5);
  const [simulatedVibration, setSimulatedVibration] = useState(1.7);
  const [simulatedFlow, setSimulatedFlow] = useState(397);
  const [simulatedLoad, setSimulatedLoad] = useState(69);

  // System 1 Live Evaluation Math for CMP-01
  // Baseline Envelope: 45–53 kW, 6.2–6.6 bar, 380–430 CFM, 1.2–2.1 mm/s, load 55–75%
  const baselineMidPower = 49.0;
  const powerDeltaPct = ((simulatedPower - baselineMidPower) / baselineMidPower) * 100.0;
  const isPowerAbnormal = simulatedPower > 53.0;
  const isPressureLow = simulatedPressure < 5.5; // Hard safety interlock
  const isVibrationHigh = simulatedVibration > 3.5;

  let s1State = 'NOMINAL ENERGY BEHAVIOUR';
  let s1Confidence = 0.95;
  let s1Observed = 'Operating within normal historical envelope (45–53 kW)';
  let s1Action = 'Normal Monitoring';
  let s1TriggerInvestigation = false;
  let s1SafetyStatus = 'PASS';

  if (isPressureLow) {
    s1SafetyStatus = 'CRITICAL_PRESSURE_INTERLOCK';
    s1Action = 'IMMEDIATE HARDWARE INTERLOCK (P < 5.5 bar)';
  } else if (isVibrationHigh) {
    s1SafetyStatus = 'BEARING_VIBRATION_INTERLOCK';
    s1Action = 'BEARING TRIP GUARD TRIGGERED';
  } else if (isPowerAbnormal) {
    const pctAboveMax = ((simulatedPower - 53.0) / 53.0) * 100.0;
    s1State = 'ABNORMAL ENERGY BEHAVIOUR';
    s1Confidence = Math.min(0.85 + (pctAboveMax / 100.0) * 0.35, 0.98);
    s1Observed = `Power +${pctAboveMax.toFixed(1)}% above expected envelope (45–53 kW)`;
    s1Action = 'Trigger investigation (System 2)';
    s1TriggerInvestigation = true;
  }

  const closedLoopSteps = [
    { label: 'Sense', desc: 'Meters & PLCs', layer: 'L0' },
    { label: 'Normalize', desc: 'Signal cleanup', layer: 'L1' },
    { label: 'Baseline', desc: 'Asset envelopes', layer: 'L1' },
    { label: 'Detect', desc: 'Fast screening', layer: 'L2' },
    { label: 'Investigate', desc: '4-Agent deep dive', layer: 'L3' },
    { label: 'Explain', desc: 'Causal evidence', layer: 'L3' },
    { label: 'Simulate', desc: 'Physics models', layer: 'L4' },
    { label: 'Optimize', desc: 'Pareto frontier', layer: 'L5' },
    { label: 'Approve', desc: 'Human in loop', layer: 'L6' },
    { label: 'Execute', desc: 'CMMS work order', layer: 'L6' },
    { label: 'Measure', desc: 'Post telemetry', layer: 'L7' },
    { label: 'Verify', desc: 'IPMVP Option B/C', layer: 'L7' },
    { label: 'Learn', desc: 'Model registry', layer: 'L7' },
  ];

  return (
    <div className="page-container">
      {/* Header */}
      <header className="page-header-clean">
        <div>
          <div className="page-kicker">
            <span className="kicker-tag">System Design Harness</span>
            <span>Closed-Loop Industrial Intelligence Architecture</span>
          </div>
          <h1 className="page-title">ForgeOps Energy — Complete System Harness</h1>
          <p className="page-subtitle">
            An 8-layer closed-loop decision harness around industrial data: AI provides reasoning, physics provides physical validity,
            economics provides business validity, human provides authorization, and measurement proves savings.
          </p>
        </div>

        <div className="header-controls-group">
          <button className="btn-primary-action" onClick={onOpenWorkbench}>
            <span>Open Decision Workbench</span>
            <ArrowRightIcon size={14} />
          </button>
        </div>
      </header>

      {/* Closed-Loop 13-Step Flow Ribbon */}
      <div className="card-clean" style={{ padding: '16px', marginBottom: '16px', background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.08) 0%, rgba(6, 182, 212, 0.08) 50%, rgba(129, 140, 248, 0.08) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <RefreshCwIcon size={15} className="text-emerald" />
            <strong style={{ fontSize: '13px', color: '#f9fafb' }}>The Complete Closed-Loop Flow</strong>
          </div>
          <span className="font-mono text-muted" style={{ fontSize: '11px' }}>
            Sense &rarr; Normalize &rarr; Baseline &rarr; Detect &rarr; Investigate &rarr; Explain &rarr; Simulate &rarr; Optimize &rarr; Approve &rarr; Execute &rarr; Measure &rarr; Verify &rarr; Learn
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(13, 1fr)', gap: '6px' }}>
          {closedLoopSteps.map((s, idx) => (
            <div
              key={s.label}
              style={{
                background: 'rgba(11, 17, 30, 0.85)',
                padding: '8px 6px',
                borderRadius: '6px',
                border: '1px solid rgba(255, 255, 255, 0.07)',
                textAlign: 'center',
                boxShadow: 'var(--neu-sunken)',
              }}
            >
              <div className="font-mono" style={{ fontSize: '9px', color: '#00d328', fontWeight: 700 }}>
                {s.layer} • #{idx + 1}
              </div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#f9fafb', marginTop: '2px' }}>
                {s.label}
              </div>
              <div style={{ fontSize: '9.5px', color: '#9ca3af', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {s.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '18px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px', flexWrap: 'wrap' }}>
        <button className={`btn-subtab ${activeTab === 'architecture_map' ? 'active' : ''}`} onClick={() => setActiveTab('architecture_map')}>Current Full-Stack Map</button>
        <button
          className={`btn-subtab ${activeTab === 'harness_overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('harness_overview')}
          style={{
            padding: '8px 14px',
            fontSize: '12px',
            borderRadius: '6px',
            background: activeTab === 'harness_overview' ? 'rgba(0, 211, 40, 0.15)' : 'transparent',
            border: activeTab === 'harness_overview' ? '1px solid #00d328' : '1px solid var(--glass-border)',
            color: activeTab === 'harness_overview' ? '#00d328' : '#9ca3af',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          1. 8-Layer Harness Architecture
        </button>

        <button
          className={`btn-subtab ${activeTab === 'flowchart' ? 'active' : ''}`}
          onClick={() => setActiveTab('flowchart')}
          style={{
            padding: '8px 14px',
            fontSize: '12px',
            borderRadius: '6px',
            background: activeTab === 'flowchart' ? 'rgba(0, 211, 40, 0.15)' : 'transparent',
            border: activeTab === 'flowchart' ? '1px solid #00d328' : '1px solid var(--glass-border)',
            color: activeTab === 'flowchart' ? '#00d328' : '#9ca3af',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          2. Complete Architecture Flowchart (Mermaid)
        </button>

        <button
          className={`btn-subtab ${activeTab === 'system1_sandbox' ? 'active' : ''}`}
          onClick={() => setActiveTab('system1_sandbox')}
          style={{
            padding: '8px 14px',
            fontSize: '12px',
            borderRadius: '6px',
            background: activeTab === 'system1_sandbox' ? 'rgba(0, 211, 40, 0.15)' : 'transparent',
            border: activeTab === 'system1_sandbox' ? '1px solid #00d328' : '1px solid var(--glass-border)',
            color: activeTab === 'system1_sandbox' ? '#00d328' : '#9ca3af',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          3. System 1 Fast Loop & CMP-01 Sandbox
        </button>

        <button
          className={`btn-subtab ${activeTab === 'competing_hypotheses' ? 'active' : ''}`}
          onClick={() => setActiveTab('competing_hypotheses')}
          style={{
            padding: '8px 14px',
            fontSize: '12px',
            borderRadius: '6px',
            background: activeTab === 'competing_hypotheses' ? 'rgba(0, 211, 40, 0.15)' : 'transparent',
            border: activeTab === 'competing_hypotheses' ? '1px solid #00d328' : '1px solid var(--glass-border)',
            color: activeTab === 'competing_hypotheses' ? '#00d328' : '#9ca3af',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          4. Agent 3 Competing Hypotheses & Physics Rejection
        </button>

        <button
          className={`btn-subtab ${activeTab === 'closed_loop_feedback' ? 'active' : ''}`}
          onClick={() => setActiveTab('closed_loop_feedback')}
          style={{
            padding: '8px 14px',
            fontSize: '12px',
            borderRadius: '6px',
            background: activeTab === 'closed_loop_feedback' ? 'rgba(0, 211, 40, 0.15)' : 'transparent',
            border: activeTab === 'closed_loop_feedback' ? '1px solid #00d328' : '1px solid var(--glass-border)',
            color: activeTab === 'closed_loop_feedback' ? '#00d328' : '#9ca3af',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          5. M&V Closed-Loop & Prediction Error (14.3%)
        </button>

        <button
          className={`btn-subtab ${activeTab === 'failure_modes' ? 'active' : ''}`}
          onClick={() => setActiveTab('failure_modes')}
          style={{
            padding: '8px 14px',
            fontSize: '12px',
            borderRadius: '6px',
            background: activeTab === 'failure_modes' ? 'rgba(0, 211, 40, 0.15)' : 'transparent',
            border: activeTab === 'failure_modes' ? '1px solid #00d328' : '1px solid var(--glass-border)',
            color: activeTab === 'failure_modes' ? '#00d328' : '#9ca3af',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          6. Safety Invariants & Failure Handling
        </button>
      </div>

      {activeTab === 'architecture_map' && <ArchitectureMap />}

      {/* TAB 1: 8-Layer Harness Architecture */}
      {activeTab === 'harness_overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="card-clean" style={{ background: 'var(--glass-surface)' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#f9fafb', marginBottom: '6px' }}>
              The 8 Major Layers of the Industrial Decision Harness
            </h3>
            <p style={{ fontSize: '12px', color: '#9ca3af', margin: '0 0 16px 0' }}>
              ForgeOps Energy is not four agents chatting with each other. It is an industrial decision harness with hard separation of concerns:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
              {/* L0 */}
              <div style={{ background: 'rgba(11, 17, 30, 0.85)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <span className="font-mono" style={{ fontSize: '11px', color: '#00d328', fontWeight: 700 }}>L0 • FACTORY</span>
                <strong style={{ fontSize: '13px', color: '#f9fafb', display: 'block', margin: '4px 0' }}>Physical Shopfloor</strong>
                <p style={{ fontSize: '11.5px', color: '#9ca3af', margin: 0 }}>
                  Sensors, PLCs, VFDs, CNCs, induction furnaces, MES, CMMS, QMS, ERP tariff feeds. Direct Modbus RTU / OPC-UA polling.
                </p>
              </div>

              {/* L1 */}
              <div style={{ background: 'rgba(11, 17, 30, 0.85)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <span className="font-mono" style={{ fontSize: '11px', color: '#06b6d4', fontWeight: 700 }}>L1 • EDGE GATEWAY</span>
                <strong style={{ fontSize: '13px', color: '#f9fafb', display: 'block', margin: '4px 0' }}>Signal & Baseline</strong>
                <p style={{ fontSize: '11.5px', color: '#9ca3af', margin: 0 }}>
                  Proposed deployment target: telemetry ingestion, locally sized buffering, signal normalization, and equipment-specific baselines. These integrations are not active in this demo.
                </p>
              </div>

              {/* L2 */}
              <div style={{ background: 'rgba(11, 17, 30, 0.85)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <span className="font-mono" style={{ fontSize: '11px', color: '#818cf8', fontWeight: 700 }}>L2 • SYSTEM 1</span>
                <strong style={{ fontSize: '13px', color: '#f9fafb', display: 'block', margin: '4px 0' }}>Fast Edge Triage (&lt;10ms)</strong>
                <p style={{ fontSize: '11.5px', color: '#9ca3af', margin: 0 }}>
                  Decision-2.0-Sol-2B non-autoregressive triage. Hard safety interlocks (P &ge; 5.5 bar). Screens whether deep investigation is warranted.
                </p>
              </div>

              {/* L3 */}
              <div style={{ background: 'rgba(11, 17, 30, 0.85)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <span className="font-mono" style={{ fontSize: '11px', color: '#fbbf24', fontWeight: 700 }}>L3 • SYSTEM 2</span>
                <strong style={{ fontSize: '13px', color: '#f9fafb', display: 'block', margin: '4px 0' }}>Bounded 4-Agent Pipeline</strong>
                <p style={{ fontSize: '11.5px', color: '#9ca3af', margin: 0 }}>
                  Planner &rarr; Research &rarr; Analysis &rarr; Execution. Formulates competing hypotheses (A-D) and synthesizes evidence pack E1-E6.
                </p>
              </div>

              {/* L4 */}
              <div style={{ background: 'rgba(11, 17, 30, 0.85)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <span className="font-mono" style={{ fontSize: '11px', color: '#f43f5e', fontWeight: 700 }}>L4 • ENGINEERING</span>
                <strong style={{ fontSize: '13px', color: '#f9fafb', display: 'block', margin: '4px 0' }}>Thermodynamic Physics</strong>
                <p style={{ fontSize: '11.5px', color: '#9ca3af', margin: 0 }}>
                  LLMs cannot hallucinate physics. Sonic orifice mass flow, isentropic compressor curves, induction heat balance, and ToD tariff equations.
                </p>
              </div>

              {/* L5 */}
              <div style={{ background: 'rgba(11, 17, 30, 0.85)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <span className="font-mono" style={{ fontSize: '11px', color: '#10b981', fontWeight: 700 }}>L5 • DECISION</span>
                <strong style={{ fontSize: '13px', color: '#f9fafb', display: 'block', margin: '4px 0' }}>Simulation & Pareto Set</strong>
                <p style={{ fontSize: '11.5px', color: '#9ca3af', margin: 0 }}>
                  Counterfactual simulator evaluates production + energy. Hard process constraints filter candidates. Multi-objective Pareto optimization.
                </p>
              </div>

              {/* L6 */}
              <div style={{ background: 'rgba(11, 17, 30, 0.85)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <span className="font-mono" style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 700 }}>L6 • HUMAN GATE</span>
                <strong style={{ fontSize: '13px', color: '#f9fafb', display: 'block', margin: '4px 0' }}>Human Review & Draft Action</strong>
                <p style={{ fontSize: '11.5px', color: '#9ca3af', margin: 0 }}>
                  Prototype records a local demo approval and draft recommendation. No CMMS work order, plant setpoint, or actuator command is issued.
                </p>
              </div>

              {/* L7 */}
              <div style={{ background: 'rgba(11, 17, 30, 0.85)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <span className="font-mono" style={{ fontSize: '11px', color: '#a855f7', fontWeight: 700 }}>L7 • VERIFICATION</span>
                <strong style={{ fontSize: '13px', color: '#f9fafb', display: 'block', margin: '4px 0' }}>Measure & Learn</strong>
                <p style={{ fontSize: '11.5px', color: '#9ca3af', margin: 0 }}>
                  Planned deployment: collect post-action meter and production data, normalize under an agreed M&V plan, then independently verify savings. No field data is connected here.
                </p>
              </div>
            </div>
          </div>

          {/* Common Data Contract Card */}
          <div className="card-clean" style={{ borderLeft: '4px solid #00d328' }}>
            <div className="card-header-clean">
              <div>
                <h3 className="card-title-clean">
                  <FileTextIcon size={16} className="text-emerald" />
                  <span>The Canonical FactoryState Contract (Section 15)</span>
                </h3>
                <p className="card-subtitle-clean">Illustrative shared data contract for the prototype; persistence and tamper-evident audit guarantees require production deployment.</p>
              </div>
              <span className="kpi-badge success">Zero Parsing Errors</span>
            </div>

            <pre className="font-mono" style={{ background: '#0b111e', padding: '14px', borderRadius: '8px', fontSize: '11.5px', color: '#e5e7eb', overflowX: 'auto', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
{`type FactoryState = {
  timestamp: string;
  equipment: {
    id: string;            // e.g. "CMP-01"
    type: string;          // "Rotary Screw Compressor with VFD"
    status: string;        // "RUNNING"
    powerKw: number;       // 61.0 kW (Observed)
    loadPct?: number;      // 69%
    temperatureC?: number; // 68.2 °C
    pressureBar?: number;  // 6.1 bar
    flowRate?: number;     // 397 CFM
    vibration?: number;    // 1.7 mm/s
  }[];
  production: {
    lineId: string;        // "Line-2"
    product: string;       // "SG Iron Automotive Flange"
    throughput: number;    // 10.2 (t/h)
    unit: string;          // "t/h"
    qualityRate: number;   // 98.7%
  };
  energy: {
    totalKw: number;       // 61.0 kW
    kwhPerUnit: number;    // 11.2 kWh/t
    tariff: number;        // ₹8.50 / kWh (DISCOM ToD Rate)
  };
  maintenance: {
    equipmentId: string;   // "CMP-01"
    openIssues: string[];  // ["Air coupling seal degradation"]
    lastMaintenance?: string;
  };
  constraints: {
    minThroughput: number; // 10.2 t/h
    maxTemperature?: number;
    minPressure?: number;  // 5.5 bar (Hard Pneumatic Clamping Interlock)
    maxQualityLoss: number; // 2.0%
  };
};`}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 2: Complete Architecture Flowchart */}
      {activeTab === 'flowchart' && (
        <div className="card-clean">
          <div className="card-header-clean">
            <div>
              <h3 className="card-title-clean">
                <LayersIcon size={16} className="text-emerald" />
                <span>Closed-Loop Architecture Topology Map (12 Subgraphs)</span>
              </h3>
              <p className="card-subtitle-clean">Prototype workflow and intended integration path. Factory endpoints shown are not connected.</p>
            </div>
            <span className="kpi-badge info">Mermaid 12-Layer Engine</span>
          </div>

          <div style={{ background: '#0b111e', padding: '18px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Row 1: Factory -> Edge -> System 1 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.2fr 1.2fr 0.2fr 1.2fr', alignItems: 'center' }}>
                <div style={{ background: 'rgba(15, 23, 42, 0.9)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <div style={{ fontSize: '11px', color: '#00d328', fontWeight: 700, marginBottom: '4px' }}>FACTORY / PHYSICAL WORLD</div>
                  <div style={{ fontSize: '11px', color: '#cbd5e1', lineHeight: '1.5' }}>
                    • Sensors & Energy Meters (Feeder F-03)<br />
                    • PLCs / VFDs / CNC Controllers<br />
                    • MES / Production Batch Counters<br />
                    • CMMS / Maintenance History<br />
                    • QMS & ERP Tariff Structures
                  </div>
                </div>

                <div style={{ textAlign: 'center', color: '#00d328', fontWeight: 800 }}>&rarr;</div>

                <div style={{ background: 'rgba(15, 23, 42, 0.9)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
                  <div style={{ fontSize: '11px', color: '#06b6d4', fontWeight: 700, marginBottom: '4px' }}>EDGE INDUSTRIAL GATEWAY</div>
                  <div style={{ fontSize: '11px', color: '#cbd5e1', lineHeight: '1.5' }}>
                    • Telemetry Ingestion (Modbus/OPC-UA)<br />
                    • Proposed offline buffering (capacity to be sized at deployment)<br />
                    • Signal Normalization & Filtering<br />
                    • Equipment-Specific Learned Baseline
                  </div>
                </div>

                <div style={{ textAlign: 'center', color: '#06b6d4', fontWeight: 800 }}>&rarr;</div>

                <div style={{ background: 'rgba(15, 23, 42, 0.9)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(129, 140, 248, 0.3)' }}>
                  <div style={{ fontSize: '11px', color: '#818cf8', fontWeight: 700, marginBottom: '4px' }}>SYSTEM 1 — FAST DECISION LOOP</div>
                  <div style={{ fontSize: '11px', color: '#cbd5e1', lineHeight: '1.5' }}>
                    • Configurable model gateway (runtime status shown separately)<br />
                    • Anomaly & Envelope Screening<br />
                    • Deterministic Safety Guardrails (P &ge; 5.5 bar)<br />
                    • Tool / Investigation Router
                  </div>
                </div>
              </div>

              {/* Trigger Gate */}
              <div style={{ display: 'flex', justifyContent: 'center', margin: '6px 0' }}>
                <div style={{ background: 'rgba(245, 158, 11, 0.15)', border: '1px solid #f59e0b', padding: '6px 18px', borderRadius: '20px', color: '#fbbf24', fontSize: '11px', fontWeight: 700 }}>
                  Requires Deep Investigation? &rarr; [YES: System 2] | [NO: Fast Edge Candidate Action Score]
                </div>
              </div>

              {/* Row 2: System 2 -> MCP -> Physics Engine */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.2fr 1.2fr 0.2fr 1.2fr', alignItems: 'center' }}>
                <div style={{ background: 'rgba(15, 23, 42, 0.9)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                  <div style={{ fontSize: '11px', color: '#fbbf24', fontWeight: 700, marginBottom: '4px' }}>SYSTEM 2 — DEEP DECISION LOOP</div>
                  <div style={{ fontSize: '11px', color: '#cbd5e1', lineHeight: '1.5' }}>
                    1. Planner Agent (Bounds & Intent)<br />
                    2. Research Agent (MCP Evidence Pack)<br />
                    3. Analysis Agent (Hypotheses A-D)<br />
                    4. Execution Agent (Scenario Formulator)
                  </div>
                </div>

                <div style={{ textAlign: 'center', color: '#fbbf24', fontWeight: 800 }}>&harr;</div>

                <div style={{ background: 'rgba(15, 23, 42, 0.9)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                  <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 700, marginBottom: '4px' }}>FORGEOPS MCP TOOL LAYER (16 TOOLS)</div>
                  <div style={{ fontSize: '11px', color: '#cbd5e1', lineHeight: '1.5' }}>
                    • Telemetry & Production Tools<br />
                    • CMMS Maintenance & QMS Tools<br />
                    • Energy History & Baseline Tools<br />
                    • Work Order & M&V Report APIs
                  </div>
                </div>

                <div style={{ textAlign: 'center', color: '#10b981', fontWeight: 800 }}>&rarr;</div>

                <div style={{ background: 'rgba(15, 23, 42, 0.9)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
                  <div style={{ fontSize: '11px', color: '#f43f5e', fontWeight: 700, marginBottom: '4px' }}>ENGINEERING & PHYSICS LAYER</div>
                  <div style={{ fontSize: '11px', color: '#cbd5e1', lineHeight: '1.5' }}>
                    • Rotary Screw Compressor Isentropic Model<br />
                    • Orifice Sonic/Subsonic Leakage Flow<br />
                    • Electric Induction Furnace Thermal Model<br />
                    • DISCOM Time-of-Day Tariff & CO₂ Engine
                  </div>
                </div>
              </div>

              {/* Row 3: Simulator -> Economics -> Human Approval */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.2fr 1.2fr 0.2fr 1.2fr', alignItems: 'center' }}>
                <div style={{ background: 'rgba(15, 23, 42, 0.9)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                  <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 700, marginBottom: '4px' }}>COUNTERFACTUAL SIMULATION</div>
                  <div style={{ fontSize: '11px', color: '#cbd5e1', lineHeight: '1.5' }}>
                    • Scenario Generator (What-If)<br />
                    • Production + Energy Simulator<br />
                    • Hard Process Constraints Verification<br />
                    • Multi-Objective Pareto Optimizer
                  </div>
                </div>

                <div style={{ textAlign: 'center', color: '#10b981', fontWeight: 800 }}>&rarr;</div>

                <div style={{ background: 'rgba(15, 23, 42, 0.9)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                  <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 700, marginBottom: '4px' }}>ECONOMIC DECISION LAYER</div>
                  <div style={{ fontSize: '11px', color: '#cbd5e1', lineHeight: '1.5' }}>
                    • Specific Energy Cost (₹/ton)<br />
                    • Expected Financial Savings (₹/day)<br />
                    • Scenario economics; no scheme grant assumed<br />
                    • Payback = CapEx / Monthly Net Savings
                  </div>
                </div>

                <div style={{ textAlign: 'center', color: '#38bdf8', fontWeight: 800 }}>&rarr;</div>

                <div style={{ background: 'rgba(15, 23, 42, 0.9)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0, 211, 40, 0.4)' }}>
                  <div style={{ fontSize: '11px', color: '#00d328', fontWeight: 700, marginBottom: '4px' }}>HUMAN DECISION LAYER</div>
                  <div style={{ fontSize: '11px', color: '#cbd5e1', lineHeight: '1.5' }}>
                    • ForgeOps Decision Dashboard<br />
                    • Causal Evidence & Explanation Dossier<br />
                    • Recommended Pareto Options (A vs B vs C)<br />
                    • Engineer Approval / Rejection Gate
                  </div>
                </div>
              </div>

              {/* Row 4: Execution -> M&V -> Learning Loop */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.2fr 1.2fr 0.2fr 1.2fr', alignItems: 'center' }}>
                <div style={{ background: 'rgba(15, 23, 42, 0.9)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(148, 163, 184, 0.3)' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, marginBottom: '4px' }}>CONTROLLED EXECUTION</div>
                  <div style={{ fontSize: '11px', color: '#cbd5e1', lineHeight: '1.5' }}>
                    • Demo approval record (no CMMS dispatch)<br />
                    • Proposed maintenance task for operator review<br />
                    • Setpoint scenario (requires engineering validation)<br />
                    • Scheduling is an integration target
                  </div>
                </div>

                <div style={{ textAlign: 'center', color: '#94a3b8', fontWeight: 800 }}>&rarr;</div>

                <div style={{ background: 'rgba(15, 23, 42, 0.9)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0, 211, 40, 0.5)' }}>
                  <div style={{ fontSize: '11px', color: '#00d328', fontWeight: 700, marginBottom: '4px' }}>MEASURE & VERIFY (L7)</div>
                  <div style={{ fontSize: '11px', color: '#cbd5e1', lineHeight: '1.5' }}>
                    • Synthetic scenario inputs (no live telemetry)<br />
                    • Illustrative baseline calculation<br />
                    • No IPMVP or field savings verification<br />
                    • Demo report export only
                  </div>
                </div>

                <div style={{ textAlign: 'center', color: '#00d328', fontWeight: 800 }}>&rarr;</div>

                <div style={{ background: 'rgba(15, 23, 42, 0.9)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(168, 85, 247, 0.4)' }}>
                  <div style={{ fontSize: '11px', color: '#a855f7', fontWeight: 700, marginBottom: '4px' }}>PLANNED LEARNING LOOP (NOT IMPLEMENTED)</div>
                  <div style={{ fontSize: '11px', color: '#cbd5e1', lineHeight: '1.5' }}>
                    • Synthetic example variance only<br />
                    • Governed model update is a future target<br />
                    • Example intensity target: 8.5 kWh/t<br />
                    • Demo audit records are not tamper-proof
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: System 1 Fast Loop & CMP-01 Sandbox */}
      {activeTab === 'system1_sandbox' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px' }}>
          {/* Left: Interactive Telemetry Controls */}
          <div className="card-clean">
            <div className="card-header-clean">
              <div>
                <h3 className="card-title-clean">
                  <SlidersIcon size={16} className="text-emerald" />
                  <span>Compressor CMP-01 Telemetry Simulator</span>
                </h3>
                <p className="card-subtitle-clean">
                  Simulate raw shopfloor sensor signals to observe sub-10ms non-autoregressive triage
                </p>
              </div>
              <span className="kpi-badge warning" style={{ fontSize: '10px' }}>
                Synthetic pilot telemetry / simulated baseline
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Power Slider */}
              <div className="slider-group-clean">
                <div className="slider-label-flex">
                  <span className="slider-label-text">Compressor Electrical Power (kW)</span>
                  <span className="slider-val-readout" style={{ color: isPowerAbnormal ? '#f87171' : '#00d328' }}>
                    {simulatedPower.toFixed(1)} kW ({powerDeltaPct > 0 ? `+${powerDeltaPct.toFixed(1)}%` : `${powerDeltaPct.toFixed(1)}%`})
                  </span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="75"
                  step="0.5"
                  value={simulatedPower}
                  onChange={(e) => setSimulatedPower(Number(e.target.value))}
                  className="slider-native-clean"
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: '#6b7280', fontFamily: 'var(--font-mono)' }}>
                  <span>40 kW (Unloaded)</span>
                  <span style={{ color: '#00d328' }}>45–53 kW (Historical Baseline Envelope)</span>
                  <span>75 kW (Full Rated)</span>
                </div>
              </div>

              {/* Pressure Slider */}
              <div className="slider-group-clean">
                <div className="slider-label-flex">
                  <span className="slider-label-text">Manifold Air Pressure (bar)</span>
                  <span className="slider-val-readout text-cyan">{simulatedPressure.toFixed(2)} bar</span>
                </div>
                <input
                  type="range"
                  min="4.5"
                  max="7.5"
                  step="0.05"
                  value={simulatedPressure}
                  onChange={(e) => setSimulatedPressure(Number(e.target.value))}
                  className="slider-native-clean"
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: '#6b7280', fontFamily: 'var(--font-mono)' }}>
                  <span style={{ color: '#f87171' }}>&lt; 5.5 bar (Hard Safety Limit)</span>
                  <span style={{ color: '#00d328' }}>6.2–6.6 bar (Envelope)</span>
                  <span>7.5 bar</span>
                </div>
              </div>

              {/* Vibration Slider */}
              <div className="slider-group-clean">
                <div className="slider-label-flex">
                  <span className="slider-label-text">Motor Bearing Vibration (mm/s RMS)</span>
                  <span className="slider-val-readout">{simulatedVibration.toFixed(2)} mm/s</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="5.0"
                  step="0.1"
                  value={simulatedVibration}
                  onChange={(e) => setSimulatedVibration(Number(e.target.value))}
                  className="slider-native-clean"
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: '#6b7280', fontFamily: 'var(--font-mono)' }}>
                  <span>0.5 mm/s (Smooth)</span>
                  <span style={{ color: '#00d328' }}>1.2–2.1 mm/s (Envelope)</span>
                  <span style={{ color: '#f87171' }}>&gt; 3.5 mm/s (Trip Limit)</span>
                </div>
              </div>

              {/* Preset buttons */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <button
                  className="btn-secondary-action"
                  onClick={() => {
                    setSimulatedPower(61.0);
                    setSimulatedPressure(6.5);
                    setSimulatedVibration(1.7);
                    setSimulatedFlow(397);
                    setSimulatedLoad(69);
                  }}
                  style={{ fontSize: '11px', padding: '6px 10px' }}
                >
                  Load Incident State (Power +18%)
                </button>
                <button
                  className="btn-secondary-action"
                  onClick={() => {
                    setSimulatedPower(49.0);
                    setSimulatedPressure(6.4);
                    setSimulatedVibration(1.5);
                    setSimulatedFlow(410);
                    setSimulatedLoad(65);
                  }}
                  style={{ fontSize: '11px', padding: '6px 10px' }}
                >
                  Load Nominal State
                </button>
              </div>
            </div>
          </div>

          {/* Right: System 1 Non-Autoregressive Output */}
          <div className="card-clean" style={{ borderLeft: s1TriggerInvestigation ? '4px solid #f59e0b' : '4px solid #00d328' }}>
            <div className="card-header-clean">
              <div>
                <h3 className="card-title-clean">
                  <CpuIcon size={16} className={s1TriggerInvestigation ? 'text-amber' : 'text-emerald'} />
                  <span>System 1 Edge Decision Engine Output</span>
                </h3>
                <p className="card-subtitle-clean">Non-autoregressive forward pass (&lt;10ms execution on RTX 3060 / DIN-rail IPC)</p>
              </div>
              <span className={`kpi-badge ${s1TriggerInvestigation ? 'warning' : 'success'}`}>
                {s1TriggerInvestigation ? 'Investigation Triggered' : 'Nominal'}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ background: 'var(--glass-surface)', padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                <span style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase' }}>Classification State</span>
                <div style={{ fontSize: '15px', fontWeight: 800, color: s1TriggerInvestigation ? '#fbbf24' : '#00d328', marginTop: '2px' }}>
                  {s1State}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                <div style={{ background: 'var(--glass-surface)', padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                  <span style={{ fontSize: '10.5px', color: '#9ca3af' }}>Calibrated Confidence</span>
                  <div className="font-mono" style={{ fontSize: '16px', fontWeight: 800, color: '#f9fafb', marginTop: '2px' }}>
                    {s1Confidence.toFixed(2)}
                  </div>
                </div>

                <div style={{ background: 'var(--glass-surface)', padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                  <span style={{ fontSize: '10.5px', color: '#9ca3af' }}>Safety Guardrail</span>
                  <div className="font-mono" style={{ fontSize: '14px', fontWeight: 800, color: s1SafetyStatus === 'PASS' ? '#00d328' : '#f87171', marginTop: '2px' }}>
                    {s1SafetyStatus}
                  </div>
                </div>
              </div>

              <div style={{ background: 'var(--glass-surface)', padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                <span style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase' }}>Deterministic Decision Triad</span>
                <div style={{ fontSize: '12px', color: '#e5e7eb', marginTop: '4px', lineHeight: '1.5' }}>
                  <strong>Observed:</strong> {s1Observed}<br />
                  <strong>Demand:</strong> Normal (Static 10.2 t/h)<br />
                  <strong>Pressure:</strong> {simulatedPressure < 6.2 ? `Sub-nominal (${simulatedPressure.toFixed(2)} bar)` : 'Normal (Within envelope)'}<br />
                  <strong>Action:</strong> <span style={{ color: '#00d328', fontWeight: 700 }}>{s1Action}</span>
                </div>
              </div>

              <div style={{ padding: '10px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '6px', fontSize: '11px', color: '#9ca3af', fontStyle: 'italic' }}>
                System 1 strictly diagnoses behaviour (&ldquo;ABNORMAL ENERGY BEHAVIOUR&rdquo;) without jumping to unverified conclusions. System 2 is summoned only when the trigger condition is met.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Agent 3 Competing Hypotheses & Physics Rejection Matrix */}
      {activeTab === 'competing_hypotheses' && (
        <div className="card-clean">
          <div className="card-header-clean">
            <div>
              <h3 className="card-title-clean">
                <ShieldCheckIcon size={16} className="text-emerald" />
                <span>Agent 3 Competing Hypotheses & Physics Rejection Matrix (Section 6)</span>
              </h3>
              <p className="card-subtitle-clean">
                ForgeOps does not accept first-pass LLM speculation. It generates competing explanations and uses deterministic physics models to reject impossible causes.
              </p>
            </div>
            <span className="kpi-badge success">Physics-Grounded</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {/* Hypothesis A */}
            <div style={{ background: 'rgba(16, 185, 129, 0.06)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.4)', boxShadow: 'var(--neu-sunken)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span className="font-mono text-emerald" style={{ fontWeight: 800, fontSize: '13px' }}>HYPOTHESIS A (SCENARIO LEADER)</span>
                <span className="kpi-badge success">Fixture score: 82%</span>
              </div>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#f9fafb', margin: '0 0 6px 0' }}>
                Compressed-Air Distribution Main Leakage
              </h4>
              <p style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.4', margin: '0 0 10px 0' }}>
                Synthetic scenario inputs pair 397 CFM flow with 6.1 bar delivery pressure. Field readings and production context are not connected.
              </p>
              <div style={{ background: '#0b111e', padding: '10px', borderRadius: '6px', fontSize: '11px', color: '#9ca3af', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <strong style={{ color: '#00d328' }}>Illustrative physics calculation:</strong> the orifice-flow model estimates the effect of an assumed 5.0 mm leak at 6.1 bar. Inspect the plant and compare with calibrated meter data before relying on the result.
                <div style={{ marginTop: '6px', color: '#6b7280' }}>
                  Evidence Sources: E1 (Power Trend), E2 (Pressure Trend), E5 (Leak Inspection History)
                </div>
              </div>
            </div>

            {/* Hypothesis B */}
            <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(239, 68, 68, 0.25)', boxShadow: 'var(--neu-sunken)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span className="font-mono text-danger" style={{ fontWeight: 800, fontSize: '13px' }}>HYPOTHESIS B (REJECTED)</span>
                <span className="kpi-badge critical">8% Confidence</span>
              </div>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#f9fafb', margin: '0 0 6px 0' }}>
                Excessive Discharge Pressure Setpoint
              </h4>
              <p style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.4', margin: '0 0 10px 0' }}>
                Operator artificially elevated discharge receiver pressure above rated 6.5 bar operating envelope.
              </p>
              <div style={{ background: '#0b111e', padding: '10px', borderRadius: '6px', fontSize: '11px', color: '#9ca3af', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <strong style={{ color: '#f87171' }}>Scenario comparison:</strong> the pressure-ratio model does not rank this explanation as highly under the assumed 6.1 bar input; it does not disprove a site condition.
                <div style={{ marginTop: '6px', color: '#6b7280' }}>
                  Evidence Sources: E2 (Line Pressure Trend)
                </div>
              </div>
            </div>

            {/* Hypothesis C */}
            <div style={{ background: 'rgba(148, 163, 184, 0.05)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(148, 163, 184, 0.2)', boxShadow: 'var(--neu-sunken)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span className="font-mono text-muted" style={{ fontWeight: 800, fontSize: '13px' }}>HYPOTHESIS C (LOW PROBABILITY)</span>
                <span className="kpi-badge info">15% Confidence</span>
              </div>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#f9fafb', margin: '0 0 6px 0' }}>
                Compressor Internal Screw / Bearing Wear
              </h4>
              <p style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.4', margin: '0 0 10px 0' }}>
                Mechanical friction or isentropic degradation inside rotary screw element causing electrical parasitic drag.
              </p>
              <div style={{ background: '#0b111e', padding: '10px', borderRadius: '6px', fontSize: '11px', color: '#9ca3af', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <strong style={{ color: '#38bdf8' }}>Illustrative physics check:</strong> sample vibration and temperature values are compared with example limits. No live vibration sensor or motor-temperature feed is connected.
                <div style={{ marginTop: '6px', color: '#6b7280' }}>
                  Evidence Sources: E1 (Power Trend), E3 (CMMS Overhaul History)
                </div>
              </div>
            </div>

            {/* Hypothesis D */}
            <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(239, 68, 68, 0.25)', boxShadow: 'var(--neu-sunken)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span className="font-mono text-danger" style={{ fontWeight: 800, fontSize: '13px' }}>HYPOTHESIS D (REJECTED)</span>
                <span className="kpi-badge critical">5% Confidence</span>
              </div>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#f9fafb', margin: '0 0 6px 0' }}>
                Surge in Factory Production Throughput
              </h4>
              <p style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.4', margin: '0 0 10px 0' }}>
                Production cadence surge on moulding line consuming additional pneumatic actuator pulses.
              </p>
              <div style={{ background: '#0b111e', padding: '10px', borderRadius: '6px', fontSize: '11px', color: '#9ca3af', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <strong style={{ color: '#f87171' }}>Scenario comparison:</strong> fixture throughput is held at 10.2 t/day while SEC changes. No MES telemetry is connected, so field throughput must be checked.
                <div style={{ marginTop: '6px', color: '#6b7280' }}>
                  Evidence Sources: E4 (MES Production Counter)
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: M&V Closed-Loop & Prediction Error */}
      {activeTab === 'closed_loop_feedback' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="card-clean" style={{ borderLeft: '4px solid #00d328' }}>
            <div className="card-header-clean">
              <div>
                <h3 className="card-title-clean">
                  <CheckCircleIcon size={16} className="text-emerald" />
                  <span>The Closed-Loop Feedback Engine (Section 14)</span>
                </h3>
                <p className="card-subtitle-clean">How post-intervention telemetry measures actual savings and updates future baseline envelopes</p>
              </div>
              <span className="kpi-badge success">Scenario only</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '14px', alignItems: 'center' }}>
              <div style={{ background: 'var(--glass-surface)', padding: '14px', borderRadius: '8px', border: '1px solid var(--glass-border)', textAlign: 'center' }}>
                <span style={{ fontSize: '10.5px', color: '#9ca3af' }}>BEFORE (INCIDENT)</span>
                <div className="font-mono text-danger" style={{ fontSize: '20px', fontWeight: 800, marginTop: '4px' }}>
                  11.2 kWh/t
                </div>
                <div style={{ fontSize: '10px', color: '#9ca3af', marginTop: '2px' }}>Line 2 Leak Surge</div>
              </div>

              <div style={{ textAlign: 'center', color: '#00d328', fontWeight: 800 }}>&rarr; Action &rarr;</div>

              <div style={{ background: 'var(--glass-surface)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.3)', textAlign: 'center' }}>
                <span style={{ fontSize: '10.5px', color: '#9ca3af' }}>AFTER (MODELLED)</span>
                <div className="font-mono text-emerald" style={{ fontSize: '20px', fontWeight: 800, marginTop: '4px' }}>
                  9.8 kWh/t
                </div>
                <div style={{ fontSize: '10px', color: '#00d328', marginTop: '2px' }}>Synthetic fixture example</div>
              </div>

              <div style={{ textAlign: 'center', color: '#00d328', fontWeight: 800 }}>&rarr; Normalized &rarr;</div>

              <div style={{ background: 'var(--glass-surface)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(6, 182, 212, 0.3)', textAlign: 'center' }}>
                <span style={{ fontSize: '10.5px', color: '#9ca3af' }}>PREDICTION ERROR</span>
                <div className="font-mono text-cyan" style={{ fontSize: '20px', fontWeight: 800, marginTop: '4px' }}>
                  14.3%
                </div>
                <div style={{ fontSize: '10px', color: '#22d3ee', marginTop: '2px' }}>Scenario A: -1.4 | Scenario B: -1.2</div>
              </div>
            </div>

            <div style={{ marginTop: '16px', background: '#0b111e', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ fontSize: '13px', color: '#f9fafb' }}>Illustrative Learning Loop (deployment target)</strong>
                  <p style={{ fontSize: '11.5px', color: '#9ca3af', margin: '2px 0 0 0' }}>
                    Synthetic example variance only. Automatic recalibration is not implemented; future updates require governed review and validated plant data.
                  </p>
                </div>
                <span className="kpi-badge success">Example target: 8.5 kWh/t</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: Safety Invariants & Failure Handling */}
      {activeTab === 'failure_modes' && (
        <div className="card-clean">
          <div className="card-header-clean">
            <div>
              <h3 className="card-title-clean">
                <AlertTriangleIcon size={16} className="text-amber" />
                <span>Deterministic Safety Boundary & Failure Matrix (Sections 9 & 19)</span>
              </h3>
              <p className="card-subtitle-clean">
                ForgeOps is a decision layer, not a replacement for industrial PLC safety control. AI cannot override physical interlocks.
              </p>
            </div>
            <span className="kpi-badge warning">Deterministic Invariants</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
            <div style={{ background: '#0b111e', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <span className="font-mono text-danger" style={{ fontSize: '11px', fontWeight: 700 }}>FAILURE SCENARIO 01</span>
              <strong style={{ display: 'block', fontSize: '13px', color: '#f9fafb', marginTop: '2px' }}>Sensor / Modbus Drop</strong>
              <p style={{ fontSize: '12px', color: '#9ca3af', margin: '6px 0 0 0' }}>
                Telemetry data quality check flags missing heartbeat. <strong>Automated Action:</strong> Block recommendation generation; mark telemetry as STALE; fallback to manual inspection log.
              </p>
            </div>

            <div style={{ background: '#0b111e', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <span className="font-mono text-amber" style={{ fontSize: '11px', fontWeight: 700 }}>FAILURE SCENARIO 02</span>
              <strong style={{ display: 'block', fontSize: '13px', color: '#f9fafb', marginTop: '2px' }}>System 1 Edge Inference Offline</strong>
              <p style={{ fontSize: '12px', color: '#9ca3af', margin: '6px 0 0 0' }}>
                DIN-rail edge model fails to execute forward pass. <strong>Automated Action:</strong> Edge hardware watchdog retains local ring buffer; alerts plant engineer; triggers manual System 2 investigation.
              </p>
            </div>

            <div style={{ background: '#0b111e', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <span className="font-mono text-danger" style={{ fontSize: '11px', fontWeight: 700 }}>FAILURE SCENARIO 03</span>
              <strong style={{ display: 'block', fontSize: '13px', color: '#f9fafb', marginTop: '2px' }}>Physics Validation Fails (P &lt; 5.5 bar)</strong>
              <p style={{ fontSize: '12px', color: '#9ca3af', margin: '6px 0 0 0' }}>
                AI proposes extreme pressure throttling below 5.5 bar to save energy. <strong>Automated Action:</strong> HARD BLOCK. Pneumatic mould clamping requires 5.5 bar minimum. The scenario is dropped before human review.
              </p>
            </div>

            <div style={{ background: '#0b111e', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <span className="font-mono text-cyan" style={{ fontSize: '11px', fontWeight: 700 }}>FAILURE SCENARIO 04</span>
              <strong style={{ display: 'block', fontSize: '13px', color: '#f9fafb', marginTop: '2px' }}>Human Engineer Rejection</strong>
              <p style={{ fontSize: '12px', color: '#9ca3af', margin: '6px 0 0 0' }}>
                Shift lead rejects recommendation citing impending tool changeover. <strong>Automated Action:</strong> Record rejection reason and production context into feedback dataset for continuous model tuning.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
