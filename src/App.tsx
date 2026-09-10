import { useCallback, useState } from 'react';
import { FocusProvider } from './FocusContext';
import { WorkbenchDataProvider, useWorkbenchData } from './WorkbenchDataContext';
import { LaunchIntro } from './LaunchIntro';
import { HomeDashboard } from './modules/HomeDashboard';
import { Workbench } from './modules/Workbench';
import { FoundryUserStoryView } from './modules/FoundryUserStoryView';
import { ArchitectureView } from './modules/ArchitectureView';
import { SmeEconomicsView } from './modules/SmeEconomicsView';

export type AppView = 'dashboard' | 'workbench' | 'journey' | 'architecture' | 'economics';

function BrandMark() {
  return (
    <div className="brand-mark energy-brand-mark" aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
  );
}

function App() {
  const [view, setView] = useState<AppView>('dashboard');
  const [showIntro, setShowIntro] = useState(true);
  const completeIntro = useCallback(() => setShowIntro(false), []);

  return (
    <WorkbenchDataProvider>
      <FocusProvider>
        <div className="app-shell">
          {showIntro && <LaunchIntro onComplete={completeIntro} />}
          <header className="app-header">
            <div className="header-left">
              <button className="brand-button" onClick={() => setView('dashboard')} aria-label="Go to ForgeOps Energy dashboard">
                <BrandMark />
                <span>
                  <strong>FORGE<span>OPS</span> <span className="energy-text">ENERGY</span></strong>
                  <small>Agentic AI Decision Intelligence</small>
                </span>
              </button>

              <nav className="header-nav" aria-label="Primary Navigation">
                <button
                  className={`nav-link ${view === 'dashboard' ? 'active' : ''}`}
                  onClick={() => setView('dashboard')}
                >
                  ⚡ Energy Overview
                </button>
                <button
                  className={`nav-link ${view === 'workbench' ? 'active' : ''}`}
                  onClick={() => setView('workbench')}
                >
                  🤖 4-Agent Workbench
                </button>
                <button
                  className={`nav-link ${view === 'journey' ? 'active' : ''}`}
                  onClick={() => setView('journey')}
                >
                  🏭 Foundry SME Journey
                </button>
                <button
                  className={`nav-link ${view === 'architecture' ? 'active' : ''}`}
                  onClick={() => setView('architecture')}
                >
                  🏗️ Architecture & MCP
                </button>
                <button
                  className={`nav-link ${view === 'economics' ? 'active' : ''}`}
                  onClick={() => setView('economics')}
                >
                  📊 SME Economics (BEE)
                </button>
              </nav>
            </div>

            <div className="header-context">
              <LiveDataLabel />
              <span className="header-divider" />
              <span className="shift-label">INC-ENG-2401 · SEC +14.3%</span>
              <span className="avatar-button" title="Signed in as Vaishak (Plant Energy Auditor)" aria-label="Signed in as Vaishak">VK</span>
            </div>
          </header>

          {view === 'dashboard' && <HomeDashboard onOpenWorkbench={() => setView('workbench')} />}
          {view === 'workbench' && <Workbench onBack={() => setView('dashboard')} />}
          {view === 'journey' && <FoundryUserStoryView onSwitchToWorkbench={() => setView('workbench')} />}
          {view === 'architecture' && <ArchitectureView onOpenWorkbench={() => setView('workbench')} />}
          {view === 'economics' && <SmeEconomicsView onOpenWorkbench={() => setView('workbench')} />}
        </div>
      </FocusProvider>
    </WorkbenchDataProvider>
  );
}

function LiveDataLabel() {
  const { data, loading } = useWorkbenchData();
  return (
    <span className="live-indicator">
      <i /> {data.incident.plant} · {loading
        ? 'Connecting to MCP'
        : data.live
          ? 'Live NitroCloud MCP'
          : 'Edge Gateway (Fallback Active)'}
    </span>
  );
}

export default App;
