import { useState } from 'react';
import {
  ZapIcon,
  ActivityIcon,
  CpuIcon,
  LayersIcon,
  ShieldCheckIcon,
  DatabaseIcon,
  SlidersIcon,
  FileTextIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  FactoryIcon,
  GaugeIcon,
  RefreshCwIcon,
  WrenchIcon,
} from '../components/Icons';

type ArchitectureTier = 'shopfloor' | 'edge' | 'agents' | 'closedloop';

export function ArchitectureView({ onOpenWorkbench }: { onOpenWorkbench: () => void }) {
  const [selectedTier, setSelectedTier] = useState<ArchitectureTier>('agents');

  return (
    <div className="page-container">
      {/* Header */}
      <header className="page-header-clean">
        <div>
          <div className="page-kicker">
            <span className="kicker-tag">Technical Topology</span>
            <span>Edge-to-Agent Closed-Loop Specification 4.2</span>
          </div>
          <h1 className="page-title">ForgeOps Energy System Architecture</h1>
          <p className="page-subtitle">
            Vendor-neutral agentic decision layer interfacing directly with factory SCADA, energy submeters, and CMMS workflows.
          </p>
        </div>

        <div className="header-controls-group">
          <button className="btn-primary-action" onClick={onOpenWorkbench}>
            <span>Open Decision Workbench</span>
            <ArrowRightIcon size={14} />
          </button>
        </div>
      </header>

      {/* 4-Tier Spatial Architecture Layout */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Tier 1: Shop Floor Assets */}
        <div
          className={`card-clean ${selectedTier === 'shopfloor' ? 'selected-tier' : ''}`}
          style={{ cursor: 'pointer', borderLeft: selectedTier === 'shopfloor' ? '4px solid #00d328' : undefined }}
          onClick={() => setSelectedTier('shopfloor')}
        >
          <div className="card-header-clean">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="kpi-badge info">TIER 01 • INGESTION</span>
              <h3 className="card-title-clean">Factory Physical Shopfloor & Submetering Infrastructure</h3>
            </div>
            <span className="font-mono text-muted" style={{ fontSize: '11px' }}>RS-485 Modbus RTU / TCP • 1.2s Poll</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
            <div style={{ background: 'rgba(11, 17, 30, 0.85)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)', boxShadow: 'var(--neu-sunken)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#00d328', marginBottom: '4px' }}>
                <ZapIcon size={16} />
                <strong style={{ fontSize: '13px', color: '#f9fafb' }}>Electrical Submeters</strong>
              </div>
              <p style={{ fontSize: '11.5px', color: '#9ca3af', margin: 0 }}>
                Class 0.5S smart meters on induction melting, compressors, and motor control centers (kW, kVAh, PF, Harmonics).
              </p>
            </div>

            <div style={{ background: 'rgba(11, 17, 30, 0.85)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)', boxShadow: 'var(--neu-sunken)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#06b6d4', marginBottom: '4px' }}>
                <GaugeIcon size={16} />
                <strong style={{ fontSize: '13px', color: '#f9fafb' }}>Process Transducers</strong>
              </div>
              <p style={{ fontSize: '11.5px', color: '#9ca3af', margin: 0 }}>
                High-frequency pneumatic pressure transducers (0-16 bar), furnace pyrometers, and cooling water flowmeters.
              </p>
            </div>

            <div style={{ background: 'rgba(11, 17, 30, 0.85)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)', boxShadow: 'var(--neu-sunken)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#818cf8', marginBottom: '4px' }}>
                <CpuIcon size={16} />
                <strong style={{ fontSize: '13px', color: '#f9fafb' }}>Automation PLCs</strong>
              </div>
              <p style={{ fontSize: '11.5px', color: '#9ca3af', margin: 0 }}>
                OPC-UA and industrial Ethernet bridge to Siemens S7-1200, Schneider Modicon, and legacy relay panels.
              </p>
            </div>

            <div style={{ background: 'rgba(11, 17, 30, 0.85)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)', boxShadow: 'var(--neu-sunken)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24', marginBottom: '4px' }}>
                <FactoryIcon size={16} />
                <strong style={{ fontSize: '13px', color: '#f9fafb' }}>MES & Batch Production</strong>
              </div>
              <p style={{ fontSize: '11.5px', color: '#9ca3af', margin: 0 }}>
                Real-time batch weights, mold cycle counts, and metallurgy spectrometer grades for dynamic SEC denominator.
              </p>
            </div>
          </div>
        </div>

        {/* Tier 2: Industrial Edge Computing Gateway */}
        <div
          className={`card-clean ${selectedTier === 'edge' ? 'selected-tier' : ''}`}
          style={{ cursor: 'pointer', borderLeft: selectedTier === 'edge' ? '4px solid #00d328' : undefined }}
          onClick={() => setSelectedTier('edge')}
        >
          <div className="card-header-clean">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="kpi-badge info">TIER 02 • EDGE GATEWAY</span>
              <h3 className="card-title-clean">DIN-Rail Industrial Edge & Anomaly Screening Gateway</h3>
            </div>
            <span className="font-mono text-muted" style={{ fontSize: '11px' }}>Local Ring Buffer • mTLS X.509 Secured</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
            <div style={{ background: 'rgba(11, 17, 30, 0.85)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)', boxShadow: 'var(--neu-sunken)' }}>
              <strong style={{ fontSize: '13px', color: '#f9fafb', display: 'block', marginBottom: '4px' }}>Sub-Second Anomaly Filter</strong>
              <p style={{ fontSize: '11.5px', color: '#9ca3af', margin: 0 }}>
                Filters electrical noise and runs localized threshold checks for voltage sags and pressure drops at 100ms intervals.
              </p>
            </div>

            <div style={{ background: 'rgba(11, 17, 30, 0.85)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)', boxShadow: 'var(--neu-sunken)' }}>
              <strong style={{ fontSize: '13px', color: '#f9fafb', display: 'block', marginBottom: '4px' }}>Offline-Resilient Ring Cache</strong>
              <p style={{ fontSize: '11.5px', color: '#9ca3af', margin: 0 }}>
                Preserves 72 hours of telemetry during factory internet outages; auto-syncs with NitroCloud on reconnect.
              </p>
            </div>

            <div style={{ background: 'rgba(11, 17, 30, 0.85)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)', boxShadow: 'var(--neu-sunken)' }}>
              <strong style={{ fontSize: '13px', color: '#f9fafb', display: 'block', marginBottom: '4px' }}>Air-Gapped OT Security</strong>
              <p style={{ fontSize: '11.5px', color: '#9ca3af', margin: 0 }}>
                Unidirectional telemetry outbound only; no inbound control ports open to factory floor automation network.
              </p>
            </div>
          </div>
        </div>

        {/* Tier 3: 4-Agent Autonomous Pipeline */}
        <div
          className={`card-clean ${selectedTier === 'agents' ? 'selected-tier' : ''}`}
          style={{ cursor: 'pointer', borderLeft: selectedTier === 'agents' ? '4px solid #00d328' : undefined, background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.06) 0%, rgba(15, 23, 42, 0.85) 100%)' }}
          onClick={() => setSelectedTier('agents')}
        >
          <div className="card-header-clean">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="kpi-badge success">TIER 03 • AGENTIC CORE</span>
              <h3 className="card-title-clean">Strict 4-Agent Decision & Optimization Engine</h3>
            </div>
            <span className="font-mono text-emerald" style={{ fontSize: '11px', fontWeight: 600 }}>min(SEC = kWh/ton) Subject to Throughput ≥ Base</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
            {/* Agent 1 */}
            <div style={{ background: 'rgba(11, 17, 30, 0.9)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.3)', boxShadow: 'var(--neu-sunken)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span className="font-mono text-emerald" style={{ fontWeight: 700, fontSize: '12px' }}>01 • PLANNER</span>
                <ShieldCheckIcon size={16} className="text-emerald" />
              </div>
              <strong style={{ fontSize: '13px', color: '#f9fafb', display: 'block', marginBottom: '4px' }}>Objective Formulation</strong>
              <p style={{ fontSize: '11.5px', color: '#9ca3af', lineHeight: '1.4', margin: 0 }}>
                Sets boundary constraints: Throughput ≥ Nominal, Quality ≥ Grade 400/18, Safety Envelope P ≥ 6.0 bar.
              </p>
            </div>

            {/* Agent 2 */}
            <div style={{ background: 'rgba(11, 17, 30, 0.9)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(6, 182, 212, 0.3)', boxShadow: 'var(--neu-sunken)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span className="font-mono text-cyan" style={{ fontWeight: 700, fontSize: '12px' }}>02 • RESEARCH</span>
                <ActivityIcon size={16} className="text-cyan" />
              </div>
              <strong style={{ fontSize: '13px', color: '#f9fafb', display: 'block', marginBottom: '4px' }}>MCP Tool Orchestration</strong>
              <p style={{ fontSize: '11.5px', color: '#9ca3af', lineHeight: '1.4', margin: 0 }}>
                Executes controlled MCP calls: retrieves submeter kWh streams, pneumatic pressures, and CMMS repair history.
              </p>
            </div>

            {/* Agent 3 */}
            <div style={{ background: 'rgba(11, 17, 30, 0.9)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(129, 140, 248, 0.3)', boxShadow: 'var(--neu-sunken)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span className="font-mono" style={{ color: '#818cf8', fontWeight: 700, fontSize: '12px' }}>03 • ANALYSIS</span>
                <CpuIcon size={16} style={{ color: '#818cf8' }} />
              </div>
              <strong style={{ fontSize: '13px', color: '#f9fafb', display: 'block', marginBottom: '4px' }}>Causal Energy Math</strong>
              <p style={{ fontSize: '11.5px', color: '#9ca3af', lineHeight: '1.4', margin: 0 }}>
                Isolates +14.3% SEC spike, correlates compressor runtime surge with pressure drop, and validates 94% causal confidence.
              </p>
            </div>

            {/* Agent 4 */}
            <div style={{ background: 'rgba(11, 17, 30, 0.9)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.3)', boxShadow: 'var(--neu-sunken)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span className="font-mono text-emerald" style={{ fontWeight: 700, fontSize: '12px' }}>04 • EXECUTION</span>
                <SlidersIcon size={16} className="text-emerald" />
              </div>
              <strong style={{ fontSize: '13px', color: '#f9fafb', display: 'block', marginBottom: '4px' }}>What-If Simulation</strong>
              <p style={{ fontSize: '11.5px', color: '#9ca3af', lineHeight: '1.4', margin: 0 }}>
                Evaluates 4 intervention options, computes ₹6,240/day savings return, and formats dispatch brief for human supervisor.
              </p>
            </div>
          </div>
        </div>

        {/* Tier 4: Closed-Loop Execution & Feedback */}
        <div
          className={`card-clean ${selectedTier === 'closedloop' ? 'selected-tier' : ''}`}
          style={{ cursor: 'pointer', borderLeft: selectedTier === 'closedloop' ? '4px solid #00d328' : undefined }}
          onClick={() => setSelectedTier('closedloop')}
        >
          <div className="card-header-clean">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="kpi-badge success">TIER 04 • CLOSED LOOP</span>
              <h3 className="card-title-clean">Human-in-the-Loop Gate, CMMS Dispatch & Verification</h3>
            </div>
            <span className="font-mono text-muted" style={{ fontSize: '11px' }}>WO-ENG-7922 • Edge Feedback Verified</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
            <div style={{ background: 'rgba(11, 17, 30, 0.85)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)', boxShadow: 'var(--neu-sunken)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#00d328', marginBottom: '4px' }}>
                <ShieldCheckIcon size={16} />
                <strong style={{ fontSize: '13px', color: '#f9fafb' }}>Human Approval Gate</strong>
              </div>
              <p style={{ fontSize: '11.5px', color: '#9ca3af', margin: 0 }}>
                Single-click authorization by certified plant energy manager prevents unvalidated machine parameter adjustments.
              </p>
            </div>

            <div style={{ background: 'rgba(11, 17, 30, 0.85)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)', boxShadow: 'var(--neu-sunken)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#06b6d4', marginBottom: '4px' }}>
                <WrenchIcon size={16} />
                <strong style={{ fontSize: '13px', color: '#f9fafb' }}>CMMS Automated Ticket</strong>
              </div>
              <p style={{ fontSize: '11.5px', color: '#9ca3af', margin: 0 }}>
                Dispatches work order WO-ENG-7922 directly to maintenance team with replacement parts and changeover schedule.
              </p>
            </div>

            <div style={{ background: 'rgba(11, 17, 30, 0.85)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)', boxShadow: 'var(--neu-sunken)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#00d328', marginBottom: '4px' }}>
                <RefreshCwIcon size={16} />
                <strong style={{ fontSize: '13px', color: '#f9fafb' }}>Closed-Loop Telemetry Verification</strong>
              </div>
              <p style={{ fontSize: '11.5px', color: '#9ca3af', margin: 0 }}>
                Edge gateway measures post-repair SEC (9.2 kWh/t), confirms -18% verified savings, and updates plant audit ledger.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
