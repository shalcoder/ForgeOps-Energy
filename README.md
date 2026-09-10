# ForgeOps Energy
### Agentic AI for Industrial Energy & Process Efficiency
> **Reduce Energy. Improve Efficiency. Decarbonise. Stay Competitive.**  
> *Targeted for Indian Manufacturing SMEs · Smart Manufacturing Challenge 04*

---

## 1. Executive Summary

**ForgeOps Energy** is a vendor-neutral agentic AI decision-intelligence layer that sits above existing factory infrastructure—Schneider, Siemens, ABB, or legacy equipment—to continuously identify why energy consumption is inefficient, quantify the production and economic impact of possible interventions, and recommend the lowest-cost actions that reduce Specific Energy Consumption (kWh/unit or kWh/ton) without sacrificing throughput, quality, or safety.

- **Core Formula:**
  $$\min \text{SEC} = \min \left( \frac{\text{kWh}}{\text{Good Output}} \right)$$
- **Hard Operational Constraints:**
  $$\text{Throughput} \ge \text{Baseline}, \quad \text{Quality} \ge \text{Baseline}, \quad \text{Safety} = \text{Preserved}$$
- **Key Metric Improvement:**
  $$\text{SEC}_{\text{improvement}} = \frac{\text{SEC}_{\text{baseline}} - \text{SEC}_{\text{optimized}}}{\text{SEC}_{\text{baseline}}} \times 100$$

---

## 2. The Indian SME Problem & Opportunity

Indian manufacturing SMEs are the backbone of industrial output, yet face acute structural energy challenges:
- **35–40%** of India's total energy is consumed by industry.
- **15–30%** of SME manufacturing production costs come from energy.
- **Over 70%** of SMEs operate with fragmented instrumentation, no submetering, and zero real-time correlation between energy bills and batch production records.
- **BEE ADEETIE Alignment:** The Bureau of Energy Efficiency (BEE) ADEETIE scheme (*Assistance in Deploying Energy Efficient Technologies in Industries & Establishments*) targets **60 energy-intensive clusters across 14 sectors** (Foundries, Forging, Ceramics, Textiles, Food Processing, Chemicals). ForgeOps Energy serves as the digital decision layer for investment-grade energy audits (IGEA) and bankable Detailed Project Reports (DPR).

---

## 3. The 4-Agent Architecture

ForgeOps Energy is strictly engineered as a **4-agent architecture** (Optimization is an integral capability of the Execution Agent, keeping the pipeline lean and deterministic):

```
┌─────────────────────────────────────────────────────────────┐
│                    EXISTING FACTORY FLOOR                   │
│  Energy Meters (Modbus) · Sensors · PLC/SCADA · MES · CMMS  │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                  INDUSTRIAL EDGE GATEWAY                    │
│    Modbus RTU/TCP · OPC-UA · MQTT · Local Ring Buffer       │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                     ENERGY DATA PLATFORM                    │
│    Time Series DB · Data Lake · Asset Context · Streaming   │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│               FORGEOPS ENERGY ENGINE (4 AGENTS)             │
├─────────────────────────────────────────────────────────────┤
│  1. PLANNER AGENT                                           │
│     • Formulates: min(SEC = kWh/ton)                        │
│     • Enforces constraints: Throughput, Quality, Safety     │
│     • Directs MCP tool selection                            │
├─────────────────────────────────────────────────────────────┤
│  2. RESEARCH AGENT                                          │
│     • Retrieves telemetry via ForgeOps MCP tools            │
│     • Queries energy submeters, pressure SCADA, CMMS logs   │
│     • Constructs cryptographically grounded evidence bundle │
├─────────────────────────────────────────────────────────────┤
│  3. ANALYSIS AGENT                                          │
│     • Detects anomalies (+14.3% SEC spike)                  │
│     • Correlates pressure drop (6.1 bar) with motor current │
│     • Builds causal inference graph & isolates root cause   │
├─────────────────────────────────────────────────────────────┤
│  4. EXECUTION AGENT (Includes Scenario Optimization)        │
│     • Simulates interventions (A: Leak, B: Setpoint, C: Both)│
│     • Pareto tradeoff optimization (SEC, Cost, Downtime)    │
│     • Quantifies ROI, Payback (1.5 mo), and CO₂ abatement   │
│     • Generates actionable recommendation for human signoff │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                  HUMAN APPROVAL GATEWAY                     │
│        [Approve Intervention]  ·  [Reject]  ·  [Simulate]   │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│             VERIFICATION FEEDBACK LOOP                      │
│        Edge Gateway measures actual post-repair drop        │
│        SEC: 11.2 → 9.2 kWh/ton (-18%) · Impact Verified     │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Realistic User Story: Belgaum Foundry SME

| Stage | Time | Event | Telemetry & Evidence | Decision Outcome |
|---|---|---|---|---|
| **1. Anomaly Detected** | 08:30 AM | SEC Spikes +14.3% | SEC rises from 9.8 to 11.2 kWh/ton on Line 2 | Throughput (10.2t) and quality (97.6%) stable; flag non-productive waste |
| **2. Root Cause Analysis** | 08:33 AM | ForgeOps isolates leak | Air pressure drops 7.2 → 6.1 bar; compressor modulation +21%; motor current 142A (+12%); 3 recurring CMMS leak logs | Root cause: Line 2 distribution manifold leak (93% confidence) |
| **3. What-If Simulation** | 08:35 AM | Multi-scenario evaluation | Simulates Options A, B, C, D | Option C (Repair + Setpoint 6.5 bar) identified as Pareto optimal |
| **4. Recommendation** | 08:35 AM | Human approval requested | Cost ₹9,500; Downtime 48 min during changeover; Payback 1.5 months | Plant Supervisor approves; CMMS Work Order WO-ENG-8821 dispatched |
| **5. Verification** | 11:30 AM | Impact verified | Post-repair SEC drops to 9.2 kWh/ton (-18.0%); Throughput 10.2t (0% loss); Quality 97.8% (+0.2%) | **1,840 kWh/day (₹6,240/day) saved. Case closed.** |

---

## 5. Value Proposition to Indian SMEs

- **8–20% Reduction** in Specific Energy Consumption (SEC).
- **10–15% Reduction** in total monthly energy billing.
- **5–15% Reduction** in Scope 1 & 2 carbon emissions.
- **1–3 Months** typical CapEx payback period.
- **Low-Cost Hardware Retrofit:** ₹20,000 – ₹60,000 for plug-and-play DIN-rail edge gateway and submeters.
- **Zero Production Disruption:** Interventions synchronized with scheduled tooling changeovers.

---

## 6. Repository Structure

```
E:\ForgeOps-Energy\
├── backend/                  # FastAPI 4-agent orchestration engine
│   ├── agents/
│   │   ├── planner/          # Agent 1: Goal & boundary constraints
│   │   ├── research/         # Agent 2: MCP multi-domain evidence fetcher
│   │   ├── analysis/         # Agent 3: Causal root cause analyzer
│   │   └── execution/        # Agent 4: What-if simulator & optimizer
│   ├── api/                  # REST endpoints (/simulate, /pipeline, /workbench)
│   └── schemas/              # Pydantic v2 data models
├── forgeops-mcp/             # Official NitroStack MCP server
│   └── src/modules/
│       ├── energy/           # Energy telemetry, pneumatics & SEC tools
│       ├── mes/              # Batch production & tonnage tools
│       ├── maintenance/      # CMMS work order history
│       ├── quality/          # Defect & yield records
│       └── simulation/       # Physics counterfactual engine
├── src/                      # React 18 + Vite frontend
│   ├── modules/
│   │   ├── HomeDashboard.tsx          # ⚡ Energy Overview & Anomalies
│   │   ├── Workbench.tsx              # 🤖 4-Agent Decision Workbench
│   │   ├── FoundryUserStoryView.tsx   # 🏭 Realistic SME Journey
│   │   ├── ArchitectureView.tsx       # 🏗️ Technical Architecture Explorer
│   │   ├── SmeEconomicsView.tsx       # 📊 SME ROI & BEE ADEETIE Calculator
│   │   ├── SimulatorPanel.tsx         # What-If interactive sliders
│   │   ├── RecommendationsPanel.tsx   # Operator approval gate
│   │   └── AssistantPanel.tsx         # 4-Agent live trace & chat
│   ├── mockData.ts           # Industrial telemetry dataset
│   └── energy-styles.css     # Premium industrial dark design system
└── index.html                # Entry point with SEO metadata
```

---

## 7. Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+

### Local Frontend Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev
# Open http://localhost:5173/ in your browser
```

### Production Build
```bash
npm run build
npm run preview
```

### Run Backend Agentic Pipeline
```bash
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

---

## 8. Deployment

The ForgeOps Energy frontend is production-ready for deployment on **Vercel** with full client-side edge fallback capabilities.
