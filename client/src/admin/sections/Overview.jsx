import { useAdmin, Spinner, Badge, EmptyBox } from '../ui.jsx';
import { fmtDate, fmtDateTime } from '../../lib/format.js';

export default function Overview() {
  const { data, error, loading } = useAdmin('/admin/overview');
  if (loading && !data) return <Spinner />;
  if (error) return <div className="a-err" role="alert">{error.message}</div>;
  const s = data.stats;
  const tiles = [
    ['NEW ENQUIRIES', s.newEnq, `${s.totalEnq} in total`, '/admin/enquiries'],
    ['BLOG POSTS', s.published, `${s.drafts} drafts${s.scheduled ? `, ${s.scheduled} scheduled` : ''}`, '/admin/blog'],
    ['NOTICES', s.notices, 'Shown on News and Home', '/admin/news'],
    ['GALLERY PHOTOS', s.photos, 'On the gallery page', '/admin/gallery'],
    ['REVIEWS', s.reviews, 'Shown on Home', '/admin/reviews']
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <h2 className="a-h2">Overview</h2>
      {!data.mailConfigured && (
        <div className="a-warn" role="note">
          <span>Enquiry emails are not switched on yet, so new enquiries only appear here. The developer connects the email service before launch.</span>
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 170px), 1fr))', gap: 16 }}>
        {tiles.map(([l, v, sub, href]) => (
          <a key={l} className="a-stat" href={href}>
            <span className="l">{l}</span><span className="v" style={l === 'NEW ENQUIRIES' && v > 0 ? { color: '#D90A0A' } : undefined}>{v}</span><span className="s">{sub}</span>
          </a>
        ))}
      </div>

      <div className="a-card">
        <h3 style={{ fontSize: 18 }}>Quick actions</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          <a className="a-btn" href="/admin/blog/new">+ New blog post</a>
          <a className="a-btn" href="/admin/news?new=1">+ New notice</a>
          <a className="a-btn" href="/admin/gallery">+ Add photos</a>
          <a className="a-ghost" href="/admin/highlights">Update timings</a>
          <a className="a-ghost" href="/" target="_blank" rel="noopener">View the website</a>
        </div>
      </div>

      <div className="a-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <h3 style={{ fontSize: 18 }}>Recent enquiries</h3>
          <a className="a-ghost sm" href="/admin/enquiries">See all</a>
        </div>
        {data.recentEnquiries.length === 0 ? <EmptyBox>No enquiries yet. They appear here when someone sends the Contact form.</EmptyBox> : (
          <div className="a-tbl-wrap">
            <table className="tbl">
              <thead><tr><th>Received</th><th>Name</th><th>Phone</th><th>Program</th><th>Status</th></tr></thead>
              <tbody>
                {data.recentEnquiries.map((e) => (
                  <tr key={e.id}>
                    <td>{fmtDateTime(e.createdAt)}</td><td><b>{e.name}</b></td><td><a href={`tel:${e.phone.replace(/[^\d+]/g, '')}`}>{e.phone}</a></td><td>{e.program || '—'}</td>
                    <td>{e.status === 'new' ? <Badge tone="red">New</Badge> : <Badge tone="green">Handled</Badge>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="a-grid">
        <div className="a-card">
          <h3 style={{ fontSize: 18 }}>Latest posts</h3>
          {data.latestPosts.length === 0 ? <div style={{ color: '#5A6378' }}>No posts yet.</div> : data.latestPosts.map((p) => (
            <a key={p.id} href={`/admin/blog/${p.id}`} style={{ display: 'flex', justifyContent: 'space-between', gap: 10, color: '#0A1530', borderTop: '1px solid #EEF1F6', paddingTop: 10 }}>
              <span style={{ fontWeight: 700 }}>{p.title}</span><StateBadge state={p.status} />
            </a>
          ))}
        </div>
        <div className="a-card">
          <h3 style={{ fontSize: 18 }}>Latest notices</h3>
          {data.latestNotices.length === 0 ? <div style={{ color: '#5A6378' }}>No notices yet.</div> : data.latestNotices.map((n) => (
            <a key={n.id} href="/admin/news" style={{ display: 'flex', justifyContent: 'space-between', gap: 10, color: '#0A1530', borderTop: '1px solid #EEF1F6', paddingTop: 10 }}>
              <span style={{ fontWeight: 700 }}>{n.title}</span><span style={{ fontSize: 13, color: '#5A6378', whiteSpace: 'nowrap' }}>{fmtDate(n.date)}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export function StateBadge({ state }) {
  if (state === 'published') return <Badge tone="green">Published</Badge>;
  if (state === 'scheduled') return <Badge tone="amber">Scheduled</Badge>;
  return <Badge tone="grey">Draft</Badge>;
}
