import { approveDecision } from './integrations/forgeOpsClient';
import type { Recommendation } from './types';

export type PendingApproval = {
  key: string;
  recommendation: Recommendation;
  approvedBy: string;
  approvedAt: string;
  workOrderId: string;
  syncedAt?: string;
  syncError?: string;
};

const STORAGE_KEY = 'forgeops-pending-approvals';
let syncInProgress = false;
const read = (): PendingApproval[] => {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(value) ? value as PendingApproval[] : [];
  } catch {
    return [];
  }
};

const write = (items: PendingApproval[]) => localStorage.setItem(STORAGE_KEY, JSON.stringify(items));

export const getPendingApprovals = () => read().filter((item) => !item.syncedAt);

export function queueApproval(recommendation: Recommendation): PendingApproval {
  const record: PendingApproval = {
    key: `${recommendation.id}:${Date.now()}`,
    recommendation,
    approvedBy: 'Vaishak',
    approvedAt: new Date().toISOString(),
    workOrderId: `WO-ENG-${String(Date.now()).slice(-4)}`,
  };
  write([...read(), record]);
  const audit = JSON.parse(localStorage.getItem('forgeops-audit-approvals') ?? '[]') as Array<{ recommendationId: string; workOrderId: string; approvedAt: string }>;
  audit.push({ recommendationId: recommendation.id, workOrderId: record.workOrderId, approvedAt: record.approvedAt });
  localStorage.setItem('forgeops-audit-approvals', JSON.stringify(audit));
  window.dispatchEvent(new Event('forgeops-approvals-changed'));
  return record;
}

export async function syncPendingApprovals() {
  if (!navigator.onLine || syncInProgress) return;
  syncInProgress = true;
  const items = read();
  let changed = false;
  try {
    for (let index = 0; index < items.length; index += 1) {
      const item = items[index];
      if (item.syncedAt) continue;
      try {
        await approveDecision(item.recommendation, 'Operator approved; queued locally and synchronized when connectivity returned.');
        items[index] = { ...item, syncedAt: new Date().toISOString(), syncError: undefined };
        changed = true;
      } catch (error) {
        items[index] = { ...item, syncError: error instanceof Error ? error.message : 'Approval sync failed' };
        changed = true;
        break;
      }
    }
    if (changed) {
      write(items);
      window.dispatchEvent(new Event('forgeops-approvals-changed'));
    }
  } finally {
    syncInProgress = false;
  }
}
