import React, { useState, useEffect, useRef } from 'react';
import {
  SearchIcon,
  XIcon,
  ArrowRightIcon,
  ZapIcon,
  GaugeIcon,
  ActivityIcon,
  ShieldCheckIcon,
  ClockIcon,
  SlidersIcon,
  CheckCircleIcon,
} from './Icons';

type CommandResult = {
  id: string;
  category: 'Asset' | 'Opportunity' | 'Investigation' | 'Action' | 'Verification';
  title: string;
  subtitle: string;
  badge?: string;
  view: string;
  detailId?: string;
};

const SEARCHABLE_ITEMS: CommandResult[] = [
  { id: 'cmp-01', category: 'Asset', title: 'CMP-01 — 75 kW Rotary Screw Compressor', subtitle: 'Feeder F-03 • Power 61 kW (+16.8% over baseline)', badge: 'Alert', view: 'assets', detailId: 'CMP-01' },
  { id: 'f-02', category: 'Asset', title: 'FURN-02 — 350 kW Holding & Pouring Furnace', subtitle: 'Feeder F-01B • 1,380°C Standby • Holding losses elevated', badge: 'Warning', view: 'assets', detailId: 'FURN-02' },
  { id: 'f-01', category: 'Asset', title: 'FURN-01 — 500 kW Induction Melting Furnace', subtitle: 'Feeder F-01 • 1,420°C • Nominal 540 kWh/ton SEC', badge: 'Normal', view: 'assets', detailId: 'FURN-01' },
  { id: 'opp-1', category: 'Opportunity', title: 'Compressor pressure setpoint optimization', subtitle: 'CMP-01 • Potential ₹48k/mo savings • Ready for investigation', badge: 'Ready', view: 'opportunities', detailId: 'opp-1' },
  { id: 'opp-2', category: 'Opportunity', title: 'Line 2 pneumatic distribution leakage', subtitle: 'Line 2 Moulding • Potential ₹61k/mo savings • Ready for decision', badge: 'Decision', view: 'opportunities', detailId: 'opp-2' },
  { id: 'opp-3', category: 'Opportunity', title: 'Furnace F-02 idle holding loss reduction', subtitle: 'FURN-02 • Potential ₹26k/mo savings • Simulated scenario', badge: 'Simulated', view: 'opportunities', detailId: 'opp-3' },
  { id: 'inv-1024', category: 'Investigation', title: 'INV-1024: CMP-01 abnormal energy consumption', subtitle: '4 Agents active • Analysis stage • Leading cause: Air leakage (82%)', badge: 'Analysis', view: 'investigations', detailId: 'INV-1024' },
  { id: 'wo-7922', category: 'Action', title: 'WO-ENG-7922: Repair CMP-01 pneumatic coupling', subtitle: 'Assigned to Shift B • Scheduled 14:30–15:15 • Expected -1.5 SEC', badge: 'Scheduled', view: 'actions', detailId: 'WO-ENG-7922' },
  { id: 'ver-332', category: 'Verification', title: 'VER-332: Illustrative Line 2 scenario', subtitle: 'Baseline-normalization example • Synthetic fixture inputs; no field-verified savings', badge: 'Modelled', view: 'verification', detailId: 'VER-332' },
];

export function CommandPalette({
  isOpen,
  onClose,
  onNavigate,
}: {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string, detailId?: string) => void;
}) {
  const [query, setQuery] = useState('');
  const [aiAnswer, setAiAnswer] = useState<{ text: string; links: Array<{ label: string; view: string; detailId?: string }> } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setAiAnswer(null);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled by parent
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredItems = query.trim()
    ? SEARCHABLE_ITEMS.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      )
    : SEARCHABLE_ITEMS;

  const handleAskQuestion = (q: string) => {
    const lower = q.toLowerCase();
    if (lower.includes('why') || lower.includes('increase') || lower.includes('sec')) {
      setAiAnswer({
        text: 'SEC increased 8.4% today because Compressor CMP-01 consumed 14.2% more power (61 kW vs 49 kW baseline) due to an unaddressed distribution leak on Line 2.',
        links: [
          { label: 'View CMP-01 Asset', view: 'assets', detailId: 'CMP-01' },
          { label: 'Open Investigation INV-1024', view: 'investigations', detailId: 'INV-1024' },
          { label: 'View Evidence Pack E1–E6', view: 'investigations', detailId: 'INV-1024' },
        ],
      });
    } else if (lower.includes('opportunity') || lower.includes('compressor')) {
      setAiAnswer({
        text: 'Found 2 high-impact opportunities on CMP-01: (1) Repair pneumatic coupling (saving ₹61k/mo, 42 min downtime) and (2) Optimize setpoint from 7.2 to 6.5 bar (saving ₹48k/mo, zero downtime).',
        links: [
          { label: 'View Opportunity Detail', view: 'opportunities', detailId: 'opp-1' },
          { label: 'Test What-If Scenarios', view: 'investigations', detailId: 'INV-1024' },
        ],
      });
    } else if (lower.includes('action') || lower.includes('work order') || lower.includes('wo')) {
      setAiAnswer({
        text: 'The prototype can prepare a proposed work-order draft for review. No live CMMS adapter is connected, so nothing is dispatched or scheduled.',
        links: [
          { label: 'View Action WO-ENG-7922', view: 'actions', detailId: 'WO-ENG-7922' },
          { label: 'Check Verification Plan', view: 'verification', detailId: 'VER-332' },
        ],
      });
    } else if (lower.includes('verify') || lower.includes('savings')) {
      setAiAnswer({
        text: 'No field-verified savings are recorded in this prototype. Explore the synthetic Line 2 normalization example; independent post-action meter and production data are required for verification.',
        links: [
          { label: 'View Savings Verification', view: 'verification', detailId: 'VER-332' },
          { label: 'Export M&V Report', view: 'reports', detailId: 'rep-mv' },
        ],
      });
    } else {
      setAiAnswer({
        text: `Showing demonstration fixtures related to "${q}". No live plant telemetry or completed interventions are connected.`,
        links: [
          { label: 'Live Operations', view: 'live-operations' },
          { label: 'All Opportunities', view: 'opportunities' },
        ],
      });
    }
  };

  return (
    <div className="command-palette-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="command-palette-modal" onClick={(e) => e.stopPropagation()}>
        <div className="command-palette-search">
          <SearchIcon size={18} className="text-secondary" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search plant assets, opportunities, investigations, or ask ForgeOps..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setAiAnswer(null);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && query.trim()) {
                handleAskQuestion(query);
              }
            }}
          />
          {query && (
            <button className="btn-secondary-action" style={{ padding: '3px 8px', fontSize: '10px' }} onClick={() => handleAskQuestion(query)}>
              <ActivityIcon size={12} />
              <span>Ask AI</span>
            </button>
          )}
          <button className="header-icon-btn" style={{ width: '28px', height: '28px' }} onClick={onClose} aria-label="Close">
            <XIcon size={14} />
          </button>
        </div>

        {/* AI Answer Card with clickable object links */}
        {aiAnswer && (
          <div className="command-palette-answer-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#bd6249', fontWeight: 700 }}>
              <ActivityIcon size={13} />
              <span>ForgeOps Context Response</span>
            </div>
            <p>{aiAnswer.text}</p>
            <div className="command-palette-actions">
              {aiAnswer.links.map((link) => (
                <button
                  key={link.label}
                  onClick={() => {
                    onNavigate(link.view, link.detailId);
                    onClose();
                  }}
                >
                  {link.label} &rarr;
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="command-palette-results">
          <div className="command-palette-group-title">
            {query.trim() ? `Search Results (${filteredItems.length})` : 'Quick Jump to Industrial Objects'}
          </div>

          {filteredItems.map((item) => (
            <button
              key={item.id}
              className="command-palette-item"
              onClick={() => {
                onNavigate(item.view, item.detailId);
                onClose();
              }}
            >
              <div className="command-palette-item-left">
                {item.category === 'Asset' && <GaugeIcon size={15} className="text-secondary" />}
                {item.category === 'Opportunity' && <ZapIcon size={15} style={{ color: '#bd6249' }} />}
                {item.category === 'Investigation' && <ActivityIcon size={15} style={{ color: '#a8793e' }} />}
                {item.category === 'Action' && <ClockIcon size={15} className="text-secondary" />}
                {item.category === 'Verification' && <ShieldCheckIcon size={15} style={{ color: '#5e7e60' }} />}

                <div>
                  <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-primary)' }}>{item.title}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{item.subtitle}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="command-palette-badge">{item.category}</span>
                {item.badge && <span className="provenance-badge provenance-modelled">{item.badge}</span>}
                <ArrowRightIcon size={13} className="text-muted" />
              </div>
            </button>
          ))}

          {!filteredItems.length && !aiAnswer && (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
              No objects matched "{query}". Press Enter to ask ForgeOps AI.
            </div>
          )}
        </div>

        <div className="command-palette-footer">
          <span>Press <strong>Enter</strong> to ask • <strong>Esc</strong> to close</span>
          <span>ForgeOps Energy v2.4 • Grounded in plant telemetry</span>
        </div>
      </div>
    </div>
  );
}
