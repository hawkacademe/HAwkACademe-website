import { Arrow, Pin as PinIcon } from './Icons.jsx';
import { COVER_STYLES, fmtDate } from '../lib/format.js';

// Blog list card: the cover photo if there is one, otherwise the subject band from the design.
export function PostCard({ post, headingLevel = 3 }) {
  const band = COVER_STYLES[post.coverStyle] || COVER_STYLES.physics;
  const H = `h${headingLevel}`;
  return (
    <article className="card" style={{ position: 'relative', background: '#ffffff', border: '1px solid #E7EAF0', borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 8px 22px rgba(11,29,69,.06)' }}>
      {post.cover ? (
        <img src={post.cover.url} alt="" loading="lazy" decoding="async" style={{ display: 'block', width: '100%', height: 170, objectFit: 'cover' }} />
      ) : (
        <div aria-hidden="true" style={{ height: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 700, fontSize: 30, background: band.bg }}>{band.glyph}</div>
      )}
      <div style={{ padding: '18px 20px 20px', display: 'flex', flexDirection: 'column', gap: 8, flexGrow: 1 }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.14em', color: '#D90A0A' }}>{post.category.toUpperCase()}</div>
        <H style={{ margin: 0, fontSize: 18, lineHeight: 1.3, fontWeight: 800 }}>
          {/* The whole card is clickable through this link's ::after overlay */}
          <a href={`/blog/${post.slug}`} className="stretched" style={{ color: '#0A1530' }}>{post.title}</a>
        </H>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: '#3E4860', flexGrow: 1 }}>{post.excerpt}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, color: '#5A6378' }}>
          <time dateTime={post.date}>{fmtDate(post.date)}</time>
          <span aria-hidden="true" style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, color: '#D90A0A' }}>Read <Arrow size={16} /></span>
        </div>
      </div>
    </article>
  );
}

const TAGS = { BATCHES: 'BATCHES', RESULTS: 'RESULTS', NOTICES: 'NOTICES' };

// One row on the News page (and the Home announcements list).
export function NoticeRow({ notice, compact = false }) {
  const inner = (
    <>
      <time dateTime={notice.date} style={{ minWidth: 110, fontSize: 13, fontWeight: 700, color: '#5A6378' }}>{fmtDate(notice.date)}</time>
      <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.1em', color: '#D90A0A', minWidth: 80, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        {notice.pinned && <PinIcon size={13} aria-label="Pinned" />}{TAGS[notice.category] || notice.category}
      </span>
      <span style={{ flex: '1 1 320px' }}>
        <strong style={{ display: 'block', fontSize: compact ? 16 : 17 }}>{notice.title}</strong>
        {notice.text && <span style={{ fontSize: 14, color: '#3E4860', whiteSpace: 'pre-line' }}>{notice.text}</span>}
      </span>
      {notice.link && <Arrow size={18} style={{ color: '#D90A0A' }} />}
    </>
  );
  const style = { background: '#ffffff', border: '1px solid #E7EAF0', borderRadius: 12, padding: compact ? '16px 20px' : '20px 24px', display: 'flex', flexWrap: 'wrap', gap: '8px 24px', alignItems: 'center', color: '#0A1530' };
  if (notice.link) {
    const external = /^https?:\/\//.test(notice.link);
    return <a className="card" href={notice.link} style={style} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{inner}</a>;
  }
  return <div style={style}>{inner}</div>;
}
