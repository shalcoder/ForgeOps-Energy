import { useState } from 'react';
import { useFocusContext } from '../FocusContext';
import type { AssistantResponse } from '../types';
import { useWorkbenchData } from '../WorkbenchDataContext';
import { AssistantPanel } from './AssistantPanel';
import { EvidencePanel } from './EvidencePanel';
import { GraphPanel } from './GraphPanel';
import { RecommendationsPanel } from './RecommendationsPanel';
import { ReplayPanel } from './ReplayPanel';
import { SimulatorPanel } from './SimulatorPanel';
import { TimelinePanel } from './TimelinePanel';

export function Workbench({ onBack }: { onBack: () => void }) {
  const {
    focus,
    clearFocus,
    focusGraphNode,
    focusEvidenceRefs,
  } = useFocusContext();
  const { data, loading, refresh } = useWorkbenchData();
  const featuredIncident = data.incident;
  const [activeTab, setActiveTab] = useState<'investigate' | 'decide'>('investigate');
  const [agentResponse, setAgentResponse] = useState<AssistantResponse | null>(null);

  const scrollToPanel = (panelId: string) => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        document.getElementById(panelId)?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      });
    });
  };

  const openComparison = () => {
    setActiveTab('decide');
    scrollToPanel('scenario-comparison');
  };

  const openEvidence = () => {
    scrollToPanel('evidence-inspector');
  };

  const applyAgentActions = (actions: AssistantResponse['uiActions']) => {
    for (const action of actions) {
      if (action.action === 'HIGHLIGHT_NODE' && action.targetId) {
        const nodeId = action.targetId.startsWith('node_')
          ? action.targetId
          : `node_${action.targetId}`;
        focusGraphNode(nodeId, 'assistant');
      }
    }
  };

  return (
    <main className="workbench-page energy-workbench-page">
      <nav className="workbench-breadcrumb" aria-label="Breadcrumb">
        <button onClick={onBack}>← Back to Energy Dashboard</button>
        <span>/</span>
        <span>{featuredIncident.id}</span>
        <span>/</span>
        <strong>4-Agent Decision Workbench</strong>
      </nav>

      {/* Energy Incident Command Bar */}
      <section className="incident-command-bar energy-command-bar">
        <div className="incident-command-title">
          <span className="severity-label high">SEC Anomaly</span>
          <div>
            <h1>{featuredIncident.title} · {featuredIncident.batchId}</h1>
            <p>
              {featuredIncident.plant} · {featuredIncident.line} · SEC: <strong>{featuredIncident.baselineSec} → {featuredIncident.currentSec} {featuredIncident.secUnit}</strong>
              <span className="delta-pill-red">▲ {featuredIncident.secDeltaPct}%</span>
            </p>
          </div>
        </div>

        <div className="command-constraints-strip">
          <div className="constraint-badge-item">
            <span className="badge-bullet ok">✓</span>
            <div>
              <small>Throughput Constraint</small>
              <strong>10.2 ton/day (0% delta)</strong>
            </div>
          </div>
          <div className="constraint-badge-item">
            <span className="badge-bullet ok">✓</span>
            <div>
              <small>Quality Yield</small>
              <strong>97.6% (Preserved)</strong>
            </div>
          </div>
          <div className="constraint-badge-item">
            <span className="badge-bullet warning">⚠️</span>
            <div>
              <small>Air Pressure</small>
              <strong className="red-text">6.1 bar (-15.3%)</strong>
            </div>
          </div>
        </div>

        <div className="command-status">
          <div>
            <span>Harness Status</span>
            <strong><i className="dot live-green" /> 4 Agents Active</strong>
          </div>
          <div>
            <span>Active Focus</span>
            <strong>{focus.aiLabel ?? (focus.pinned ? 'Pinned moment' : focus.eventId ?? 'Line 2 Anomaly')}</strong>
          </div>
          <button className="icon-button" onClick={clearFocus} title="Reset focus" aria-label="Reset workbench focus">↺</button>
          <button className="icon-button" onClick={() => void refresh()} title="Refresh MCP telemetry" aria-label="Refresh MCP telemetry">↻</button>
        </div>
      </section>

      {/* 4-Agent Pipeline Status Bar */}
      <section className="four-agent-stepper-bar">
        <div className="stepper-track">
          <div className="step-node complete">
            <span className="node-circle">1</span>
            <div className="node-info">
              <strong>Planner Agent</strong>
              <small>Formulated: min(SEC)</small>
            </div>
          </div>
          <span className="step-connector active" />
          <div className="step-node complete">
            <span className="node-circle">2</span>
            <div className="node-info">
              <strong>Research Agent</strong>
              <small>Retrieved: 5 Telemetry Records</small>
            </div>
          </div>
          <span className="step-connector active" />
          <div className="step-node complete">
            <span className="node-circle">3</span>
            <div className="node-info">
              <strong>Analysis Agent</strong>
              <small>Isolated: Line 2 Leakage (93%)</small>
            </div>
          </div>
          <span className="step-connector active" />
          <div className="step-node complete execution-step">
            <span className="node-circle">4</span>
            <div className="node-info">
              <strong>Execution Agent</strong>
              <small>What-If Sim: Option C (-18%)</small>
            </div>
          </div>
        </div>
      </section>

      {/* Tab Switcher */}
      <div className="workbench-tabs" role="tablist" aria-label="Workbench mode">
        <div className="workbench-tab-switcher">
          <button className={activeTab === 'investigate' ? 'active' : ''} onClick={() => setActiveTab('investigate')}>
            01 · Root Cause Investigation
          </button>
          <button className={activeTab === 'decide' ? 'active' : ''} onClick={() => setActiveTab('decide')}>
            02 · What-If Simulation & Decision
          </button>
        </div>
        <span className={`contract-badge${data.live ? ' live' : ''}`}>
          {loading ? 'Loading MCP telemetry…' : data.live ? 'Live NitroCloud MCP data' : 'Edge Gateway (Fallback Active)'}
        </span>
      </div>

      {/* Workbench Content */}
      <div className="workbench-with-assistant">
        <div className="workbench-main">
          {activeTab === 'investigate' ? (
            <>
              <TimelinePanel />
              <div className="analysis-grid">
                <ReplayPanel />
                <GraphPanel />
              </div>
              <EvidencePanel />
            </>
          ) : (
            <>
              <SimulatorPanel />
              <RecommendationsPanel agentResponse={agentResponse} />
            </>
          )}
        </div>
        <div hidden={activeTab !== 'investigate'}>
          <AssistantPanel
            onOpenDecision={openComparison}
            onFocusEvidence={openEvidence}
            onAgentActions={applyAgentActions}
            onResponse={(response) => {
              setAgentResponse(response);
              focusEvidenceRefs(response.evidenceRefs, response.conclusion);
            }}
          />
        </div>
      </div>
    </main>
  );
}
