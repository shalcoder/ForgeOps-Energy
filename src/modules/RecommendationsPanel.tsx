import { useState } from 'react';
import { recommendations } from '../mockData';
import type { AssistantResponse, Recommendation } from '../types';

export function RecommendationsPanel({ agentResponse }: { agentResponse?: AssistantResponse | null }) {
  const [recList, setRecList] = useState<Recommendation[]>(recommendations);
  const [dispatchedOrder, setDispatchedOrder] = useState<string | null>(null);

  const handleApprove = (id: string) => {
    setRecList((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, status: 'approved' } : rec))
    );
    setDispatchedOrder(`WO-ENG-${Math.floor(1000 + Math.random() * 9000)}`);
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
          <span>Human-in-the-loop decision gate with quantified ROI and zero production risk</span>
        </div>
        <span className="objective-badge">Constraint: min(SEC) | Preserved Throughput & Quality</span>
      </header>

      {dispatchedOrder && (
        <div className="dispatch-alert-banner">
          <span className="dispatch-icon">🚀</span>
          <div>
            <strong>Intervention Approved & Work Order Dispatched!</strong>
            <p>
              CMMS Work Order <strong>{dispatchedOrder}</strong> dispatched to Plant Line 2 Maintenance. Execution scheduled for upcoming 48-minute die changeover. Edge verification tracking enabled.
            </p>
          </div>
          <button className="dismiss-btn" onClick={() => setDispatchedOrder(null)}>✕</button>
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
                    {isOptimal ? '★ RANK 1 (OPTIMAL)' : `RANK ${rec.rank}`}
                  </span>
                  <span className="rec-confidence-pill">Confidence: {(rec.confidence * 100).toFixed(0)}%</span>
                  {isApproved && <span className="rec-status-tag approved">✓ CMMS Dispatched</span>}
                  {isRejected && <span className="rec-status-tag rejected">✕ Rejected</span>}
                </div>
                <div className="rec-payback-tag">
                  <small>Payback Period</small>
                  <strong>{rec.paybackPeriod}</strong>
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
                  <strong>{rec.energySavingKwhDay.toLocaleString('en-IN')} kWh</strong>
                  <span className="impact-sub green-text">▼ {rec.secReductionPct}% SEC reduction</span>
                </div>
                <div className="impact-box">
                  <small>Daily Cost Saving</small>
                  <strong>₹{rec.costSavingInrDay.toLocaleString('en-IN')}</strong>
                  <span className="impact-sub">₹{(rec.savingsPerMonthInr / 100000).toFixed(1)}L / month</span>
                </div>
                <div className="impact-box">
                  <small>CO₂ Abatement</small>
                  <strong>{rec.co2ReductionKgDay} kg / day</strong>
                  <span className="impact-sub">{((rec.co2ReductionKgDay * 26 * 12) / 1000).toFixed(1)} tCO₂e / year</span>
                </div>
                <div className="impact-box">
                  <small>Estimated CapEx</small>
                  <strong>{rec.cost}</strong>
                  <span className="impact-sub">{rec.effort}</span>
                </div>
              </div>

              {/* Hard Constraints Verification Strip */}
              <div className="rec-constraints-strip">
                <div className="constraint-check-item">
                  <span className="check-dot">✓</span>
                  <span>Throughput: <strong>10.2 ton/day Preserved (0% loss)</strong></span>
                </div>
                <div className="constraint-check-item">
                  <span className="check-dot">✓</span>
                  <span>Quality Yield: <strong>{rec.predictedYield}% Preserved</strong></span>
                </div>
                <div className="constraint-check-item">
                  <span className="check-dot">✓</span>
                  <span>Safety: <strong>Pneumatic pressure within safe envelope (6.5 bar)</strong></span>
                </div>
              </div>

              {/* Human Approval Action Strip */}
              <div className="rec-approval-actions">
                <div className="rec-approval-left">
                  <span>Operator Approval Required</span>
                  <small>No autonomous equipment change without human supervisor sign-off.</small>
                </div>
                <div className="rec-approval-buttons">
                  <button
                    className={`btn-approve-rec ${isApproved ? 'btn-done' : 'btn-primary-glow'}`}
                    disabled={isApproved}
                    onClick={() => handleApprove(rec.id)}
                  >
                    {isApproved ? '✓ APPROVED & RUNNING' : 'APPROVE INTERVENTION'}
                  </button>
                  <button
                    className="btn-reject-rec"
                    disabled={isApproved}
                    onClick={() => handleReject(rec.id)}
                  >
                    REJECT
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
