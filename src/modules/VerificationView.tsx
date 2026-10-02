import { useState } from 'react';
import { useWorkbenchData } from '../WorkbenchDataContext';
import { useFocusContext } from '../FocusContext';
import { AuditDossier, exportAuditDossier } from './AuditDossier';
import {
  CheckCircleIcon,
  ShieldCheckIcon,
  ActivityIcon,
  TrendingDownIcon,
  ClockIcon,
  WrenchIcon,
  FileTextIcon,
  ArrowRightIcon,
  ZapIcon,
  RefreshCwIcon,
} from '../components/Icons';

export function VerificationView({ onOpenWorkbench }: { onOpenWorkbench: () => void }) {
  const [activeIncidentId] = useState('INC-ENG-2401');
  const { data } = useWorkbenchData();
  const { focus } = useFocusContext();

  return (
    <div className="page-container">
      {/* Header */}
      <header className="page-header-clean">
        <div>
          <div className="page-kicker">
            <span className="kicker-tag">Closed-Loop Verification</span>
            <span>BEE Normalized Measurement & Verification Protocol (IPMVP)</span>
          </div>
          <h1 className="page-title">Post-Intervention Savings Verification Engine</h1>
          <p className="page-subtitle">
            Rigorous before-vs-after telemetry comparison normalized for throughput, metallurgy product mix, and ambient operating shifts.
          </p>
        </div>

        <div className="header-controls-group">
          <span className="kpi-badge success" style={{ padding: '8px 14px', fontSize: '12px' }}>
            <CheckCircleIcon size={14} />
            <span>Savings Audit Verified: -17.9% SEC</span>
          </span>
          <button className="btn-secondary-action" onClick={() => exportAuditDossier(data, focus)}>
            <FileTextIcon size={14} />
            <span>Export Incident Dossier (PDF)</span>
          </button>
        </div>
      </header>

      {/* Hero Card: Verified Incident Summary */}
      <div className="card-clean" style={{ borderLeft: '4px solid #00d328', background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.08) 0%, rgba(15, 23, 42, 0.85) 100%)' }}>
        <div className="card-header-clean">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="kpi-badge success">CLOSED • VERIFIED</span>
              <span className="font-mono text-muted" style={{ fontSize: '12px' }}>INC-ENG-2401 • Work Order WO-ENG-7922</span>
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#f9fafb' }}>
              Line 2 Compressed-Air Manifold Coupling Replacement & Pressure Optimization
            </h2>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase' }}>Verified Annual Run-Rate</span>
            <div className="font-mono text-emerald" style={{ fontSize: '24px', fontWeight: 800 }}>
              ₹22.46 Lakhs / yr
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginTop: '8px' }}>
          {/* SEC Comparison */}
          <div style={{ background: 'var(--glass-surface)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.3)', boxShadow: 'var(--neu-sunken)' }}>
            <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase' }}>Specific Energy (SEC)</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
              <span className="font-mono" style={{ textDecoration: 'line-through', color: '#f87171', fontSize: '15px' }}>11.2</span>
              <span className="font-mono text-emerald" style={{ fontSize: '24px', fontWeight: 800 }}>9.2</span>
              <span className="font-mono text-muted" style={{ fontSize: '12px' }}>kWh/t</span>
            </div>
            <div style={{ fontSize: '11.5px', color: '#00d328', fontWeight: 600, marginTop: '4px' }}>
              &darr; -17.9% Verified Reduction
            </div>
          </div>

          {/* Throughput Preservation */}
          <div style={{ background: 'var(--glass-surface)', padding: '16px', borderRadius: '10px', border: '1px solid var(--glass-border)', boxShadow: 'var(--neu-sunken)' }}>
            <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase' }}>Throughput Output</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
              <span className="font-mono text-primary" style={{ fontSize: '24px', fontWeight: 800 }}>10.2</span>
              <span className="font-mono text-muted" style={{ fontSize: '12px' }}>ton / hr</span>
            </div>
            <div style={{ fontSize: '11.5px', color: '#38bdf8', fontWeight: 600, marginTop: '4px' }}>
              100% Preserved (0% Disruption)
            </div>
          </div>

          {/* Metallurgical Yield */}
          <div style={{ background: 'var(--glass-surface)', padding: '16px', borderRadius: '10px', border: '1px solid var(--glass-border)', boxShadow: 'var(--neu-sunken)' }}>
            <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase' }}>Quality & Yield Rate</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
              <span className="font-mono text-primary" style={{ fontSize: '24px', fontWeight: 800 }}>97.8%</span>
              <span className="font-mono text-muted" style={{ fontSize: '12px' }}>Yield</span>
            </div>
            <div style={{ fontSize: '11.5px', color: '#00d328', fontWeight: 600, marginTop: '4px' }}>
              +0.2% vs Baseline (Grade 400/18)
            </div>
          </div>

          {/* Carbon Abatement */}
          <div style={{ background: 'var(--glass-surface)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(6, 182, 212, 0.3)', boxShadow: 'var(--neu-sunken)' }}>
            <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase' }}>Scope 2 Avoidance</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
              <span className="font-mono text-cyan" style={{ fontSize: '24px', fontWeight: 800 }}>96</span>
              <span className="font-mono text-muted" style={{ fontSize: '12px' }}>kg CO₂/day</span>
            </div>
            <div style={{ fontSize: '11.5px', color: '#22d3ee', fontWeight: 600, marginTop: '4px' }}>
              35.0 tCO₂e / year clean avoided
            </div>
          </div>
        </div>
      </div>

      {/* Two-Column Detail Grid */}
      <div className="grid-equal-2">
        {/* Left: Execution & Governance Audit Trail */}
        <div className="card-clean">
          <div className="card-header-clean">
            <div>
              <h3 className="card-title-clean">
                <WrenchIcon size={16} className="text-emerald" />
                <span>CMMS Work Order & Execution Audit Trail</span>
              </h3>
              <p className="card-subtitle-clean">End-to-end trace from anomaly detection to physical resolution</p>
            </div>
            <span className="kpi-badge info">Audit Stamped</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--bg-elevated, #1e293b)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#f87171' }}>
                <ClockIcon size={14} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <strong style={{ fontSize: '13px', color: '#f9fafb' }}>Anomaly Detected by Edge Gateway</strong>
                  <span className="font-mono text-muted" style={{ fontSize: '11px' }}>08:30 AM Today</span>
                </div>
                <p style={{ fontSize: '12px', color: '#9ca3af', margin: '2px 0 0 0' }}>
                  Pneumatic manifold pressure dropped to 6.1 bar; compressor modulation spiked to 84%.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--bg-elevated, #1e293b)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#38bdf8' }}>
                <ShieldCheckIcon size={14} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <strong style={{ fontSize: '13px', color: '#f9fafb' }}>4-Agent Pipeline Investigation & Approval</strong>
                  <span className="font-mono text-muted" style={{ fontSize: '11px' }}>08:35 AM Today</span>
                </div>
                <p style={{ fontSize: '12px', color: '#9ca3af', margin: '2px 0 0 0' }}>
                  Option C approved by Supervisor VK. Work order <strong>WO-ENG-7922</strong> generated and dispatched.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--bg-elevated, #1e293b)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#f59e0b' }}>
                <WrenchIcon size={14} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <strong style={{ fontSize: '13px', color: '#f9fafb' }}>Maintenance Executed (Shift B Changeover)</strong>
                  <span className="font-mono text-muted" style={{ fontSize: '11px' }}>11:00 AM - 11:42 AM</span>
                </div>
                <p style={{ fontSize: '12px', color: '#9ca3af', margin: '2px 0 0 0' }}>
                  Technician S. Kulkarni replaced ruptured braided coupling; compressor setpoint adjusted to 6.5 bar.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#00d328', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#051408' }}>
                <CheckCircleIcon size={14} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <strong style={{ fontSize: '13px', color: '#00d328' }}>Independent Telemetry Verification Confirmed</strong>
                  <span className="font-mono text-emerald" style={{ fontSize: '11px', fontWeight: 600 }}>12:30 PM Today</span>
                </div>
                <p style={{ fontSize: '12px', color: '#9ca3af', margin: '2px 0 0 0' }}>
                  Modbus Feeder F-03 confirms SEC stabilized at 9.2 kWh/ton. Energy audit ledger permanently updated.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Controlled Model Learning & Baseline Calibration */}
        <div className="card-clean">
          <div className="card-header-clean">
            <div>
              <h3 className="card-title-clean">
                <RefreshCwIcon size={16} className="text-emerald" />
                <span>Controlled Model Learning & Calibration (Section 73)</span>
              </h3>
              <p className="card-subtitle-clean">Closed-loop model evaluation and baseline recalibration record</p>
            </div>
            <span className="kpi-badge success">Model Calibrated</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--glass-surface)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#9ca3af' }}>Simulation Prediction vs Actual Result</span>
                <strong style={{ display: 'block', fontSize: '13px', color: '#f9fafb', marginTop: '2px' }}>
                  Predicted: -18.0% SEC • Measured Actual: -17.9% SEC
                </strong>
              </div>
              <span className="kpi-badge success">99.4% Accuracy</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--glass-surface)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#9ca3af' }}>Downtime Window Execution</span>
                <strong style={{ display: 'block', fontSize: '13px', color: '#f9fafb', marginTop: '2px' }}>
                  Estimated: 48 min • Actual Changeover: 42 min
                </strong>
              </div>
              <span className="kpi-badge info">Within Budget</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--glass-surface)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#9ca3af' }}>Dynamic Baseline Envelope Status</span>
                <strong style={{ display: 'block', fontSize: '13px', color: '#f9fafb', marginTop: '2px' }}>
                  Line 2 Standard SEC recalibrated to 8.5 kWh/ton target
                </strong>
              </div>
              <span className="kpi-badge success">Re-Anchored</span>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn-primary-action" onClick={onOpenWorkbench}>
                <span>View Decision Workbench →</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <AuditDossier data={data} focus={focus} />
    </div>
  );
}
