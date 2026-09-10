import { useState } from 'react';

type ArchitectureLayer = 'sources' | 'edge' | 'platform' | 'agents' | 'mcp' | 'actions';

export function ArchitectureView({ onOpenWorkbench }: { onOpenWorkbench: () => void }) {
  const [selectedLayer, setSelectedLayer] = useState<ArchitectureLayer>('agents');
  const [activeAgent, setActiveAgent] = useState<'planner' | 'research' | 'analysis' | 'execution'>('execution');

  return (
    <main className="architecture-page">
      {/* Header */}
      <section className="architecture-header">
        <div className="badge-pill energy-pill">System Architecture</div>
        <h1>ForgeOps Energy Technical Architecture</h1>
        <p className="subtitle">
          A vendor-neutral agentic AI decision-intelligence layer sitting above existing factory infrastructure—Schneider, Siemens, ABB, or legacy machines.
        </p>
        <div className="arch-kicker-bar">
          <span>Formula: <strong>min(SEC = kWh / Good Output)</strong></span>
          <span>Constraints: <strong>Throughput ≥ Baseline · Quality ≥ Baseline · Safety = Preserved</strong></span>
          <span className="badge-tag">Strict 4-Agent Pipeline</span>
        </div>
      </section>

      {/* Layer Selector Bar */}
      <div className="arch-layer-selector">
        <button
          className={`layer-tab ${selectedLayer === 'sources' ? 'active' : ''}`}
          onClick={() => setSelectedLayer('sources')}
        >
          1. Data Sources
        </button>
        <button
          className={`layer-tab ${selectedLayer === 'edge' ? 'active' : ''}`}
          onClick={() => setSelectedLayer('edge')}
        >
          2. Edge Gateway
        </button>
        <button
          className={`layer-tab ${selectedLayer === 'platform' ? 'active' : ''}`}
          onClick={() => setSelectedLayer('platform')}
        >
          3. Data Platform
        </button>
        <button
          className={`layer-tab ${selectedLayer === 'agents' ? 'active' : ''}`}
          onClick={() => setSelectedLayer('agents')}
        >
          4. 4-Agent Engine
        </button>
        <button
          className={`layer-tab ${selectedLayer === 'mcp' ? 'active' : ''}`}
          onClick={() => setSelectedLayer('mcp')}
        >
          5. MCP Tool Layer
        </button>
        <button
          className={`layer-tab ${selectedLayer === 'actions' ? 'active' : ''}`}
          onClick={() => setSelectedLayer('actions')}
        >
          6. Action & Integration
        </button>
      </div>

      {/* Full Visual Diagram (Matching Image 2 Top Section) */}
      <div className="architecture-diagram-container">
        {/* Layer 1: Data Sources */}
        <div className={`arch-box layer-sources ${selectedLayer === 'sources' ? 'highlighted' : ''}`}>
          <div className="arch-box-title">
            <strong>DATA SOURCES</strong>
            <small>Factory Floor Assets</small>
          </div>
          <div className="arch-items-list">
            <div className="arch-subitem">
              <span className="subitem-icon">⚡</span>
              <div>
                <strong>Energy Meters</strong>
                <small>kWh, V, I, PF, Harmonics</small>
              </div>
            </div>
            <div className="arch-subitem">
              <span className="subitem-icon">📡</span>
              <div>
                <strong>Machine Sensors</strong>
                <small>Pressure, Temp, Acoustic, Vib</small>
              </div>
            </div>
            <div className="arch-subitem">
              <span className="subitem-icon">🎛️</span>
              <div>
                <strong>PLC / SCADA</strong>
                <small>Schneider, Siemens, ABB, Delta</small>
              </div>
            </div>
            <div className="arch-subitem">
              <span className="subitem-icon">📋</span>
              <div>
                <strong>MES / Production</strong>
                <small>Batch weights, counts, cycle times</small>
              </div>
            </div>
            <div className="arch-subitem">
              <span className="subitem-icon">🔧</span>
              <div>
                <strong>Maintenance (CMMS)</strong>
                <small>Work orders, downtime history</small>
              </div>
            </div>
            <div className="arch-subitem">
              <span className="subitem-icon">🔬</span>
              <div>
                <strong>Quality System</strong>
                <small>Defect logs, scrap & rework rates</small>
              </div>
            </div>
            <div className="arch-subitem">
              <span className="subitem-icon">☀️</span>
              <div>
                <strong>Tariff & Utility</strong>
                <small>Time-of-day tariffs, Solar generation</small>
              </div>
            </div>
          </div>
        </div>

        <div className="arch-arrow">→</div>

        {/* Layer 2: Industrial Edge Gateway */}
        <div className={`arch-box layer-edge ${selectedLayer === 'edge' ? 'highlighted' : ''}`}>
          <div className="arch-box-title">
            <strong>EDGE GATEWAY</strong>
            <small>Collect · Filter · Buffer</small>
          </div>
          <div className="edge-hardware-visual">
            <div className="gateway-box-art">
              <div className="antenna" />
              <div className="antenna" />
              <div className="device-body">
                <span className="led green" />
                <span className="led blue" />
                <span className="led amber" />
              </div>
            </div>
            <span className="device-label">DIN-Rail Linux Micro-Gateway</span>
          </div>
          <div className="arch-bullet-list">
            <div><strong>Protocols:</strong> Modbus RTU/TCP, OPC-UA, MQTT, S7</div>
            <div><strong>Processing:</strong> Edge filtering, anomaly pre-screening</div>
            <div><strong>Storage:</strong> Local ring buffer (Offline ready)</div>
            <div><strong>Security:</strong> Mutual TLS, Device X.509 certs</div>
          </div>
        </div>

        <div className="arch-arrow">→</div>

        {/* Layer 3: Energy Data Platform */}
        <div className={`arch-box layer-platform ${selectedLayer === 'platform' ? 'highlighted' : ''}`}>
          <div className="arch-box-title">
            <strong>DATA PLATFORM</strong>
            <small>Store · Process · Contextualize</small>
          </div>
          <div className="arch-subitem-stack">
            <div className="arch-stack-chip">
              <span className="chip-ico">🗄️</span>
              <div><strong>Time Series DB</strong><small>High-frequency kW, pressure, current</small></div>
            </div>
            <div className="arch-stack-chip">
              <span className="chip-ico">🌊</span>
              <div><strong>Data Lake</strong><small>Raw telemetry, alerts & audio blobs</small></div>
            </div>
            <div className="arch-stack-chip">
              <span className="chip-ico">📐</span>
              <div><strong>Metadata & Models</strong><small>Equipment specs & baseline SEC envelopes</small></div>
            </div>
            <div className="arch-stack-chip">
              <span className="chip-ico">🌐</span>
              <div><strong>Unified Asset Context</strong><small>Machines, lines, shifts & operator tags</small></div>
            </div>
            <div className="arch-stack-chip">
              <span className="chip-ico">⏱</span>
              <div><strong>Streaming Engine</strong><small>Real-time SEC event processing</small></div>
            </div>
          </div>
        </div>

        <div className="arch-arrow">→</div>

        {/* Layer 4: ForgeOps Energy Engine (4-AGENT PIPELINE) */}
        <div className={`arch-box layer-agents ${selectedLayer === 'agents' ? 'highlighted' : ''}`}>
          <div className="arch-box-title agent-engine-title">
            <div>
              <strong>FORGEOPS ENERGY ENGINE</strong>
              <small>Agentic AI Orchestrator (4-Agent Pipeline)</small>
            </div>
            <span className="badge-4agents">Strict 4 Agents</span>
          </div>

          <div className="agent-pipeline-grid">
            {/* 1. Planner Agent */}
            <div
              className={`agent-card-mini ${activeAgent === 'planner' ? 'selected' : ''}`}
              onClick={() => setActiveAgent('planner')}
            >
              <div className="agent-num">1</div>
              <div className="agent-icon-wrap">📋</div>
              <strong>PLANNER AGENT</strong>
              <p className="agent-role-summary">
                Understands objective (min SEC), sets constraints (Throughput, Quality, Safety, Cost), and formulates tool execution strategy.
              </p>
              <div className="agent-tags">
                <span>Objective Formulation</span>
                <span>Boundary Constraints</span>
              </div>
            </div>

            {/* 2. Research Agent */}
            <div
              className={`agent-card-mini ${activeAgent === 'research' ? 'selected' : ''}`}
              onClick={() => setActiveAgent('research')}
            >
              <div className="agent-num">2</div>
              <div className="agent-icon-wrap">🔍</div>
              <strong>RESEARCH AGENT</strong>
              <p className="agent-role-summary">
                Fetches telemetry, sensor trends, CMMS work orders, quality records, and tariffs via controlled MCP tool calls.
              </p>
              <div className="agent-tags">
                <span>MCP Data Gathering</span>
                <span>Evidence Bundles</span>
              </div>
            </div>

            {/* 3. Analysis Agent */}
            <div
              className={`agent-card-mini ${activeAgent === 'analysis' ? 'selected' : ''}`}
              onClick={() => setActiveAgent('analysis')}
            >
              <div className="agent-num">3</div>
              <div className="agent-icon-wrap">🧠</div>
              <strong>ANALYSIS AGENT</strong>
              <p className="agent-role-summary">
                Detects SEC anomalies, correlates pressure drop with compressor runtime surge, builds causal graph, and establishes root cause.
              </p>
              <div className="agent-tags">
                <span>SEC Calculation</span>
                <span>Causal Inference</span>
              </div>
            </div>

            {/* 4. Execution Agent */}
            <div
              className={`agent-card-mini ${activeAgent === 'execution' ? 'selected' : ''}`}
              onClick={() => setActiveAgent('execution')}
            >
              <div className="agent-num">4</div>
              <div className="agent-icon-wrap">🚀</div>
              <strong>EXECUTION AGENT</strong>
              <div className="sub-role-badge">Contains Optimization Engine</div>
              <p className="agent-role-summary">
                Runs what-if simulations, compares interventions (cost, downtime, ROI), calculates CO₂ impact, and generates actionable recommendation.
              </p>
              <div className="agent-tags">
                <span>What-If Simulation</span>
                <span>ROI & Payback</span>
                <span>Recommendation</span>
              </div>
            </div>
          </div>

          {/* MCP Tool Layer Attached to Agents */}
          <div className="mcp-sublayer">
            <div className="mcp-sublayer-header">
              <span>FORGEOPS MCP TOOL LAYER (Controlled Manufacturing & Energy Tools)</span>
            </div>
            <div className="mcp-tools-strip">
              <span className="mcp-pill">⚡ Energy Tools</span>
              <span className="mcp-pill">📋 MES Tools</span>
              <span className="mcp-pill">🔧 Maintenance Tools</span>
              <span className="mcp-pill">🔬 Quality Tools</span>
              <span className="mcp-pill">🎲 Simulation Tools</span>
              <span className="mcp-pill">🌿 Tariff & Carbon Tools</span>
              <span className="mcp-pill">📄 Document / SOP Tools</span>
            </div>
          </div>
        </div>

        <div className="arch-arrow">→</div>

        {/* Layer 5: Action & Integration */}
        <div className={`arch-box layer-actions ${selectedLayer === 'actions' ? 'highlighted' : ''}`}>
          <div className="arch-box-title">
            <strong>ACTION & INTEGRATION</strong>
            <small>Human Decision & Plant Execution</small>
          </div>
          <div className="arch-items-list">
            <div className="arch-subitem">
              <span className="subitem-icon">🖥️</span>
              <div>
                <strong>Operator Dashboard</strong>
                <small>Real-time SEC gauges, anomalies, recommendations</small>
              </div>
            </div>
            <div className="arch-subitem">
              <span className="subitem-icon">🚨</span>
              <div>
                <strong>Alerts & Notifications</strong>
                <small>SMS, WhatsApp, Email, Plant sirens</small>
              </div>
            </div>
            <div className="arch-subitem">
              <span className="subitem-icon">🔄</span>
              <div>
                <strong>ERP / MES Integration</strong>
                <small>SAP, Oracle, local SME ERP dispatch</small>
              </div>
            </div>
            <div className="arch-subitem">
              <span className="subitem-icon">📝</span>
              <div>
                <strong>Work Orders (CMMS)</strong>
                <small>Automated maintenance dispatch</small>
              </div>
            </div>
            <div className="arch-subitem">
              <span className="subitem-icon">📊</span>
              <div>
                <strong>Reports & Compliance</strong>
                <small>BEE PAT / ADEETIE audit dossiers</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Closed-Loop Verification Feedback Banner */}
      <div className="feedback-loop-banner">
        <div className="loop-icon">🔁</div>
        <div>
          <strong>CLOSED-LOOP FEEDBACK: Verify → Learn → Improve</strong>
          <p>
            When an operator approves an intervention, ForgeOps Energy tracks post-implementation telemetry at the Edge to verify actual kWh reduction. Results update baseline envelopes and reinforce agent reasoning models.
          </p>
        </div>
        <button className="btn-primary-compact" onClick={onOpenWorkbench}>
          Open Live 4-Agent Workbench →
        </button>
      </div>
    </main>
  );
}
