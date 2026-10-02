import type { FocusContext, WorkbenchSnapshot } from '../types';
import { getPendingApprovals } from '../offlineApprovals';

type DossierData = Pick<WorkbenchSnapshot, 'incident' | 'graphNodes' | 'incidentEvents' | 'recommendations' | 'evidenceRecords' | 'rootCause' | 'businessImpact'>;

export function exportAuditDossier(data: DossierData, focus: FocusContext) {
  void data;
  void focus;
  window.print();
}

export function AuditDossier({ data, focus }: { data: DossierData; focus: FocusContext }) {
  const approvalRecords = JSON.parse(localStorage.getItem('forgeops-audit-approvals') ?? '[]') as Array<{ recommendationId: string; workOrderId: string; approvedAt: string }>;
  const approval = approvalRecords[approvalRecords.length - 1];
  const pending = getPendingApprovals();
  const waitingToSync = pending.some((item) => item.workOrderId === approval?.workOrderId);
  const workOrder = approval?.workOrderId ?? (pending.length ? 'Approval queued for sync' : 'Awaiting operator approval');
  const cause = data.graphNodes.find((node) => focus.graphNodeIds.includes(node.id)) ?? data.graphNodes[0];
  const chosen = data.recommendations.find((item) => item.id === approval?.recommendationId) ?? data.recommendations.find((item) => item.rank === 1);
  const event = data.incidentEvents.find((item) => item.id === focus.eventId);

  return (
    <article className="audit-dossier" id="incident-dossier">
      <p className="dossier-kicker">ForgeOps Energy · Incident audit dossier</p>
      <h1>{data.incident.id} · {data.incident.title}</h1>
      <p>{data.incident.plant} · Generated {new Date().toLocaleString('en-IN')}</p>
      <section><h2>Incident summary</h2><p>{data.incident.summary}</p><p>Focused evidence: {event?.label ?? 'No event selected'} {event ? `(${event.value})` : ''}</p></section>
      <section><h2>Causal path</h2><p>{data.graphNodes.map((node) => node.label).join('  →  ')}</p><p>Primary root cause: {data.rootCause || cause?.label || 'See available incident evidence.'}</p></section>
      <section><h2>Operator decision</h2><p>{chosen?.title ?? 'No recommendation selected'}</p><p>Work order: {workOrder}</p><p>{approval ? `Approved locally ${new Date(approval.approvedAt).toLocaleString('en-IN')}${waitingToSync ? ' · waiting for edge sync' : ' · synchronized to audit service'}` : 'No operator approval is recorded.'}</p></section>
      <section><h2>Verified savings</h2><p>Specific energy: {data.businessImpact.baselineSec.toFixed(1)} → {data.businessImpact.optimizedSec.toFixed(1)} kWh/t ({data.businessImpact.secImprovementPct.toFixed(1)}% improvement).</p><p>Verified annual run-rate: ₹{(data.businessImpact.monthlySavingsInr * 12 / 100000).toFixed(2)} lakhs. Throughput: {data.businessImpact.predictedYield}% of target.</p></section>
      <footer>Evidence records in current snapshot: {data.evidenceRecords.length} · Focus: {focus.timeMinute} min</footer>
    </article>
  );
}
