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
    title: 'Plant Energy Scenario Report',
    period: 'Synthetic Belgaum case study',
    desc: 'Executive summary of SEC, total consumption, baseline compliance, and feeder breakdown.',
    badge: 'Executive',
    size: '1.4 MB',
  },
  {
    id: 'rep-monthly',
    title: 'Scenario Economics Worksheet',
    period: 'Synthetic Belgaum case study',
    desc: 'Modelled cost assumptions for review; not realized savings or a financial audit.',
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
    title: 'Proposed Intervention & Work-Order Draft',
    period: 'WO-ENG-7922',
    desc: 'Prototype decision flow with a proposed draft; no work order was dispatched and no post-repair telemetry exists.',
    badge: 'Audit Trail',
    size: '1.1 MB',
  },
  {
    id: 'rep-carbon',
    title: 'Illustrative Energy & Carbon Worksheet',
    period: 'Synthetic Belgaum case study',
    desc: 'Example fields only. This is not a SEBI BRSR disclosure, audited inventory, or OEM submission.',
    badge: 'Sample only',
    size: '720 KB',
  },
];

export function ReportsView({ onNavigate, selectedReportId }: ReportsProps) {
  const [downloadMsg, setDownloadMsg] = useState<string | null>(null);

  const handleDownload = (report: typeof REPORT_TEMPLATES[number], format: 'PDF' | 'CSV') => {
    const rows = [
      ['Report', report.title],
      ['Period / scenario', report.period],
      ['Description', report.desc],
      ['Data boundary', 'Synthetic demonstration fixtures; no connected plant telemetry'],
      ['Claim boundary', 'Not audited, certified, field-measured, or suitable as a regulatory/OEM disclosure'],
    ];
    if (format === 'CSV') {
      const csv = rows.map(row => row.map(value => `"${value.replace(/"/g, '""')}"`).join(',')).join('\r\n');
      const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = `${report.id}-demo.csv`;
      link.click();
      URL.revokeObjectURL(url);
      setDownloadMsg(`Downloaded the synthetic-fixture CSV for "${report.title}".`);
      return;
    }
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      setDownloadMsg('Allow the print window to open, then choose Save as PDF.');
      return;
    }
    const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
    printWindow.document.write(`<!doctype html><html><head><title>${escapeHtml(report.title)}</title><style>body{font:16px Arial,sans-serif;max-width:820px;margin:48px auto;line-height:1.5;color:#1f2933}h1{font-size:26px}.notice{padding:14px;background:#fff8e8;border:1px solid #ead9b2}small{color:#5b6570}</style></head><body><h1>${escapeHtml(report.title)}</h1><p>${escapeHtml(report.period)}</p><p>${escapeHtml(report.desc)}</p><div class="notice"><strong>Prototype data notice</strong><p>Synthetic demonstration fixtures only. No connected plant telemetry, completed physical intervention, field-verified savings, audit, or certification is represented.</p></div><p><small>ForgeOps Energy · Demo export · Not for regulatory or OEM disclosure</small></p><script>window.onload=()=>window.print()</script></body></html>`);
    printWindow.document.close();
    setDownloadMsg(`Opened a print-ready demo worksheet for "${report.title}".`);
  };

  return (
    <div className="page-container">
      {/* ── Page Header ── */}
      <header className="page-header-clean">
        <div>
          <div className="page-kicker">
            <span className="kicker-tag">REPORTS & DOSSIERS</span>
            <span>Illustrative exports for review</span>
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
                <span className="provenance-badge provenance-simulated">{rep.badge}</span>
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
                onClick={() => handleDownload(rep, 'CSV')}
              >
                Export CSV
              </button>

              <button
                className="btn-primary-action"
                style={{ padding: '5px 12px', fontSize: '11px' }}
                onClick={() => handleDownload(rep, 'PDF')}
              >
                <FileTextIcon size={13} />
                <span>Print / Save PDF</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
