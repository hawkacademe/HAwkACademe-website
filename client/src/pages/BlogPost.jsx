import { useParams } from 'react-router-dom';
import PageHero from '../components/PageHero.jsx';
import { PostCard } from '../components/Cards.jsx';
import { Loading, LoadError } from '../components/Blocks.jsx';
import { useData, usePageMeta } from '../lib/hooks.js';
import { fmtDate } from '../lib/format.js';
import NotFound from './NotFound.jsx';

export default function BlogPost() {
  const { slug } = useParams();
  const { data, error, loading } = useData(`/posts/${encodeURIComponent(slug)}`);
  const post = data?.post;
  usePageMeta(post ? `${post.title} | HAwk ACademe` : null, post?.excerpt);

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
          {post && (
            <article style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', fontSize: 13, fontWeight: 700, color: '#5A6378' }}>
                <span style={{ color: '#D90A0A', letterSpacing: '.08em' }}>{post.category.toUpperCase()}</span><span aria-hidden="true">·</span>
                <time dateTime={post.date}>{fmtDate(post.date)}</time>
                {post.author && <><span aria-hidden="true">·</span><span>{post.author}</span></>}
              </div>
              {post.cover && <img src={post.cover.url} alt={post.cover.alt || ''} style={{ display: 'block', width: '100%', height: 'auto', borderRadius: 14 }} />}
              {/* Content is cleaned on the server when it is saved (no scripts or styles). */}
              <div className="prose" dangerouslySetInnerHTML={{ __html: post.content }} />
            </article>
          )}
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
