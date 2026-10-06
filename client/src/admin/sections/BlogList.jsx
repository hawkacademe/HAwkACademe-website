import { useState } from 'react';
import { useAdmin, Spinner, SectionHead, ConfirmButton, EmptyBox, Msg, useFlash } from '../ui.jsx';
import { StateBadge } from './Overview.jsx';
import { api, clearCache } from '../../lib/api.js';
import { fmtDateTime } from '../../lib/format.js';

const CATS = ['all', 'Exam Tips', 'Study Plans', 'Parents', 'Updates'];

export default function BlogList() {
  const { data, error, loading, reload } = useAdmin('/admin/posts');
  const [cat, setCat] = useState('all');
  const [q, setQ] = useState('');
  const [ok, setOk] = useFlash();
  const [err, setErr] = useState('');
  const posts = (data?.posts || []).filter((p) => (cat === 'all' || p.category === cat) && (!q.trim() || p.title.toLowerCase().includes(q.trim().toLowerCase())));

  async function setStatus(p, status) {
    setErr('');
    try {
      const full = (await api(`/admin/posts/${p.id}`)).post;
      await api(`/admin/posts/${p.id}`, { method: 'PUT', body: { ...full, status } });
      clearCache();
      setOk(status === 'published' ? `"${p.title}" is published.` : `"${p.title}" is now a hidden draft.`);
      reload();
    } catch (e) { setErr(e.message); }
  }
  async function remove(p) {
    setErr('');
    try {
      await api(`/admin/posts/${p.id}`, { method: 'DELETE' });
      clearCache();
      setOk(`"${p.title}" was deleted.`);
      reload();
    } catch (e) { setErr(e.message); }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <SectionHead title="Blog posts"><a className="a-btn" href="/admin/blog/new">+ New post</a></SectionHead>
      <Msg ok={ok} err={err} />
      <div className="a-card">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center', justifyContent: 'space-between' }}>
          <input className="a-in" type="search" aria-label="Search posts" placeholder="Search by title" value={q} onChange={(e) => setQ(e.target.value)} style={{ height: 44, flex: '1 1 220px', maxWidth: 360 }} />
          <div role="group" aria-label="Filter by category" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {CATS.map((c) => <button key={c} type="button" className={cat === c ? 'pill on' : 'pill'} aria-pressed={cat === c} onClick={() => setCat(c)}>{c === 'all' ? 'All' : c}</button>)}
          </div>
        </div>
        {loading && !data && <Spinner />}
        {error && <div className="a-err" role="alert">{error.message}</div>}
        {data && <div style={{ fontSize: 13, color: '#5A6378' }} aria-live="polite">{posts.length} {posts.length === 1 ? 'post' : 'posts'}</div>}
        {data && posts.length === 0 && <EmptyBox>No posts here yet. Click “New post” to write one.</EmptyBox>}
        {posts.length > 0 && (
          <div className="a-tbl-wrap">
            <table className="tbl">
              <thead><tr><th>Title</th><th>Category</th><th>Status</th><th>Publish date</th><th>Actions</th></tr></thead>
              <tbody>
                {posts.map((p) => (
                  <tr key={p.id}>
                    <td><a href={`/admin/blog/${p.id}`} style={{ fontWeight: 700, color: '#0A1530' }}>{p.title}</a></td>
                    <td>{p.category}</td>
                    <td><StateBadge state={p.state} /></td>
                    <td style={{ whiteSpace: 'nowrap' }}>{fmtDateTime(p.publishAt)}</td>
                    <td>
                      <div className="a-row-actions">
                        <a className="pill" href={`/admin/blog/${p.id}`}>Edit</a>
                        {p.state === 'published' && <a className="pill" href={`/blog/${p.slug}`} target="_blank" rel="noopener">View</a>}
                        {p.status === 'published'
                          ? <button type="button" className="pill" onClick={() => setStatus(p, 'draft')}>Unpublish</button>
                          : <button type="button" className="pill" onClick={() => setStatus(p, 'published')}>Publish</button>}
                        <ConfirmButton onConfirm={() => remove(p)} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
