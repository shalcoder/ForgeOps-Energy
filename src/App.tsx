import React, { useEffect, useState } from 'react';
import { FocusProvider } from './FocusContext';
import { WorkbenchDataProvider, useWorkbenchData } from './WorkbenchDataContext';
import { OverviewView } from './modules/OverviewView';
import { LiveOperationsView } from './modules/LiveOperationsView';
import { OpportunitiesView } from './modules/OpportunitiesView';
import { InvestigationWorkspace } from './modules/InvestigationWorkspace';
import { ActionsView } from './modules/ActionsView';
import { AssetsView } from './modules/AssetsView';
import { EnergyCarbonView } from './modules/EnergyCarbonView';
import { VerificationView } from './modules/VerificationView';
import { ReportsView } from './modules/ReportsView';
import { SettingsView } from './modules/SettingsView';
import { LandingPageView } from './modules/LandingPageView';
import { LoginView } from './modules/LoginView';
import { CommandPalette } from './components/CommandPalette';
import {
  AlertTriangleIcon,
  BarChartIcon,
  CpuIcon,
  GaugeIcon,
  MoonIcon,
  ShieldCheckIcon,
  SunIcon,
  ZapIcon,
  ClockIcon,
  ActivityIcon,
  SettingsIcon,
  FileTextIcon,
  SearchIcon,
  UserIcon,
  LogOutIcon,
  GlobeIcon,
  MoreHorizontalIcon,
  WrenchIcon,
  UsersIcon,
} from './components/Icons';

export type AppView =
  | 'landing'
  | 'login'
  | 'overview'
  | 'live-operations'
  | 'opportunities'
  | 'investigations'
  | 'actions'
  | 'assets'
  | 'energy'
  | 'verification'
  | 'reports'
  | 'settings';

export type Theme = 'dark' | 'light';

const pageLabels: Record<AppView, string> = {
  landing: 'Public Overview',
  login: 'Sign In',
  overview: 'Overview',
  'live-operations': 'Live Operations',
  opportunities: 'Energy Opportunities',
  investigations: 'Investigations',
  actions: 'Actions & Work Orders',
  assets: 'Asset Fleet',
  energy: 'Energy & Carbon',
  verification: 'Savings Verification',
  reports: 'Reports & Dossiers',
  settings: 'Settings & System Health',
};

const ROLE_META: Record<string, { name: string; initials: string }> = {
  'Plant Manager':         { name: 'Vishal',  initials: 'VI' },
  'Energy Manager':        { name: 'Vaishak', initials: 'VA' },
  'Maintenance Engineer':  { name: 'Keerthi', initials: 'KE' },
  'Operator':              { name: 'Sham',    initials: 'SH' },
};

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <span>F</span>
    </span>
  );
}

function LiveDataLabel() {
  const { data } = useWorkbenchData();
  return (
    <div
      className="live-status-pill"
      title={data.errors[0] ?? (data.live ? 'Connected to the live case data source.' : 'Using matching case-study data.')}
    >
      <span className="pulsing-indicator" />
      <span>{data.live ? 'Live incident' : 'Case study'}</span>
    </div>
  );
}

function ThemeToggle({ theme, setTheme }: { theme: Theme; setTheme: (t: Theme) => void }) {
  const next = theme === 'light' ? 'dark' : 'light';
  return (
    <button
      className="theme-toggle-segmented"
      onClick={() => setTheme(next)}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
    >
      {theme === 'light' ? <MoonIcon size={15} /> : <SunIcon size={15} />}
      <span>{theme === 'light' ? 'Dark' : 'Light'}</span>
    </button>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    localStorage.getItem('forgeops-auth') === 'true'
  );
  const [view, setView] = useState<AppView>(() =>
    isAuthenticated ? 'overview' : 'landing'
  );
  const [detailId, setDetailId] = useState<string | undefined>(undefined);
  const [theme, setTheme] = useState<Theme>(() =>
    localStorage.getItem('forgeops-theme-v2') === 'dark' ? 'dark' : 'light'
  );
  const [currentRole, setCurrentRole] = useState(() =>
    localStorage.getItem('forgeops-role') || 'Plant Manager'
  );
  const [selectedPlant, setSelectedPlant] = useState(() =>
    localStorage.getItem('forgeops-plant') || 'Belgaum Foundry'
  );
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [plantDropdownOpen, setPlantDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('forgeops-theme-v2', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('forgeops-auth', isAuthenticated ? 'true' : 'false');
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('forgeops-role', currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem('forgeops-plant', selectedPlant);
  }, [selectedPlant]);

  // ⌘K global shortcut
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const navigate = (nextView: string, nextDetailId?: string) => {
    setView(nextView as AppView);
    setDetailId(nextDetailId);
    setUserMenuOpen(false);
    setPlantDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (role: string, plant: string) => {
    setCurrentRole(role);
    setSelectedPlant(plant.split(' ').slice(0, 2).join(' '));
    setIsAuthenticated(true);
    navigate('overview');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserMenuOpen(false);
    navigate('login');
  };

  const navItem = (target: AppView, label: string, Icon: typeof ZapIcon, badgeCount?: number) => (
    <button
      key={target}
      className={`sidebar-link${view === target ? ' active' : ''}`}
      onClick={() => navigate(target)}
      aria-current={view === target ? 'page' : undefined}
    >
      <Icon size={16} />
      <span>{label}</span>
      {badgeCount !== undefined && badgeCount > 0 && (
        <span className="sidebar-count">{badgeCount}</span>
      )}
    </button>
  );

  const roleMeta = ROLE_META[currentRole] ?? ROLE_META['Plant Manager'];

  // ── Public landing page (no auth required) ──
  if (view === 'landing') {
    return (
      <WorkbenchDataProvider>
        <FocusProvider>
          <LandingPageView
            onEnterApp={target => navigate(target || 'login')}
            onLogin={() => navigate('login')}
            theme={theme}
            setTheme={setTheme}
          />
        </FocusProvider>
      </WorkbenchDataProvider>
    );
  }

  // ── Login page ──
  if (view === 'login' || !isAuthenticated) {
    return (
      <WorkbenchDataProvider>
        <FocusProvider>
          <LoginView
            onLoginSuccess={handleLoginSuccess}
            onBackToLanding={() => navigate('landing')}
            theme={theme}
            setTheme={setTheme}
          />
        </FocusProvider>
      </WorkbenchDataProvider>
    );
  }

  // ── Authenticated app shell ──
  return (
    <WorkbenchDataProvider>
      <FocusProvider>
        <div className="app-shell">
          {/* ── Sidebar ── */}
          <aside className="app-sidebar">
            <button className="brand-logo-btn" onClick={() => navigate('overview')} aria-label="ForgeOps Energy home">
              <BrandMark />
              <span className="brand-title">ForgeOps<span>Energy</span></span>
            </button>

            {/* Plant Selector */}
            <div
              className="sidebar-plant"
              style={{ cursor: 'pointer', position: 'relative' }}
              onClick={() => setPlantDropdownOpen(!plantDropdownOpen)}
            >
              <span className="plant-avatar">{selectedPlant.charAt(0)}</span>
              <span>
                <strong>{selectedPlant}</strong>
                <small>Plant workspace &bull; {currentRole}</small>
              </span>
              <span className="plant-chevron"><ChevronSmall /></span>

              {plantDropdownOpen && (
                <div
                  className="card-clean"
                  style={{ position: 'absolute', top: '100%', left: 0, width: '100%', zIndex: 40, marginTop: '4px', padding: '6px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
                  onClick={e => e.stopPropagation()}
                >
                  {['Belgaum Foundry', 'Coimbatore Casting Hub', 'Pune Auto Forging'].map(p => (
                    <button
                      key={p}
                      className="sidebar-link"
                      style={{ padding: '6px 10px', fontSize: '11.5px', height: '32px' }}
                      onClick={() => { setSelectedPlant(p); setPlantDropdownOpen(false); }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Navigation */}
            <nav className="sidebar-navigation" aria-label="Main navigation">
              {navItem('overview', 'Overview', ZapIcon)}

              <p className="sidebar-section-label">OPERATIONS</p>
              {navItem('live-operations', 'Live Operations', ActivityIcon)}
              {navItem('opportunities', 'Opportunities', AlertTriangleIcon, 12)}
              {navItem('investigations', 'Investigations', CpuIcon, 3)}
              {navItem('actions', 'Actions', ClockIcon, 2)}

              <p className="sidebar-section-label">ASSETS</p>
              {navItem('assets', 'Asset Fleet', GaugeIcon, 6)}

              <p className="sidebar-section-label">ENERGY & CARBON</p>
              {navItem('energy', 'Energy & Carbon', BarChartIcon)}

              <p className="sidebar-section-label">VERIFICATION</p>
              {navItem('verification', 'Savings Verification', ShieldCheckIcon, 18)}

              <p className="sidebar-section-label">REPORTS</p>
              {navItem('reports', 'Reports & Dossiers', FileTextIcon)}

              <p className="sidebar-section-label">GOVERNANCE</p>
              {navItem('settings', 'Settings & Health', SettingsIcon)}
            </nav>

            <div className="sidebar-spacer" />

            {/* Ask ForgeOps */}
            <button
              className="sidebar-link copilot-link"
              onClick={() => setCommandPaletteOpen(true)}
              aria-label="Open Ask ForgeOps command palette"
            >
              <ActivityIcon size={16} />
              <span>Ask ForgeOps</span>
              <span className="copilot-shortcut">⌘ K</span>
            </button>

            {/* User profile */}
            <div style={{ position: 'relative' }}>
              <div
                className="sidebar-user"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                style={{ cursor: 'pointer' }}
                title="Account & role settings"
              >
                <span className="user-avatar">
                  <UserIcon size={14} />
                </span>
                <span>
                  <strong>{roleMeta.name}</strong>
                  <small>{currentRole}</small>
                </span>
                <button
                  aria-label="Account options"
                  className="user-menu-trigger-btn"
                  onClick={e => { e.stopPropagation(); setUserMenuOpen(!userMenuOpen); }}
                >
                  <MoreHorizontalIcon size={15} />
                </button>
              </div>

              {userMenuOpen && (
                <div className="user-menu-popover" onClick={e => e.stopPropagation()}>
                  {/* Current session info */}
                  <div className="user-menu-header">
                    <span className="user-menu-avatar-lg"><UserIcon size={16} /></span>
                    <div>
                      <strong>{roleMeta.name}</strong>
                      <small>{currentRole}</small>
                    </div>
                  </div>

                  <div className="user-menu-section-label">Switch role</div>

                  <button className="user-menu-item" onClick={() => { setCurrentRole('Plant Manager'); setUserMenuOpen(false); }}>
                    <UserIcon size={13} />
                    <span>Plant Manager <small>(Vishal)</small></span>
                    {currentRole === 'Plant Manager' && <span className="user-menu-active-dot" />}
                  </button>
                  <button className="user-menu-item" onClick={() => { setCurrentRole('Energy Manager'); setUserMenuOpen(false); }}>
                    <ZapIcon size={13} />
                    <span>Energy Manager <small>(Vaishak)</small></span>
                    {currentRole === 'Energy Manager' && <span className="user-menu-active-dot" />}
                  </button>
                  <button className="user-menu-item" onClick={() => { setCurrentRole('Maintenance Engineer'); setUserMenuOpen(false); }}>
                    <WrenchIcon size={13} />
                    <span>Maintenance Eng. <small>(Keerthi)</small></span>
                    {currentRole === 'Maintenance Engineer' && <span className="user-menu-active-dot" />}
                  </button>
                  <button className="user-menu-item" onClick={() => { setCurrentRole('Operator'); setUserMenuOpen(false); }}>
                    <UsersIcon size={13} />
                    <span>Operator <small>(Sham)</small></span>
                    {currentRole === 'Operator' && <span className="user-menu-active-dot" />}
                  </button>

                  <div className="user-menu-divider" />

                  <button className="user-menu-item" onClick={() => navigate('landing')}>
                    <GlobeIcon size={13} />
                    <span>Public Landing Page</span>
                  </button>
                  <button className="user-menu-item user-menu-item--danger" onClick={handleLogout}>
                    <LogOutIcon size={13} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </aside>

          {/* ── Main workspace ── */}
          <div className="workspace-column">
            <header className="app-header-modern">
              <div className="breadcrumbs">
                <span>{selectedPlant}</span>
                <span>/</span>
                <strong>{pageLabels[view]}</strong>
              </div>

              <button
                className="header-search-trigger"
                onClick={() => setCommandPaletteOpen(true)}
                title="Search plant objects or ask AI (⌘K)"
              >
                <SearchIcon size={14} />
                <span>Search assets, opportunities...</span>
                <span className="header-search-kbd">⌘K</span>
              </button>

              <div className="header-actions">
                <LiveDataLabel />

                <button
                  className="incident-alarm-pill"
                  onClick={() => navigate('opportunities')}
                  title="2 items need attention"
                >
                  <AlertTriangleIcon size={14} />
                  <span>2 alerts</span>
                </button>

                <ThemeToggle theme={theme} setTheme={setTheme} />

                <button
                  className="header-icon-btn"
                  onClick={() => setCommandPaletteOpen(true)}
                  title="Ask ForgeOps AI"
                >
                  <ActivityIcon size={15} style={{ color: '#bd6249' }} />
                </button>

                {/* Profile avatar — icon based */}
                <button
                  className="header-user-avatar"
                  title={`${roleMeta.name} · ${currentRole}`}
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <UserIcon size={14} />
                </button>
              </div>
            </header>

            <main className="workspace-main" key={view}>
              {view === 'overview'        && <OverviewView onNavigate={navigate} />}
              {view === 'live-operations' && <LiveOperationsView onNavigate={navigate} />}
              {view === 'opportunities'   && <OpportunitiesView onNavigate={navigate} selectedDetailId={detailId} />}
              {view === 'investigations'  && <InvestigationWorkspace investigationId={detailId || 'INV-1024'} onNavigate={navigate} />}
              {view === 'actions'         && <ActionsView onNavigate={navigate} selectedActionId={detailId || 'WO-ENG-7922'} />}
              {view === 'assets'          && <AssetsView onNavigate={navigate} selectedAssetId={detailId} />}
              {view === 'energy'          && <EnergyCarbonView onNavigate={navigate} />}
              {view === 'verification'    && <VerificationView onOpenWorkbench={() => navigate('investigations')} />}
              {view === 'reports'         && <ReportsView onNavigate={navigate} selectedReportId={detailId} />}
              {view === 'settings'        && <SettingsView currentRole={currentRole} onRoleChange={setCurrentRole} onNavigate={navigate} />}
            </main>
          </div>
        </div>

        <CommandPalette
          isOpen={commandPaletteOpen}
          onClose={() => setCommandPaletteOpen(false)}
          onNavigate={navigate}
        />
      </FocusProvider>
    </WorkbenchDataProvider>
  );
}

// Small inline chevron to avoid an extra import
function ChevronSmall() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export default App;
