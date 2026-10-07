import { useSearchParams } from 'react-router-dom';
import PageHero, { Eyebrow } from '../components/PageHero.jsx';
import { PostCard } from '../components/Cards.jsx';
import { Loading, LoadError, Empty } from '../components/Blocks.jsx';
import { Megaphone, WhatsApp } from '../components/Icons.jsx';
import { useData, usePageMeta } from '../lib/hooks.js';
import { useSite } from '../lib/site.jsx';

const CATS = ['all', 'Exam Tips', 'Study Plans', 'Parents', 'Updates'];

export default function Blog() {
  usePageMeta('Blog: Exam Tips and Study Plans | HAwk ACademe', 'Exam tips, study plans and guidance for students and parents from the HAwk ACademe faculty.');
  const [params, setParams] = useSearchParams();
  const cat = CATS.includes(params.get('category')) ? params.get('category') : 'all';
  const { data, error, loading } = useData('/posts');
  const { whatsapp } = useSite();
  const posts = (data?.posts || []).filter((p) => cat === 'all' || p.category === cat);

  return (
    <>
      <PageHero crumb="Blog" title={<>Tips, Guides &amp; <span style={{ color: '#FF4A3A' }}>Updates</span></>}
        intro="Practical advice for JEE, NEET and Foundation students, and news from HAwk ACademe." />

      <section style={{ background: '#F6F8FC' }}>
        <div className="pad" style={{ maxWidth: 1280, margin: '0 auto', padding: '72px 32px', display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div role="group" aria-label="Filter posts by category" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {CATS.map((c) => (
              <button key={c} type="button" className={cat === c ? 'pill on' : 'pill'} aria-pressed={cat === c}
                onClick={() => setParams(c === 'all' ? {} : { category: c }, { replace: true, preventScrollReset: true })}>
                {c === 'all' ? 'All Posts' : c}
              </button>
            ))}
          </div>
          {loading && <Loading label="Loading posts…" />}
          {error && <LoadError error={error} />}
          {data && posts.length === 0 && <Empty>No posts in this category yet.</Empty>}
          {posts.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: 22 }}>
              {posts.map((p) => <PostCard key={p.slug} post={p} headingLevel={2} />)}
            </div>
          )}
        </div>
      </section>

      <section style={{ background: '#ffffff' }}>
        <div className="pad" style={{ maxWidth: 1280, margin: '0 auto', padding: '64px 32px' }}>
          <div style={{ maxWidth: 720, margin: '0 auto', width: '100%', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            <Eyebrow center>STAY UPDATED</Eyebrow>
            <h2 className="h2" style={{ margin: 0, fontSize: 34, lineHeight: 1.1, fontWeight: 800, letterSpacing: '-.015em' }}>Never miss a <span style={{ color: '#D90A0A' }}>batch or test date</span></h2>
            <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: '#3E4860' }}>New batches, admission tests and results are posted on our News page as soon as they are announced.</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
              <a className="btn-red" href="/news" style={{ height: 50, display: 'inline-flex', alignItems: 'center', gap: 10, padding: '0 26px', borderRadius: 4, background: '#D90A0A', color: '#ffffff', fontWeight: 700, fontSize: 15 }}><Megaphone size={18} />See the latest news</a>
              {whatsapp && (
                <a className="btn-ghost" href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" style={{ height: 50, display: 'inline-flex', alignItems: 'center', gap: 10, padding: '0 24px', borderRadius: 4, border: '1.5px solid #D90A0A', color: '#D90A0A', background: '#ffffff', fontWeight: 700, fontSize: 15 }}>
                  <span style={{ width: 20, height: 20, display: 'flex' }}><WhatsApp /></span>Ask on WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
