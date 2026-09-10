import {
  businessImpact as fallbackImpact,
  evidenceRecords as fallbackEvidence,
  featuredIncident,
  graphEdges as fallbackEdges,
  graphNodes as fallbackNodes,
  incidentEvents as fallbackEvents,
  recommendations as fallbackRecommendations,
  replayStages as fallbackStages,
  simulationPresets as fallbackSimulations,
} from './mockData';
import type {
  BusinessImpact,
  EvidenceRecord,
  EvidenceType,
  GraphEdge,
  GraphNode,
  Incident,
  IncidentEvent,
  Recommendation,
  ReplayStage,
  SimulationResult,
  ToolTraceStep,
  WorkbenchSnapshot,
} from './types';

type Json = Record<string, any>;

const asObject = (value: unknown): Json => (
  value && typeof value === 'object' && !Array.isArray(value) ? value as Json : {}
);
const asArray = (value: unknown): Json[] => (
  Array.isArray(value) ? value.filter((item) => item && typeof item === 'object') as Json[] : []
);
const number = (value: unknown, fallback: number) => (
  Number.isFinite(Number(value)) ? Number(value) : fallback
);
const percent = (value: unknown, fallback: number) => {
  const result = number(value, fallback);
  return result <= 1 ? result * 100 : result;
};
const confidence = (value: unknown, fallback: number) => {
  const result = number(value, fallback);
  return result > 1 ? result / 100 : result;
};
const evidenceType = (value: unknown, fallback: EvidenceType): EvidenceType => {
  const allowed: EvidenceType[] = [
    'observed_correlation',
    'model_estimated',
    'counterfactual_simulated',
  ];
  return allowed.includes(value as EvidenceType) ? value as EvidenceType : fallback;
};
const titleCase = (value: string) => value
  .replace(/[_-]+/g, ' ')
  .replace(/\b\w/g, (character) => character.toUpperCase());

export const fallbackWorkbenchSnapshot: WorkbenchSnapshot = {
  source: 'degraded_fallback',
  live: false,
  incident: featuredIncident,
  incidentEvents: fallbackEvents,
  replayStages: fallbackStages,
  graphNodes: fallbackNodes,
  graphEdges: fallbackEdges,
  evidenceRecords: fallbackEvidence,
  recommendations: fallbackRecommendations,
  businessImpact: fallbackImpact,
  simulations: fallbackSimulations,
  rootCause: 'Line 2 compressed-air distribution leakage causing 1.1 bar pressure drop and compressor overcycling (+21% runtime).',
  toolTrace: [],
  errors: [],
  updatedAt: new Date(0).toISOString(),
};

export function normalizeWorkbenchData(rawValue: unknown): WorkbenchSnapshot {
  const raw = asObject(rawValue);
  const incidentRaw = asObject(raw.incident);
  const timelineRaw = asObject(raw.timeline);
  const graphRaw = asObject(raw.graph);
  const recommendationRaw = asObject(raw.recommendations);
  const impactRaw = asObject(raw.business_impact);
  const eventRows = asArray(timelineRaw.events);
  const nodeRows = asArray(graphRaw.nodes);
  const edgeRows = asArray(graphRaw.edges);
  const recommendationRows = asArray(recommendationRaw.recommendations);
  const simulationRows = asArray(raw.simulations);

  const incident = normalizeIncident(incidentRaw);
  const incidentEvents = eventRows.length
    ? normalizeEvents(eventRows)
    : fallbackEvents;
  const graphNodes = nodeRows.length
    ? normalizeNodes(nodeRows, incidentEvents)
    : fallbackNodes;
  const graphEdges = edgeRows.length
    ? normalizeEdges(edgeRows)
    : fallbackEdges;
  const simulations = simulationRows.length
    ? normalizeSimulations(simulationRows)
    : fallbackSimulations;
  const recommendations = recommendationRows.length
    ? normalizeRecommendations(recommendationRows)
    : fallbackRecommendations;
  const businessImpact = Object.keys(impactRaw).length
    ? normalizeImpact(impactRaw)
    : fallbackImpact;
  const replayStages = normalizeStages(incidentEvents);
  const evidenceRecords = buildEvidenceRecords(
    incidentEvents,
    graphNodes,
    simulations,
  );
  const rootCauseRows = asArray(raw.root_causes);
  const rootCause = String(
    rootCauseRows[0]?.primary_cause
    ?? incidentRaw.causal_chain?.join(' → ')
    ?? '',
  );
  const errors = Array.isArray(raw.errors)
    ? raw.errors.map(String)
    : [];

  return {
    source: raw.source === 'nitrocloud_agents_and_mcp'
      ? 'nitrocloud_agents_and_mcp'
      : raw.source === 'nitrocloud_mcp'
        ? 'nitrocloud_mcp'
        : 'degraded_fallback',
    live: Boolean(raw.live),
    incident,
    incidentEvents,
    replayStages,
    graphNodes,
    graphEdges,
    evidenceRecords,
    recommendations,
    businessImpact,
    simulations,
    rootCause,
    toolTrace: normalizeTrace(raw.tool_trace),
    errors,
    updatedAt: new Date().toISOString(),
  };
}

function normalizeIncident(raw: Json): Incident {
  if (!Object.keys(raw).length) return featuredIncident;
  const kpi = String(raw.kpi_change ?? '');
  const yields = [...kpi.matchAll(/(\d+(?:\.\d+)?)%/g)].map((match) => Number(match[1]));
  return {
    ...featuredIncident,
    id: String(raw.incident_id ?? featuredIncident.id),
    title: String(raw.title ?? featuredIncident.title).replace(/\s*-\s*Batch.*$/i, ''),
    plant: String(raw.plant ?? featuredIncident.plant),
    line: String(raw.line ?? featuredIncident.line),
    batchId: String(raw.batch_id ?? featuredIncident.batchId),
    severity: ['low', 'medium', 'high'].includes(raw.severity)
      ? raw.severity
      : featuredIncident.severity,
    status: ['open', 'investigating', 'monitoring'].includes(raw.status)
      ? raw.status
      : featuredIncident.status,
    detectedAt: String(raw.detected_at ?? featuredIncident.detectedAt),
    baselineYield: yields[0] ?? featuredIncident.baselineYield,
    currentYield: yields[1] ?? featuredIncident.currentYield,
    summary: String(raw.description ?? featuredIncident.summary),
  };
}

function normalizeEvents(rows: Json[]): IncidentEvent[] {
  const start = Math.min(...rows.map((row) => new Date(row.timestamp).getTime()));
  return rows.map((row, index) => {
    const id = String(row.event_id ?? `event-${index + 1}`);
    const type = String(row.type ?? '');
    const source = String(row.source ?? 'system').toLowerCase();
    const fallback = fallbackEvents.find((event) => event.id === id);
    const category: IncidentEvent['category'] = source === 'quality'
      ? 'inspection'
      : source === 'maintenance'
        ? 'maintenance'
        : source === 'iot'
          ? 'sensor'
          : type.includes('queue')
            ? 'queue'
            : 'system';
    const timestamp = String(row.timestamp ?? new Date(start).toISOString());
    return {
      id,
      timestamp,
      offsetMinutes: Math.max(0, Math.round((new Date(timestamp).getTime() - start) / 60_000)),
      label: String(row.title ?? titleCase(type)),
      category,
      severity: ['info', 'warning', 'critical'].includes(row.severity)
        ? row.severity
        : 'info',
      source: String(row.source ?? fallback?.source ?? 'MCP').toUpperCase(),
      recordId: String(row.record_id ?? `timeline:${id}`),
      stageId: stageId(String(row.stage ?? '')),
      graphNodeIds: fallback?.graphNodeIds ?? inferNodes(`${row.title} ${row.description}`),
      evidenceIds: [`evidence-event-${id}`],
      confidence: fallback?.confidence ?? (row.severity === 'critical' ? 0.95 : 0.9),
      value: fallback?.value ?? String(row.value ?? row.severity ?? ''),
      description: String(row.description ?? ''),
    };
  });
}

function normalizeNodes(rows: Json[], events: IncidentEvent[]): GraphNode[] {
  return rows.map((row, index) => {
    const id = String(row.id ?? `node-${index + 1}`);
    const fallback = fallbackNodes.find((node) => node.id === id);
    const eventIds = events
      .filter((event) => event.graphNodeIds.includes(id))
      .map((event) => event.id);
    return {
      id,
      label: String(row.label ?? fallback?.label ?? id),
      type: fallback?.type ?? 'condition',
      influence: confidence(row.influence, fallback?.influence ?? 0),
      confidence: confidence(row.confidence, fallback?.confidence ?? 0.8),
      evidenceType: evidenceType(row.evidence_type, fallback?.evidenceType ?? 'model_estimated'),
      controllable: Boolean(row.controllable),
      source: String(row.source ?? fallback?.source ?? 'MCP'),
      value: String(row.value ?? fallback?.value ?? ''),
      threshold: String(row.threshold ?? fallback?.threshold ?? ''),
      description: fallback?.description
        ?? `Live MCP causal factor with ${Math.round(confidence(row.influence, 0) * 100)}% modeled influence.`,
      eventIds,
      evidenceIds: [`evidence-node-${id}`],
      position: fallback?.position ?? {
        x: 10 + (index % 3) * 30,
        y: 15 + Math.floor(index / 3) * 48,
      },
    };
  });
}

function normalizeEdges(rows: Json[]): GraphEdge[] {
  return rows.map((row, index) => ({
    id: String(row.id ?? `edge-${index + 1}`),
    from: String(row.from),
    to: String(row.to),
    strength: confidence(row.strength, 0),
    evidenceType: row.type === 'primary_cause'
      ? 'counterfactual_simulated'
      : row.type === 'causes'
        ? 'model_estimated'
        : 'observed_correlation',
    label: titleCase(String(row.type ?? 'related')),
  }));
}

function normalizeRecommendations(rows: Json[]): Recommendation[] {
  return rows.map((row, index) => {
    const fallback = fallbackRecommendations[index] ?? fallbackRecommendations[0];
    return {
      id: `rec-live-${row.rank ?? index + 1}`,
      rank: number(row.rank, index + 1),
      title: String(row.action ?? row.title ?? fallback.title),
      confidence: confidence(row.confidence ?? row.confidence_pct, fallback.confidence),
      predictedYield: percent(row.predicted_yield ?? row.predicted_yield_pct, fallback.predictedYield),
      predictedSec: number(row.predicted_sec, fallback.predictedSec),
      secReductionPct: number(row.sec_reduction_pct, fallback.secReductionPct),
      energySavingKwhDay: number(row.energy_saving_kwh_day, fallback.energySavingKwhDay),
      costSavingInrDay: number(row.cost_saving_inr_day, fallback.costSavingInrDay),
      co2ReductionKgDay: number(row.co2_reduction_kg_day, fallback.co2ReductionKgDay),
      paybackPeriod: String(row.payback_period ?? fallback.paybackPeriod),
      cost: String(row.cost ?? row.cost_estimate ?? fallback.cost),
      costInr: number(row.cost_inr, fallback.costInr),
      effort: String(row.implementation ?? row.implementation_speed ?? fallback.effort),
      downtime: String(row.downtime ?? fallback.downtime),
      impact: normalizeLevel(row.impact, fallback.impact),
      risk: normalizeLevel(row.risk, fallback.risk),
      description: String(row.description ?? fallback.description),
      savingsPerWeekInr: number(row.savings_per_week_inr, fallback.savingsPerWeekInr),
      savingsPerMonthInr: number(row.savings_per_month_inr, fallback.savingsPerMonthInr),
      evidenceRefs: Array.isArray(row.evidence_refs)
        ? row.evidence_refs.map(String)
        : fallback.evidenceRefs,
      status: row.status ?? 'pending',
    };
  });
}

function normalizeImpact(raw: Json): BusinessImpact {
  const current = asObject(raw.current_state);
  const recommended = asObject(raw.recommended_action_impact);
  return {
    currentMonthlyLossInr: number(
      current.monthly_loss_exposure_inr ?? raw.monthly_loss_exposure_inr,
      fallbackImpact.currentMonthlyLossInr,
    ),
    monthlySavingsInr: number(
      recommended.monthly_savings_inr ?? raw.monthly_loss_avoided_inr,
      fallbackImpact.monthlySavingsInr,
    ),
    downtimeReductionPct: number(
      recommended.downtime_reduction_percent ?? raw.downtime_reduction_pct,
      fallbackImpact.downtimeReductionPct,
    ),
    baselineYield: percent(
      current.yield_percent,
      fallbackImpact.baselineYield,
    ),
    predictedYield: percent(
      recommended.yield_percent,
      fallbackImpact.predictedYield,
    ),
    baselineSec: number(raw.baseline_sec, fallbackImpact.baselineSec),
    optimizedSec: number(raw.optimized_sec, fallbackImpact.optimizedSec),
    secImprovementPct: number(raw.sec_improvement_pct, fallbackImpact.secImprovementPct),
    dailyKwhSaved: number(raw.daily_kwh_saved, fallbackImpact.dailyKwhSaved),
    annualCo2ReductionTons: number(raw.annual_co2_reduction_tons, fallbackImpact.annualCo2ReductionTons),
    paybackPeriod: String(
      recommended.payback_period ?? fallbackImpact.paybackPeriod,
    ),
    basis: String(
      raw.record_id
      ?? recommended.calculation_basis
      ?? fallbackImpact.basis,
    ),
  };
}

function normalizeSimulations(rows: Json[]): Record<string, SimulationResult> {
  const simulations: Record<string, SimulationResult> = {};
  for (const rawRow of rows) {
    const row = asObject(rawRow.result ?? rawRow);
    const name = String(row.scenario_name ?? row.scenarioName ?? 'Scenario');
    const key = scenarioKey(name);
    const fallback = fallbackSimulations[key] ?? fallbackSimulations.both_repair_and_optimize ?? fallbackSimulations.repair_leakage;
    const scenarioId = String(row.scenario_id ?? row.scenarioId ?? key);
    const baselineYield = percent(row.baseline_yield ?? row.baselineYield, fallback.baselineYield);
    const predictedYield = percent(row.predicted_yield ?? row.predictedYield, fallback.predictedYield);
    simulations[key] = {
      scenarioId,
      scenarioName: name,
      baselineYield,
      predictedYield,
      baselineSec: number(row.baseline_sec, fallback.baselineSec),
      predictedSec: number(row.predicted_sec, fallback.predictedSec),
      secUnit: String(row.sec_unit ?? fallback.secUnit ?? 'kWh/ton'),
      secReductionPct: number(row.sec_reduction_pct, fallback.secReductionPct),
      energySavingKwhDay: number(row.energy_saving_kwh_day, fallback.energySavingKwhDay),
      costSavingInrDay: number(row.cost_saving_inr_day, fallback.costSavingInrDay),
      co2ReductionKgDay: number(row.co2_reduction_kg_day, fallback.co2ReductionKgDay),
      confidence: confidence(row.confidence, fallback.confidence),
      cost: String(row.cost_estimate ?? row.cost ?? fallback.cost),
      costInr: number(row.cost_inr, fallback.costInr),
      effort: String(row.implementation_effort ?? row.effort ?? fallback.effort),
      downtimeMinutes: number(row.downtime_minutes, fallback.downtimeMinutes),
      paybackMonths: number(row.payback_months, fallback.paybackMonths),
      throughputImpact: String(row.throughput_impact ?? fallback.throughputImpact),
      qualityImpact: String(row.quality_impact ?? fallback.qualityImpact),
      safetyPreserved: Boolean(row.safety_preserved ?? fallback.safetyPreserved),
      assumptions: Array.isArray(row.assumptions) ? row.assumptions.map(String) : fallback.assumptions,
      reasoning: row.reasoning ? String(row.reasoning) : fallback.reasoning,
      inValidatedRange: Boolean(row.in_validated_range ?? row.within_validated_range ?? fallback.inValidatedRange),
      warnings: Array.isArray(row.warnings)
        ? row.warnings.map(String)
        : fallback.warnings,
      evidenceRefs: Array.isArray(row.evidence_refs)
        ? row.evidence_refs.map(String)
        : fallback.evidenceRefs,
      modelVersion: String(row.model_version ?? fallback.modelVersion),
    };
  }
  return { ...fallbackSimulations, ...simulations };
}

function normalizeStages(events: IncidentEvent[]): ReplayStage[] {
  const grouped = new Map<string, IncidentEvent[]>();
  for (const event of events) {
    const items = grouped.get(event.stageId) ?? [];
    items.push(event);
    grouped.set(event.stageId, items);
  }
  return [...grouped.entries()].map(([id, items], index) => {
    const fallback = fallbackStages.find((stage) => stage.id === id);
    const critical = items.some((event) => event.severity === 'critical');
    const warning = items.some((event) => event.severity === 'warning');
    const status: ReplayStage['status'] = critical
      ? 'failure'
      : warning
        ? 'warning'
        : 'ok';
    return {
      id,
      label: fallback?.label ?? titleCase(id.replace(/^stage-/, '')),
      shortLabel: fallback?.shortLabel ?? titleCase(id.replace(/^stage-/, '')),
      status,
      startMinute: Math.min(...items.map((event) => event.offsetMinutes)),
      endMinute: Math.max(...items.map((event) => event.offsetMinutes + 1)),
      summary: items[items.length - 1]?.description ?? fallback?.summary ?? '',
      inputs: fallback?.inputs ?? [],
      outputs: fallback?.outputs ?? [],
      metrics: fallback?.metrics ?? [{
        label: 'Events',
        value: String(items.length),
        state: critical ? 'critical' : warning ? 'warning' : 'normal',
      }],
      eventIds: items.map((event) => event.id),
    };
  }).sort((left, right) => left.startMinute - right.startMinute)
    .map((stage, index, all) => ({
      ...stage,
      endMinute: Math.max(
        stage.endMinute,
        all[index + 1]?.startMinute ?? stage.endMinute,
      ),
    }));
}

function buildEvidenceRecords(
  events: IncidentEvent[],
  nodes: GraphNode[],
  simulations: Record<string, SimulationResult>,
): EvidenceRecord[] {
  const eventRecords: EvidenceRecord[] = events.map((event) => ({
    id: `evidence-event-${event.id}`,
    title: event.label,
    source: event.source,
    recordId: event.recordId,
    timestamp: event.timestamp,
    kind: event.category === 'sensor' ? 'sensor' : 'record',
    summary: event.description,
    confidence: event.confidence,
    evidenceType: 'observed_correlation',
  }));
  const nodeRecords: EvidenceRecord[] = nodes.map((node) => ({
    id: `evidence-node-${node.id}`,
    title: node.label,
    source: node.source,
    recordId: `graph:${node.id}`,
    timestamp: events.find((event) => event.graphNodeIds.includes(node.id))?.timestamp
      ?? featuredIncident.detectedAt,
    kind: 'comparison',
    summary: node.description,
    confidence: node.confidence,
    evidenceType: node.evidenceType,
  }));
  const simulationRecords: EvidenceRecord[] = Object.values(simulations).map((simulation) => ({
    id: `evidence-sim-${simulation.scenarioId}`,
    title: simulation.scenarioName,
    source: 'NitroCloud MCP simulation',
    recordId: `sim:${simulation.scenarioId}`,
    timestamp: featuredIncident.detectedAt,
    kind: 'simulation',
    summary: `Predicted yield ${simulation.predictedYield}% from a ${simulation.baselineYield}% baseline.`,
    confidence: simulation.confidence,
    evidenceType: 'counterfactual_simulated',
  }));
  return [...eventRecords, ...nodeRecords, ...simulationRecords];
}

function inferNodes(text: string): string[] {
  const lower = text.toLowerCase();
  return fallbackNodes
    .filter((node) => node.label.toLowerCase().split(' ').some((word) => word.length > 4 && lower.includes(word)))
    .map((node) => node.id);
}

function stageId(value: string): string {
  const lower = value.toLowerCase();
  if (lower.includes('intake')) return 'stage-intake';
  if (lower.includes('machine a')) return 'stage-machine-a';
  if (lower.includes('queue')) return 'stage-queue';
  if (lower.includes('machine b') || lower.includes('grinding')) return 'stage-machine-7';
  if (lower.includes('inspection')) return 'stage-inspection';
  if (lower.includes('packag')) return 'stage-packaging';
  return `stage-${lower.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'event'}`;
}

function scenarioKey(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes('queue')) return 'reduce_queue_delay';
  if (lower.includes('humidity')) return 'humidity_control';
  if (lower.includes('machine 7')) return 'replace_machine_7';
  if (lower.includes('baseline')) return 'baseline';
  return lower.replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
}

function normalizeLevel(value: unknown, fallback: 'Low' | 'Medium' | 'High') {
  const normalized = titleCase(String(value ?? ''));
  return ['Low', 'Medium', 'High'].includes(normalized)
    ? normalized as 'Low' | 'Medium' | 'High'
    : fallback;
}

function normalizeTrace(value: unknown): ToolTraceStep[] {
  return asArray(value).map((row, index) => ({
    id: String(row.id ?? `workbench-tool-${index + 1}`),
    server: String(row.server ?? 'NitroCloud MCP'),
    tool: String(row.tool ?? 'unknown'),
    status: ['queued', 'running', 'complete', 'error'].includes(row.status)
      ? row.status
      : 'error',
    durationMs: number(row.durationMs ?? row.duration_ms, 0),
    records: Array.isArray(row.records) ? row.records.map(String) : [],
  }));
}


