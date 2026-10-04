import React, { useState } from 'react';
import {
  ClockIcon,
  CheckCircleIcon,
  WrenchIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  ZapIcon,
  ActivityIcon,
} from '../components/Icons';

type ActionsProps = {
  onNavigate: (view: string, detailId?: string) => void;
  selectedActionId?: string;
};

export function ActionsView({ onNavigate, selectedActionId = 'WO-ENG-7922' }: ActionsProps) {
  const [activeTab, setActiveTab] = useState<'approved' | 'in_progress' | 'completed' | 'all'>('approved');

  const executionSteps = [
    { time: '10:32 AM', title: 'Investigation completed', desc: 'INV-1024 synthesized causal evidence pack', done: true },
    { time: '10:41 AM', title: 'Scenario approved', desc: 'Scenario A selected by Plant Engineer Vaishak', done: true },
    { time: '10:45 AM', title: 'Demo work-order record', desc: 'Prototype-only record; no CMMS connection or dispatch occurred', done: true },
    { time: '11:00 AM', title: 'Technician started', desc: 'Shift B maintenance technician arrived at Line 2 Moulding bank', done: true },
    { time: '11:32 AM', title: 'Leak repaired', desc: 'Replaced braided coupling with reinforced flexible connector', done: true },
    { time: '11:48 AM', title: 'Equipment returned', desc: 'Air header pressurized to 6.5 bar; soap bubble test passed', done: true },
    { time: '12:00 PM', title: 'Verification started', desc: 'Modbus submeter logged post-repair baseline for IPMVP audit', done: true },
  ];

  return (
    <div className="page-container">
      {/* ── Page Header ── */}
      <header className="page-header-clean">
        <div>
          <div className="page-kicker">
            <span className="kicker-tag">OPERATIONS</span>
            <span>Shopfloor Action & Execution Center</span>
          </div>
          <h1 className="page-title">Operational Actions & Work Orders</h1>
          <p className="page-subtitle">
            Review the prototype approval record and simulated work-order flow. This deployment is not connected to a CMMS or plant equipment.
          </p>
        </div>

        <div className="header-controls-group">
          <button className="btn-primary-action" onClick={() => onNavigate('verification', 'VER-332')}>
            <span>View Verification Center &rarr;</span>
          </button>
        </div>
      </header>

      {/* ── Tabs (Section 26 of Spec) ── */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px' }}>
        <button className={`btn-subtab ${activeTab === 'approved' ? 'active' : ''}`} onClick={() => setActiveTab('approved')}>
          Approved (1)
        </button>
        <button className={`btn-subtab ${activeTab === 'in_progress' ? 'active' : ''}`} onClick={() => setActiveTab('in_progress')}>
          In Progress (1)
        </button>
        <button className={`btn-subtab ${activeTab === 'completed' ? 'active' : ''}`} onClick={() => setActiveTab('completed')}>
          Completed (18)
        </button>
        <button className={`btn-subtab ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>
          All Actions (20)
        </button>
      </div>

      {/* ── Action Detail Card (Section 27 of Spec) ── */}
      <div className="card-clean" style={{ padding: '22px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="kicker-tag" style={{ border: '1px solid #d4e4d2', background: '#edf4ec', color: '#3b663b' }}>
                SCHEDULED &bull; WO-ENG-7922
              </span>
              <span className="provenance-badge provenance-simulated">Demo work-order record</span>
            </div>
            <h2 style={{ margin: '8px 0 2px', fontFamily: 'var(--font-serif)', fontSize: '20px', color: 'var(--text-primary)' }}>
              Repair CMP-01 Pneumatic Distribution Leak
            </h2>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>
              Target equipment: <strong>CMP-01 Screw Compressor</strong> &bull; Line 2 Moulding Bank Drop #4
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Scheduled: <strong>14:30–15:15</strong></span>
            <span className="provenance-badge provenance-measured" style={{ background: '#edf4ec', color: '#3b663b' }}>
              Zero Throughput Loss
            </span>
          </div>
        </div>

        {/* Action Metadata Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '12px', margin: '18px 0', padding: '14px', borderRadius: '8px', background: 'var(--bg-ground)', border: '1px solid var(--glass-border)' }}>
          <div>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Approved By</span>
            <div style={{ fontSize: '13px', fontWeight: 650, color: 'var(--text-primary)', marginTop: '2px' }}>Plant Engineer (Vaishak)</div>
          </div>
          <div>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Assigned Crew</span>
            <div style={{ fontSize: '13px', fontWeight: 650, color: 'var(--text-primary)', marginTop: '2px' }}>Maintenance Shift B</div>
          </div>
          <div>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Downtime Window</span>
            <div style={{ fontSize: '13px', fontWeight: 650, color: 'var(--text-primary)', marginTop: '2px' }}>42 min (Shift Changeover)</div>
          </div>
          <div>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Expected Savings</span>
            <div style={{ fontSize: '13px', fontWeight: 650, color: '#5e7e60', marginTop: '2px' }}>-1.5 kWh/t (₹48k/mo)</div>
          </div>
        </div>

        {/* Before vs After Telemetry Delta (Section 27 of Spec) */}
        <div style={{ margin: '20px 0' }}>
          <h4 style={{ margin: '0 0 10px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Scenario Inputs vs Modelled Outcome
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '12px' }}>
            <div style={{ padding: '14px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-surface)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Compressor Power</span>
                <span className="provenance-badge provenance-simulated">Demo input</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
                <span style={{ fontSize: '16px', color: '#bd6249', fontWeight: 700 }}>61 kW</span>
                <span style={{ color: 'var(--text-muted)' }}>&rarr;</span>
                <span style={{ fontSize: '18px', color: '#5e7e60', fontWeight: 700 }}>49 kW</span>
              </div>
              <small style={{ color: '#5e7e60', fontWeight: 600, display: 'block', marginTop: '4px' }}>-12.0 kW restored to nominal envelope</small>
            </div>

            <div style={{ padding: '14px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-surface)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Header Pressure</span>
                <span className="provenance-badge provenance-simulated">Demo input</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
                <span style={{ fontSize: '16px', color: '#a8793e', fontWeight: 700 }}>6.1 bar</span>
                <span style={{ color: 'var(--text-muted)' }}>&rarr;</span>
                <span style={{ fontSize: '18px', color: '#5e7e60', fontWeight: 700 }}>6.5 bar</span>
              </div>
              <small style={{ color: '#5e7e60', fontWeight: 600, display: 'block', marginTop: '4px' }}>+0.4 bar restored</small>
            </div>

            <div style={{ padding: '14px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-surface)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Line 2 Specific Energy</span>
                <span className="provenance-badge provenance-simulated">Modelled</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
                <span style={{ fontSize: '16px', color: '#bd6249', fontWeight: 700 }}>11.2 kWh/t</span>
                <span style={{ color: 'var(--text-muted)' }}>&rarr;</span>
                <span style={{ fontSize: '18px', color: '#5e7e60', fontWeight: 700 }}>9.8 kWh/t</span>
              </div>
              <small style={{ color: '#5e7e60', fontWeight: 600, display: 'block', marginTop: '4px' }}>-1.4 kWh/t scenario estimate</small>
            </div>
          </div>
        </div>

        {/* Execution Timeline (Section 27 of Spec) */}
        <div>
          <h4 style={{ margin: '0 0 12px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Execution Sequence
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {executionSteps.map((step, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '6px', background: 'var(--bg-ground)', border: '1px solid var(--glass-border)' }}>
                <span className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)', width: '70px', flexShrink: 0 }}>
                  {step.time}
                </span>
                <CheckCircleIcon size={14} style={{ color: '#5e7e60', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <strong style={{ fontSize: '12px', color: 'var(--text-primary)' }}>{step.title}</strong>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)', marginLeft: '8px' }}>&bull; {step.desc}</span>
                </div>
                <span className="provenance-badge provenance-measured">Done</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '22px', paddingTop: '16px', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button className="btn-secondary-action" onClick={() => onNavigate('investigations', 'INV-1024')}>
            Back to Investigation
          </button>
          <button className="btn-primary-action" onClick={() => onNavigate('verification', 'VER-332')}>
            <span>Open Verification Engine &rarr;</span>
          </button>
        </div>
      </div>
    </div>
  );
}
