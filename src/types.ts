export type Severity = 'info' | 'warning' | 'critical';
export type LoadState = 'idle' | 'loading' | 'success' | 'partial' | 'error';
export type EvidenceType = 'observed_correlation' | 'model_estimated' | 'counterfactual_simulated';
export type FocusOrigin = 'user' | 'replay' | 'assistant';

export type Incident = {
  id: string;
  title: string;
  plant: string;
  line: string;
  product: string;
  batchId: string;
  severity: 'low' | 'medium' | 'high';
  status: 'open' | 'investigating' | 'monitoring' | 'verified';
  detectedAt: string;
  baselineYield: number;
  currentYield: number;
  exposureInr: number;
  summary: string;
  // Energy specific fields
  baselineSec: number; // e.g. 11.2 kWh/ton or 8.50 kWh/unit
  currentSec: number;  // e.g. 9.2 kWh/ton or 7.40 kWh/unit
  secUnit: string;     // 'kWh/ton' | 'kWh/unit'
  secDeltaPct: number; // e.g. +14.3% or -18.0%
  dailyEnergyKwh: number;
  dailyCostInr: number;
  co2EmissionsTons: number;
  airPressureBar?: number;
  compressorRuntimePct?: number;
  motorCurrentA?: number;
};

export type IncidentEvent = {
  id: string;
  timestamp: string;
  offsetMinutes: number;
  label: string;
  category: 'sensor' | 'queue' | 'maintenance' | 'inspection' | 'operator' | 'system' | 'energy' | 'pneumatic';
  severity: Severity;
  source: string;
  recordId: string;
  stageId: string;
  graphNodeIds: string[];
  evidenceIds: string[];
  confidence: number;
  value: string;
  description: string;
  secImpact?: string;
};

export type ReplayStage = {
  id: string;
  label: string;
  shortLabel: string;
  status: 'ok' | 'warning' | 'failure';
  startMinute: number;
  endMinute: number;
  summary: string;
  inputs: string[];
  outputs: string[];
  metrics: Array<{ label: string; value: string; state?: 'normal' | 'warning' | 'critical' }>;
  eventIds: string[];
};

export type GraphNode = {
  id: string;
  label: string;
  type: 'condition' | 'process' | 'equipment' | 'material' | 'environment' | 'outcome' | 'energy';
  influence: number;
  confidence: number;
  evidenceType: EvidenceType;
  controllable: boolean;
  source: string;
  value: string;
  threshold: string;
  description: string;
  eventIds: string[];
  evidenceIds: string[];
  position: { x: number; y: number };
};

export type GraphEdge = {
  id: string;
  from: string;
  to: string;
  strength: number;
  evidenceType: EvidenceType;
  label: string;
};

export type EvidenceRecord = {
  id: string;
  title: string;
  source: string;
  recordId: string;
  timestamp: string;
  kind: 'record' | 'sensor' | 'simulation' | 'comparison' | 'energy_telemetry' | 'scada';
  summary: string;
  confidence: number;
  evidenceType: EvidenceType;
  metricDetails?: {
    metric: string;
    baseline: string;
    observed: string;
    deviation: string;
  };
};

export type SimulationResult = {
  scenarioId: string;
  scenarioName: string;
  baselineYield: number;
  predictedYield: number;
  baselineSec: number;
  predictedSec: number;
  secUnit: string;
  secReductionPct: number;
  energySavingKwhDay: number;
  costSavingInrDay: number;
  co2ReductionKgDay: number;
  confidence: number;
  cost: string;
  costInr: number;
  effort: string;
  downtimeMinutes: number;
  paybackMonths: number;
  throughputImpact: string;
  qualityImpact: string;
  safetyPreserved: boolean;
  assumptions: string[];
  reasoning?: string;
  inValidatedRange: boolean;
  warnings: string[];
  evidenceRefs: string[];
  modelVersion: string;
};

export type Recommendation = {
  id: string;
  rank: number;
  title: string;
  confidence: number;
  predictedYield: number;
  predictedSec: number;
  secReductionPct: number;
  energySavingKwhDay: number;
  costSavingInrDay: number;
  co2ReductionKgDay: number;
  paybackPeriod: string;
  cost: string;
  costInr: number;
  effort: string;
  downtime: string;
  impact: 'Low' | 'Medium' | 'High';
  risk: 'Low' | 'Medium' | 'High';
  description: string;
  savingsPerWeekInr: number;
  savingsPerMonthInr: number;
  evidenceRefs: string[];
  status?: 'pending' | 'approved' | 'rejected';
};

export type BusinessImpact = {
  currentMonthlyLossInr: number;
  monthlySavingsInr: number;
  downtimeReductionPct: number;
  baselineYield: number;
  predictedYield: number;
  baselineSec: number;
  optimizedSec: number;
  secImprovementPct: number;
  dailyKwhSaved: number;
  annualCo2ReductionTons: number;
  paybackPeriod: string;
  basis: string;
};

export type ToolTraceStep = {
  id: string;
  server: string;
  tool: string;
  status: 'queued' | 'running' | 'complete' | 'error';
  durationMs: number;
  records: string[];
};

export type AgentTraceStep = {
  agent: 'planner' | 'research' | 'analysis' | 'execution';
  agentTitle: string;
  status: 'complete' | 'complete_with_safe_tool_selection' | 'fallback';
  durationMs: number;
  model: string;
  objective: string;
  summary: string;
  error?: string | null;
  attempts?: number;
  keyOutputs?: string[];
};

export type AssistantResponse = {
  intent: string;
  conclusion: string;
  effect: string;
  confidence: number;
  evidenceRefs: string[];
  assumptions: string[];
  actions: Array<'open_evidence' | 'run_comparison' | 'generate_report'>;
  toolTrace: ToolTraceStep[];
  agentTrace?: AgentTraceStep[];
  uiActions: Array<{ action: string; targetId?: string | null; params?: Record<string, unknown> }>;
  generatedReports: Array<{ reportType: string; markdown: string; html?: string | null }>;
  notifications: Array<{ recipient: string; subject: string; body: string; requiresApproval: boolean }>;
  workbenchData?: WorkbenchSnapshot;
  pipelineMode?: 'live_nitrocloud' | 'live_nitrocloud_with_safe_tool_selection' | 'degraded_fallback';
  model?: string;
};

export type WorkbenchSnapshot = {
  source: 'nitrocloud_mcp' | 'nitrocloud_agents_and_mcp' | 'degraded_fallback';
  live: boolean;
  incident: Incident;
  incidentEvents: IncidentEvent[];
  replayStages: ReplayStage[];
  graphNodes: GraphNode[];
  graphEdges: GraphEdge[];
  evidenceRecords: EvidenceRecord[];
  recommendations: Recommendation[];
  businessImpact: BusinessImpact;
  simulations: Record<string, SimulationResult>;
  rootCause: string;
  toolTrace: ToolTraceStep[];
  errors: string[];
  updatedAt: string;
};

export type FocusContext = {
  incidentId: string;
  eventId: string | null;
  stageId: string | null;
  graphNodeIds: string[];
  evidenceIds: string[];
  timeMinute: number;
  timeRange: [number, number] | null;
  pinned: boolean;
  origin: FocusOrigin;
  aiLabel: string | null;
};

export type WasteBreakdownItem = {
  category: string;
  percentage: number;
  kwh: number;
  color: string;
};

export type AnomalySummary = {
  id: string;
  title: string;
  severity: 'high' | 'medium' | 'low';
  impactPct: number;
  description: string;
  equipment: string;
};

export type UserStoryStep = {
  stepNumber: number;
  time: string;
  title: string;
  subtitle: string;
  findings: string[];
  keyMetrics: Record<string, string>;
  details: string;
};
