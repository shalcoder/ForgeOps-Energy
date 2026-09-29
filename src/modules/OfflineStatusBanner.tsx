import { useEffect, useState } from 'react';
import { getPendingApprovals, syncPendingApprovals } from '../offlineApprovals';
import { getRuntimeStatus } from '../integrations/forgeOpsClient';

export function OfflineStatusBanner() {
  const [online, setOnline] = useState(navigator.onLine);
  const [pending, setPending] = useState(getPendingApprovals().length);

  useEffect(() => {
    const refresh = () => setPending(getPendingApprovals().length);
    const checkGateway = async () => {
      const status = await getRuntimeStatus();
      setOnline(status.online);
      if (status.online) void syncPendingApprovals();
    };
    const reconnect = () => { void checkGateway(); };
    const disconnect = () => setOnline(false);
    window.addEventListener('online', reconnect);
    window.addEventListener('offline', disconnect);
    window.addEventListener('forgeops-approvals-changed', refresh);
    void checkGateway();
    const timer = window.setInterval(checkGateway, 15000);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('online', reconnect);
      window.removeEventListener('offline', disconnect);
      window.removeEventListener('forgeops-approvals-changed', refresh);
    };
  }, []);

  useEffect(() => {
    const refresh = () => setPending(getPendingApprovals().length);
    window.addEventListener('forgeops-approvals-changed', refresh);
    return () => window.removeEventListener('forgeops-approvals-changed', refresh);
  }, []);

  if (online && pending === 0) return null;
  return (
    <aside className={`edge-status-banner${online ? ' reconnecting' : ' offline'}`} role="status" aria-live="polite">
      <span className="edge-status-dot" />
      <strong>{online ? 'Edge gateway connected' : 'Edge gateway offline'}</strong>
      <span>{pending ? `${pending} approval${pending === 1 ? '' : 's'} ${online ? 'syncing' : 'saved on this device'}` : 'Waiting for connection to restore.'}</span>
      {online && pending > 0 && <button onClick={() => void syncPendingApprovals()}>Retry sync</button>}
    </aside>
  );
}
