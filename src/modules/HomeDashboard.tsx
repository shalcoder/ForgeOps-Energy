import { ActivityIcon, AlertTriangleIcon, ArrowRightIcon, BarChartIcon, CheckCircleIcon, CpuIcon, GaugeIcon, ShieldCheckIcon } from '../components/Icons';
import { useWorkbenchData } from '../WorkbenchDataContext';
import type { AppView } from '../App';

const shortcuts: Array<{ view: AppView; title: string; detail: string; icon: typeof CpuIcon }> = [
  { view: 'workbench', title: 'Decision workbench', detail: 'Investigate, simulate, and approve', icon: CpuIcon },
  { view: 'fleet', title: 'Asset fleet', detail: 'Review equipment and events', icon: GaugeIcon },
  { view: 'economics', title: 'Energy economics', detail: 'Explore cost and savings', icon: BarChartIcon },
  { view: 'verification', title: 'Savings verification', detail: 'Check post-repair performance', icon: ShieldCheckIcon },
];

export function HomeDashboard({ onNavigate }: { onNavigate: (view: AppView) => void }) {
  const { data } = useWorkbenchData();
  const incident = data.incident;
  const activeAlerts = data.incidentEvents.filter((event) => event.severity === 'critical' || event.severity === 'warning');
  const primaryEvent = activeAlerts.find((event) => event.severity === 'critical') ?? activeAlerts[0];
  const impact = data.businessImpact;
  const shortPlant = incident.plant.replace('Foundry Cluster - ', '');

  return (
    <div className="overview-page">
      <header className="overview-heading">
        <div>
          <p className="eyebrow">PLANT OPERATIONS <span>·</span> {shortPlant.toUpperCase()}</p>
          <h1>Operations at a glance</h1>
          <p className="overview-subtitle">A clear view of energy performance and the work that needs attention.</p>
        </div>
        <div className="overview-date"><span className="status-dot" /> Edge connection <strong>{data.live ? 'Live' : 'Demo data'}</strong></div>
      </header>

      <section className="overview-metrics" aria-label="Energy performance">
        <article className="overview-metric">
          <span>Specific energy</span>
          <div><strong>{incident.currentSec.toFixed(1)}</strong><small>{incident.secUnit}</small></div>
          <p><span className="metric-change">{incident.secDeltaPct > 0 ? '+' : ''}{incident.secDeltaPct.toFixed(1)}%</span> from baseline</p>
        </article>
        <article className="overview-metric">
          <span>Open alerts</span>
          <div><strong>{activeAlerts.length}</strong><small>to review</small></div>
          <p><span className="metric-warning">{activeAlerts.filter((event) => event.severity === 'critical').length} critical</span> across the plant</p>
        </article>
        <article className="overview-metric">
          <span>Monthly opportunity</span>
          <div><strong>₹{Math.round(impact.monthlySavingsInr / 1000)}k</strong><small>estimated</small></div>
          <p>At current production and tariff</p>
        </article>
      </section>

      <section className="priority-card" aria-labelledby="priority-title">
        <div className="priority-mark"><AlertTriangleIcon size={19} /></div>
        <div className="priority-copy">
          <div className="priority-meta"><span className="priority-label">NEEDS ATTENTION</span><span>·</span><span>{incident.id}</span></div>
          <h2 id="priority-title">{primaryEvent?.label ?? incident.title}</h2>
          <p>{incident.summary}</p>
          <div className="priority-facts">
            <span><small>Area</small>{incident.line}</span>
            <span><small>Current SEC</small>{incident.currentSec.toFixed(1)} {incident.secUnit}</span>
            <span><small>Header pressure</small>{incident.airPressureBar?.toFixed(1) ?? '—'} bar</span>
            <span><small>Compressor load</small>{incident.compressorRuntimePct?.toFixed(0) ?? '—'}%</span>
          </div>
        </div>
        <button className="priority-action" onClick={() => onNavigate('workbench')}>Open investigation <ArrowRightIcon size={16} /></button>
      </section>

      <section className="overview-section" aria-labelledby="workspace-title">
        <div className="section-heading-row">
          <div><p className="eyebrow">YOUR WORKSPACE</p><h2 id="workspace-title">Go to a work area</h2></div>
          <span className="section-aside">Choose a view to see more detail</span>
        </div>
        <div className="workspace-links">
          {shortcuts.map(({ view, title, detail, icon: Icon }) => (
            <button key={view} className="workspace-link" onClick={() => onNavigate(view)}>
              <span className="workspace-link-icon"><Icon size={18} /></span>
              <span className="workspace-link-copy"><strong>{title}</strong><small>{detail}</small></span>
              <ArrowRightIcon size={16} />
            </button>
          ))}
        </div>
      </section>

      <section className="overview-bottom">
        <div className="activity-card">
          <div className="section-heading-row"><div><p className="eyebrow">LATEST UPDATES</p><h2>Recent activity</h2></div><button className="text-action" onClick={() => onNavigate('workbench')}>View timeline <ArrowRightIcon size={14} /></button></div>
          <div className="activity-list">
            {data.incidentEvents.slice(0, 3).map((event, index) => (
              <div className="activity-row" key={event.id}>
                <span className={`activity-marker ${event.severity}`}><span /></span>
                <div><strong>{event.label}</strong><small>{event.source} · {event.value}</small></div>
                <time>{new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(event.timestamp))}</time>
                {index === 0 && <span className="activity-new">NEW</span>}
              </div>
            ))}
            {!data.incidentEvents.length && <div className="activity-empty"><CheckCircleIcon size={17} /> No recent alerts. Plant is operating within its target range.</div>}
          </div>
        </div>
        <aside className="overview-note"><span className="note-symbol"><ActivityIcon size={17} /></span><p>ForgeOps brings plant signals, engineering context, and operational decisions together in one place.</p><button onClick={() => onNavigate('copilot')}>Ask ForgeOps <ArrowRightIcon size={14} /></button></aside>
      </section>
      <footer className="overview-footer">Updated {new Date(data.updatedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} <span>·</span> {data.source === 'degraded_fallback' ? 'Showing sample plant data' : 'Connected to plant data'}</footer>
    </div>
  );
}
