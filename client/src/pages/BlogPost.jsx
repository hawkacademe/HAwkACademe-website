import { useParams } from 'react-router-dom';
import PageHero from '../components/PageHero.jsx';
import { PostCard } from '../components/Cards.jsx';
import { Loading, LoadError } from '../components/Blocks.jsx';
import { useData, usePageMeta } from '../lib/hooks.js';
import { fmtDate } from '../lib/format.js';
import NotFound from './NotFound.jsx';
import { BRAND_NAME } from '../lib/brand.js';
import { landingPath } from '../lib/seoPages.js';
import { LANDINGS } from '../content/landing.js';

// Which program page a post should point readers to, from its title and slug.
function relatedProgram(post) {
  const t = `${post.title} ${post.slug}`.toLowerCase();
  if (/neet|biology|medical/.test(t)) return 'neet';
  if (/class (8|9|10)|foundation|olympiad/.test(t)) return 'foundation';
  if (/jee|engineering|iit/.test(t)) return 'jee';
  return null;
}

const slugify = (s) => s.toLowerCase().replace(/<[^>]+>/g, '').replace(/&[a-z]+;/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);

// Adds ids to <h2> headings and returns them for the table of contents.
function withToc(html) {
  const toc = [];
  const out = String(html || '').replace(/<h2>([\s\S]*?)<\/h2>/g, (m, inner) => {
    const id = slugify(inner) || `section-${toc.length + 1}`;
    toc.push({ id, text: inner.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&') });
    return `<h2 id="${id}">${inner}</h2>`;
  });
  return { html: out, toc };
}

const readingMinutes = (html) => Math.max(1, Math.round(String(html || '').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length / 200));
const sameDay = (a, b) => fmtDate(a) === fmtDate(b);

export default function BlogPost() {
  const { slug } = useParams();
  const { data, error, loading } = useData(`/posts/${encodeURIComponent(slug)}`);
  const post = data?.post;
  usePageMeta(post ? `${post.title} | ${BRAND_NAME}` : null, post?.excerpt);

  if (error?.status === 404) return <NotFound />;
  return (
    <>
      <PageHero crumbs={[{ href: '/', label: 'Home' }, { href: '/blog', label: 'Blog' }, { label: post ? post.category : '…' }]}
        title={post ? post.title : loading ? 'Loading…' : 'Blog'} intro={post?.excerpt} />

      <section style={{ background: '#ffffff' }}>
        <div className="pad" style={{ maxWidth: 820, margin: '0 auto', padding: '72px 32px', display: 'flex', flexDirection: 'column', gap: 18 }}>
          <a href="/blog" style={{ fontWeight: 700, color: '#D90A0A' }}>← Back to all posts</a>
          {loading && <Loading label="Loading the post…" />}
          {error && <LoadError error={error} />}
          {post && (() => {
            const { html, toc } = withToc(post.content);
            const prog = relatedProgram(post);
            return (
              <article style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', fontSize: 13, fontWeight: 700, color: '#5A6378' }}>
                  <span style={{ color: '#D90A0A', letterSpacing: '.08em' }}>{post.category.toUpperCase()}</span><span aria-hidden="true">·</span>
                  <span>Published <time dateTime={post.date}>{fmtDate(post.date)}</time></span>
                  {post.updated && !sameDay(post.updated, post.date) && <><span aria-hidden="true">·</span><span>Updated <time dateTime={post.updated}>{fmtDate(post.updated)}</time></span></>}
                  <span aria-hidden="true">·</span><span>{readingMinutes(post.content)} min read</span>
                </div>
                {post.author && <div style={{ fontSize: 14, color: '#3E4860' }}>By <strong style={{ color: '#0A1530' }}>{post.author}</strong>{post.author === BRAND_NAME ? ', the teaching team at our JEE, NEET and Foundation centres in Barasat, Madhyamgram and New Town, Kolkata.' : ''}</div>}
                {post.cover && <img src={post.cover.url} alt={post.cover.alt || ''} style={{ display: 'block', width: '100%', height: 'auto', borderRadius: 14 }} />}
                {toc.length >= 3 && (
                  <nav aria-label="In this article" style={{ background: '#F6F8FC', borderRadius: 12, padding: '16px 20px' }}>
                    <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: '.12em', color: '#5A6378', marginBottom: 8 }}>IN THIS ARTICLE</div>
                    <ol style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 15 }}>
                      {toc.map((t) => <li key={t.id}><a href={`#${t.id}`}>{t.text}</a></li>)}
                    </ol>
                  </nav>
                )}
                {/* Content is cleaned on the server when it is saved (no scripts or styles). */}
                <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
                <aside style={{ background: '#0B1D45', color: '#ffffff', borderRadius: 14, padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ fontSize: 20, fontWeight: 800 }}>{prog ? `Preparing with ${BRAND_NAME}` : `Talk to ${BRAND_NAME}`}</div>
                  <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: '#D5DDF0' }}>
                    {prog ? <>See how our <a href={landingPath(prog)} style={{ color: '#ffffff', fontWeight: 700, textDecoration: 'underline' }}>{LANDINGS[prog].h1.replace(' in Madhyamgram, Kolkata', '').replace(' in Kolkata', '')}</a> works, with weekly tests, doubt sessions and centres in Barasat, Madhyamgram and New Town.</> : <>Ask our counsellors which program fits your class and goals.</>}
                  </p>
                  <div><a href="/contact#enquiry" data-track="enquire" style={{ display: 'inline-flex', alignItems: 'center', minHeight: 44, padding: '0 20px', background: '#D90A0A', color: '#ffffff', fontWeight: 700, borderRadius: 4 }}>Send an enquiry</a></div>
                </aside>
              </article>
            );
          })()}
          {data?.related?.length > 0 && (
            <>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0A1530', margin: '32px 0 0' }}>More to read</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%, 220px),1fr))', gap: 16 }}>
                {data.related.map((r) => <PostCard key={r.slug} post={r} />)}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
