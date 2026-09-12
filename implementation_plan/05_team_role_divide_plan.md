# ForgeOps Energy — Team Role Division & Implementation Plan

> **Document ID:** `05_team_role_divide_plan.md`  
> **Target Audience:** Engineering Team (Dev 1: Keerthi, Dev 2: Vaishak, Dev 3: Sham, Dev 4: Vishal)  
> **Product:** ForgeOps Energy — Agentic Industrial Decision-Intelligence Platform for Manufacturing SMEs  

---

## 1. Executive Team Topology & Ownership

ForgeOps Energy is structured as a tightly decoupled, high-velocity multi-stack platform. The 4-developer engineering team is divided across clear architectural boundaries to eliminate merge conflicts, enable parallel feature velocity, and maintain mathematical and operational determinism.

```text
┌────────────────────────────────────────────────────────────────────────┐
│                   DEV 4: VISHAL (ARCHITECT & SYSTEMS LEAD)             │
│         Architecture · System Integration · Git Flow · Release         │
└───────┬──────────────────────────┬──────────────────────────┬──────────┘
        │                          │                          │
        ▼                          ▼                          ▼
┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│  DEV 1: KEERTHI  │      │  DEV 2: VAISHAK  │      │   DEV 3: SHAM    │
│  Agentic Backend │      │     Frontend     │      │ Physics, Sim &   │
│   & MCP Engine   │      │   & Operator UX  │      │  Energy Econ     │
│                  │      │                  │      │                  │
│ • FastAPI Agents │      │ • React 18 / TS  │      │ • Orifice Physics│
│ • NitroStack MCP │      │ • Decision Bench │      │ • Pareto Engine  │
│ • SSE Streaming  │      │ • Synced Focus   │      │ • BEE ADEETIE    │
│ • Audit Log DB   │      │ • Dual Themes    │      │ • IPMVP Protocol │
└──────────────────┘      └──────────────────┘      └──────────────────┘
```

### Team Responsibilities Matrix

| Developer | Name | Role & Title | Primary Stack | Owned Files & Directories | Core Mission |
|---|---|---|---|---|---|
| **Dev 1** | **Keerthi** | **Agentic Pipeline & MCP Backend Engineer** | Python 3.10 (FastAPI), TypeScript, NitroStack MCP, Pydantic v2 | `backend/`, `forgeops-mcp/` | Own the "Brain & Nervous System": Agent determinism, MCP tool execution, streaming SSE, and tamper-proof audit trails. |
| **Dev 2** | **Vaishak** | **Frontend & Industrial UX Engineer** | React 18, TypeScript, Vite, CSS Variables, SVG/Canvas | `src/`, `index.html` | Own the "Control Cockpit": Operator workbench, synchronized graph/timeline selection, responsive layouts, and industrial ergonomics. |
| **Dev 3** | **Sham** | **Simulation, Telemetry & Energy Economics Engineer** | Python, TypeScript, NumPy/SciPy, Mathematical Modeling | `simulation/`, `data/`, `src/modules/SmeEconomicsView.tsx` | Own the "Ground Truth & Physics": Compressed air thermodynamic formulas, Pareto optimization, BEE ADEETIE compliance, and IPMVP verification. |
| **Dev 4** | **Vishal** | **Lead Architect & Integration Lead** | Full-Stack Architecture, Git, Docker, Cloud/Edge | System Architecture, CI/CD, Deployment | End-to-end integration, API contracts, deployment to Vercel/Cloud/Edge, and stakeholder/demo alignment. |

---

## 2. Dev 1 (Keerthi): Agentic Pipeline & MCP Backend Engineer

### Mental Model
> *"The LLM coordinates and reasons; it never fabricates facts or hallucinates calculations."*

### Owned Repositories & Files
- `backend/agents/planner/planner.py`
- `backend/agents/research/research.py`
- `backend/agents/analysis/analysis.py`
- `backend/agents/execution/execution.py`
- `backend/pipeline.py` & `backend/main.py`
- `backend/schemas/` (`planner_models.py`, `research_models.py`, `analysis_models.py`, `execution_models.py`, `shared_models.py`)
- `backend/database/audit_log.py`
- `forgeops-mcp/src/modules/` (`energy/`, `mes/`, `maintenance/`, `quality/`, `simulation/`, `orchestrator/`)

### Backlog & Deliverables

#### Task 1.1: Server-Sent Events (SSE) Agent Streaming [Priority: P0]
- **Objective:** Enable real-time phase updates in the UI as each agent executes rather than waiting for a single synchronous REST response.
- **Endpoint:** `GET /api/pipeline/stream?query=...&incident_id=...`
- **Payload Events:**
  - `event: planner` → `{"status": "running", "intent": "show_evidence", "constraints": {"min_throughput": 10.2}}`
  - `event: research` → `{"status": "calling_mcp", "tool": "get_compressed_air_metrics", "evidence_count": 6}`
  - `event: analysis` → `{"status": "computing_dag", "root_cause": "Line 2 manifold blowout", "confidence": 0.93}`
  - `event: execution` → `{"status": "complete", "recommendation": "OPT-C", "payback_months": 1.5}`

#### Task 1.2: Strict MCP Tool Contracts & Graceful Degradation [Priority: P0]
- In `forgeops-mcp/src/modules/`, harden tool inputs using strict **Zod schemas**.
- Implement timeout and error boundaries: if an MCP tool fails or times out, the Research Agent must flag missing telemetry with `is_partial: true` rather than crashing the pipeline.
- Implement token-efficient response compaction so large telemetry logs are summarized before feeding into the LLM context window.

#### Task 1.3: Tamper-Evident Audit Logging [Priority: P1]
- Enhance `backend/database/audit_log.py` to record every approved decision with a SHA-256 cryptographic hash of:
  `Hash(incident_id + approved_by + recommendation_id + timestamp + evidence_hashes)`
- Provide immutable compliance export endpoint `GET /api/audit-log/export` for ISO 50001 audits.

#### Task 1.4: Agent Regression & Determinism Benchmark [Priority: P1]
- Expand `backend/tests/test_agent_pipeline.py` with 20+ realistic manufacturing prompts.
- Assert that Planner never invents tools outside the MCP manifest and that Execution Agent never violates hard safety boundaries.

---

## 3. Dev 2 (Vaishak): Frontend & Industrial UX Engineer

### Mental Model
> *"The visual Workbench is the product; the AI is an integrated operator co-pilot."*

### Owned Repositories & Files
- `src/modules/Workbench.tsx`
- `src/modules/GraphPanel.tsx` (Causal Directed Acyclic Graph)
- `src/modules/TimelinePanel.tsx` (Multi-system synchronized timeline)
- `src/modules/SimulatorPanel.tsx` (What-if interactive sandbox)
- `src/modules/EvidencePanel.tsx` (Cryptographic evidence explorer)
- `src/modules/RecommendationsPanel.tsx` (Operator approval gate)
- `src/components/AskForgeOpsView.tsx` & `src/components/Icons.tsx`
- `src/App.tsx`, `src/FocusContext.tsx`, `src/schneider-theme.css`, `src/theme.css`

### Backlog & Deliverables

#### Task 2.1: Cross-Panel Synchronized Interactive Focus [Priority: P0]
- **Objective:** Deepen `FocusContext.tsx` integration across all workbench panels:
  - Clicking a node in `GraphPanel.tsx` (e.g. `Pneumatic Leak`) highlights the matching sensor spike in `TimelinePanel.tsx` and automatically scrolls to the raw sensor reading in `EvidencePanel.tsx`.
  - Scrubbing time in `TimelinePanel.tsx` updates live telemetry gauge cards in real-time.

#### Task 2.2: Industrial Tablet & Shop-Floor Touch Ergonomics [Priority: P0]
- Ensure all interactive elements (sliders in `SimulatorPanel.tsx`, approval buttons in `RecommendationsPanel.tsx`, nav tabs) meet a minimum touch target size of 44x44px.
- Make the multi-column workbench grid gracefully collapse into tabbed panels or accordions on screens $<1200\text{px}$.
- Maintain zero text clipping across both Dark and Light themes on 1024px, 1280px, and 1440px displays.

#### Task 2.3: Offline State & Edge Reconnection Indicator [Priority: P1]
- Add an edge connectivity status banner: detects if the local edge gateway goes offline, gracefully caching pending operator approvals in IndexedDB/localStorage and auto-syncing upon reconnection.

#### Task 2.4: One-Click Audit & Executive PDF Export [Priority: P1]
- Add an "Export Incident Dossier" button on `RecommendationsPanel.tsx` and `VerificationView.tsx`.
- Generates a print-ready, clean PDF report containing the incident summary, causal DAG, approved work order (`WO-ENG-8821`), and verified post-repair savings for plant executives.

---

## 4. Dev 3 (Sham): Simulation, Telemetry & Energy Economics Engineer

### Mental Model
> *"Thermodynamic formulas, compressor physics, and electricity tariffs provide the immutable mathematical foundation."*

### Owned Repositories & Files
- `simulation/engine.py` & `simulation/engine.ts`
- `data/canonical_dataset.json`, `src/mockData.ts`
- `src/modules/SmeEconomicsView.tsx`
- `src/modules/VerificationView.tsx`

### Backlog & Deliverables

#### Task 3.1: Physics-Based Pneumatic & Thermodynamic Engine [Priority: P0]
- **Objective:** Implement authentic compressed air thermodynamic orifice physics:
  $$Q = C_d \cdot A \cdot P_1 \sqrt{\frac{\gamma}{R \cdot T} \left(\frac{2}{\gamma + 1}\right)^{\frac{\gamma + 1}{\gamma - 1}}}$$
- Model rotary screw compressor specific power consumption ($\text{kW} / 100 \text{ CFM}$) as a function of pressure setpoint (bar) and VFD modulation percentage.
- Model electric induction furnace specific energy ($\text{kWh}/\text{ton}$) based on scrap packing density and pouring holding duration.

#### Task 3.2: Multi-Objective Pareto Trade-Off Optimizer [Priority: P0]
- Enhance `calculate_pareto_front()`:
  - **Inputs:** Leak repair budget, Line pressure reduction ($\Delta P = 0.2\text{ to }1.5\text{ bar}$), Tooling changeover delay ($0\text{ to }60\text{ min}$).
  - **Constraints:** Cylinder clamping force $\ge 5.5\text{ bar}$, Throughput loss $= 0$.
  - **Outputs:** Pareto-optimal candidate options (A, B, C, D) showing SEC reduction, CapEx, downtime, and payback period.

#### Task 3.3: Indian Electricity Tariff Engine & Peak Penalty Modeling [Priority: P1]
- Integrate actual Indian industrial DISCOM tariff structures:
  - **Time of Day (ToD) Tariffs:** Peak hours surcharge (+20%), Normal hours, Solar/Off-peak discount (-15%).
  - **Contract Demand & Power Factor (PF) Penalties:** kVA demand charges and incentives for $\text{PF} > 0.98$.
  - Provide immediate monetary calculations in Indian Rupees (₹) showing exact savings per shift and per month.

#### Task 3.4: BEE ADEETIE & IPMVP Verification Compliance [Priority: P1]
- Align calculation models in `SmeEconomicsView.tsx` and `VerificationView.tsx` with:
  - **BEE ADEETIE DPR Guidelines:** Detailed Project Report format for bankable subsidies (20–30% capital subsidy from SIDBI/BEE).
  - **IPMVP Option B / C Protocol:** Mathematical baseline adjustment factoring in ambient temperature changes and production volume shifts.

---

## 5. Dev 4 (Vishal): Architecture, Systems & Release Lead

### Mental Model
> *"Keep the developers unblocked, protect system boundaries, and ensure end-to-end cohesion."*

### Owned Areas
- System Architecture & End-to-End Integration
- Cross-Team API Contracts & Data Schemas
- CI/CD Pipelines, Docker Packaging & Vercel/Edge Deployment
- Production Verification & Stakeholder Demonstrations

### Core Responsibilities
1. **API Contracts & Cross-Team Interfaces:**
   - Ensure Dev 1 (Keerthi) and Dev 2 (Vaishak) strictly adhere to shared TypeScript interfaces (`src/types.ts` $\leftrightarrow$ `backend/schemas/`).
   - Ensure Dev 3 (Sham)'s simulation engine is cleanly wrapped as both a standalone Python package and a TypeScript MCP tool.
2. **Git & Branching Workflow:**
   - Protect `main`.
   - Feature branch strategy:
     - `feat/keerthi-sse-streaming`
     - `feat/vaishak-synchronized-focus`
     - `feat/sham-physics-engine`
   - Continuous integration: Require `npm run build` and `pytest backend/tests/` to pass before merging.
3. **Product Narrative & Demo Preparation:**
   - Rehearse the complete Belgaum Foundry story end-to-end:
     1. Telemetry spike on Home Dashboard.
     2. Open Decision Workbench.
     3. Watch 4 agents stream evidence and isolate Line 2 manifold leak.
     4. Adjust what-if simulation sliders.
     5. Operator approval sign-off.
     6. View verified savings in IPMVP verification view.

---

## 6. Cross-Team Interface Contracts

```text
               ┌───────────────────────────────────────────────┐
               │         Dev 3: Sham (Physics & Sim)           │
               │            & Canonical Telemetry              │
               └───────────────────────┬───────────────────────┘
                                       │ Thermodynamic JSON
                                       │ Canonical Datasets
                                       ▼
┌──────────────────────────────────────┴──────────────────────────────────────┐
│                  Dev 1: Keerthi (Agentic Backend & MCP)                     │
│                                                                             │
│  FastAPI Endpoints:                                                         │
│    • GET  /api/pipeline/stream  (SSE streaming trace)                       │
│    • POST /api/pipeline/run     (Full execution dossier)                    │
│    • POST /api/simulate         (What-if simulation)                        │
│    • POST /api/decisions/approve (Operator sign-off gate)                   │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ Pydantic UIState & Trace JSON
                                       ▼
┌──────────────────────────────────────┴──────────────────────────────────────┐
│                 Dev 2: Vaishak (Frontend Decision Cockpit)                  │
│                                                                             │
│  React Components:                                                          │
│    • Workbench.tsx (Subscribes to SSE stream)                               │
│    • FocusContext.tsx (Synchronizes graph + timeline)                       │
│    • SimulatorPanel.tsx (Binds to /api/simulate)                            │
│    • RecommendationsPanel.tsx (Dispatches /api/approve)                     │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ Integration & Release
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                 Dev 4: Vishal (Architecture & Systems Lead)                 │
│         CI/CD · Docker · Edge Gateway · Demo Verification · Release         │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. 3-Week Execution Schedule

```text
WEEK 1: Foundation & Contracts
├── Dev 1 (Keerthi): Stand up SSE agent streaming & strict MCP error boundaries
├── Dev 2 (Vaishak): Integrate FocusContext cross-panel highlighting & tablet responsiveness
├── Dev 3 (Sham): Implement orifice thermodynamic physics & ToD tariff calculations
└── Dev 4 (Vishal): Set up API mock contracts, CI build tests & branch rules

WEEK 2: Deep Features & Integration
├── Dev 1 (Keerthi): Multi-tenant audit trail with cryptographic SHA-256 hashes
├── Dev 2 (Vaishak): Real-time telemetry chart scrubber & offline edge reconnect modal
├── Dev 3 (Sham): Pareto frontier generator & BEE ADEETIE DPR export logic
└── Dev 4 (Vishal): Validate cross-service integration & edge containerization

WEEK 3: Hardening, Polish & Demo Rehearsal
├── Dev 1 (Keerthi): Stress testing & multi-scenario agent benchmark suite
├── Dev 2 (Vaishak): One-click PDF audit dossier generation & micro-animations
├── Dev 3 (Sham): Baseline adjustment verification against real factory noise
└── Dev 4 (Vishal): End-to-end Belgaum story rehearsal, final deployment & release
```

---

## 8. Current System Inventory

For a detailed file-by-file inventory of everything implemented in the codebase (frontend views, backend agents, MCP tools, simulation models, test suites), see:  
👉 **[06_built_so_far.md](./06_built_so_far.md)**
