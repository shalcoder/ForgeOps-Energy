import { useState, useEffect } from 'react';
import { FocusProvider } from './FocusContext';
import { WorkbenchDataProvider, useWorkbenchData } from './WorkbenchDataContext';
import { HomeDashboard } from './modules/HomeDashboard';
import { Workbench } from './modules/Workbench';
import { FoundryUserStoryView } from './modules/FoundryUserStoryView';
import { SmeEconomicsView } from './modules/SmeEconomicsView';
import { VerificationView } from './modules/VerificationView';
import { AskForgeOpsView } from './components/AskForgeOpsView';
import {
  ZapIcon,
  CpuIcon,
  BarChartIcon,
  GaugeIcon,
  AlertTriangleIcon,
  ShieldCheckIcon,
  SparklesIcon,
  SunIcon,
  MoonIcon,
} from './components/Icons';

export type AppView = 'dashboard' | 'workbench' | 'fleet' | 'verification' | 'economics' | 'copilot';
export type Theme = 'dark' | 'light';

function BrandMark() {
  return (
    <div style={{
      width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
      background: 'linear-gradient(135deg, #00e02c 0%, #00843d 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 0 12px rgba(0, 211, 40, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
    }} aria-hidden="true">
      <svg width={16} height={16} viewBox="0 0 24 24" fill="none">
        <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="#ffffff" />
      </svg>
    </div>
  );
}

function LiveDataLabel() {
  const { data } = useWorkbenchData();
  return (
    <div className="live-status-pill">
      <span className="pulsing-indicator" />
      <span className="font-mono text-secondary" style={{ fontSize: '11px' }}>
        {data.incident.plant} • Edge
      </span>
    </div>
  );
}

function App() {
  const [view, setView] = useState<AppView>('dashboard');
  const [theme, setTheme] = useState<Theme>(() =>
    (localStorage.getItem('forgeops-theme') as Theme) || 'dark'
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('forgeops-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  return (
    <WorkbenchDataProvider>
      <FocusProvider>
        <div className="app-shell">
          <header className="app-header-modern">
            <div className="header-brand-group">
              <button className="brand-logo-btn" onClick={() => setView('dashboard')} aria-label="Home">
                <BrandMark />
                <span className="brand-title">
                  FORGEOPS <span className="brand-accent">ENERGY</span>
                </span>
              </button>

              <nav className="segmented-nav" aria-label="Primary Navigation">
                <button className={`nav-tab-btn ${view === 'dashboard' ? 'active' : ''}`} onClick={() => setView('dashboard')}>
                  <ZapIcon size={13} /><span>Energy Overview</span>
                </button>
                <button className={`nav-tab-btn ${view === 'workbench' ? 'active' : ''}`} onClick={() => setView('workbench')}>
                  <CpuIcon size={13} /><span>Decision Workbench</span>
                </button>
                <button className={`nav-tab-btn ${view === 'fleet' ? 'active' : ''}`} onClick={() => setView('fleet')}>
                  <GaugeIcon size={13} /><span>Asset Fleet Monitor</span>
                </button>
                <button className={`nav-tab-btn ${view === 'verification' ? 'active' : ''}`} onClick={() => setView('verification')}>
                  <ShieldCheckIcon size={13} /><span>Verification (IPMVP)</span>
                </button>
                <button className={`nav-tab-btn ${view === 'economics' ? 'active' : ''}`} onClick={() => setView('economics')}>
                  <BarChartIcon size={13} /><span>Economics & BEE</span>
                </button>
                <button
                  className={`nav-tab-btn copilot-tab ${view === 'copilot' ? 'active' : ''}`}
                  onClick={() => setView('copilot')}
                  style={{ color: view === 'copilot' ? undefined : 'var(--schneider-green)' }}
                >
                  <SparklesIcon size={13} /><span>Ask ForgeOps</span>
                </button>
              </nav>
            </div>

            <div className="header-actions">
              <LiveDataLabel />
              <button
                className="incident-alarm-pill"
                onClick={() => setView('workbench')}
                title="Active Incident: INC-ENG-2401 (+14.3% SEC)"
              >
                <AlertTriangleIcon size={13} />
                <span>INC-ENG-2401 • +14.3%</span>
              </button>
              <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle theme"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
                {theme === 'dark' ? <SunIcon size={14} /> : <MoonIcon size={14} />}
                <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
              </button>
              <div className="avatar-pill" title="Plant Energy Engineer (Shift B)">EE</div>
            </div>
          </header>

          <main style={{ flexGrow: 1 }}>
            {view === 'dashboard'     && <HomeDashboard onOpenWorkbench={() => setView('workbench')} />}
            {view === 'workbench'     && <Workbench onBack={() => setView('dashboard')} />}
            {view === 'fleet'         && <FoundryUserStoryView onSwitchToWorkbench={() => setView('workbench')} />}
            {view === 'verification'  && <VerificationView onOpenWorkbench={() => setView('workbench')} />}
            {view === 'economics'     && <SmeEconomicsView onOpenWorkbench={() => setView('workbench')} />}
            {view === 'copilot'       && <AskForgeOpsView onNavigate={(v) => setView(v as AppView)} />}
          </main>
        </div>
      </FocusProvider>
    </WorkbenchDataProvider>
  );
}

export default App;
