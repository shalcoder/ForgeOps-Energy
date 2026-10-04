import { assistantResponses, featuredIncident, simulationPresets } from '../mockData';
import type {
  AssistantResponse,
  Recommendation,
  SimulationResult,
  WorkbenchSnapshot,
} from '../types';
import {
  fallbackWorkbenchSnapshot,
  normalizeWorkbenchData,
} from '../workbenchData';

const apiBaseUrl = (
  import.meta.env.VITE_FORGEOPS_API_URL
  ?? import.meta.env.VITE_ROLE3_API_URL
  ?? ''
).replace(/\/$/, '');
const simulationUrl = `${apiBaseUrl}/api/agent/simulate`;
const agentUrl = import.meta.env.VITE_ROLE1_AGENT_URL ?? `${apiBaseUrl}/api/agent/pipeline`;

const toPercent = (value: number | undefined, fallback: number) => {
  if (value === undefined || Number.isNaN(value)) return fallback;
  return value <= 1 ? value * 100 : value;
};

type Role3SimulationPayload = {
  scenario_id?: string;
  scenario_name?: string;
  baseline_yield?: number;
  predicted_yield?: number;
  confidence?: number;
  cost_estimate?: string;
  implementation_effort?: string;
  assumptions?: string[];
  reasoning?: string;
  in_validated_range?: boolean;
  within_validated_range?: boolean;
  warnings?: string[];
  warning?: string | null;
};

export type RuntimeStatus = {
  online: boolean;
  toolCount: number;
  agentRoles: number;
  orchestratorProcesses: number;
  llmBacked: boolean;
  model: string;
  mcpServerAttached: boolean;
};

export type SystemRuntimeStatus = {
  deployment_stage: string;
  data_mode: string;
  data_note: string;
  system1: {
    model: string;
    model_path: string;
    runtime: string;
    status: string;
    live_loaded: boolean;
    weights_present: boolean;
    load_enabled: boolean;
    packages: Record<string, string | null>;
    load_error?: string | null;
  };
  system2: {
    agents: string[];
    provider_model: string;
    live_provider_enabled: boolean;
    status: string;
  };
  integrations: {
    remote_mcp: { configured: boolean; reachable: boolean; tool_count: number };
    factory_ot_adapters: { configured: boolean; status: string; protocols_supported_by_design: string[] };
    mes_cmms_qms_erp: { configured: boolean; status: string };
  };
};

export async function getSystemRuntimeStatus(): Promise<SystemRuntimeStatus | null> {
  try {
    const response = await fetch(`${apiBaseUrl}/api/system/status`);
    if (!response.ok) return null;
    return await response.json() as SystemRuntimeStatus;
  } catch {
    return null;
  }
}

export async function getRuntimeStatus(): Promise<RuntimeStatus> {
  try {
    const response = await fetch(`${apiBaseUrl}/api/agent/health`);
    if (!response.ok) throw new Error(`Health API returned ${response.status}`);
    const data = await response.json() as {
      agentRoles?: number;
      orchestratorProcesses?: number;
      llmBacked?: boolean;
      model?: string;
      mcp?: {
        attached?: boolean;
        toolCount?: number;
      };
    };
    return {
      online: true,
      toolCount: data.mcp?.toolCount ?? 0,
      agentRoles: data.agentRoles ?? 0,
      orchestratorProcesses: data.orchestratorProcesses ?? 0,
      llmBacked: data.llmBacked ?? false,
      model: data.model ?? '',
      mcpServerAttached: data.mcp?.attached ?? false,
    };
  } catch {
    return {
      online: false,
      toolCount: 0,
      agentRoles: 0,
      orchestratorProcesses: 0,
      llmBacked: false,
      model: '',
      mcpServerAttached: false,
    };
  }
}

export async function getWorkbenchData(): Promise<WorkbenchSnapshot> {
  try {
    const params = new URLSearchParams({
      incident_id: featuredIncident.id,
      batch_id: featuredIncident.batchId,
    });
    const response = await fetch(`${apiBaseUrl}/api/agent/workbench?${params}`);
    if (!response.ok) throw new Error(`Workbench API returned ${response.status}`);
    return normalizeWorkbenchData(await response.json());
  } catch (error) {
    const message = error instanceof Error ? error.message : 'MCP workbench unavailable';
    return {
      ...fallbackWorkbenchSnapshot,
      errors: [
        message.includes('409')
          ? 'The live agent service is configured for a different incident. This workspace is showing its matching case-study data.'
          : message,
      ],
      updatedAt: new Date().toISOString(),
    };
  }
}

export async function runScenario(
  scenarioKey: keyof typeof simulationPresets,
  inputs: Record<string, number | boolean>,
  constraints: Record<string, string | number | boolean>,
): Promise<SimulationResult> {
  const fallback = simulationPresets[scenarioKey] ?? simulationPresets.baseline;
  try {
    const response = await fetch(simulationUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: fallback.scenarioName, inputs, constraints }),
    });
    if (!response.ok) throw new Error(`Role 3 API returned ${response.status}`);
    const data = await response.json() as Role3SimulationPayload;
    const warnings = data.warnings ?? (data.warning ? [data.warning] : []);
    return {
      ...fallback,
      scenarioId: data.scenario_id ?? fallback.scenarioId,
      scenarioName: data.scenario_name ?? fallback.scenarioName,
      baselineYield: toPercent(data.baseline_yield, fallback.baselineYield),
      predictedYield: toPercent(data.predicted_yield, fallback.predictedYield),
      confidence: data.confidence ?? fallback.confidence,
      cost: data.cost_estimate ?? fallback.cost,
      effort: data.implementation_effort ?? fallback.effort,
      assumptions: data.assumptions ?? fallback.assumptions,
      reasoning: data.reasoning ?? fallback.reasoning,
      inValidatedRange: data.in_validated_range ?? data.within_validated_range ?? fallback.inValidatedRange,
      warnings,
    };
  } catch (error) {
    return {
      ...fallback,
      warnings: [`Role 3 API unavailable; showing the deterministic handoff fixture. ${error instanceof Error ? error.message : ''}`.trim()],
    };
  }
}

export async function askAgent(
  query: string,
  constraints: Record<string, boolean> = {},
): Promise<AssistantResponse> {
  const intent = fallbackIntent(query);
  const fallback = assistantResponses[intent] ?? assistantResponses.evidence;
  try {
    const response = await fetch(agentUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        incident_id: featuredIncident.id,
        batch_id: featuredIncident.batchId,
        constraints,
      }),
    });
    if (!response.ok) throw new Error(`Tool API returned ${response.status}`);
    const data = await response.json() as Partial<AssistantResponse>;
    return {
      ...fallback,
      ...data,
      evidenceRefs: data.evidenceRefs ?? (data as { evidence_refs?: string[] }).evidence_refs ?? fallback.evidenceRefs,
      toolTrace: data.toolTrace ?? (data as { tool_trace?: AssistantResponse['toolTrace'] }).tool_trace ?? fallback.toolTrace,
      agentTrace: data.agentTrace ?? (data as { agent_trace?: AssistantResponse['agentTrace'] }).agent_trace ?? [],
      pipelineMode: data.pipelineMode ?? (data as { pipeline_mode?: AssistantResponse['pipelineMode'] }).pipeline_mode ?? 'degraded_fallback',
      model: data.model ?? '',
      actions: data.actions ?? (data as { actions_available?: AssistantResponse['actions'] }).actions_available ?? fallback.actions,
      uiActions: normalizeUiActions(data),
      generatedReports: normalizeReports(data),
      notifications: normalizeNotifications(data),
      workbenchData: normalizeWorkbenchData(
        (data as { workbench_data?: unknown }).workbench_data,
      ),
    };
  } catch (error) {
    return {
      ...fallback,
      effect: `${fallback.effect} This case study is not configured on the live agent service, so this response uses the matching local case-study data.`,
      assumptions: [
        ...fallback.assumptions,
        error instanceof Error ? error.message : 'MCP bridge unavailable',
      ],
      agentTrace: [],
      toolTrace: [],
      pipelineMode: 'degraded_fallback',
      model: '',
      uiActions: [],
      generatedReports: [],
      notifications: [],
      workbenchData: fallbackWorkbenchSnapshot,
    };
  }
}

export async function approveDecision(
  recommendation: Recommendation,
  agentConclusion: string,
) {
  const response = await fetch(`${apiBaseUrl}/api/agent/decision/approve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      incident_id: featuredIncident.id,
      recommendation,
      approved_by: 'Vaishak',
      agent_conclusion: agentConclusion,
    }),
  });
  if (!response.ok) throw new Error(`Approval API returned ${response.status}`);
  return response.json() as Promise<{
    id: number;
    timestamp: string;
    execution_status: 'recorded_not_executed';
  }>;
}

function fallbackIntent(query: string): keyof typeof assistantResponses {
  const normalized = query.toLowerCase();
  if (normalized.includes('report') || normalized.includes('brief') || normalized.includes('audit')) return 'report';
  if (normalized.includes('compare') || normalized.includes('option') || normalized.includes('simulate') || normalized.includes('what-if')) return 'compare';
  return 'default';
}

function normalizeUiActions(data: Partial<AssistantResponse>) {
  const raw = (data as {
    ui_actions?: Array<{ action?: string; target_id?: string | null; params?: Record<string, unknown> }>;
  }).ui_actions ?? [];
  return raw.map((action) => ({
    action: String(action.action ?? ''),
    targetId: action.target_id,
    params: action.params ?? {},
  }));
}

function normalizeReports(data: Partial<AssistantResponse>) {
  const raw = (data as {
    generated_reports?: Array<{ report_type?: string; markdown?: string; html?: string | null }>;
  }).generated_reports ?? [];
  return raw.map((report) => ({
    reportType: String(report.report_type ?? 'decision_brief'),
    markdown: String(report.markdown ?? ''),
    html: report.html,
  }));
}

function normalizeNotifications(data: Partial<AssistantResponse>) {
  const raw = (data as {
    notifications?: Array<{
      recipient?: string;
      subject?: string;
      body?: string;
      requires_approval?: boolean;
    }>;
  }).notifications ?? [];
  return raw.map((notification) => ({
    recipient: String(notification.recipient ?? ''),
    subject: String(notification.subject ?? ''),
    body: String(notification.body ?? ''),
    requiresApproval: notification.requires_approval ?? true,
  }));
}
