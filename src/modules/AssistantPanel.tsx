import { FormEvent, useEffect, useState } from 'react';
import { useFocusContext } from '../FocusContext';
import {
  askAgent,
  getRuntimeStatus,
  type RuntimeStatus,
} from '../integrations/forgeOpsClient';
import type { AssistantResponse, LoadState } from '../types';
import { useWorkbenchData } from '../WorkbenchDataContext';
import { agentTraceSteps } from '../mockData';

const energyPrompts = [
  {
    key: 'why-sec',
    label: 'Why did SEC increase today?',
    query: 'Why did our Specific Energy Consumption increase by 14.3% in the last 6 hours?',
  },
  {
    key: 'evidence',
    label: 'Show root cause evidence',
    query: 'Show me the evidence connecting air pressure drop, compressor runtime, and SEC surge.',
  },
  {
    key: 'compressor',
    label: 'Explain compressor overcycling',
    query: 'Why did the 75 kW screw compressor jump to 88% on-load runtime and draw 142A current?',
  },
  {
    key: 'compare',
    label: 'Compare 4 interventions',
    query: 'Compare repairing leakage, setpoint optimization to 6.5 bar, both combined, and doing nothing.',
  },
  {
    key: 'report',
    label: 'Generate BEE energy brief',
    query: 'Generate an executive decision brief aligned with BEE energy audit standards.',
  },
  {
    key: 'risk',
    label: 'Assess status quo risk',
    query: 'What happens if we take no action and allow the Line 2 leak to continue?',
  },
  {
    key: 'production',
    label: 'Verify throughput & quality',
    query: 'Prove that throughput and quality were unaffected during this energy excursion.',
  },
  {
    key: 'verify',
    label: 'Verify post-repair impact',
    query: 'What are the verified post-intervention savings and payback timeline?',
  },
];

type AssistantPanelProps = {
  onOpenDecision: () => void;
  onFocusEvidence: () => void;
  onAgentActions: (actions: AssistantResponse['uiActions']) => void;
  onResponse: (response: AssistantResponse) => void;
};

export function AssistantPanel({
  onOpenDecision,
  onFocusEvidence,
  onAgentActions,
  onResponse,
}: AssistantPanelProps) {
  const { focus, focusEvidenceRefs } = useFocusContext();
  const { applyAgentData } = useWorkbenchData();
  const [status, setStatus] = useState<LoadState>('idle');
  const [response, setResponse] = useState<AssistantResponse | null>(null);
  const [question, setQuestion] = useState('');
  const [draft, setDraft] = useState('');
  const [traceOpen, setTraceOpen] = useState(true);
  const [reportOpen, setReportOpen] = useState(false);
  const [runtime, setRuntime] = useState<RuntimeStatus | null>(null);

  useEffect(() => {
    let active = true;
    getRuntimeStatus().then((result) => {
      if (active) setRuntime(result);
    });
    return () => {
      active = false;
    };
  }, []);

  const runQuery = async (rawQuery: string) => {
    const query = rawQuery.trim();
    if (!query || status === 'loading') return;
    setQuestion(query);
    setDraft('');
    setStatus('loading');
    const result = await askAgent(query);
    setResponse(result);
    setStatus('success');
    applyAgentData(result.workbenchData);
    onResponse(result);
    onAgentActions(result.uiActions);
    if (result.generatedReports.length > 0) {
      setReportOpen(true);
    }
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void runQuery(draft);
  };

  return (
    <aside className="assistant-panel energy-assistant-panel" aria-label="Agentic AI Assistant">
      <header className="assistant-header">
        <div>
          <div className="assistant-kicker">Agentic AI Engine</div>
          <h2>ForgeOps Assistant</h2>
        </div>
        <span className="harness-badge">
          <i /> 4-Agent Pipeline
        </span>
      </header>

      {/* Suggested Prompt Chips */}
      <div className="prompt-chips-container" role="list">
        {energyPrompts.map((p) => (
          <button
            key={p.key}
            className="prompt-chip"
            onClick={() => void runQuery(p.query)}
            disabled={status === 'loading'}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* 4-Agent Harness Live Trace Viewer */}
      <div className="agent-harness-trace-card">
        <div className="trace-header-row" onClick={() => setTraceOpen(!traceOpen)}>
          <div className="trace-title">
            <span className="pulse-dot" />
            <strong>4-Agent Execution Trace</strong>
          </div>
          <span className="trace-toggle-btn">{traceOpen ? 'Hide ▲' : 'Show ▼'}</span>
        </div>

        {traceOpen && (
          <div className="trace-steps-stack">
            {agentTraceSteps.map((step) => (
              <div key={step.agent} className="trace-step-item">
                <div className="step-topline">
                  <span className="step-agent-name">{step.agentTitle}</span>
                  <span className="step-duration">{step.durationMs} ms</span>
                </div>
                <p className="step-summary-text">{step.summary}</p>
                <div className="step-chips-row">
                  {step.keyOutputs?.map((out, i) => (
                    <span key={i} className="output-chip">{out}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Conversation / Response Area */}
      <div className="assistant-response-area">
        {status === 'loading' && (
          <div className="agent-thinking-state">
            <div className="thinking-spinner" />
            <p>Orchestrating Planner, Research, Analysis, and Execution agents via MCP…</p>
          </div>
        )}

        {response && status !== 'loading' && (
          <div className="agent-answer-box">
            <div className="answer-query">Q: {question}</div>
            <div className="answer-conclusion">
              <strong>Diagnosis:</strong>
              <p>{response.conclusion}</p>
            </div>
            <div className="answer-effect">
              <strong>Quantified Impact:</strong>
              <p>{response.effect}</p>
            </div>

            {response.generatedReports.length > 0 && (
              <div className="report-expander">
                <button
                  className="btn-view-report"
                  onClick={() => setReportOpen(!reportOpen)}
                >
                  {reportOpen ? 'Hide Executive Brief ▲' : 'View Generated BEE Audit Brief ▼'}
                </button>
                {reportOpen && (
                  <div className="report-markdown-view">
                    <pre>{response.generatedReports[0].markdown}</pre>
                  </div>
                )}
              </div>
            )}

            <div className="answer-actions-bar">
              <button className="btn-assistant-action" onClick={onOpenDecision}>
                Simulate Interventions →
              </button>
              <button className="btn-assistant-action secondary" onClick={onFocusEvidence}>
                Inspect Sensor Evidence →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Query Input Box */}
      <form onSubmit={onSubmit} className="assistant-input-form">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Ask ForgeOps (e.g. Why did SEC increase?)"
          className="assistant-text-input"
        />
        <button type="submit" disabled={!draft.trim() || status === 'loading'} className="btn-send-query">
          Send ↵
        </button>
      </form>
    </aside>
  );
}
