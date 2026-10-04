import { useState } from 'react';
import {
  ActivityIcon,
  SendIcon,
  ArrowRightIcon,
  ZapIcon,
  ShieldCheckIcon,
  GaugeIcon,
} from './Icons';

type CopilotResponse = {
  answer: string;
  evidence: string[];
  confidence: number;
  impact: string;
  nextAction: string;
  actionLabel: string;
  actionTarget: 'workbench' | 'verification' | 'fleet' | 'economics';
};

const PRESET_QUESTIONS = [
  { label: 'Why did SEC increase this morning?', query: 'Why did Line 2 SEC increase this morning?' },
  { label: 'Simulate setpoint 6.5 bar', query: 'What happens if I reduce compressor setpoint to 6.5 bar?' },
  { label: 'Modelled scenario savings', query: 'Show me the modelled before and after scenario' },
  { label: 'Best intervention for COMP-02?', query: 'What is the best intervention for COMP-02 leak?' },
  { label: 'ROI of BEE upgrade?', query: 'What is the ROI of the BEE hardware upgrade?' },
];

const SUGGESTION_CARDS = [
  {
    icon: <ZapIcon size={16} />,
    title: 'Energy Anomaly Analysis',
    desc: 'Ask why SEC deviated, which asset caused it, and what the financial bleed rate is.',
    query: 'Why did Line 2 SEC increase this morning?',
  },
  {
    icon: <GaugeIcon size={16} />,
    title: 'What-If Simulation',
    desc: 'Simulate setpoint changes, leak remediation, or load shifting and see predicted SEC impact.',
    query: 'What happens if I reduce compressor setpoint to 6.5 bar?',
  },
  {
    icon: <ShieldCheckIcon size={16} />,
    title: 'IPMVP Savings Verification',
    desc: 'Explore an illustrative baseline-normalization example. It is not field measurement or independent verification.',
    query: 'Show me the modelled before and after scenario',
  },
];

export function AskForgeOpsView({ onNavigate }: {
  onNavigate: (view: 'dashboard' | 'workbench' | 'fleet' | 'verification' | 'economics') => void;
}) {
  const [query, setQuery] = useState('');
  const [activeResponse, setActiveResponse] = useState<CopilotResponse | null>(null);

  const handleAsk = (presetQuestion?: string) => {
    const q = presetQuestion || query;
    if (!q.trim()) return;

    if (q.toLowerCase().includes('setpoint') || q.toLowerCase().includes('simulate')) {
      setActiveResponse({
        answer: 'In the synthetic Belgaum case study, the simulation estimates 9.2 kWh/t after a 6.5 bar setpoint and assumed leak repair (-18% vs the incident input). This is a scenario result, not a plant measurement or operating instruction.',
        evidence: [
          'Fixture assumption: ₹9,500 repair cost; confirm against site quotes',
          'Downtime and production timing require plant-team validation',
          'Throughput, quality, and safety constraints are modelled guardrails only',
        ],
        confidence: 0.96,
        impact: 'The fixture estimates ₹6,240/day avoided cost under its assumptions; no realized savings or site payback is established.',
        nextAction: 'Review assumptions with the plant team and draft a proposed work order if appropriate.',
        actionLabel: 'Open Decision Gate in Workbench →',
        actionTarget: 'workbench',
      });
    } else if (q.toLowerCase().includes('ipmvp') || q.toLowerCase().includes('savings') || q.toLowerCase().includes('verified')) {
      setActiveResponse({
        answer: 'This prototype can calculate an illustrative before/after scenario from synthetic inputs. It has no post-maintenance plant meter data and cannot verify savings or issue an IPMVP certificate.',
        evidence: [
          'The demo holds throughput and quality guardrail inputs constant; no actual production record is connected',
          'Independent post-action meter and production data are required for a savings claim',
          'Carbon output is indicative and depends on a site-specific emissions factor',
        ],
        confidence: 0.72,
        impact: 'Modelled scenario only; not certified, field verified, or logged to a real plant ledger.',
        nextAction: 'Review the illustrative normalization example and M&V requirements.',
        actionLabel: 'View Verification Center →',
        actionTarget: 'verification',
      });
    } else if (q.toLowerCase().includes('roi') || q.toLowerCase().includes('bee') || q.toLowerCase().includes('economics')) {
      setActiveResponse({
        answer: 'Use the economics view as a planning calculator: enter site energy, tariff, expected efficiency, installation, and recurring service assumptions. Its outputs are not a quote or guaranteed saving.',
        evidence: [
          'Schneider PM8000 sub-meter + edge gateway: ₹4.8L',
          'Agent pipeline compute: ₹1.2L/year (cloud)',
          'BEE/ADEETIE eligibility and loan benefits must be confirmed with BEE and the lender; no grant is assumed',
        ],
        confidence: 0.68,
        impact: 'Indicative scenario economics only. No customer savings or NPV has been validated.',
        nextAction: 'Review the assumptions and obtain site-specific installation quotes.',
        actionLabel: 'Open Economics & BEE →',
        actionTarget: 'economics',
      });
    } else {
      setActiveResponse({
        answer: 'The synthetic case study points to compressed-air leakage as a root-cause hypothesis. Confirm it with calibrated site meters, pressure readings, operating context, and a maintenance inspection.',
        evidence: [
          '3 leak complaints logged in CMMS over past 14 days on Line 2 Moulding Bank',
          'Header pressure deficit: 1.1 bar loss across delivery manifold',
          'COMP-02 continuous on-load draw: 68 kW (+21% duty cycle above nominal)',
        ],
        confidence: 0.72,
        impact: 'Fixture-only cost estimate; actual exposure depends on measured site energy and tariff.',
        nextAction: 'Inspect the evidence, validate the hypothesis, and prepare a draft work order for human review.',
        actionLabel: 'Investigate in Workbench →',
        actionTarget: 'workbench',
      });
    }
    setQuery('');
  };

  return (
    <div style={{ padding: '28px 32px', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span style={{
            fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
            color: 'var(--schneider-green)', fontFamily: 'var(--font-mono)',
            background: 'rgba(0,211,40,0.10)', padding: '3px 10px', borderRadius: '4px',
            border: '1px solid rgba(0,211,40,0.25)',
          }}>AI DECISION COPILOT</span>
          <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            BELGAUM LINE 2 • INC-ENG-2401 ACTIVE
          </span>
        </div>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
          Ask ForgeOps
        </h1>
        <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginTop: '6px' }}>
          Prototype decision support over a synthetic foundry case study. It can model scenarios; it is not connected to live plant telemetry and does not verify savings.
        </p>
      </div>

      {/* ─── Input Row ─────────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', gap: '10px', marginBottom: '16px',
        background: 'var(--glass-surface)',
        border: '1px solid var(--glass-border)',
        borderRadius: '12px',
        padding: '14px 16px',
        boxShadow: 'var(--neu-sunken)',
        backdropFilter: 'blur(12px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--schneider-green)' }}>
          <ActivityIcon size={18} />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
          placeholder="Ask anything about plant energy, root causes, simulation, or savings..."
          style={{
            flexGrow: 1,
            background: 'transparent',
            border: 'none',
            color: 'var(--text-primary)',
            fontSize: '14px',
            outline: 'none',
            fontFamily: 'var(--font-sans)',
          }}
        />
        <button
          className="schneider-btn schneider-btn-primary"
          style={{ padding: '8px 20px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}
          onClick={() => handleAsk()}
        >
          <SendIcon size={13} />
          <span>Ask</span>
        </button>
      </div>

      {/* ─── Quick Suggestion Pills ─────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '32px' }}>
        {PRESET_QUESTIONS.map(({ label, query: q }) => (
          <button
            key={label}
            className="btn-secondary-action"
            style={{ fontSize: '11.5px', padding: '5px 12px' }}
            onClick={() => handleAsk(q)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ─── Response Panel (shown after query) ─────────────────────────────── */}
      {activeResponse ? (
        <div style={{
          background: 'var(--glass-surface)',
          border: '1px solid var(--glass-border)',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: 'var(--spatial-shadow-floating)',
          backdropFilter: 'blur(16px)',
        }}>
          {/* Response header stripe */}
          <div style={{
            padding: '14px 24px',
            background: 'linear-gradient(90deg, rgba(0,211,40,0.10) 0%, transparent 100%)',
            borderBottom: '1px solid var(--glass-border)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '24px', height: '24px', borderRadius: '6px',
                background: 'linear-gradient(135deg, #00e02c, #00843d)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <ActivityIcon size={13} color="#fff" />
              </div>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                ForgeOps AI Response
              </span>
            </div>
            <span className="kpi-badge success" style={{ fontSize: '11px' }}>
              {(activeResponse.confidence * 100).toFixed(0)}% Confidence
            </span>
          </div>

          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* 1. Answer */}
            <div>
              <span style={{
                fontSize: '10.5px', color: 'var(--schneider-green)', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.07em',
              }}>Executive Answer</span>
              <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: '1.65', marginTop: '6px', fontWeight: 500 }}>
                {activeResponse.answer}
              </p>
            </div>

            {/* 2. Evidence */}
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--glass-border)',
              borderRadius: '10px', padding: '16px',
            }}>
              <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.06em' }}>
                Multi-Sensor Evidence Bundle
              </span>
              <ul style={{ margin: '10px 0 0 0', paddingLeft: '18px', color: 'var(--text-secondary)', fontSize: '12.5px', lineHeight: '1.7' }}>
                {activeResponse.evidence.map((ev, i) => (
                  <li key={i}>{ev}</li>
                ))}
              </ul>
            </div>

            {/* 3. Impact + Next Action */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--alert-border)', borderRadius: '10px', padding: '14px' }}>
                <span style={{ fontSize: '10.5px', color: '#f87171', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.06em' }}>
                  Operational Impact
                </span>
                <p style={{ fontSize: '13px', color: 'var(--text-primary)', margin: '6px 0 0 0', fontWeight: 600 }}>
                  {activeResponse.impact}
                </p>
              </div>
              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--cyan-border)', borderRadius: '10px', padding: '14px' }}>
                <span style={{ fontSize: '10.5px', color: '#38bdf8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.06em' }}>
                  Recommended Next Step
                </span>
                <p style={{ fontSize: '13px', color: 'var(--text-primary)', margin: '6px 0 0 0' }}>
                  {activeResponse.nextAction}
                </p>
              </div>
            </div>

            {/* Action Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                className="schneider-btn schneider-btn-primary"
                style={{ padding: '10px 24px', borderRadius: '8px', fontSize: '13px', fontWeight: 600 }}
                onClick={() => onNavigate(activeResponse.actionTarget)}
              >
                {activeResponse.actionLabel}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ─── Empty State: Suggestion Cards ──────────────────────────────── */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {SUGGESTION_CARDS.map(({ icon, title, desc, query: q }) => (
            <button
              key={title}
              onClick={() => handleAsk(q)}
              style={{
                background: 'var(--glass-surface)',
                border: '1px solid var(--glass-border)',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s',
                backdropFilter: 'blur(12px)',
                display: 'flex', flexDirection: 'column', gap: '10px',
              }}
              onMouseOver={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--emerald-border)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,211,40,0.12)';
              }}
              onMouseOut={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--glass-border)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}
            >
              <div style={{ color: 'var(--schneider-green)' }}>{icon}</div>
              <div>
                <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {title}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.55' }}>
                  {desc}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
