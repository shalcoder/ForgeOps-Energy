import { useState } from 'react';
import { ActivityIcon, AlertTriangleIcon, ArrowRightIcon, ClockIcon, FileTextIcon, ShieldCheckIcon, SlidersIcon } from '../components/Icons';
import { useFocusContext } from '../FocusContext';
import { useWorkbenchData } from '../WorkbenchDataContext';
import { AuditDossier, exportAuditDossier } from './AuditDossier';
import { EvidencePanel } from './EvidencePanel';
import { GraphPanel } from './GraphPanel';
import { OfflineStatusBanner } from './OfflineStatusBanner';
import { RecommendationsPanel } from './RecommendationsPanel';
import { ReplayPanel } from './ReplayPanel';
import { SimulatorPanel } from './SimulatorPanel';
import { TimelinePanel } from './TimelinePanel';

type WorkbenchTab = 'investigate' | 'timeline' | 'simulate' | 'decision';

const tabs: Array<{ id: WorkbenchTab; label: string; detail: string; icon: typeof ActivityIcon }> = [
  { id: 'investigate', label: 'Investigation', detail: 'Cause & evidence', icon: ActivityIcon },
  { id: 'timeline', label: 'Timeline', detail: 'Events & replay', icon: ClockIcon },
  { id: 'simulate', label: 'What-if', detail: 'Test an intervention', icon: SlidersIcon },
  { id: 'decision', label: 'Decision', detail: 'Review & approve', icon: ShieldCheckIcon },
];

export function Workbench({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<WorkbenchTab>('investigate');
  const { focus } = useFocusContext();
  const { data } = useWorkbenchData();
  const incident = data.incident;
  const focusedEvent = data.incidentEvents.find((event) => event.id === focus.eventId);

  return (
    <div className="decision-page">
      <OfflineStatusBanner />
      <header className="decision-heading">
        <div>
          <div className="decision-breadcrumb"><button onClick={onBack}>Operations overview</button><span>/</span><span>Decision workspace</span></div>
          <p className="eyebrow">OPEN INCIDENT <span>·</span> {incident.id}</p>
          <h1>Line 2 compressed-air pressure loss</h1>
          <p className="decision-subtitle">Review the evidence, test options against operating limits, and record a clear operator decision.</p>
        </div>
        <div className="decision-heading-actions">
          <span className="incident-state"><i /> Investigation in progress</span>
          <button className="decision-export" onClick={() => exportAuditDossier(data, focus)}><FileTextIcon size={15} /> Export dossier</button>
        </div>
      </header>

      <section className="decision-incident-card">
        <span className="decision-alert-icon"><AlertTriangleIcon size={18} /></span>
        <div className="decision-incident-copy">
          <span className="decision-kicker">PRIORITY INCIDENT <span>·</span> {incident.line}</span>
          <h2>Compressed-air leakage is driving excess energy use</h2>
          <p>{incident.summary}</p>
        </div>
        <button className="decision-jump" onClick={() => setActiveTab('decision')}>Review decision <ArrowRightIcon size={15} /></button>
      </section>

      <section className="decision-metrics" aria-label="Incident measurements">
        <article><span>Specific energy</span><strong>{incident.currentSec.toFixed(1)} <small>{incident.secUnit}</small></strong><p><em>+{incident.secDeltaPct.toFixed(1)}%</em> above baseline</p></article>
        <article><span>Header pressure</span><strong>{incident.airPressureBar?.toFixed(1) ?? '—'} <small>bar</small></strong><p>Nominal operating pressure 7.2 bar</p></article>
        <article><span>Compressor on-load</span><strong>{incident.compressorRuntimePct?.toFixed(0) ?? '—'}<small>%</small></strong><p>Motor current {incident.motorCurrentA ?? '—'} A</p></article>
      </section>

      {focusedEvent && <div className="decision-focus-note"><ActivityIcon size={15} /><span>Focused event</span><strong>{focusedEvent.label}</strong><small>{focusedEvent.value}</small></div>}

      <nav className="decision-tabs" aria-label="Incident workflow">
        {tabs.map(({ id, label, detail, icon: Icon }, index) => (
          <button key={id} className={`decision-tab${activeTab === id ? ' active' : ''}`} onClick={() => setActiveTab(id)} aria-current={activeTab === id ? 'step' : undefined}>
            <span className="decision-tab-number">0{index + 1}</span>
            <Icon size={17} />
            <span className="decision-tab-copy"><strong>{label}</strong><small>{detail}</small></span>
            {index < tabs.length - 1 && <span className="decision-tab-connector" aria-hidden="true" />}
          </button>
        ))}
      </nav>

      <main className="decision-content">
        {activeTab === 'investigate' && <div className="decision-investigation"><GraphPanel /><EvidencePanel /></div>}
        {activeTab === 'timeline' && <div className="decision-timeline"><ReplayPanel /><TimelinePanel /></div>}
        {activeTab === 'simulate' && <SimulatorPanel />}
        {activeTab === 'decision' && <RecommendationsPanel />}
      </main>

      <footer className="decision-footer"><button onClick={onBack}>← Back to operations overview</button><span>Decision support only · Operator approval is required for any action</span></footer>
      <AuditDossier data={data} focus={focus} />
    </div>
  );
}
