import { Fragment, useEffect, useState } from 'react';
import { useAdmin, Spinner, SectionHead, ConfirmButton, EmptyBox, Msg, Badge, useFlash } from '../ui.jsx';
import { api } from '../../lib/api.js';
import { fmtDateTime, telHref } from '../../lib/format.js';

const FILTERS = [['all', 'All'], ['new', 'New'], ['handled', 'Handled']];

export default function Enquiries() {
  const [status, setStatus] = useState('new');
  const [q, setQ] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(null);
  const [ok, setOk] = useFlash();
  const [err, setErr] = useState('');
  // Search after typing stops.
  useEffect(() => { const t = setTimeout(() => { setQuery(q.trim()); setPage(1); }, 350); return () => clearTimeout(t); }, [q]);
  const params = new URLSearchParams({ page: String(page), ...(status !== 'all' ? { status } : {}), ...(query ? { q: query } : {}) });
  const { data, error, loading, reload } = useAdmin(`/admin/enquiries?${params}`);
  const list = data?.enquiries || [];
  const exportParams = new URLSearchParams({ ...(status !== 'all' ? { status } : {}), ...(query ? { q: query } : {}) });

  async function mark(e, s) {
    setErr('');
    try {
      await api(`/admin/enquiries/${e.id}`, { method: 'PATCH', body: { status: s } });
      setOk(s === 'handled' ? `Marked ${e.name}'s enquiry as handled.` : `Moved ${e.name}'s enquiry back to new.`);
      reload();
    } catch (ex) { setErr(ex.message); }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <SectionHead title="Enquiries">
        <a className="a-ghost" href={`/api/admin/enquiries.csv?${exportParams}`} download>Export CSV</a>
      </SectionHead>
      <p className="a-hint" style={{ margin: 0, fontSize: 14 }}>Messages sent through the Contact form. Call the parent back, then mark the enquiry as handled. The CSV opens in Excel or Google Sheets.</p>
      <Msg ok={ok} err={err} />
      <div className="a-card">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center', justifyContent: 'space-between' }}>
          <input className="a-in" type="search" aria-label="Search enquiries" placeholder="Search name, phone, email or reference" value={q} onChange={(e) => setQ(e.target.value)} style={{ height: 44, flex: '1 1 220px', maxWidth: 360 }} />
          <div role="group" aria-label="Filter by status" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {FILTERS.map(([k, l]) => (
              <button key={k} type="button" className={status === k ? 'pill on' : 'pill'} aria-pressed={status === k} onClick={() => { setStatus(k); setPage(1); }}>
                {l}{k === 'new' && data?.newCount ? ` (${data.newCount})` : ''}
              </button>
            ))}
          </div>
        </div>
        {loading && !data && <Spinner />}
        {error && <div className="a-err" role="alert">{error.message}</div>}
        {data && <div style={{ fontSize: 13, color: '#5A6378' }} aria-live="polite">{data.total} {data.total === 1 ? 'enquiry' : 'enquiries'}</div>}
        {data && list.length === 0 && <EmptyBox>{status === 'new' ? 'No new enquiries. All caught up.' : 'No enquiries found.'}</EmptyBox>}
        {list.length > 0 && (
          <div className="a-tbl-wrap">
            <table className="tbl">
              <thead><tr><th>Received</th><th>Student</th><th>Phone</th><th>Program</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {list.map((e) => (
                  <Fragment key={e.id}>
                    <tr>
                      <td style={{ whiteSpace: 'nowrap' }}>{fmtDateTime(e.createdAt)}<div style={{ fontSize: 12, color: '#8A93A8' }}>{e.ref}</div></td>
                      <td><b style={{ color: '#0A1530' }}>{e.name}</b>{e.studentClass && <div style={{ fontSize: 12 }}>{e.studentClass}</div>}</td>
                      <td style={{ whiteSpace: 'nowrap' }}><a href={telHref(e.phone)}>{e.phone}</a></td>
                      <td>{e.program || '—'}{e.centre && <div style={{ fontSize: 12 }}>{e.centre}</div>}</td>
                      <td>{e.status === 'new' ? <Badge tone="red">New</Badge> : <Badge tone="green">Handled</Badge>}</td>
                      <td>
                        <div className="a-row-actions">
                          <button type="button" className="pill" aria-expanded={open === e.id} onClick={() => setOpen(open === e.id ? null : e.id)}>{open === e.id ? 'Hide' : 'View'}</button>
                          {e.status === 'new'
                            ? <button type="button" className="pill on" onClick={() => mark(e, 'handled')}>Mark handled</button>
                            : <button type="button" className="pill" onClick={() => mark(e, 'new')}>Mark new</button>}
                        </div>
                      </td>
                    </tr>
                    {open === e.id && (
                      <tr>
                        <td colSpan={6} style={{ background: '#FFFBF2' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 12, fontSize: 14, color: '#0A1530' }}>
                            <div><b>Email</b><br />{e.email ? <a href={`mailto:${e.email}`}>{e.email}</a> : '—'}</div>
                            <div><b>Class</b><br />{e.studentClass || '—'}</div>
                            <div><b>Centre</b><br />{e.centre || '—'}</div>
                            <div><b>Email to office</b><br />{e.emailSent ? 'Sent' : 'Not sent'}</div>
                            {e.status === 'handled' && <div><b>Handled</b><br />{e.handledBy} · {fmtDateTime(e.handledAt)}</div>}
                          </div>
                          <div style={{ marginTop: 12, fontSize: 14, lineHeight: 1.6, color: '#0A1530', whiteSpace: 'pre-wrap' }}><b>Message</b><br />{e.message || '—'}</div>
                          <div style={{ marginTop: 12 }}>
                            <ConfirmButton label="Delete enquiry" confirmLabel="Yes, delete permanently" onConfirm={async () => {
                              try { await api(`/admin/enquiries/${e.id}`, { method: 'DELETE' }); setOk('Enquiry deleted.'); setOpen(null); reload(); } catch (ex) { setErr(ex.message); }
                            }} />
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {data?.pages > 1 && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button type="button" className="pill" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
            <span style={{ fontSize: 14 }}>Page {data.page} of {data.pages}</span>
            <button type="button" className="pill" disabled={page >= data.pages} onClick={() => setPage(page + 1)}>Next</button>
          </div>
        )}
      </div>
    </div>
  );
}
