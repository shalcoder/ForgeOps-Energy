import React, { useState } from 'react';
import {
  SettingsIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ActivityIcon,
  CpuIcon,
  LayersIcon,
  UsersIcon,
  ZapIcon,
  DatabaseIcon,
  LockIcon,
  FileTextIcon,
} from '../components/Icons';

type SettingsProps = {
  currentRole: string;
  onRoleChange: (role: string) => void;
  onNavigate: (view: string) => void;
};

type SettingsTab =
  | 'plant'
  | 'data_sources'
  | 'baselines'
  | 'safety'
  | 'tariffs'
  | 'users'
  | 'system_health';

export function SettingsView({ currentRole, onRoleChange, onNavigate }: SettingsProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('system_health');

  const dataSources = [
    { name: 'Modbus RTU / TCP Submeters', protocol: 'Modbus', status: 'Connected', lastSync: '1 sec ago', signals: 48 },
    { name: 'Siemens S7-1500 PLC & VFD Drives', protocol: 'OPC-UA', status: 'Connected', lastSync: '2 sec ago', signals: 64 },
    { name: 'Shopfloor Environmental MQTT Bus', protocol: 'MQTT', status: 'Connected', lastSync: '4 sec ago', signals: 16 },
    { name: 'MES Production & Tonnage System', protocol: 'REST / SQL', status: 'Connected', lastSync: '12 sec ago', signals: 12 },
    { name: 'CMMS Maintenance & Work Orders', protocol: 'SAP PM API', status: 'Connected', lastSync: '28 sec ago', signals: 8 },
    { name: 'QMS Quality Inspection Terminal', protocol: 'REST API', status: 'Connected', lastSync: '45 sec ago', signals: 6 },
    { name: 'DISCOM Tariff & Billing Feed', protocol: 'JSON Webhook', status: 'Connected', lastSync: '1 hr ago', signals: 4 },
  ];

  return (
    <div className="page-container">
      {/* ── Header ── */}
      <header className="page-header-clean">
        <div>
          <div className="page-kicker">
            <span className="kicker-tag">CONFIGURATION & HEALTH</span>
            <span>Plant Settings, Governance & AI Engine Health</span>
          </div>
          <h1 className="page-title">Settings & System Health</h1>
          <p className="page-subtitle">
            Configure industrial data sources, safety interlock constraints, equipment baselines, and inspect Decision 2.0 AI system health.
          </p>
        </div>

        <div className="header-controls-group">
          <div className="live-status-pill">
            <span className="pulsing-indicator" />
            <span>All 7 Data Feeds Operational</span>
          </div>
        </div>
      </header>

      {/* ── Subtabs ── */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px', flexWrap: 'wrap' }}>
        <button className={`btn-subtab ${activeTab === 'system_health' ? 'active' : ''}`} onClick={() => setActiveTab('system_health')}>
          System Health & Decision Engine
        </button>
        <button className={`btn-subtab ${activeTab === 'data_sources' ? 'active' : ''}`} onClick={() => setActiveTab('data_sources')}>
          Data Sources (7 Connected)
        </button>
        <button className={`btn-subtab ${activeTab === 'safety' ? 'active' : ''}`} onClick={() => setActiveTab('safety')}>
          Safety & Constraint Invariants
        </button>
        <button className={`btn-subtab ${activeTab === 'baselines' ? 'active' : ''}`} onClick={() => setActiveTab('baselines')}>
          Learned Baselines
        </button>
        <button className={`btn-subtab ${activeTab === 'tariffs' ? 'active' : ''}`} onClick={() => setActiveTab('tariffs')}>
          DISCOM Tariffs
        </button>
        <button className={`btn-subtab ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
          Users & Role Persona ({currentRole})
        </button>
      </div>

      {/* ── TAB 1: System Health (Section 2 & 43 of Spec) ── */}
      {activeTab === 'system_health' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Architecture Status Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '12px' }}>
            <div className="card-clean" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>System 1 Fast Loop</span>
                <span className="provenance-badge provenance-measured">Healthy</span>
              </div>
              <div style={{ fontSize: '15px', fontWeight: 650, color: 'var(--text-primary)', marginTop: '4px' }}>
                Decision-2.0 Sol-2B
              </div>
              <p style={{ margin: '4px 0 0', fontSize: '10.5px', color: 'var(--text-secondary)' }}>
                Non-autoregressive edge triage &bull; 8.4ms inference
              </p>
            </div>

            <div className="card-clean" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>System 2 Reasoning</span>
                <span className="provenance-badge provenance-measured">Healthy</span>
              </div>
              <div style={{ fontSize: '15px', fontWeight: 650, color: 'var(--text-primary)', marginTop: '4px' }}>
                4-Agent Bounded Pipeline
              </div>
              <p style={{ margin: '4px 0 0', fontSize: '10.5px', color: 'var(--text-secondary)' }}>
                Planner &bull; Research &bull; Analysis &bull; Execution
              </p>
            </div>

            <div className="card-clean" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Physics Engine</span>
                <span className="provenance-badge provenance-measured">Validated</span>
              </div>
              <div style={{ fontSize: '15px', fontWeight: 650, color: 'var(--text-primary)', marginTop: '4px' }}>
                Thermodynamic Validator
              </div>
              <p style={{ margin: '4px 0 0', fontSize: '10.5px', color: 'var(--text-secondary)' }}>
                Sonic orifice mass flow &bull; Isentropic curves
              </p>
            </div>

            <div className="card-clean" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>MCP Protocol</span>
                <span className="provenance-badge provenance-measured">Active (16)</span>
              </div>
              <div style={{ fontSize: '15px', fontWeight: 650, color: 'var(--text-primary)', marginTop: '4px' }}>
                ForgeOps MCP Server
              </div>
              <p style={{ margin: '4px 0 0', fontSize: '10.5px', color: 'var(--text-secondary)' }}>
                16 controlled tools &bull; Port 8787 HTTP API
              </p>
            </div>
          </div>

          {/* Canonical FactoryState Contract Verification */}
          <div className="card-clean" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: '17px', color: 'var(--text-primary)' }}>
                  Canonical FactoryState Contract & Data Pipeline
                </h3>
                <p style={{ margin: '3px 0 0', fontSize: '11px', color: 'var(--text-secondary)' }}>
                  Immutable typed schema consuming shopfloor telemetry with zero parsing errors.
                </p>
              </div>
              <span className="provenance-badge provenance-measured">Zero Parsing Errors</span>
            </div>

            <div style={{ padding: '14px', borderRadius: '8px', background: 'var(--bg-ground)', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-primary)', display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '14px' }}>
              <div>
                <div style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>// INGESTION RING BUFFER</div>
                <div>Ring capacity: 72 hours</div>
                <div>Current samples: 259,200</div>
                <div>Dropped frames: 0 (0.00%)</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>// MCP TOOLS REGISTERED</div>
                <div>Read tools: 12 read_telemetry_*</div>
                <div>Sim tools: 2 simulate_counterfactual</div>
                <div>Action tools: 2 dispatch_cmms_order</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>// AUDIT LEDGER INTEGRITY</div>
                <div>Chain length: 18 entries</div>
                <div>Hash algorithm: SHA-256</div>
                <div>Cryptographic check: VALID</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: Data Sources (Section 38 of Spec) ── */}
      {activeTab === 'data_sources' && (
        <div className="clean-table-wrap">
          <table className="clean-table">
            <thead>
              <tr>
                <th>Data Source</th>
                <th>Protocol</th>
                <th>Status</th>
                <th>Last Ingestion Sync</th>
                <th>Signals / Metrics</th>
              </tr>
            </thead>
            <tbody>
              {dataSources.map((ds) => (
                <tr key={ds.name}>
                  <td><strong>{ds.name}</strong></td>
                  <td><span className="font-mono">{ds.protocol}</span></td>
                  <td>
                    <span className="provenance-badge provenance-measured">
                      ● {ds.status}
                    </span>
                  </td>
                  <td><span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{ds.lastSync}</span></td>
                  <td><span className="font-mono">{ds.signals} signals</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── TAB 3: Safety Invariants (Section 38 of Spec) ── */}
      {activeTab === 'safety' && (
        <div className="card-clean" style={{ padding: '20px' }}>
          <h3 style={{ margin: '0 0 6px', fontFamily: 'var(--font-serif)', fontSize: '18px', color: 'var(--text-primary)' }}>
            Deterministic Safety Interlocks & Constraints
          </h3>
          <p style={{ margin: '0 0 16px', fontSize: '11.5px', color: 'var(--text-secondary)' }}>
            Strict physical bounds that AI recommendations and automated setpoints can never violate.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px' }}>
            <div style={{ padding: '14px', borderRadius: '7px', background: 'var(--bg-ground)', border: '1px solid var(--glass-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ fontSize: '12px', color: 'var(--text-primary)' }}>Compressor Pressure Interlock</strong>
                <span className="provenance-badge provenance-measured">Hard Lock</span>
              </div>
              <p style={{ margin: '4px 0 0', fontSize: '11px', color: 'var(--text-secondary)' }}>
                Minimum header pressure: <strong>5.5 bar</strong>. Sol-2B edge gateway immediately trips if pressure drops below limit.
              </p>
            </div>

            <div style={{ padding: '14px', borderRadius: '7px', background: 'var(--bg-ground)', border: '1px solid var(--glass-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ fontSize: '12px', color: 'var(--text-primary)' }}>Bearing Vibration Guard</strong>
                <span className="provenance-badge provenance-measured">Hard Lock</span>
              </div>
              <p style={{ margin: '4px 0 0', fontSize: '11px', color: 'var(--text-secondary)' }}>
                Vibration threshold: <strong>3.5 mm/s RMS</strong>. Prevents catastrophic mechanical bearing seizure.
              </p>
            </div>

            <div style={{ padding: '14px', borderRadius: '7px', background: 'var(--bg-ground)', border: '1px solid var(--glass-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ fontSize: '12px', color: 'var(--text-primary)' }}>Furnace Temperature Threshold</strong>
                <span className="provenance-badge provenance-measured">Hard Lock</span>
              </div>
              <p style={{ margin: '4px 0 0', fontSize: '11px', color: 'var(--text-secondary)' }}>
                Maximum bath temperature: <strong>1,480°C</strong>. Protects refractory lining and avoids coil burn.
              </p>
            </div>

            <div style={{ padding: '14px', borderRadius: '7px', background: 'var(--bg-ground)', border: '1px solid var(--glass-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ fontSize: '12px', color: 'var(--text-primary)' }}>Throughput Preserved Guardrail</strong>
                <span className="provenance-badge provenance-measured">Process Gate</span>
              </div>
              <p style={{ margin: '4px 0 0', fontSize: '11px', color: 'var(--text-secondary)' }}>
                Minimum line rate: <strong>10.0 t/h</strong>. Interventions causing throughput penalty are automatically rejected.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 4: Users & Roles (Section 39 of Spec) ── */}
      {activeTab === 'users' && (
        <div className="card-clean" style={{ padding: '20px' }}>
          <h3 style={{ margin: '0 0 6px', fontFamily: 'var(--font-serif)', fontSize: '18px', color: 'var(--text-primary)' }}>
            User Personas & Role-Tailored Views
          </h3>
          <p style={{ margin: '0 0 16px', fontSize: '11.5px', color: 'var(--text-secondary)' }}>
            Select a role to preview how ForgeOps tailors complexity to each plant professional.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '12px' }}>
            {[
              { id: 'Plant Manager', desc: 'Overview, Opportunities, Decisions, Verification, and Executive Reports.' },
              { id: 'Energy Manager', desc: 'Overview, Live Operations, Opportunities, Energy & Carbon, and Verification.' },
              { id: 'Maintenance Engineer', desc: 'Live Operations, Investigations, Assets, Actions, and CMMS telemetry.' },
              { id: 'Operator', desc: 'Live Operations, Assigned Actions, Urgent Alerts, and Approvals.' },
            ].map((role) => (
              <div
                key={role.id}
                style={{
                  padding: '16px',
                  borderRadius: '8px',
                  border: currentRole === role.id ? '1.5px solid #bd6249' : '1px solid var(--glass-border)',
                  background: currentRole === role.id ? 'var(--brand-subtle)' : 'var(--bg-surface)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
                onClick={() => onRoleChange(role.id)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{role.id}</strong>
                  {currentRole === role.id && <span className="best-tag">ACTIVE</span>}
                </div>
                <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                  {role.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
