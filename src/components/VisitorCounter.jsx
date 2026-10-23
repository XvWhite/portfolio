import { useEffect, useState } from 'react';
import './VisitorCounter.css';

const STORAGE_KEY = 'gch_portfolio_visitor_id_v1';

const createVisitorId = () => {
  if (typeof crypto?.randomUUID === 'function') return crypto.randomUUID();
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = [...bytes].map(value => value.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
};

const getStoredVisitorId = () => {
  try {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (existing) return existing;
    const created = createVisitorId();
    localStorage.setItem(STORAGE_KEY, created);
    return created;
  } catch {
    return null;
  }
};

export default function VisitorCounter() {
  const [count, setCount] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadCount = async () => {
      const visitorId = getStoredVisitorId();
      const response = await fetch('/api/visitors', visitorId ? {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitorId }),
        signal: controller.signal,
      } : { signal: controller.signal });

      if (!response.ok) return;
      const payload = await response.json();
      if (Number.isSafeInteger(payload.count) && payload.count >= 0) setCount(payload.count);
    };

    loadCount().catch(() => {});
    return () => controller.abort();
  }, []);

  const ready = count !== null;
  const displayCount = String(count ?? 0).padStart(4, '0');

  return <span
    className={`visitor-counter${ready ? ' is-ready' : ''}`}
    aria-hidden={ready ? undefined : 'true'}
    aria-label={ready ? `累计独立访客 ${count} 人` : undefined}
  >
    <span aria-hidden="true">VISITORS</span>
    <strong aria-hidden="true">{displayCount}</strong>
  </span>;
}
