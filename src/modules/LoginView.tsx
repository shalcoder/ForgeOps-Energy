import React, { useState } from 'react';
import {
  ZapIcon,
  ArrowRightIcon,
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

  const personas = [
    {
      name: 'Vishal',
      role: 'Plant Manager',
      avatar: 'VI',
      focus: 'Overview, scenario opportunities, demo decision review',
      badge: 'All Access',
    },
    {
      name: 'Vaishak',
      role: 'Energy Manager',
      avatar: 'VA',
      focus: 'SEC assumptions, tariff scenarios, indicative carbon estimates',
      badge: 'Energy Focus',
    },
    {
      name: 'Keerthi',
      role: 'Maintenance Engineer',
      avatar: 'KE',
      focus: 'Synthetic asset fixtures, root-cause hypotheses, proposed work-order drafts',
      badge: 'Engineering',
    },
    {
      name: 'Sham',
      role: 'Shopfloor Operator',
      avatar: 'SH',
      focus: 'Demo operations, process graph, illustrative safety checks',
      badge: 'Shopfloor',
    },
  ];

  const handlePersonaSelect = (p: typeof personas[0]) => setSelectedRole(p.role);

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
              DEMONSTRATION ACCESS &bull; SYNTHETIC CASE STUDY
            </span>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '26px', margin: '10px 0 6px', color: 'var(--text-primary)' }}>
              Enter ForgeOps Energy Demo
            </h1>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
              Choose a role persona to explore the prototype. No account authentication or factory connection is active.
            </p>
          </div>

          <div role="note" style={{ marginBottom: '16px', padding: '10px 12px', border: '1px solid #ead9b2', borderRadius: '7px', background: '#fff8e8', color: '#725624', fontSize: '12px' }}>
            Demo mode: this role selector is not authentication. No plant gateway, PLC, MES, QMS, or CMMS is connected.
          </div>

          {/* Plant Selector */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '6px' }}>
              Select demonstration workspace
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

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '0 0 4px' }}>
                Choose a demo persona; this only changes the example workspace view.
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
                        <span className="provenance-badge provenance-simulated" style={{ marginLeft: 'auto' }}>
                          Demo persona
                        </span>
                      </div>
                      <p style={{ margin: '3px 0 0', fontSize: '11px', color: 'var(--text-muted)' }}>{p.focus}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <button type="submit" className="btn-primary-action login-submit-btn">
              <ZapIcon size={16} />
              <span>Enter {selectedPlant.split(' ')[0]} Demo as {selectedRole}</span>
              <ArrowRightIcon size={15} />
            </button>
          </form>

          <div style={{ marginTop: '18px', paddingTop: '14px', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--text-muted)' }}>
            <span>Runtime: browser-based demonstration</span>
            <span style={{ color: '#a8793e', fontWeight: 600 }}>No factory gateway connected</span>
          </div>
        </div>
      </div>
    </div>
  );
}
