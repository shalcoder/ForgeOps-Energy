import React, { useState } from 'react';
import {
  GaugeIcon,
  ZapIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  ArrowRightIcon,
  ClockIcon,
  WrenchIcon,
  ActivityIcon,
} from '../components/Icons';

type AssetsProps = {
  onNavigate: (view: string, detailId?: string) => void;
  selectedAssetId?: string;
};

type AssetData = {
  id: string;
  name: string;
  category: 'Casting' | 'Machining' | 'Utilities';
  feeder: string;
  status: 'running' | 'warning' | 'alert' | 'standby';
  powerKw: number;
  expectedPowerBand: string;
  pressureBar: number;
  flowCfm: number;
  vibrationMmS: number;
  loadPct: number;
  secContribution: string;
  lastService: string;
  activeAlertsCount: number;
};

const ASSETS_LIST: AssetData[] = [
  {
    id: 'CMP-01',
    name: '75 kW Rotary Screw Compressor',
    category: 'Casting',
    feeder: 'Feeder F-03',
    status: 'alert',
    powerKw: 61.0,
    expectedPowerBand: '47–53 kW',
    pressureBar: 6.5,
    flowCfm: 397,
    vibrationMmS: 1.7,
    loadPct: 69,
    secContribution: '1.4 kWh/t (+16.8%)',
    lastService: '12 days ago',
    activeAlertsCount: 1,
  },
  {
    id: 'FURN-01',
    name: '500 kW Induction Melting Furnace',
    category: 'Casting',
    feeder: 'Feeder F-01',
    status: 'running',
    powerKw: 440.0,
    expectedPowerBand: '420–460 kW',
    pressureBar: 0,
    flowCfm: 0,
    vibrationMmS: 0.8,
    loadPct: 88,
    secContribution: '5.2 kWh/t (Nominal)',
    lastService: '4 days ago',
    activeAlertsCount: 0,
  },
  {
    id: 'FURN-02',
    name: '350 kW Holding & Pouring Furnace',
    category: 'Casting',
    feeder: 'Feeder F-01B',
    status: 'warning',
    powerKw: 110.0,
    expectedPowerBand: '85–98 kW',
    pressureBar: 0,
    flowCfm: 0,
    vibrationMmS: 0.9,
    loadPct: 35,
    secContribution: '1.8 kWh/t (+12%)',
    lastService: '18 days ago',
    activeAlertsCount: 1,
  },
  {
    id: 'CNC-01',
    name: 'Heller 4-Axis CNC Milling Center',
    category: 'Machining',
    feeder: 'Feeder F-04A',
    status: 'running',
    powerKw: 32.0,
    expectedPowerBand: '28–36 kW',
    pressureBar: 6.2,
    flowCfm: 45,
    vibrationMmS: 1.1,
    loadPct: 65,
    secContribution: '0.4 kWh/t (Nominal)',
    lastService: '8 days ago',
    activeAlertsCount: 0,
  },
  {
    id: 'MULL-01',
    name: '45 kW Green Sand Intensive Muller',
    category: 'Casting',
    feeder: 'Feeder F-05',
    status: 'running',
    powerKw: 38.0,
    expectedPowerBand: '34–42 kW',
    pressureBar: 0,
    flowCfm: 0,
    vibrationMmS: 2.1,
    loadPct: 75,
    secContribution: '0.5 kWh/t (Nominal)',
    lastService: '2 days ago',
    activeAlertsCount: 0,
  },
  {
    id: 'PUMP-03',
    name: '30 kW Cooling Water Circulation Pump',
    category: 'Utilities',
    feeder: 'Feeder F-06',
    status: 'running',
    powerKw: 24.0,
    expectedPowerBand: '18–22 kW',
    pressureBar: 3.2,
    flowCfm: 0,
    vibrationMmS: 1.4,
    loadPct: 80,
    secContribution: '0.3 kWh/t (Nominal)',
    lastService: '15 days ago',
    activeAlertsCount: 0,
  },
];

export function AssetsView({ onNavigate, selectedAssetId }: AssetsProps) {
  const [currentAssetId, setCurrentAssetId] = useState<string | null>(selectedAssetId || null);
  const [detailTab, setDetailTab] = useState<'overview' | 'performance' | 'telemetry' | 'maintenance'>('overview');
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Casting' | 'Machining' | 'Utilities'>('All');

  const asset = currentAssetId ? ASSETS_LIST.find((a) => a.id === currentAssetId) || ASSETS_LIST[0] : null;

  const filteredAssets = categoryFilter === 'All'
    ? ASSETS_LIST
    : ASSETS_LIST.filter((a) => a.category === categoryFilter);

  return (
    <div className="page-container">
      {/* ── Breadcrumb / Header ── */}
      <header className="page-header-clean">
        <div>
          <div className="page-kicker">
            <span className="kicker-tag">ASSETS</span>
            <span>Equipment Hierarchy & Operational Envelopes</span>
          </div>
          <h1 className="page-title">
            {asset ? `${asset.id} — ${asset.name}` : 'Plant Asset Fleet'}
          </h1>
          <p className="page-subtitle">
            {asset
              ? 'Real-time telemetry, baseline envelope validation, and submetered power draw.'
              : 'Directory of submetered production machinery, furnaces, compressors, and utility systems.'}
          </p>
        </div>

        <div className="header-controls-group">
          {asset ? (
            <button className="btn-secondary-action" onClick={() => setCurrentAssetId(null)}>
              &larr; All Assets
            </button>
          ) : (
            <div className="live-status-pill">
              <span className="pulsing-indicator" />
              <span>6 Demo Assets</span>
            </div>
          )}
        </div>
      </header>

      {/* ── IF ASSET DETAIL IS SELECTED (Sections 10 & 11 of Spec) ── */}
      {asset ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Asset Hero Card */}
          <div className="card-clean" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="font-mono" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)' }}>{asset.feeder}</span>
                  <span className="provenance-badge provenance-simulated">
                    {asset.status === 'alert' ? 'DEMO ANOMALY' : 'DEMO STATUS'}
                  </span>
                  <span className="provenance-badge provenance-simulated">Synthetic asset fixture</span>
                </div>
                <h2 style={{ margin: '8px 0 2px', fontFamily: 'var(--font-serif)', fontSize: '22px', color: 'var(--text-primary)' }}>
                  {asset.name}
                </h2>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Category: {asset.category} complex &bull; Submeter: Schneider PM8000 (Modbus RTU ID #3)
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button className="btn-secondary-action" onClick={() => onNavigate('live-operations')}>
                  <ZapIcon size={14} />
                  <span>View fixture signals</span>
                </button>
                <button className="btn-primary-action" onClick={() => onNavigate('investigations', 'INV-1024')}>
                  <span>Investigate Anomaly &rarr;</span>
                </button>
              </div>
            </div>

            {/* Sub-Tabs: Overview | Performance | Telemetry | Maintenance */}
            <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--glass-border)', marginTop: '18px', paddingTop: '14px' }}>
              <button className={`btn-subtab ${detailTab === 'overview' ? 'active' : ''}`} onClick={() => setDetailTab('overview')}>
                Overview KPIs
              </button>
              <button className={`btn-subtab ${detailTab === 'performance' ? 'active' : ''}`} onClick={() => setDetailTab('performance')}>
                Performance & Operating Envelope
              </button>
              <button className={`btn-subtab ${detailTab === 'maintenance' ? 'active' : ''}`} onClick={() => setDetailTab('maintenance')}>
                Maintenance & History
              </button>
            </div>
          </div>

          {/* Subtab Content: Overview */}
          {detailTab === 'overview' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: '12px' }}>
              <div className="card-clean" style={{ padding: '16px' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active Power</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '4px' }}>
                  <strong style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: asset.powerKw > 53 ? '#bd6249' : 'var(--text-primary)' }}>
                    {asset.powerKw}
                  </strong>
                  <small style={{ color: 'var(--text-muted)' }}>kW</small>
                </div>
                <small style={{ color: '#bd6249', fontWeight: 600, display: 'block', marginTop: '2px' }}>+16.8% over baseline</small>
              </div>

              <div className="card-clean" style={{ padding: '16px' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Header Pressure</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '4px' }}>
                  <strong style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: 'var(--text-primary)' }}>
                    {asset.pressureBar}
                  </strong>
                  <small style={{ color: 'var(--text-muted)' }}>bar</small>
                </div>
                <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>Target: 6.5–7.2 bar</small>
              </div>

              <div className="card-clean" style={{ padding: '16px' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Air Flow</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '4px' }}>
                  <strong style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: 'var(--text-primary)' }}>
                    {asset.flowCfm}
                  </strong>
                  <small style={{ color: 'var(--text-muted)' }}>CFM</small>
                </div>
                <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>Nominal delivery</small>
              </div>

              <div className="card-clean" style={{ padding: '16px' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Duty Load</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '4px' }}>
                  <strong style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: 'var(--text-primary)' }}>
                    {asset.loadPct}
                  </strong>
                  <small style={{ color: 'var(--text-muted)' }}>%</small>
                </div>
                <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>VFD Modulation</small>
              </div>

              <div className="card-clean" style={{ padding: '16px' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Bearing Vibration</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '4px' }}>
                  <strong style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: 'var(--text-primary)' }}>
                    {asset.vibrationMmS}
                  </strong>
                  <small style={{ color: 'var(--text-muted)' }}>mm/s</small>
                </div>
                <small style={{ color: '#5e7e60', fontWeight: 600, display: 'block', marginTop: '2px' }}>Within trip limit &lt; 3.5</small>
              </div>
            </div>
          )}

          {/* Subtab Content: Performance & Operating Envelope (Section 11 of Spec) */}
          {detailTab === 'performance' && (
            <div className="card-clean" style={{ padding: '22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div>
                  <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: '18px', color: 'var(--text-primary)' }}>
                    {asset.id} Operating Envelope & Baseline Range
                  </h3>
                  <p style={{ margin: '3px 0 0', fontSize: '11px', color: 'var(--text-secondary)' }}>
                    Machine-learned operating baseline showing why ForgeOps flags this asset as abnormal.
                  </p>
                </div>
                <span className="provenance-badge provenance-simulated">Illustrative envelope</span>
              </div>

              {/* Envelope Band Visual */}
              <div style={{ padding: '16px', borderRadius: '8px', background: 'var(--bg-ground)', border: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)' }}>
                  <span>Expected Operating Envelope: <strong>{asset.expectedPowerBand}</strong></span>
                  <span>Scenario power input: <strong style={{ color: '#bd6249' }}>{asset.powerKw} kW (+16.8% vs fixture envelope)</strong></span>
                </div>

                <div className="envelope-band-wrap">
                  {/* Expected green range */}
                  <div className="envelope-band-range" style={{ left: '35%', width: '25%' }} title="Expected Range: 47–53 kW" />
                  {/* Actual marker */}
                  <div className="envelope-actual-marker" style={{ left: '72%' }} title="Current: 61 kW" />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9.5px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  <span>30 kW</span>
                  <span>47 kW (Envelope Min)</span>
                  <span>53 kW (Envelope Max)</span>
                  <span style={{ color: '#bd6249', fontWeight: 700 }}>61 kW (Observed)</span>
                  <span>80 kW</span>
                </div>
              </div>

              {/* Engineering Explanation */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '14px', marginTop: '16px' }}>
                <div style={{ padding: '12px', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--bg-surface)' }}>
                  <strong style={{ fontSize: '11.5px', color: 'var(--text-primary)' }}>Power vs Pressure</strong>
                  <p style={{ margin: '4px 0 0', fontSize: '10.5px', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                    Pressure is steady at 6.5 bar, but power draw is at 61 kW. At this pressure, nominal power is 49 kW.
                  </p>
                </div>
                <div style={{ padding: '12px', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--bg-surface)' }}>
                  <strong style={{ fontSize: '11.5px', color: 'var(--text-primary)' }}>Power vs Flow Demand</strong>
                  <p style={{ margin: '4px 0 0', fontSize: '10.5px', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                    Flow is constant at 397 CFM. The excess 12 kW produces unmetered flow bypassing downstream work cells.
                  </p>
                </div>
                <div style={{ padding: '12px', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--bg-surface)' }}>
                  <strong style={{ fontSize: '11.5px', color: 'var(--text-primary)' }}>Specific Power</strong>
                  <p style={{ margin: '4px 0 0', fontSize: '10.5px', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                    Specific energy 0.153 kW/CFM vs nominal 0.123 kW/CFM. +24.4% degraded compressor specific efficiency.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Subtab Content: Maintenance & History */}
          {detailTab === 'maintenance' && (
            <div className="card-clean" style={{ padding: '20px' }}>
                <h3 style={{ margin: '0 0 12px', fontFamily: 'var(--font-serif)', fontSize: '18px', color: 'var(--text-primary)' }}>
                Proposed Work Orders & Fixture History
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ padding: '12px 14px', borderRadius: '6px', border: '1px solid var(--alert-border)', background: 'var(--alert-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ fontSize: '12px', color: 'var(--text-primary)' }}>WO-ENG-7922: Replace Flexible Coupling</strong>
                    <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>Proposed draft only &bull; time and crew require plant review</div>
                  </div>
                  <span className="provenance-badge provenance-simulated">Draft</span>
                </div>

                <div style={{ padding: '12px 14px', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--bg-ground)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ fontSize: '12px', color: 'var(--text-primary)' }}>WR-6891: Temporary Clamp on Manifold Drop</strong>
                    <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>Synthetic fixture history &bull; no maintenance action is confirmed</div>
                  </div>
                  <span className="provenance-badge provenance-simulated">Fixture history</span>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ── ASSET FLEET DIRECTORY TABLE (Section 35 of Spec) ── */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Category Filter Pills */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 650, textTransform: 'uppercase' }}>Cluster:</span>
            {['All', 'Casting', 'Machining', 'Utilities'].map((cat) => (
              <button
                key={cat}
                className={`btn-subtab ${categoryFilter === cat ? 'active' : ''}`}
                onClick={() => setCategoryFilter(cat as any)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="clean-table-wrap">
            <table className="clean-table">
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Category</th>
                  <th>Feeder</th>
                  <th>Status</th>
                  <th>Active Power</th>
                  <th>Operating Envelope</th>
                  <th>SEC Contribution</th>
                  <th>Last Service</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.map((item) => (
                  <tr key={item.id} style={{ cursor: 'pointer' }} onClick={() => setCurrentAssetId(item.id)}>
                    <td>
                      <strong>{item.id}</strong>
                      <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>{item.name}</div>
                    </td>
                    <td><span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{item.category}</span></td>
                    <td><span className="font-mono">{item.feeder}</span></td>
                    <td>
                      <span className="provenance-badge provenance-simulated">
                        {item.status === 'alert' ? 'DEMO ALERT' : item.status === 'warning' ? 'DEMO WARNING' : 'DEMO STATUS'}
                      </span>
                    </td>
                    <td>
                      <span className="font-mono">
                        <strong style={{ color: item.powerKw > 53 ? '#bd6249' : 'inherit' }}>{item.powerKw} kW</strong>
                      </span>
                    </td>
                    <td><span className="font-mono text-muted">{item.expectedPowerBand}</span></td>
                    <td><span style={{ fontSize: '11px', color: item.secContribution.includes('+') ? '#bd6249' : '#5e7e60', fontWeight: 600 }}>{item.secContribution}</span></td>
                    <td><span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.lastService}</span></td>
                    <td>
                      <button
                        className="btn-secondary-action"
                        style={{ padding: '4px 10px', fontSize: '11px' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentAssetId(item.id);
                        }}
                      >
                        Inspect &rarr;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
