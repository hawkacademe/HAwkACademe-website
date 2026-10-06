import { useState } from 'react';
import PageHero from '../components/PageHero.jsx';
import { NoticeRow } from '../components/Cards.jsx';
import { Loading, LoadError, Empty } from '../components/Blocks.jsx';
import { useData, usePageMeta } from '../lib/hooks.js';

const CATS = [['all', 'All'], ['BATCHES', 'Batches'], ['RESULTS', 'Results'], ['NOTICES', 'Notices']];

export default function News() {
  usePageMeta('News and Announcements | Hawk Academe', 'New batches, admission test dates, results and notices from Hawk Academe.');
  const { data, error, loading } = useData('/notices');
  const [cat, setCat] = useState('all');
  const rows = (data?.notices || []).filter((n) => cat === 'all' || n.category === cat);

  return (
    <>
      <PageHero crumb="News" title="News & Announcements" intro="Batch start dates, results and notices." />
      <section style={{ background: '#F6F8FC' }}>
        <div className="pad" style={{ maxWidth: 1180, margin: '0 auto', padding: '64px 32px', display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div role="group" aria-label="Filter announcements" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {CATS.map(([k, label]) => (
              <button key={k} type="button" className={cat === k ? 'pill on' : 'pill'} aria-pressed={cat === k} onClick={() => setCat(k)}>{label}</button>
            ))}
          </div>
          {loading && <Loading label="Loading announcements…" />}
          {error && <LoadError error={error} />}
          {data && rows.length === 0 && <Empty>Nothing here yet.</Empty>}
          {rows.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {rows.map((n) => <NoticeRow key={n.id} notice={n} />)}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
