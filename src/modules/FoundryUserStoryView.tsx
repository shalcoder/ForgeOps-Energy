import { useState } from 'react';
import {
  GaugeIcon,
  ZapIcon,
  ActivityIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ClockIcon,
  SlidersIcon,
  WrenchIcon,
  LayersIcon,
} from '../components/Icons';

export function FoundryUserStoryView({ onSwitchToWorkbench }: { onSwitchToWorkbench: () => void }) {
  const [viewMode, setViewMode] = useState<'fleet' | 'lifecycle'>('fleet');
  const [filterCategory, setFilterCategory] = useState<'all' | 'air' | 'furnace' | 'aux'>('all');

  const assets = [
    {
      id: 'COMP-02',
      name: '75 kW Rotary Screw Compressor',
      type: 'air',
      model: 'Kaeser CSD-75 • Feeder F-03',
      status: 'alert',
      statusLabel: 'Leak Detected',
      powerKw: 68,
      primaryMetric: '6.1 bar (Nominal: 7.2)',
      efficiency: '74% (Degraded)',
      hasIncident: true,
      incidentId: 'INC-ENG-2401',
    },
    {
      id: 'COMP-01',
      name: '90 kW VFD Master Compressor',
      type: 'air',
      model: 'Atlas Copco GA-90VSD • Feeder F-02',
      status: 'optimal',
      statusLabel: 'Optimal / Running',
      powerKw: 52,
      primaryMetric: '7.0 bar • 42 Hz VFD',
      efficiency: '94% Optimal',
      hasIncident: false,
    },
    {
      id: 'FURN-01',
      name: '500 kW Induction Melting Furnace',
      type: 'furnace',
      model: 'Inductotherm Tri-Line • Feeder F-01',
      status: 'optimal',
      statusLabel: 'Melting Cycle',
      powerKw: 440,
      primaryMetric: '1,420°C • Batch 1.2t',
      efficiency: '540 kWh/ton SEC',
      hasIncident: false,
    },
    {
      id: 'FURN-02',
      name: '350 kW Holding & Pouring Furnace',
      type: 'furnace',
      model: 'BBC Inductive Holding • Feeder F-01B',
      status: 'holding',
      statusLabel: 'Holding Standby',
      powerKw: 110,
      primaryMetric: '1,380°C • Pouring Ready',
      efficiency: 'Nominal Holding',
      hasIncident: false,
    },
    {
      id: 'MULL-01',
      name: '45 kW Intensive Green Sand Muller',
      type: 'aux',
      model: 'Simpson Multi-Mull • Feeder F-05',
      status: 'optimal',
      statusLabel: 'Cycling / Running',
      powerKw: 38,
      primaryMetric: '450 kg batch • 2.4 kWh/b',
      efficiency: '91% Optimal',
      hasIncident: false,
    },
    {
      id: 'PUMP-03',
      name: '30 kW Cooling Water Circulation Pump',
      type: 'aux',
      model: 'Kirloskar Centrifugal • Feeder F-06',
      status: 'optimal',
      statusLabel: 'Continuous Cooling',
      powerKw: 24,
      primaryMetric: '120 m³/hr • 3.2 bar',
      efficiency: '88% Standard',
      hasIncident: false,
    },
  ];

  const filteredAssets = assets.filter((a) => {
    if (filterCategory === 'all') return true;
    return a.type === filterCategory;
  });

  return (
    <div className="page-container">
      {/* Header */}
      <header className="page-header-clean">
        <div>
          <div className="page-kicker">
            <span className="kicker-tag">Asset Intelligence</span>
            <span>Belgaum Foundry Complex • Line 2 Equipment Directory</span>
          </div>
          <h1 className="page-title">
            {viewMode === 'fleet' ? 'Plant Asset Fleet & Submeter Directory' : 'Incident Lifecycle: Detection to Verification'}
          </h1>
          <p className="page-subtitle">
            {viewMode === 'fleet'
              ? 'Real-time telemetry, operating power, and specific energy efficiency across 6 submetered load centers.'
              : 'Autonomous diagnosis and constrained simulation of the +14.3% specific energy excursion.'}
          </p>
        </div>

        <div className="header-controls-group">
          <div className="segmented-nav">
            <button
              className={`nav-tab-btn ${viewMode === 'fleet' ? 'active' : ''}`}
              onClick={() => setViewMode('fleet')}
            >
              <GaugeIcon size={14} />
              <span>Asset Fleet Directory</span>
            </button>
            <button
              className={`nav-tab-btn ${viewMode === 'lifecycle' ? 'active' : ''}`}
              onClick={() => setViewMode('lifecycle')}
            >
              <ActivityIcon size={14} />
              <span>Incident Lifecycle Story</span>
            </button>
          </div>
        </div>
      </header>

      {/* VIEW 1: Plant Asset Fleet Monitor */}
      {viewMode === 'fleet' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Filter Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className={`btn-secondary-action ${filterCategory === 'all' ? 'active' : ''}`}
                style={{ backgroundColor: filterCategory === 'all' ? 'var(--bg-elevated)' : 'transparent' }}
                onClick={() => setFilterCategory('all')}
              >
                All Machinery (6)
              </button>
              <button
                className={`btn-secondary-action ${filterCategory === 'air' ? 'active' : ''}`}
                style={{ backgroundColor: filterCategory === 'air' ? 'var(--bg-elevated)' : 'transparent' }}
                onClick={() => setFilterCategory('air')}
              >
                Compressed Air (2)
              </button>
              <button
                className={`btn-secondary-action ${filterCategory === 'furnace' ? 'active' : ''}`}
                style={{ backgroundColor: filterCategory === 'furnace' ? 'var(--bg-elevated)' : 'transparent' }}
                onClick={() => setFilterCategory('furnace')}
              >
                Furnaces (2)
              </button>
              <button
                className={`btn-secondary-action ${filterCategory === 'aux' ? 'active' : ''}`}
                style={{ backgroundColor: filterCategory === 'aux' ? 'var(--bg-elevated)' : 'transparent' }}
                onClick={() => setFilterCategory('aux')}
              >
                Auxiliaries & Pumping (2)
              </button>
            </div>

            <div className="font-mono text-muted" style={{ fontSize: '12px' }}>
              Total Active Load: <strong className="text-primary font-bold">842 kW</strong> • 6 Meters Online
            </div>
          </div>

          {/* Asset Grid (3 columns, generous 20px gap) */}
          <div className="grid-3col">
            {filteredAssets.map((asset) => (
              <div
                key={asset.id}
                className={`fleet-card ${asset.status === 'alert' ? 'alert-status' : ''}`}
              >
                <div className="fleet-card-top">
                  <div>
                    <div className="fleet-asset-code">{asset.id}</div>
                    <div className="fleet-asset-title">{asset.name}</div>
                  </div>
                  <span
                    className={`kpi-badge ${
                      asset.status === 'alert'
                        ? 'danger'
                        : asset.status === 'holding'
                        ? 'info'
                        : 'success'
                    }`}
                  >
                    {asset.status === 'alert' ? (
                      <AlertTriangleIcon size={12} />
                    ) : (
                      <CheckCircleIcon size={12} />
                    )}
                    <span>{asset.statusLabel}</span>
                  </span>
                </div>

                <div style={{ fontSize: '11.5px', color: '#6b7280' }} dangerouslySetInnerHTML={{ __html: asset.model }} />

                {/* Telemetry Metrics Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', backgroundColor: 'var(--bg-surface, #090d16)', border: '1px solid var(--glass-border)', borderRadius: '6px', padding: '12px' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: '#9ca3af' }}>Active Power</span>
                    <div className="font-mono text-primary" style={{ fontSize: '16px', fontWeight: 700 }}>
                      {asset.powerKw} <span style={{ fontSize: '11px', color: '#6b7280' }}>kW</span>
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: '#9ca3af' }}>Operating Metric</span>
                    <div className="font-mono" style={{ fontSize: '12px', fontWeight: 600, color: asset.status === 'alert' ? '#f87171' : '#f9fafb' }}>
                      {asset.primaryMetric}
                    </div>
                  </div>
                </div>

                {/* Efficiency & Incident CTA */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid #1f2937' }}>
                  <span className="font-mono text-muted" style={{ fontSize: '11px' }}>
                    Efficiency: <strong className={asset.status === 'alert' ? 'text-alert' : 'text-emerald'}>{asset.efficiency}</strong>
                  </span>

                  {asset.hasIncident ? (
                    <button className="btn-primary-action" style={{ padding: '6px 12px', fontSize: '11.5px' }} onClick={onSwitchToWorkbench}>
                      <span>Resolve Leak →</span>
                    </button>
                  ) : (
                    <span className="font-mono text-muted" style={{ fontSize: '11px' }}>
                      Telemetry OK
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: Clean Incident Lifecycle Storyboard */}
      {viewMode === 'lifecycle' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card-clean" style={{ padding: '24px' }}>
            <h3 className="card-title-clean" style={{ marginBottom: '16px' }}>
              <ClockIcon size={16} className="text-emerald" />
              <span>5-Step Autonomous Incident Resolution Flow (INC-ENG-2401)</span>
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
              {/* Step 1 */}
              <div style={{ backgroundColor: 'var(--bg-surface, #090d16)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="font-mono" style={{ color: '#ef4444', fontWeight: 700, fontSize: '13px' }}>01 • 08:30 AM</span>
                  <span className="kpi-badge danger">Spike</span>
                </div>
                <strong style={{ fontSize: '13px', color: '#f9fafb' }}>Anomaly Detected</strong>
                <p style={{ fontSize: '11.5px', color: '#9ca3af', lineHeight: '1.5', margin: 0 }}>
                  SEC exceeded baseline (+14.3% spike: 9.8 → 11.2 kWh/t). Throughput and quality intact.
                </p>
              </div>

              {/* Step 2 */}
              <div style={{ backgroundColor: 'var(--bg-surface, #090d16)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="font-mono" style={{ color: '#06b6d4', fontWeight: 700, fontSize: '13px' }}>02 • 08:33 AM</span>
                  <span className="kpi-badge info">94% Causal</span>
                </div>
                <strong style={{ fontSize: '13px', color: '#f9fafb' }}>Root Cause Isolated</strong>
                <p style={{ fontSize: '11.5px', color: '#9ca3af', lineHeight: '1.5', margin: 0 }}>
                  Pneumatic manifold drop to 6.1 bar correlated with COMP-02 +21% modulation and CMMS logs.
                </p>
              </div>

              {/* Step 3 */}
              <div style={{ backgroundColor: 'var(--bg-surface, #090d16)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="font-mono" style={{ color: '#00d328', fontWeight: 700, fontSize: '13px' }}>03 • 08:35 AM</span>
                  <span className="kpi-badge success">-18% SEC</span>
                </div>
                <strong style={{ fontSize: '13px', color: '#f9fafb' }}>What-If Simulated</strong>
                <p style={{ fontSize: '11.5px', color: '#9ca3af', lineHeight: '1.5', margin: 0 }}>
                  Simulated 4 scenarios. Option C (Manifold repair + 6.5 bar retune) delivers ₹6,240/day savings.
                </p>
              </div>

              {/* Step 4 */}
              <div style={{ backgroundColor: 'var(--bg-surface, #090d16)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="font-mono" style={{ color: '#00d328', fontWeight: 700, fontSize: '13px' }}>04 • 08:40 AM</span>
                  <span className="kpi-badge success">Dispatched</span>
                </div>
                <strong style={{ fontSize: '13px', color: '#f9fafb' }}>Human Gate Approved</strong>
                <p style={{ fontSize: '11.5px', color: '#9ca3af', lineHeight: '1.5', margin: 0 }}>
                  Operator approved intervention. CMMS work order WO-ENG-7922 dispatched for 11:00 AM changeover.
                </p>
              </div>

              {/* Step 5 */}
              <div style={{ backgroundColor: 'var(--bg-surface, #090d16)', border: '1px solid rgba(0, 211, 40, 0.4)', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="font-mono" style={{ color: '#00d328', fontWeight: 700, fontSize: '13px' }}>05 • 11:30 AM</span>
                  <span className="kpi-badge success">Verified</span>
                </div>
                <strong style={{ fontSize: '13px', color: '#f9fafb' }}>Impact Closed-Loop</strong>
                <p style={{ fontSize: '11.5px', color: '#9ca3af', lineHeight: '1.5', margin: 0 }}>
                  Telemetry confirms SEC reduced to 9.2 kWh/ton (-18.0%). Savings logged to energy audit ledger.
                </p>
              </div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn-primary-action" onClick={onSwitchToWorkbench}>
                <span>Open Live Decision Workbench →</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
