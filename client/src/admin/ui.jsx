import { useCallback, useEffect, useState, useId } from 'react';
import { api } from '../lib/api.js';

// Loads admin data and gives a reload() to call after changes.
export function useAdmin(path) {
  const [state, setState] = useState({ data: null, error: null, loading: true });
  const load = useCallback(async () => {
    if (!path) return;
    setState((s) => ({ ...s, loading: true }));
    try {
      setState({ data: await api(path), error: null, loading: false });
    } catch (error) {
      setState({ data: null, error, loading: false });
    }
  }, [path]);
  useEffect(() => { load(); }, [load]);
  return { ...state, reload: load, setData: (fn) => setState((s) => ({ ...s, data: typeof fn === 'function' ? fn(s.data) : fn })) };
}

// Short-lived success message.
export function useFlash() {
  const [msg, setMsg] = useState('');
  useEffect(() => {
    if (!msg) return undefined;
    const t = setTimeout(() => setMsg(''), 5000);
    return () => clearTimeout(t);
  }, [msg]);
  return [msg, setMsg];
}

export function Field({ label, hint, full, error, children, id: idProp }) {
  const auto = useId();
  const id = idProp || auto;
  const child = typeof children === 'function' ? children({ id, 'aria-invalid': error ? 'true' : undefined, 'aria-describedby': hint || error ? `${id}-h` : undefined }) : children;
  return (
    <div className={`a-field${full ? ' full' : ''}`}>
      <label htmlFor={id} className="a-lbl">{label}</label>
      {child}
      {(error || hint) && <div id={`${id}-h`} className="a-hint" style={error ? { color: '#B00808', fontWeight: 600 } : undefined}>{error || hint}</div>}
    </div>
  );
}

export function Msg({ ok, err }) {
  return (
    <>
      {ok && <div className="a-ok" role="status">{ok}</div>}
      {err && <div className="a-err" role="alert">{err}</div>}
    </>
  );
}

// Delete button that asks once before acting.
export function ConfirmButton({ label = 'Delete', confirmLabel = 'Confirm delete', onConfirm, className = 'pill' }) {
  const [ask, setAsk] = useState(false);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!ask) return undefined;
    const t = setTimeout(() => setAsk(false), 6000);
    return () => clearTimeout(t);
  }, [ask]);
  if (!ask) return <button type="button" className={className} onClick={() => setAsk(true)}>{label}</button>;
  return (
    <span style={{ display: 'inline-flex', gap: 6 }}>
      <button type="button" className={className} disabled={busy} style={{ background: '#B00808', borderColor: '#B00808', color: '#fff' }}
        onClick={async () => { setBusy(true); try { await onConfirm(); } finally { setBusy(false); setAsk(false); } }}>{busy ? 'Working…' : confirmLabel}</button>
      <button type="button" className={className} onClick={() => setAsk(false)}>Cancel</button>
    </span>
  );
}

export function Badge({ tone = 'grey', children }) {
  return <span className={`a-badge ${tone}`}>{children}</span>;
}

export function SectionHead({ title, children }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
      <h2 className="a-h2">{title}</h2>
      {children && <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{children}</div>}
    </div>
  );
}

export function Spinner({ label = 'Loading…' }) {
  return <div role="status" style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#5A6378', fontSize: 15 }}><span className="spin" style={{ width: 24, height: 24, borderWidth: 4 }} />{label}</div>;
}

export const EmptyBox = ({ children }) => (
  <div style={{ background: '#F6F8FC', border: '1px dashed #B7C4E3', borderRadius: 10, padding: 28, textAlign: 'center', fontSize: 15, color: '#3E4860' }}>{children}</div>
);
