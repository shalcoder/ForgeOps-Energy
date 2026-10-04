import React, { useState } from 'react';
import {
  FileTextIcon,
  ShieldCheckIcon,
  ZapIcon,
  ArrowRightIcon,
  CheckCircleIcon,
} from '../components/Icons';

type ReportsProps = {
  onNavigate: (view: string, detailId?: string) => void;
  selectedReportId?: string;
};

const REPORT_TEMPLATES = [
  {
    id: 'rep-plant',
    title: 'Plant Energy Performance Report',
    period: 'Monthly (September 2026)',
    desc: 'Executive summary of SEC, total consumption, baseline compliance, and feeder breakdown.',
    badge: 'Executive',
    size: '1.4 MB',
  },
  {
    id: 'rep-monthly',
    title: 'Monthly Savings & Financial Audit',
    period: 'September 2026',
    desc: 'Cost savings breakdown against DISCOM HT-2A tariff and ToD peak demand charges.',
    badge: 'Financial',
    size: '890 KB',
  },
  {
    id: 'rep-mv',
    title: 'Scenario M&V Calculation Report',
    period: 'INC-ENG-2401 (Line 2 Manifold)',
    desc: 'Synthetic-input baseline normalization example; not a certificate or field verification.',
    badge: 'Demo only',
    size: '640 KB',
  },
  {
    id: 'rep-intervention',
    title: 'Intervention & Work Order Dossier',
    period: 'WO-ENG-7922',
    desc: 'Full audit dossier from System 1 detection to human gate approval and post-repair telemetry.',
    badge: 'Audit Trail',
    size: '1.1 MB',
  },
  {
    id: 'rep-carbon',
    title: 'SEBI BRSR Core Carbon Disclosure',
    period: 'FY 2026-27 Tier-1 OEM Submission',
    desc: 'Scope 1 direct thermal emissions and Scope 2 indirect grid emissions intensity scorecard.',
    badge: 'ESG / BRSR',
    size: '720 KB',
  },
];

export function ReportsView({ onNavigate, selectedReportId }: ReportsProps) {
  const [downloadMsg, setDownloadMsg] = useState<string | null>(null);

  const handleDownload = (title: string, format: 'PDF' | 'CSV') => {
    setDownloadMsg(`Generated and downloaded "${title}" (${format})`);
    setTimeout(() => setDownloadMsg(null), 4000);
  };

  return (
    <div className="page-container">
      {/* ── Page Header ── */}
      <header className="page-header-clean">
        <div>
          <div className="page-kicker">
            <span className="kicker-tag">REPORTS & DOSSIERS</span>
            <span>Audit-Grade Compliance, Financial & Savings Exports</span>
          </div>
          <h1 className="page-title">Plant Reports & Decision Dossiers</h1>
          <p className="page-subtitle">
            Export demonstration reports for review. They are not certified, audited, or suitable as independent OEM or regulatory disclosures.
          </p>
        </div>
      </header>

      {downloadMsg && (
        <div style={{ padding: '12px 16px', borderRadius: '7px', background: '#edf4ec', border: '1px solid #d4e4d2', color: '#3b663b', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircleIcon size={16} />
          <span>{downloadMsg}</span>
        </div>
      )}

      {/* ── Report Templates Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '14px' }}>
        {REPORT_TEMPLATES.map((rep) => (
          <div key={rep.id} className="card-clean" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span className="provenance-badge provenance-measured">{rep.badge}</span>
                <h3 style={{ margin: '6px 0 2px', fontFamily: 'var(--font-serif)', fontSize: '16px', color: 'var(--text-primary)' }}>
                  {rep.title}
                </h3>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Period: {rep.period}</span>
              </div>
              <span className="font-mono text-muted" style={{ fontSize: '10px' }}>{rep.size}</span>
            </div>

            <p style={{ margin: '4px 0 0', fontSize: '11.5px', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
              {rep.desc}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--glass-border)' }}>
              <button
                className="text-action"
                onClick={() => handleDownload(rep.title, 'CSV')}
              >
                Export CSV
              </button>

              <button
                className="btn-primary-action"
                style={{ padding: '5px 12px', fontSize: '11px' }}
                onClick={() => handleDownload(rep.title, 'PDF')}
              >
                <FileTextIcon size={13} />
                <span>Generate PDF</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
