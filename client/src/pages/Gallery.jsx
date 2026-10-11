import { useState } from 'react';
import PageHero from '../components/PageHero.jsx';
import Lightbox from '../components/Lightbox.jsx';
import { CtaBand, Loading, LoadError, Empty } from '../components/Blocks.jsx';
import { useData, usePathMeta } from '../lib/hooks.js';
import PhotoTile from '../components/PhotoTile.jsx';

const CATS = ['all', 'Classroom', 'Seminars', 'Activities', 'Celebrations', 'Campus'];

export default function Gallery() {
  usePathMeta('/gallery');
  const { data, error, loading } = useData('/gallery');
  const [cat, setCat] = useState('all');
  const [lb, setLb] = useState(-1);
  const photos = data?.photos || [];
  const list = photos.filter((p) => cat === 'all' || p.category === cat);
  const cats = CATS.filter((c) => c === 'all' || photos.some((p) => p.category === c));

  return (
    <>
      <PageHero crumb="Gallery" title={<>Life at <span style={{ color: '#FF4A3A' }}>HAwk ACademe</span></>}
        intro="Classrooms, seminars, activities and celebrations. A look at what student life feels like." />

      <section style={{ background: '#F6F8FC' }}>
        <div className="pad" style={{ maxWidth: 1280, margin: '0 auto', padding: '72px 32px', display: 'flex', flexDirection: 'column', gap: 32 }}>
          {cats.length > 2 && (
            <div role="group" aria-label="Filter photos" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {cats.map((c) => (
                <button key={c} type="button" className={cat === c ? 'pill on' : 'pill'} aria-pressed={cat === c} onClick={() => { setCat(c); setLb(-1); }}>{c === 'all' ? 'All' : c}</button>
              ))}
            </div>
          )}
          {loading && <Loading label="Loading photos…" />}
          {error && <LoadError error={error} />}
          {data && list.length === 0 && <Empty>No photos here yet.</Empty>}
          {list.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: 16 }}>
              {list.map((g, i) => (
                <PhotoTile key={g.id} photo={g} lazy={i > 5} onOpen={() => setLb(i)} />
              ))}
            </div>
          )}
        </div>
      </section>
      {lb >= 0 && <Lightbox items={list.map(({ caption, ...p }) => p)} index={lb} onIndex={setLb} onClose={() => setLb(-1)} />}

      <CtaBand title="Want to be part of it?" text="Join a community that inspires you to achieve more."
        secondary={{ href: '/programs', label: 'Explore Programs' }} />
    </>
  );
}
