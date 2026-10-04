import { useState } from 'react';
import {
  ActivityIcon,
  XIcon,
  SendIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  SlidersIcon,
  CheckCircleIcon,
  ZapIcon,
} from './Icons';

type CopilotResponse = {
  answer: string;
  evidence: string[];
  confidence: number;
  impact: string;
  nextAction: string;
  actionLabel: string;
  actionTarget: 'workbench' | 'verification' | 'fleet';
};

export function AskForgeOpsModal({
  isOpen,
  onClose,
  onNavigate,
  currentPage,
}: {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: 'dashboard' | 'workbench' | 'fleet' | 'verification' | 'architecture' | 'economics') => void;
  currentPage: string;
}) {
  const [query, setQuery] = useState('');
  const [activeResponse, setActiveResponse] = useState<CopilotResponse | null>({
    answer: 'In the synthetic case study, Specific Energy Consumption (SEC) rises +14.3% above its fixture baseline (9.8 to 11.2 kWh/t). These are demonstration values, not live plant readings.',
    evidence: [
      'Fixture scenario: pneumatic manifold pressure changes from 7.2 to 6.1 bar (-15.3%)',
      'COMP-02 screw compressor on-load modulation surged from 62% to 84% (+22% duty)',
      'Motor drive current increased to 142 A (+13.6% overload)',
      'Throughput and quality values are held as synthetic scenario guardrails',
    ],
    confidence: 0.72,
    impact: 'Illustrative cost estimate from fixture assumptions; verify with site meters and tariff.',
    nextAction: 'Inspect the evidence and confirm the hypothesis with plant staff before drafting a work order.',
    actionLabel: 'Launch What-If Simulation in Workbench',
    actionTarget: 'workbench',
  });

  if (!isOpen) return null;

  const handleAsk = (presetQuestion?: string) => {
    const q = presetQuestion || query;
    if (!q) return;

    if (q.toLowerCase().includes('setpoint') || q.toLowerCase().includes('simulate')) {
      setActiveResponse({
        answer: 'The synthetic case-study simulation estimates 9.2 kWh/t at a 6.5 bar setpoint with assumed leak repair (-18% vs the incident input). It is not a plant measurement or operating instruction.',
        evidence: [
          'Fixture repair-cost assumption: ₹9,500; verify with site quotes',
          'Downtime and timing must be assessed by the plant team',
          'Throughput, quality, and safety checks are modeled guardrails only',
        ],
        confidence: 0.96,
        impact: 'Fixture estimate only; no realized savings or site payback has been established.',
        nextAction: 'Validate the scenario with the plant team and prepare a draft action for human review.',
        actionLabel: 'Open Decision Gate in Workbench',
        actionTarget: 'workbench',
      });
    } else if (q.toLowerCase().includes('verified') || q.toLowerCase().includes('savings') || q.toLowerCase().includes('ipmvp')) {
      setActiveResponse({
        answer: 'This prototype calculates an illustrative before/after scenario using synthetic inputs. No post-maintenance plant meter data is connected, so it cannot verify savings or issue an IPMVP certificate.',
        evidence: [
          'Throughput and quality are scenario guardrails; actual production data is not connected',
          'Independent post-action meter and production data are required for savings verification',
          'Carbon values are indicative and depend on a site-specific emissions factor',
        ],
        confidence: 0.72,
        impact: 'Scenario estimate only; not field verified, certified, or written to a plant ledger.',
        nextAction: 'Review the normalization example and requirements for independent M&V.',
        actionLabel: 'View Closed-Loop Verification Center',
        actionTarget: 'verification',
      });
    } else {
      setActiveResponse({
        answer: 'The synthetic case study points to compressed-air leakage as a root-cause hypothesis. Confirm it with calibrated site readings and a maintenance inspection.',
        evidence: [
          'Synthetic fixture includes three sample maintenance records; no live CMMS is connected',
          'Fixture input: 1.1 bar pressure change across the delivery manifold',
          'Scenario compressor draw: 68 kW; validate onsite',
        ],
        confidence: 0.72,
        impact: 'Illustrative cost exposure only; calculate actual impact from site meter data and tariff.',
        nextAction: 'Validate onsite and prepare a proposed work-order draft for human review.',
        actionLabel: 'Inspect Multi-Sensor Diagnostics',
        actionTarget: 'workbench',
      });
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--modal-overlay, rgba(7, 10, 17, 0.75))',
      backdropFilter: 'blur(16px)',
      animation: 'fadeIn 0.15s ease-out',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '720px',
        backgroundColor: 'var(--glass-surface-elevated)',
        backdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.14)',
        borderRadius: '14px',
        boxShadow: '0 24px 64px -12px rgba(0, 0, 0, 0.7), 0 0 32px rgba(0, 211, 40, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'linear-gradient(90deg, rgba(0, 211, 40, 0.08) 0%, transparent 100%)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'linear-gradient(135deg, #00e02c, #00843d)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ActivityIcon size={16} />
            </div>
            <div>
              <strong style={{ fontSize: '14px', color: '#f9fafb' }}>Ask ForgeOps • Contextual AI Decision Copilot</strong>
              <div style={{ fontSize: '11px', color: '#9ca3af', fontFamily: 'var(--font-mono)' }}>
                Active Context: Belgaum Line 2 • Page: {currentPage} • INC-ENG-2401
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: '4px' }}
          >
            <XIcon size={18} />
          </button>
        </div>

        {/* Input Bar */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            placeholder="Ask anything about plant energy, root causes, simulation, or savings..."
            style={{
              flexGrow: 1,
              background: 'var(--glass-surface)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '10px 14px',
              color: '#f9fafb',
              fontSize: '13px',
              outline: 'none',
              boxShadow: 'var(--neu-sunken)',
            }}
          />
          <button className="btn-primary-action" onClick={() => handleAsk()}>
            <SendIcon size={14} />
            <span>Ask</span>
          </button>
        </div>

        {/* Quick Suggested Queries */}
        <div style={{ padding: '10px 24px', display: 'flex', gap: '8px', flexWrap: 'wrap', background: 'rgba(11, 17, 30, 0.5)' }}>
          <button
            className="btn-secondary-action"
            style={{ fontSize: '11px', padding: '4px 10px' }}
            onClick={() => handleAsk('Why did Line 2 SEC increase this morning?')}
          >
            Why did SEC increase this morning?
          </button>
          <button
            className="btn-secondary-action"
            style={{ fontSize: '11px', padding: '4px 10px' }}
            onClick={() => handleAsk('What happens if I reduce compressor setpoint to 6.5 bar?')}
          >
            What happens if I reduce setpoint to 6.5 bar?
          </button>
          <button
            className="btn-secondary-action"
            style={{ fontSize: '11px', padding: '4px 10px' }}
            onClick={() => handleAsk('Show me the modelled before and after scenario')}
          >
            Show modelled scenario
          </button>
        </div>

        {/* Response Body (Strict Section 65 UX Rule) */}
        {activeResponse && (
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '440px', overflowY: 'auto' }}>
            {/* 1. Answer */}
            <div>
              <span style={{ fontSize: '11px', color: '#00d328', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                EXECUTIVE ANSWER
              </span>
              <p style={{ fontSize: '13.5px', color: '#f9fafb', lineHeight: '1.6', marginTop: '4px' }}>
                {activeResponse.answer}
              </p>
            </div>

            {/* 2. Evidence */}
            <div style={{ background: 'var(--glass-surface)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 600 }}>
                  MULTI-SENSOR EVIDENCE BUNDLE
                </span>
                <span className="kpi-badge success">{(activeResponse.confidence * 100).toFixed(0)}% Confidence</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px', color: '#cbd5e1', fontSize: '12px', lineHeight: '1.6' }}>
                {activeResponse.evidence.map((ev, i) => (
                  <li key={i}>{ev}</li>
                ))}
              </ul>
            </div>

            {/* 3. Impact & Next Action */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ background: 'var(--glass-surface)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '12px' }}>
                <span style={{ fontSize: '10.5px', color: '#f87171', textTransform: 'uppercase', fontWeight: 600 }}>OPERATIONAL IMPACT</span>
                <p style={{ fontSize: '12px', color: '#f9fafb', margin: '4px 0 0 0', fontWeight: 600 }}>{activeResponse.impact}</p>
              </div>

              <div style={{ background: 'var(--glass-surface)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '12px' }}>
                <span style={{ fontSize: '10.5px', color: '#38bdf8', textTransform: 'uppercase', fontWeight: 600 }}>RECOMMENDED NEXT STEP</span>
                <p style={{ fontSize: '12px', color: '#f9fafb', margin: '4px 0 0 0' }}>{activeResponse.nextAction}</p>
              </div>
            </div>

            {/* Action Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
              <button
                className="btn-primary-action"
                onClick={() => {
                  onClose();
                  onNavigate(activeResponse.actionTarget);
                }}
              >
                <span>{activeResponse.actionLabel}</span>
                <ArrowRightIcon size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
