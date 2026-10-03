import { useEffect, useState } from 'react';
import { FocusProvider } from './FocusContext';
import { WorkbenchDataProvider, useWorkbenchData } from './WorkbenchDataContext';
import { HomeDashboard } from './modules/HomeDashboard';
import { Workbench } from './modules/Workbench';
import { FoundryUserStoryView } from './modules/FoundryUserStoryView';
import { SmeEconomicsView } from './modules/SmeEconomicsView';
import { VerificationView } from './modules/VerificationView';
import { AskForgeOpsView } from './components/AskForgeOpsView';
import {
  AlertTriangleIcon,
  BarChartIcon,
  CpuIcon,
  GaugeIcon,
  MoonIcon,
  ShieldCheckIcon,
  SparklesIcon,
  SunIcon,
  ZapIcon,
} from './components/Icons';

export type AppView = 'dashboard' | 'workbench' | 'fleet' | 'verification' | 'economics' | 'copilot';
export type Theme = 'dark' | 'light';

const pageLabels: Record<AppView, string> = {
  dashboard: 'Overview',
  workbench: 'Decision workbench',
  fleet: 'Asset fleet',
  verification: 'Savings verification',
  economics: 'Energy economics',
  copilot: 'Ask ForgeOps',
};

function BrandMark() {
  return <span className="brand-mark" aria-hidden="true"><span>F</span></span>;
}

function LiveDataLabel() {
  const { data } = useWorkbenchData();
  return <div className="live-status-pill" title={data.errors[0] ?? (data.live ? 'Connected to the live case data source.' : 'Using matching case-study data.')}><span className="pulsing-indicator" /><span>{data.live ? 'Live incident' : 'Case study'}</span></div>;
}

function ThemeToggle({ theme, setTheme }: { theme: Theme; setTheme: (theme: Theme) => void }) {
  const nextTheme = theme === 'light' ? 'dark' : 'light';
  return (
    <button className="theme-toggle-segmented" onClick={() => setTheme(nextTheme)} aria-label={`Switch to ${nextTheme} theme`} title={`Switch to ${nextTheme} theme`}>
      {theme === 'light' ? <MoonIcon size={16} /> : <SunIcon size={16} />}
      <span>{theme === 'light' ? 'Dark' : 'Light'} theme</span>
    </button>
  );
}

function App() {
  const [view, setView] = useState<AppView>('dashboard');
  const [theme, setTheme] = useState<Theme>(() => (
    localStorage.getItem('forgeops-theme-v2') === 'dark' ? 'dark' : 'light'
  ));

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('forgeops-theme-v2', theme);
  }, [theme]);

  const navigate = (nextView: AppView) => {
    setView(nextView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItem = (target: AppView, label: string, Icon: typeof ZapIcon) => (
    <button key={target} className={`sidebar-link${view === target ? ' active' : ''}`} onClick={() => navigate(target)} aria-current={view === target ? 'page' : undefined}>
      <Icon size={17} /><span>{label}</span>{target === 'workbench' && <span className="sidebar-count">1</span>}
    </button>
  );

  return (
    <WorkbenchDataProvider>
      <FocusProvider>
        <div className="app-shell">
          <aside className="app-sidebar">
            <button className="brand-logo-btn" onClick={() => navigate('dashboard')} aria-label="ForgeOps Energy home">
              <BrandMark /><span className="brand-title">ForgeOps<span>Energy</span></span>
            </button>
            <div className="sidebar-plant"><span className="plant-avatar">B</span><span><strong>Belgaum Foundry</strong><small>Plant workspace</small></span><span className="plant-chevron">⌄</span></div>
            <nav className="sidebar-navigation" aria-label="Main navigation">
              <p className="sidebar-section-label">WORKSPACE</p>
              {navItem('dashboard', 'Overview', ZapIcon)}
              {navItem('workbench', 'Decision workbench', CpuIcon)}
              <p className="sidebar-section-label">OPERATIONS</p>
              {navItem('fleet', 'Asset fleet', GaugeIcon)}
              {navItem('verification', 'Savings verification', ShieldCheckIcon)}
              {navItem('economics', 'Energy economics', BarChartIcon)}
            </nav>
            <div className="sidebar-spacer" />
            <button className={`sidebar-link copilot-link${view === 'copilot' ? ' active' : ''}`} onClick={() => navigate('copilot')} aria-current={view === 'copilot' ? 'page' : undefined}>
              <SparklesIcon size={17} /><span>Ask ForgeOps</span><span className="copilot-shortcut">⌘ K</span>
            </button>
            <div className="sidebar-user"><span className="user-avatar">VA</span><span><strong>Vaishak</strong><small>Plant engineer</small></span><button aria-label="Account options">···</button></div>
          </aside>

          <div className="workspace-column">
            <header className="app-header-modern">
              <div className="breadcrumbs"><span>Belgaum Foundry</span><span>/</span><strong>{pageLabels[view]}</strong></div>
              <div className="header-actions">
                <LiveDataLabel />
                <button className="incident-alarm-pill" onClick={() => navigate('workbench')} title="Open the priority incident"><AlertTriangleIcon size={15} /><span>1 needs attention</span></button>
                <ThemeToggle theme={theme} setTheme={setTheme} />
                <span className="header-user-avatar">VA</span>
              </div>
            </header>
            <main className="workspace-main" key={view}>
              {view === 'dashboard' && <HomeDashboard onNavigate={navigate} />}
              {view === 'workbench' && <Workbench onBack={() => navigate('dashboard')} />}
              {view === 'fleet' && <FoundryUserStoryView onSwitchToWorkbench={() => navigate('workbench')} />}
              {view === 'verification' && <VerificationView onOpenWorkbench={() => navigate('workbench')} />}
              {view === 'economics' && <SmeEconomicsView onOpenWorkbench={() => navigate('workbench')} />}
              {view === 'copilot' && <AskForgeOpsView onNavigate={(target) => navigate(target as AppView)} />}
            </main>
          </div>
        </div>
      </FocusProvider>
    </WorkbenchDataProvider>
  );
}

export default App;
