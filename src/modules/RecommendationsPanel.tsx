import { useState } from 'react';
import { recommendations } from '../mockData';
import type { AssistantResponse, Recommendation } from '../types';
import {
  CheckCircleIcon,
  CheckIcon,
  XIcon,
  WrenchIcon,
  ShieldCheckIcon,
  ClockIcon,
  ZapIcon,
  TrendingDownIcon,
  FileTextIcon,
} from '../components/Icons';
import { queueApproval, syncPendingApprovals } from '../offlineApprovals';
import { useWorkbenchData } from '../WorkbenchDataContext';
import { useFocusContext } from '../FocusContext';
import { exportAuditDossier } from './AuditDossier';

export function RecommendationsPanel({ agentResponse }: { agentResponse?: AssistantResponse | null }) {
  const [recList, setRecList] = useState<Recommendation[]>(recommendations);
  const [dispatchedOrder, setDispatchedOrder] = useState<string | null>(null);
  const { data } = useWorkbenchData();
  const { focus } = useFocusContext();

  const handleApprove = (id: string) => {
    const recommendation = recList.find((item) => item.id === id);
    if (!recommendation) return;
    const approval = queueApproval(recommendation);
    setRecList((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, status: 'approved' } : rec))
    );
    setDispatchedOrder(approval.workOrderId);
    void syncPendingApprovals();
  };

  const handleReject = (id: string) => {
    setRecList((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, status: 'rejected' } : rec))
    );
  };

  return (
    <section id="recommendations-section" className="module-panel energy-recommendations-panel">
      <header className="module-header">
        <div>
          <h2>Actionable Recommendations & Operator Approval</h2>
          <span>Human approval is saved on this device and synchronized to the audit API when available.</span>
        </div>
        <button className="btn-secondary-action dossier-export-button" onClick={() => exportAuditDossier(data, focus)}><FileTextIcon size={14} /> Export dossier</button>
        <span className="objective-badge font-mono">
          min(SEC) | Preserved Throughput & Quality
        </span>
      </header>

      {dispatchedOrder && (
        <div className="dispatch-alert-banner">
          <span className="dispatch-icon text-emerald-400">
            <WrenchIcon size={20} />
          </span>
          <div>
            <strong>Operator Approval Recorded</strong>
            <p>
              Work order reference <strong className="font-mono text-emerald-300">{dispatchedOrder}</strong> saved locally. It will sync when the edge gateway is online; this records approval only and does not claim physical execution.
            </p>
          </div>
          <button className="dismiss-btn" onClick={() => setDispatchedOrder(null)} aria-label="Dismiss">
            <XIcon size={14} />
          </button>
        </div>
      )}

      <div className="recommendations-stack">
        {recList.map((rec) => {
          const isOptimal = rec.rank === 1;
          const isApproved = rec.status === 'approved';
          const isRejected = rec.status === 'rejected';

          return (
            <article
              key={rec.id}
              className={`recommendation-card ${isOptimal ? 'optimal-card' : ''} ${isApproved ? 'is-approved-state' : ''}`}
            >
              <div className="rec-card-top">
                <div className="rec-rank-group">
                  <span className={`rec-rank-badge ${isOptimal ? 'optimal-badge' : ''}`}>
                    {isOptimal ? 'RANK 1 (OPTIMAL)' : `RANK ${rec.rank}`}
                  </span>
                  <span className="rec-confidence-pill font-mono">Confidence: {(rec.confidence * 100).toFixed(0)}%</span>
                  {isApproved && (
                    <span className="rec-status-tag approved flex items-center gap-1 font-mono">
                      <CheckCircleIcon size={12} />
                      CMMS Dispatched
                    </span>
                  )}
                  {isRejected && (
                    <span className="rec-status-tag rejected flex items-center gap-1 font-mono">
                      <XIcon size={12} />
                      Rejected
                    </span>
                  )}
                </div>
                <div className="rec-payback-tag">
                  <small>Payback Period</small>
                  <strong className="font-mono text-emerald-400">{rec.paybackPeriod}</strong>
                </div>
              </div>

              <div className="rec-card-body">
                <h3>{rec.title}</h3>
                <p className="rec-description">{rec.description}</p>
              </div>

              {/* Quantified Business & Technical Impact Grid */}
              <div className="rec-impact-grid">
                <div className="impact-box highlight">
                  <small>Daily Energy Saving</small>
                  <strong className="font-mono text-emerald-400">{rec.energySavingKwhDay.toLocaleString('en-IN')} kWh</strong>
                  <span className="impact-sub green-text font-mono">-{rec.secReductionPct}% SEC reduction</span>
                </div>
                <div className="impact-box">
                  <small>Daily Cost Saving</small>
                  <strong className="font-mono text-slate-100">&#8377;{rec.costSavingInrDay.toLocaleString('en-IN')}</strong>
                  <span className="impact-sub font-mono">&#8377;{(rec.savingsPerMonthInr / 100000).toFixed(1)}L / month</span>
                </div>
                <div className="impact-box">
                  <small>CO2 Abatement</small>
                  <strong className="font-mono text-cyan-400">{rec.co2ReductionKgDay} kg / day</strong>
                  <span className="impact-sub font-mono">{((rec.co2ReductionKgDay * 26 * 12) / 1000).toFixed(1)} tCO2e / year</span>
                </div>
                <div className="impact-box">
                  <small>Estimated CapEx</small>
                  <strong className="font-mono text-slate-100">{rec.cost}</strong>
                  <span className="impact-sub">{rec.effort}</span>
                </div>
              </div>

              {/* Hard Constraints Verification Strip */}
              <div className="rec-constraints-strip font-mono text-xs">
                <div className="constraint-check-item">
                  <CheckCircleIcon size={13} className="text-emerald-400" />
                  <span>Throughput: <strong className="text-slate-200">10.2 ton/day Preserved (0% loss)</strong></span>
                </div>
                <div className="constraint-check-item">
                  <CheckCircleIcon size={13} className="text-emerald-400" />
                  <span>Quality Yield: <strong className="text-slate-200">{rec.predictedYield}% Preserved</strong></span>
                </div>
                <div className="constraint-check-item">
                  <CheckCircleIcon size={13} className="text-emerald-400" />
                  <span>Safety: <strong className="text-slate-200">Pneumatic pressure in envelope (6.5 bar)</strong></span>
                </div>
              </div>

              {/* Human Approval Action Strip */}
              <div className="rec-approval-actions">
                <div className="rec-approval-left">
                  <span className="text-xs font-semibold text-slate-300">Operator Decision Gate</span>
                  <small className="text-slate-400 text-[11px] block">No autonomous actuator dispatch without plant supervisor sign-off.</small>
                </div>
                <div className="rec-approval-buttons">
                  <button
                    className={`btn-approve-rec ${isApproved ? 'btn-done' : 'btn-primary-glow'} flex items-center gap-1.5`}
                    disabled={isApproved}
                    onClick={() => handleApprove(rec.id)}
                  >
                    {isApproved ? (
                      <>
                        <CheckIcon size={14} />
                        <span>APPROVED & DISPATCHED</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheckIcon size={14} />
                        <span>APPROVE INTERVENTION</span>
                      </>
                    )}
                  </button>
                  <button
                    className="btn-reject-rec flex items-center gap-1"
                    disabled={isApproved}
                    onClick={() => handleReject(rec.id)}
                  >
                    <XIcon size={13} />
                    <span>REJECT</span>
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
