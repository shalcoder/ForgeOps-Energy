import React, { useState } from 'react';
import {
  ZapIcon,
  ShieldCheckIcon,
  CpuIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  UsersIcon,
  AlertTriangleIcon,
  LockIcon,
} from '../components/Icons';

type LoginProps = {
  onLoginSuccess: (role: string, plant: string) => void;
  onBackToLanding: () => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
};

export function LoginView({ onLoginSuccess, onBackToLanding, theme, setTheme }: LoginProps) {
  const [selectedPlant, setSelectedPlant] = useState('Belgaum Foundry Complex');
  const [selectedRole, setSelectedRole] = useState('Plant Manager');
  const [email, setEmail] = useState('vishal@belgaumfoundry.in');
  const [pin, setPin] = useState('4821');
  const [loginMethod, setLoginMethod] = useState<'persona' | 'credentials'>('persona');

  const personas = [
    {
      name: 'Vishal',
      role: 'Plant Manager',
      avatar: 'VI',
      focus: 'Executive Cockpit, Opportunities, Decision Gate Approvals, M&V Savings',
      badge: 'All Access',
      defaultEmail: 'vishal@belgaumfoundry.in',
    },
    {
      name: 'Vaishak',
      role: 'Energy Manager',
      avatar: 'VA',
      focus: 'SEC Baselines, DISCOM HT-2A Tariff Arbitrage, SEBI BRSR Carbon',
      badge: 'Energy Focus',
      defaultEmail: 'vaishak.energy@belgaumfoundry.in',
    },
    {
      name: 'Keerthi',
      role: 'Maintenance Engineer',
      avatar: 'KE',
      focus: 'Asset Telemetry, CMP-01 Root Cause Evidence, CMMS Work Orders',
      badge: 'Engineering',
      defaultEmail: 'keerthi.maint@belgaumfoundry.in',
    },
    {
      name: 'Sham',
      role: 'Shopfloor Operator',
      avatar: 'SH',
      focus: 'Live Operations, Line 2 Process Graph, Interlock Pass Checks',
      badge: 'Shopfloor',
      defaultEmail: 'sham.shift_b@belgaumfoundry.in',
    },
  ];

  const handlePersonaSelect = (p: typeof personas[0]) => {
    setSelectedRole(p.role);
    setEmail(p.defaultEmail);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess(selectedRole, selectedPlant);
  };

  return (
    <div className="login-page-wrapper">
      {/* Top Bar */}
      <header className="login-top-bar">
        <div className="landing-logo" onClick={onBackToLanding} style={{ cursor: 'pointer' }}>
          <span className="brand-mark"><span>F</span></span>
          <span className="brand-title">ForgeOps<span>Energy</span></span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            className="theme-toggle-segmented"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            {theme === 'light' ? (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
                <span>Dark</span>
              </>
            ) : (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
                <span>Light</span>
              </>
            )}
          </button>
          <button className="text-action" onClick={onBackToLanding}>
            &larr; Back to Public Overview
          </button>
        </div>
      </header>

      {/* Center Auth Card */}
      <div className="login-container">
        <div className="login-card card-clean">
          <div style={{ textAlign: 'center', marginBottom: '22px' }}>
            <span className="kicker-tag" style={{ border: '1px solid #ebd0c9', background: '#fbf2ef', color: '#a75743' }}>
              SECURE INDUSTRIAL GATEWAY &bull; SAML 2.0 / RBAC
            </span>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '26px', margin: '10px 0 6px', color: 'var(--text-primary)' }}>
              Sign In to ForgeOps Energy
            </h1>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
              Select a plant workspace and role persona to enter plant operations.
            </p>
          </div>

          {/* Plant Selector */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '6px' }}>
              Select Manufacturing Complex
            </label>
            <select
              value={selectedPlant}
              onChange={(e) => setSelectedPlant(e.target.value)}
              className="login-input-select"
            >
              <option value="Belgaum Foundry Complex">Belgaum Foundry Complex (Karnataka &bull; Casting & Moulding)</option>
              <option value="Coimbatore Casting Hub">Coimbatore Foundry & Pump Hub (Tamil Nadu)</option>
              <option value="Pune Auto Forging Hub">Pune Auto Forging Complex (Maharashtra)</option>
            </select>
          </div>

          {/* Auth Method Tabs */}
          <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px', marginBottom: '18px' }}>
            <button
              className={`btn-subtab ${loginMethod === 'persona' ? 'active' : ''}`}
              onClick={() => setLoginMethod('persona')}
              style={{ flex: 1, textAlign: 'center' }}
            >
              1-Click Role Persona (Fast Demo)
            </button>
            <button
              className={`btn-subtab ${loginMethod === 'credentials' ? 'active' : ''}`}
              onClick={() => setLoginMethod('credentials')}
              style={{ flex: 1, textAlign: 'center' }}
            >
              Direct PIN / Credentials
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {loginMethod === 'persona' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '0 0 4px' }}>
                  Choose a role persona to experience the role-specific information disclosure:
                </p>

                {personas.map((p) => {
                  const isSelected = selectedRole === p.role;
                  return (
                    <div
                      key={p.role}
                      className={`login-persona-row ${isSelected ? 'selected' : ''}`}
                      onClick={() => handlePersonaSelect(p)}
                    >
                      <div className="login-avatar">{p.avatar}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <strong style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{p.name}</strong>
                          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>&bull; {p.role}</span>
                          <span className="provenance-badge provenance-measured" style={{ marginLeft: 'auto' }}>
                            {p.badge}
                          </span>
                        </div>
                        <p style={{ margin: '3px 0 0', fontSize: '11px', color: 'var(--text-muted)' }}>
                          {p.focus}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Plant Work Email / Employee ID
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="login-input-text"
                    required
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      Access PIN / Password
                    </label>
                    <span style={{ fontSize: '10.5px', color: '#5e7e60', fontWeight: 600 }}>Demo PIN: 4821</span>
                  </div>
                  <input
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="login-input-text"
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Operating Role
                  </label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="login-input-select"
                  >
                    <option value="Plant Manager">Plant Manager (Vishal)</option>
                    <option value="Energy Manager">Energy Manager (Vaishak)</option>
                    <option value="Maintenance Engineer">Maintenance Engineer (Keerthi)</option>
                    <option value="Operator">Shopfloor Operator (Sham)</option>
                  </select>
                </div>
              </div>
            )}

            <button type="submit" className="btn-primary-action login-submit-btn">
              <ZapIcon size={16} />
              <span>Enter {selectedPlant.split(' ')[0]} Workspace as {selectedRole}</span>
              <ArrowRightIcon size={15} />
            </button>
          </form>

          <div style={{ marginTop: '18px', paddingTop: '14px', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--text-muted)' }}>
            <span>Hardware: DIN-rail Edge Gateway #EG-01</span>
            <span style={{ color: '#5e7e60', fontWeight: 600 }}>● Online (1-sec poll)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
