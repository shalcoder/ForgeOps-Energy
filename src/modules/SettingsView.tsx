import React, { useEffect, useState } from 'react';
import { getSystemRuntimeStatus, type SystemRuntimeStatus } from '../integrations/forgeOpsClient';
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
  const [runtime, setRuntime] = useState<SystemRuntimeStatus | null>(null);

  useEffect(() => {
    let mounted = true;
    getSystemRuntimeStatus().then((status) => {
      if (mounted) setRuntime(status);
    });
    return () => { mounted = false; };
  }, []);

  const dataSources = [
    { name: 'Energy meters & submeters', protocol: 'Modbus RTU / TCP', status: 'Not connected', lastSync: 'Not available', signals: 'Demo fixture' },
    { name: 'PLC, VFD & machine telemetry', protocol: 'OPC-UA / Modbus', status: 'Not connected', lastSync: 'Not available', signals: 'Demo fixture' },
    { name: 'Shopfloor sensor bus', protocol: 'MQTT / 4–20mA', status: 'Not connected', lastSync: 'Not available', signals: 'Demo fixture' },
    { name: 'Production, maintenance & quality', protocol: 'MES / CMMS / QMS', status: 'Not connected', lastSync: 'Not available', signals: 'Demo fixture' },
    { name: 'Tariff, materials & finance', protocol: 'ERP / API / file', status: 'Not connected', lastSync: 'Not available', signals: 'Demo fixture' },
  ];

  const modelLabel = runtime?.system1.runtime === 'native_local_model'
    ? 'Local Decision-2 model'
    : 'Calibrated deterministic fallback';

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
            <span className="pulsing-indicator" style={{ background: '#d5a04e' }} />
            <span>Prototype · demo plant data</span>
          </div>
        </div>
      </header>

      {/* ── Subtabs ── */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px', flexWrap: 'wrap' }}>
        <button className={`btn-subtab ${activeTab === 'system_health' ? 'active' : ''}`} onClick={() => setActiveTab('system_health')}>
          System Health & Decision Engine
        </button>
        <button className={`btn-subtab ${activeTab === 'data_sources' ? 'active' : ''}`} onClick={() => setActiveTab('data_sources')}>
          Data Sources (Demo status)
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
                <span className="provenance-badge provenance-estimated">{runtime?.system1.live_loaded ? 'Native loaded' : 'Fallback active'}</span>
              </div>
              <div style={{ fontSize: '15px', fontWeight: 650, color: 'var(--text-primary)', marginTop: '4px' }}>
                {modelLabel}
              </div>
              <p style={{ margin: '4px 0 0', fontSize: '10.5px', color: 'var(--text-secondary)' }}>
                {runtime ? `Target ${runtime.system1.model} · ${runtime.system1.weights_present ? 'weights available' : 'weights not found locally'} · torch ${runtime.system1.packages.torch ?? 'not installed'}` : 'Runtime status unavailable'}
              </p>
            </div>

            <div className="card-clean" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>System 2 Reasoning</span>
                <span className="provenance-badge provenance-estimated">{runtime?.system2.live_provider_enabled ? 'Provider enabled' : 'Fallback mode'}</span>
              </div>
              <div style={{ fontSize: '15px', fontWeight: 650, color: 'var(--text-primary)', marginTop: '4px' }}>
                4-Agent Bounded Pipeline
              </div>
              <p style={{ margin: '4px 0 0', fontSize: '10.5px', color: 'var(--text-secondary)' }}>
                {runtime?.system2.agents.join(' · ') ?? 'Planner · Research · Analysis · Execution'}
              </p>
            </div>

            <div className="card-clean" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Physics Engine</span>
                <span className="provenance-badge provenance-measured">Deterministic model</span>
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
                <span className={`provenance-badge ${runtime?.integrations.remote_mcp.reachable ? 'provenance-measured' : 'provenance-estimated'}`}>{runtime?.integrations.remote_mcp.reachable ? `Remote tools (${runtime.integrations.remote_mcp.tool_count})` : 'Local fallback'}</span>
              </div>
              <div style={{ fontSize: '15px', fontWeight: 650, color: 'var(--text-primary)', marginTop: '4px' }}>
                ForgeOps MCP Server
              </div>
              <p style={{ margin: '4px 0 0', fontSize: '10.5px', color: 'var(--text-secondary)' }}>
                MCP tools are read-only in the research path; remote availability is checked at runtime.
              </p>
            </div>
          </div>

          {/* Canonical FactoryState Contract Verification */}
          <div className="card-clean" style={{ padding: '20px', marginBottom: '14px', borderLeft: '4px solid #d5a04e' }}>
            <strong>Data provenance: synthetic demonstration</strong>
            <p style={{ margin: '5px 0 0', fontSize: '11.5px', color: 'var(--text-secondary)' }}>
              {runtime?.data_note ?? 'Factory telemetry and operational records in this prototype are demonstration fixtures. No live plant OT adapter is connected.'}
            </p>
          </div>
          <div className="card-clean" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: '17px', color: 'var(--text-primary)' }}>
                  Canonical FactoryState Contract & Data Pipeline
                </h3>
                <p style={{ margin: '3px 0 0', fontSize: '11px', color: 'var(--text-secondary)' }}>
                  Typed data contract for structured records; this deployment is populated with demonstration fixtures.
                </p>
              </div>
                  <span className="provenance-badge provenance-estimated">Typed demo contract</span>
            </div>

            <div style={{ padding: '14px', borderRadius: '8px', background: 'var(--bg-ground)', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-primary)', display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '14px' }}>
              <div>
                <div style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>// INGESTION RING BUFFER</div>
                <div>Ingestion: not connected</div>
                <div>Sample count: demo fixture</div>
                <div>Field buffer: not deployed</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>// MCP TOOLS REGISTERED</div>
                <div>Remote endpoint: {runtime?.integrations.remote_mcp.reachable ? 'reachable' : 'unavailable / unchecked'}</div>
                <div>Read-only research tools</div>
                <div>Plant action dispatch: simulated only</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>// AUDIT LEDGER INTEGRITY</div>
                <div>Audit storage: local SQLite</div>
                <div>Persistence: deployment dependent</div>
                <div>Runtime checks: see API health</div>
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
                  <span className="provenance-badge provenance-estimated">
                      ● {ds.status}
                    </span>
                  </td>
                  <td><span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{ds.lastSync}</span></td>
                  <td><span className="font-mono">{ds.signals}</span></td>
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
                <span className="provenance-badge provenance-estimated">App constraint</span>
              </div>
              <p style={{ margin: '4px 0 0', fontSize: '11px', color: 'var(--text-secondary)' }}>
                Minimum header pressure: <strong>5.5 bar</strong>. The application blocks recommendations below this configured boundary; it is not wired to trip plant hardware.
              </p>
            </div>

            <div style={{ padding: '14px', borderRadius: '7px', background: 'var(--bg-ground)', border: '1px solid var(--glass-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ fontSize: '12px', color: 'var(--text-primary)' }}>Bearing Vibration Guard</strong>
                <span className="provenance-badge provenance-estimated">App constraint</span>
              </div>
              <p style={{ margin: '4px 0 0', fontSize: '11px', color: 'var(--text-secondary)' }}>
                Vibration threshold: <strong>3.5 mm/s RMS</strong>. Prevents catastrophic mechanical bearing seizure.
              </p>
            </div>

            <div style={{ padding: '14px', borderRadius: '7px', background: 'var(--bg-ground)', border: '1px solid var(--glass-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ fontSize: '12px', color: 'var(--text-primary)' }}>Furnace Temperature Threshold</strong>
                <span className="provenance-badge provenance-estimated">App constraint</span>
              </div>
              <p style={{ margin: '4px 0 0', fontSize: '11px', color: 'var(--text-secondary)' }}>
                Maximum bath temperature: <strong>1,480°C</strong>. Protects refractory lining and avoids coil burn.
              </p>
            </div>

            <div style={{ padding: '14px', borderRadius: '7px', background: 'var(--bg-ground)', border: '1px solid var(--glass-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ fontSize: '12px', color: 'var(--text-primary)' }}>Throughput Preserved Guardrail</strong>
                <span className="provenance-badge provenance-estimated">App constraint</span>
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
