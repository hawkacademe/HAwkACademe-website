import { useMemo, useState } from 'react';
import PageHero from '../components/PageHero.jsx';
import { CtaBand, Empty } from '../components/Blocks.jsx';
import { Trophy } from '../components/Icons.jsx';
import { TOPPERS, EXAMS, RESULT_STATS, initials, examLabel } from '../content/results.js';
import { usePageMeta } from '../lib/hooks.js';

const statIcons = [
  { color: '#D90A0A', d: <><path d="M8 4h8v5a4 4 0 0 1-8 0z" /><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4" /><path d="M12 13v4M8 20h8" /></> },
  { color: '#0B1D45', d: <><circle cx="12" cy="9" r="5.5" /><path d="M8.5 13.5L7 21l5-2.5 5 2.5-1.5-7.5" /></> },
  { color: '#D90A0A', d: <><path d="M4 20h16" /><path d="M7 17v-5M12 17V7M17 17v-8" /></> },
  { color: '#0B1D45', d: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4.5" /></> }
];

export default function Results() {
  usePageMeta('Results and Toppers | Hawk Academe', 'Hawk Academe toppers and selections in JEE Advanced, JEE Main, NEET and board exams, year by year.');
  const [exam, setExam] = useState('all');
  const [year, setYear] = useState('all');
  const years = useMemo(() => [...new Set(TOPPERS.map((t) => t.year))].sort((a, b) => b - a), []);
  const shown = TOPPERS.filter((t) => (exam === 'all' || t.exam === exam) && (year === 'all' || t.year === Number(year)));

  const pills = (defs, cur, set) => defs.map(([k, label]) => (
    <button key={k} type="button" className={cur === k ? 'pill on' : 'pill'} aria-pressed={cur === k} onClick={() => set(k)}>{label}</button>
  ));

  return (
    <>
      <PageHero crumb="Results" title={<>Proven Results, <span style={{ color: '#FF4A3A' }}>Real Success</span></>}
        intro="Year after year, HAwk ACademe students turn ambition into achievement. Browse our toppers by exam and year." />

      <section style={{ background: '#F6F8FC' }}>
        <div className="pad" style={{ maxWidth: 1280, margin: '0 auto', padding: '56px 32px 24px', display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 16 }}>
            {RESULT_STATS.map((s, i) => (
              <div key={i} style={{ background: '#ffffff', borderRadius: 12, padding: 22, boxShadow: '0 8px 24px rgba(11,29,69,.08)', display: 'flex', gap: 14, alignItems: 'center' }}>
                <div style={{ color: statIcons[i % 4].color }}><svg className="ico" viewBox="0 0 24 24" style={{ width: 32, height: 32 }} aria-hidden="true">{statIcons[i % 4].d}</svg></div>
                <div><div style={{ fontSize: 24, fontWeight: 800, color: '#D90A0A' }}>{s.value}</div><div style={{ fontSize: 13, color: '#3E4860' }}>{s.label}</div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: '#ffffff' }}>
        <div className="pad" style={{ maxWidth: 1280, margin: '0 auto', padding: '56px 32px 72px', display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div id="f-exam" style={{ fontSize: 12, fontWeight: 800, letterSpacing: '.14em', color: '#5A6378' }}>EXAM</div>
            <div role="group" aria-labelledby="f-exam" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {pills([['all', 'All Exams'], ...EXAMS.map((e) => [e.key, e.name])], exam, setExam)}
            </div>
            <div id="f-year" style={{ fontSize: 12, fontWeight: 800, letterSpacing: '.14em', color: '#5A6378', marginTop: 8 }}>YEAR</div>
            <div role="group" aria-labelledby="f-year" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {pills([['all', 'All Years'], ...years.map((y) => [String(y), String(y)])], year, setYear)}
            </div>
          </div>
          <div style={{ fontSize: 15, fontWeight: 700 }} aria-live="polite">Showing {shown.length} of {TOPPERS.length} results</div>
          {shown.length === 0 ? <Empty>No results for this exam and year yet.</Empty> : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 270px), 1fr))', gap: 18 }}>
              {shown.map((t, i) => (
                <article key={i} className="card" style={{ background: '#ffffff', border: '1px solid #E7EAF0', borderRadius: 12, padding: 22, display: 'flex', flexDirection: 'column', gap: 12, boxShadow: '0 8px 22px rgba(11,29,69,.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                    {t.photo ? (
                      <img src={t.photo} alt="" width="54" height="54" loading="lazy" style={{ width: 54, height: 54, borderRadius: '50%', objectFit: 'cover', border: '3px solid #D90A0A' }} />
                    ) : (
                      <div aria-hidden="true" style={{ width: 54, height: 54, borderRadius: '50%', background: '#0B1D45', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                        {initials(t.name) === '—' ? <Trophy size={26} /> : initials(t.name)}
                      </div>
                    )}
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.12em', color: '#5A6378' }}>{t.metricLabel}</div>
                      <div style={{ fontSize: 28, fontWeight: 800, color: '#D90A0A', lineHeight: 1 }}>{t.metric}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.12em', color: '#D90A0A' }}>{t.label || examLabel(t)}</div>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>{t.name}</h3>
                  {t.badge && <div style={{ alignSelf: 'flex-start', background: '#FFF1F1', color: '#A80707', fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 999 }}>{t.badge}</div>}
                  <div style={{ fontSize: 14, color: '#3E4860', lineHeight: 1.5 }}>{t.program}<br />{[t.detail, t.detailSub].filter(Boolean).join(' · ')}</div>
                </article>
              ))}
            </div>
          )}
          {(exam !== 'all' || year !== 'all') && (
            <div><button type="button" className="pill on" onClick={() => { setExam('all'); setYear('all'); }}>Show all results</button></div>
          )}
        </div>
      </section>

      <CtaBand title="Be our next topper" text="Talk to our counsellors and find the program that fits your goals."
        secondary={{ href: '/programs', label: 'Explore Programs' }} />
    </>
  );
}
