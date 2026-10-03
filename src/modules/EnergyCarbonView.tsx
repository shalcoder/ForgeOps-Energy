import React, { useState } from 'react';
import {
  BarChartIcon,
  TrendingDownIcon,
  ZapIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  LayersIcon,
} from '../components/Icons';

type EnergyCarbonProps = {
  onNavigate: (view: string, detailId?: string) => void;
};

export function EnergyCarbonView({ onNavigate }: EnergyCarbonProps) {
  const [activeTab, setActiveTab] = useState<'performance' | 'cost' | 'carbon'>('performance');

  const equipmentContributions = [
    { name: 'Compressed Air (CMP-01 & CMP-02)', pct: 42, kwh: 162830, opportunityId: 'opp-1' },
    { name: 'Induction Melting & Holding (F-01 & F-02)', pct: 33, kwh: 127938, opportunityId: 'opp-3' },
    { name: 'Mulling & Sand Auxiliaries', pct: 14, kwh: 54276, opportunityId: null },
    { name: 'Cooling Water Circulation & Pumping', pct: 6, kwh: 23261, opportunityId: 'opp-4' },
    { name: 'Plant Lighting & Ventilation', pct: 3, kwh: 11630, opportunityId: null },
    { name: 'Office & Admin Utilities', pct: 2, kwh: 7753, opportunityId: null },
  ];

  return (
    <div className="page-container">
      {/* ── Page Header ── */}
      <header className="page-header-clean">
        <div>
          <div className="page-kicker">
            <span className="kicker-tag">ANALYTICS</span>
            <span>Management Energy, Financial Tariff & Carbon Accounting</span>
          </div>
          <h1 className="page-title">Energy Performance & Carbon Footprint</h1>
          <p className="page-subtitle">
            Comprehensive plant SEC tracking, DISCOM HT-2A cost breakdown, and SEBI BRSR Core carbon intensity reporting.
          </p>
        </div>

        <div className="header-controls-group">
          <button className="btn-secondary-action" onClick={() => onNavigate('reports', 'rep-monthly')}>
            <span>Export Energy Report (.pdf)</span>
          </button>
        </div>
      </header>

      {/* ── Top Summary KPIs (Section 31 of Spec) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '12px' }}>
        <div className="card-clean" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '10.5px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Plant SEC</span>
            <span className="provenance-badge provenance-measured">Measured</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '6px' }}>
            <strong style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: 'var(--text-primary)' }}>9.8</strong>
            <small style={{ color: 'var(--text-muted)' }}>kWh/t</small>
          </div>
          <small style={{ color: '#5e7e60', fontWeight: 600, display: 'block', marginTop: '4px' }}>↓ 8.4% vs baseline</small>
        </div>

        <div className="card-clean" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '10.5px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Monthly Energy</span>
            <span className="provenance-badge provenance-measured">Measured</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '6px' }}>
            <strong style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: 'var(--text-primary)' }}>387,692</strong>
            <small style={{ color: 'var(--text-muted)' }}>kWh</small>
          </div>
          <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>Across 6 feeder meters</small>
        </div>

        <div className="card-clean" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '10.5px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>DISCOM Energy Cost</span>
            <span className="provenance-badge provenance-modelled">Modelled</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '6px' }}>
            <strong style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: 'var(--text-primary)' }}>₹42.3L</strong>
            <small style={{ color: 'var(--text-muted)' }}>this month</small>
          </div>
          <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>Projected: ₹44.1L at month end</small>
        </div>

        <div className="card-clean" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '10.5px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Scope 1 & 2 Carbon</span>
            <span className="provenance-badge provenance-modelled">Modelled</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '6px' }}>
            <strong style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: 'var(--text-primary)' }}>317.9</strong>
            <small style={{ color: 'var(--text-muted)' }}>tCO₂e</small>
          </div>
          <small style={{ color: '#5e7e60', fontWeight: 600, display: 'block', marginTop: '4px' }}>35.2 tCO₂e abated to date</small>
        </div>
      </div>

      {/* ── Subtabs: Performance | Cost | Carbon ── */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px' }}>
        <button className={`btn-subtab ${activeTab === 'performance' ? 'active' : ''}`} onClick={() => setActiveTab('performance')}>
          Energy Performance Breakdown
        </button>
        <button className={`btn-subtab ${activeTab === 'cost' ? 'active' : ''}`} onClick={() => setActiveTab('cost')}>
          Tariff & Cost Drivers
        </button>
        <button className={`btn-subtab ${activeTab === 'carbon' ? 'active' : ''}`} onClick={() => setActiveTab('carbon')}>
          Decarbonisation & Scope 1/2
        </button>
      </div>

      {/* ── TAB 1: Energy Performance (Section 32 of Spec) ── */}
      {activeTab === 'performance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="card-clean" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: '18px', color: 'var(--text-primary)' }}>
                  Equipment Energy Contribution Breakdown
                </h3>
                <p style={{ margin: '3px 0 0', fontSize: '11px', color: 'var(--text-secondary)' }}>
                  Share of monthly electrical load centers. Click any equipment category to view correlated opportunities.
                </p>
              </div>
              <span className="provenance-badge provenance-measured">Direct Modbus PM8000</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {equipmentContributions.map((eq) => (
                <div key={eq.name} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <strong style={{ color: 'var(--text-primary)' }}>{eq.name}</strong>
                      {eq.opportunityId && (
                        <button
                          className="text-action"
                          style={{ fontSize: '10.5px' }}
                          onClick={() => onNavigate('opportunities', eq.opportunityId!)}
                        >
                          View opportunity &rarr;
                        </button>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span className="font-mono text-muted">{eq.kwh.toLocaleString('en-IN')} kWh</span>
                      <strong className="font-mono" style={{ width: '40px', textAlign: 'right' }}>{eq.pct}%</strong>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div style={{ width: '100%', height: '8px', borderRadius: '4px', background: 'var(--bg-ground)', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${eq.pct}%`,
                        height: '100%',
                        borderRadius: '4px',
                        background: eq.pct > 30 ? '#bd6249' : eq.pct > 10 ? '#5e7e60' : 'var(--glass-border-highlight)',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: Cost Drivers (Section 33 of Spec) ── */}
      {activeTab === 'cost' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Cost Drivers Grid */}
          <div className="card-clean" style={{ padding: '20px' }}>
            <h3 style={{ margin: '0 0 14px', fontFamily: 'var(--font-serif)', fontSize: '18px', color: 'var(--text-primary)' }}>
              DISCOM HT-2A Tariff & Cost Drivers
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: '10px' }}>
              <div style={{ padding: '12px', borderRadius: '6px', background: 'var(--bg-ground)', border: '1px solid var(--glass-border)' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active Energy</span>
                <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>₹30.2L</div>
                <small style={{ color: 'var(--text-muted)' }}>₹7.80/kWh base</small>
              </div>

              <div style={{ padding: '12px', borderRadius: '6px', background: 'var(--bg-ground)', border: '1px solid var(--glass-border)' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>ToD Peak Charge</span>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#bd6249', marginTop: '2px' }}>₹6.8L</div>
                <small style={{ color: '#bd6249' }}>+₹2.20/kWh (18:00–22:00)</small>
              </div>

              <div style={{ padding: '12px', borderRadius: '6px', background: 'var(--bg-ground)', border: '1px solid var(--glass-border)' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Demand Charge</span>
                <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>₹3.8L</div>
                <small style={{ color: 'var(--text-muted)' }}>750 kVA sanctioned</small>
              </div>

              <div style={{ padding: '12px', borderRadius: '6px', background: 'var(--bg-ground)', border: '1px solid var(--glass-border)' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Power Factor Incentive</span>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#5e7e60', marginTop: '2px' }}>-₹42,000</div>
                <small style={{ color: '#5e7e60' }}>0.98 PF rebate</small>
              </div>

              <div style={{ padding: '12px', borderRadius: '6px', background: 'var(--bg-ground)', border: '1px solid var(--glass-border)' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Thermal Fuel</span>
                <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>₹1.9L</div>
                <small style={{ color: 'var(--text-muted)' }}>LDO ladle preheating</small>
              </div>
            </div>
          </div>

          {/* Actionable Cost Reduction Opportunities */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '14px' }}>
            <div className="card-clean" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <span className="best-tag">ARBITRAGE</span>
                <h4 style={{ margin: '8px 0 2px', fontSize: '14px', color: 'var(--text-primary)' }}>ToD Solar Load Shifting</h4>
                <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-secondary)' }}>
                  Shift sand mulling cycle to solar hours (10:00–14:00) at ₹4.80/kWh solar tariff.
                </p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid var(--glass-border)' }}>
                <strong style={{ color: '#5e7e60', fontSize: '13px' }}>₹54,000 / mo</strong>
                <button className="text-action" onClick={() => onNavigate('opportunities')}>
                  Open scenario &rarr;
                </button>
              </div>
            </div>

            <div className="card-clean" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <span className="provenance-badge provenance-modelled">DEMAND PEAK</span>
                <h4 style={{ margin: '8px 0 2px', fontSize: '14px', color: 'var(--text-primary)' }}>Peak Demand Shaving</h4>
                <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-secondary)' }}>
                  Stagger induction furnace tap changes to avoid 750 kVA billing penalty step.
                </p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid var(--glass-border)' }}>
                <strong style={{ color: '#5e7e60', fontSize: '13px' }}>₹38,000 / mo</strong>
                <button className="text-action" onClick={() => onNavigate('opportunities')}>
                  Open scenario &rarr;
                </button>
              </div>
            </div>

            <div className="card-clean" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <span className="provenance-badge provenance-verified">PF REBATE</span>
                <h4 style={{ margin: '8px 0 2px', fontSize: '14px', color: 'var(--text-primary)' }}>APFC Capacitor Tuning</h4>
                <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-secondary)' }}>
                  Maintain 0.99 power factor continuously to maximize maximum DISCOM rebate.
                </p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid var(--glass-border)' }}>
                <strong style={{ color: '#5e7e60', fontSize: '13px' }}>₹18,000 / mo</strong>
                <button className="text-action" onClick={() => onNavigate('opportunities')}>
                  Open scenario &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: Decarbonisation & Carbon (Section 34 of Spec) ── */}
      {activeTab === 'carbon' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="card-clean" style={{ padding: '22px' }}>
            <h3 style={{ margin: '0 0 12px', fontFamily: 'var(--font-serif)', fontSize: '18px', color: 'var(--text-primary)' }}>
              Carbon Accounting (SEBI BRSR Core & GHG Protocol)
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '12px' }}>
              <div style={{ padding: '14px', borderRadius: '7px', background: 'var(--bg-ground)', border: '1px solid var(--glass-border)' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Scope 1 Direct</span>
                <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>42.4 tCO₂e</div>
                <small style={{ color: 'var(--text-muted)' }}>Ladle preheat fuel</small>
              </div>

              <div style={{ padding: '14px', borderRadius: '7px', background: 'var(--bg-ground)', border: '1px solid var(--glass-border)' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Scope 2 Indirect</span>
                <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>275.5 tCO₂e</div>
                <small style={{ color: 'var(--text-muted)' }}>0.82 kg CO₂/kWh grid</small>
              </div>

              <div style={{ padding: '14px', borderRadius: '7px', background: 'var(--bg-ground)', border: '1px solid var(--glass-border)' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Carbon Intensity</span>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#5e7e60', marginTop: '2px' }}>0.417 t/ton</div>
                <small style={{ color: '#5e7e60' }}>↓ 6.8% FY26 progress</small>
              </div>

              <div style={{ padding: '14px', borderRadius: '7px', background: 'var(--bg-ground)', border: '1px solid var(--glass-border)' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Verified Abatement</span>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#5e7e60', marginTop: '2px' }}>35.2 tCO₂e/yr</div>
                <small style={{ color: '#5e7e60' }}>Certified under IPMVP</small>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
