import React, { useState } from 'react';
import {
  ZapIcon,
  FilterIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ActivityIcon,
  SlidersIcon,
  XIcon,
  ShieldCheckIcon,
} from '../components/Icons';

type OpportunitiesProps = {
  onNavigate: (view: string, detailId?: string) => void;
  selectedDetailId?: string;
};

type Opportunity = {
  id: string;
  title: string;
  asset: string;
  line: string;
  evidenceCount: number;
  expectedSecDelta: string;
  monthlySavings: string;
  effort: 'Low' | 'Medium' | 'High';
  status: 'Ready' | 'Investigating' | 'Decision' | 'Executing' | 'Closed';
  whatChanged: string;
  whatDidNotChange: string;
  whyItMatters: string;
  evidenceSources: Array<{ name: string; checked: boolean }>;
};

const OPPORTUNITIES_DATA: Opportunity[] = [
  {
    id: 'opp-1',
    title: 'Excess compressor power consumption',
    asset: 'CMP-01',
    line: 'Assembly Line 2',
    evidenceCount: 6,
    expectedSecDelta: '-0.7 kWh/t',
    monthlySavings: '₹48,000/mo',
    effort: 'Low',
    status: 'Ready',
    whatChanged: 'Power consumption increased 16.8% above baseline envelope (61 kW vs 49 kW nominal).',
    whatDidNotChange: 'Production demand (10.2 t/h), Header pressure (6.5 bar), Air flow (397 CFM).',
    whyItMatters: 'Energy intensity is increasing without corresponding production output, bleeding ₹1,840/day.',
    evidenceSources: [
      { name: 'Power trend telemetry', checked: true },
      { name: 'Pressure transducer feed', checked: true },
      { name: 'Flow meter telemetry', checked: true },
      { name: 'MES production tonnage', checked: true },
      { name: 'CMMS maintenance log', checked: true },
      { name: 'Quality inspection record', checked: true },
    ],
  },
  {
    id: 'opp-2',
    title: 'Pneumatic manifold distribution leakage',
    asset: 'Line 2 Moulding',
    line: 'Assembly Line 2',
    evidenceCount: 8,
    expectedSecDelta: '-0.9 kWh/t',
    monthlySavings: '₹61,000/mo',
    effort: 'Low',
    status: 'Decision',
    whatChanged: 'Pneumatic drop across manifold causing continuous compressor overcycling.',
    whatDidNotChange: 'Production throughput intact, zero scrap rate increase.',
    whyItMatters: 'Continuous mechanical load on compressor reduces motor life and wastes 14.2 m³/min.',
    evidenceSources: [
      { name: 'Differential pressure sensors', checked: true },
      { name: 'Acoustic leak inspection', checked: true },
      { name: 'Feeder F-03 submeter', checked: true },
      { name: 'Vibration monitoring', checked: true },
      { name: 'Historical baseline envelope', checked: true },
      { name: 'Operator maintenance log', checked: true },
    ],
  },
  {
    id: 'opp-3',
    title: 'Furnace idle thermal holding loss',
    asset: 'FURN-02',
    line: 'Melting Bank',
    evidenceCount: 4,
    expectedSecDelta: '-0.4 kWh/t',
    monthlySavings: '₹26,000/mo',
    effort: 'Medium',
    status: 'Investigating',
    whatChanged: 'Holding power draw increased 12% during inter-pour standby periods.',
    whatDidNotChange: 'Ladle melt temperature (1,380°C constant).',
    whyItMatters: 'Worn refractory lid seal allows radiative and convective heat loss.',
    evidenceSources: [
      { name: 'IR pyrometer telemetry', checked: true },
      { name: 'Induction power submeter', checked: true },
      { name: 'Ladle cycle log', checked: true },
      { name: 'Refractory thermal scan', checked: true },
    ],
  },
  {
    id: 'opp-4',
    title: 'Cooling water circulation pump throttling',
    asset: 'PUMP-03',
    line: 'Utilities',
    evidenceCount: 5,
    expectedSecDelta: '-0.3 kWh/t',
    monthlySavings: '₹18,500/mo',
    effort: 'Low',
    status: 'Ready',
    whatChanged: 'Throttled discharge valve causes 28% pump hydraulic inefficiency.',
    whatDidNotChange: 'Cooling jacket heat rejection requirements.',
    whyItMatters: 'Trimming impeller or VFD retrofit saves 6.8 kW continuous power.',
    evidenceSources: [
      { name: 'Flow meter 120 m³/hr', checked: true },
      { name: 'Discharge pressure 3.2 bar', checked: true },
      { name: 'Motor load 24 kW', checked: true },
      { name: 'Delta T temperature', checked: true },
      { name: 'Pump affinity model', checked: true },
    ],
  },
];

export function OpportunitiesView({ onNavigate, selectedDetailId }: OpportunitiesProps) {
  const [activeOpportunity, setActiveOpportunity] = useState<Opportunity | null>(() => {
    return OPPORTUNITIES_DATA.find((o) => o.id === selectedDetailId) || null;
  });
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const filtered = statusFilter === 'All'
    ? OPPORTUNITIES_DATA
    : OPPORTUNITIES_DATA.filter((o) => o.status === statusFilter);

  return (
    <div className="page-container">
      {/* ── Page Header ── */}
      <header className="page-header-clean">
        <div>
          <div className="page-kicker">
            <span className="kicker-tag">OPPORTUNITIES</span>
            <span>Energy Waste & Optimization Pipeline</span>
          </div>
          <h1 className="page-title">Energy Opportunities</h1>
          <p className="page-subtitle">
            System 1 continuous screening identifies anomalous energy waste, quantified with financial and SEC impact.
          </p>
        </div>

        <div className="header-controls-group">
          <button className="btn-primary-action" onClick={() => onNavigate('investigations', 'INV-1024')}>
            <span>+ Create Investigation</span>
          </button>
        </div>
      </header>

      {/* ── Pipeline Metric Strip (Section 12 of Spec) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: '10px' }}>
        <div className="card-clean" style={{ padding: '12px 14px' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Detected</span>
          <div style={{ fontSize: '18px', fontWeight: 650, color: 'var(--text-primary)', marginTop: '2px' }}>18 identified</div>
        </div>
        <div className="card-clean" style={{ padding: '12px 14px' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Ready for Investigation</span>
          <div style={{ fontSize: '18px', fontWeight: 650, color: '#bd6249', marginTop: '2px' }}>7 ready</div>
        </div>
        <div className="card-clean" style={{ padding: '12px 14px' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Ready for Decision</span>
          <div style={{ fontSize: '18px', fontWeight: 650, color: '#a8793e', marginTop: '2px' }}>4 ready</div>
        </div>
        <div className="card-clean" style={{ padding: '12px 14px' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Under Execution</span>
          <div style={{ fontSize: '18px', fontWeight: 650, color: '#5e7e60', marginTop: '2px' }}>2 executing</div>
        </div>
        <div className="card-clean" style={{ padding: '12px 14px' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Closed / Verified</span>
          <div style={{ fontSize: '18px', fontWeight: 650, color: 'var(--text-muted)', marginTop: '2px' }}>5 closed</div>
        </div>
      </div>

      {/* ── Filter Bar ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', marginTop: '4px' }}>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 650, textTransform: 'uppercase' }}>Status:</span>
          {['All', 'Ready', 'Investigating', 'Decision', 'Executing'].map((st) => (
            <button
              key={st}
              className={`btn-subtab ${statusFilter === st ? 'active' : ''}`}
              onClick={() => setStatusFilter(st)}
            >
              {st}
            </button>
          ))}
        </div>

        <span className="font-mono text-muted" style={{ fontSize: '11.5px' }}>
          Showing {filtered.length} opportunities • Total potential: ₹1.53L/mo
        </span>
      </div>

      {/* ── Opportunities Table (Section 12 of Spec) ── */}
      <div className="clean-table-wrap">
        <table className="clean-table">
          <thead>
            <tr>
              <th>Opportunity</th>
              <th>Asset</th>
              <th>Evidence</th>
              <th>Expected SEC</th>
              <th>Monthly Savings</th>
              <th>Effort</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((opp) => (
              <tr key={opp.id} style={{ cursor: 'pointer' }} onClick={() => setActiveOpportunity(opp)}>
                <td>
                  <strong>{opp.title}</strong>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>{opp.line}</div>
                </td>
                <td><span className="font-mono">{opp.asset}</span></td>
                <td>
                  <span className="provenance-badge provenance-measured">{opp.evidenceCount} sources</span>
                </td>
                <td><strong style={{ color: '#5e7e60' }}>{opp.expectedSecDelta}</strong></td>
                <td><strong>{opp.monthlySavings}</strong></td>
                <td><span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{opp.effort}</span></td>
                <td>
                  <span className={`provenance-badge ${
                    opp.status === 'Ready' ? 'provenance-simulated' :
                    opp.status === 'Decision' ? 'provenance-estimated' :
                    opp.status === 'Investigating' ? 'provenance-modelled' :
                    'provenance-measured'
                  }`}>
                    {opp.status}
                  </span>
                </td>
                <td>
                  <button
                    className="btn-secondary-action"
                    style={{ padding: '4px 10px', fontSize: '11px' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveOpportunity(opp);
                    }}
                  >
                    Details &rarr;
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Opportunity Detail Modal (Section 13 of Spec) ── */}
      {activeOpportunity && (
        <div className="command-palette-backdrop" onClick={() => setActiveOpportunity(null)} role="dialog" aria-modal="true">
          <div className="command-palette-modal" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span className="kicker-tag" style={{ border: '1px solid #ebd0c9', background: '#f8ebe8', color: '#a84d39' }}>
                  OPPORTUNITY DETAIL • {activeOpportunity.asset}
                </span>
                <h2 style={{ margin: '8px 0 2px', fontFamily: 'var(--font-serif)', fontSize: '19px', fontWeight: 500, color: 'var(--text-primary)' }}>
                  {activeOpportunity.title}
                </h2>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  Detected 14 minutes ago • Status: <strong>{activeOpportunity.status}</strong>
                </span>
              </div>
              <button className="header-icon-btn" onClick={() => setActiveOpportunity(null)}>
                <XIcon size={14} />
              </button>
            </div>

            <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
              {/* Structured Summary Cards */}
              <div style={{ display: 'grid', gap: '10px' }}>
                <div style={{ padding: '12px 14px', borderRadius: '7px', background: 'var(--bg-ground)', border: '1px solid var(--glass-border)' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#bd6249', marginBottom: '3px' }}>
                    WHAT CHANGED?
                  </div>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-primary)', lineHeight: 1.45 }}>
                    {activeOpportunity.whatChanged}
                  </p>
                </div>

                <div style={{ padding: '12px 14px', borderRadius: '7px', background: 'var(--bg-ground)', border: '1px solid var(--glass-border)' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '3px' }}>
                    WHAT DID NOT CHANGE?
                  </div>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-primary)', lineHeight: 1.45 }}>
                    {activeOpportunity.whatDidNotChange}
                  </p>
                </div>

                <div style={{ padding: '12px 14px', borderRadius: '7px', background: 'var(--bg-ground)', border: '1px solid var(--glass-border)' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#5e7e60', marginBottom: '3px' }}>
                    WHY IT MATTERS
                  </div>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-primary)', lineHeight: 1.45 }}>
                    {activeOpportunity.whyItMatters}
                  </p>
                </div>
              </div>

              {/* Evidence Strip (6 sources) */}
              <div>
                <span style={{ fontSize: '11px', fontWeight: 650, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>
                  {activeOpportunity.evidenceSources.length} Correlated Evidence Sources
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '8px' }}>
                  {activeOpportunity.evidenceSources.map((ev) => (
                    <div key={ev.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-secondary)', padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--bg-surface)' }}>
                      <CheckCircleIcon size={13} style={{ color: '#5e7e60', flexShrink: 0 }} />
                      <span>{ev.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ padding: '14px 22px', borderTop: '1px solid var(--glass-border)', background: 'var(--bg-ground)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Projected saving:</span>
                <strong style={{ color: '#5e7e60', fontSize: '14px', marginLeft: '6px' }}>{activeOpportunity.monthlySavings}</strong>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn-secondary-action" onClick={() => setActiveOpportunity(null)}>
                  Close
                </button>
                <button
                  className="btn-primary-action"
                  onClick={() => {
                    setActiveOpportunity(null);
                    onNavigate('investigations', 'INV-1024');
                  }}
                >
                  <span>Start investigation</span>
                  <ArrowRightIcon size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
