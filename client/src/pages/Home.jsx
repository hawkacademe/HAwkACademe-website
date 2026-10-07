import { useEffect, useRef, useState } from 'react';
import { Eyebrow } from '../components/PageHero.jsx';
import { HighlightTiles, FounderQuote } from '../components/Blocks.jsx';
import { NoticeRow } from '../components/Cards.jsx';
import { Arrow, Tick, Chat, Calendar, Circled, Pin, Quote } from '../components/Icons.jsx';
import { useData, usePathMeta, useRotate } from '../lib/hooks.js';
import { useSite } from '../lib/site.jsx';
import { telHref } from '../lib/format.js';
import { TOPPERS, EXAMS, EXAM_STATS, initials, examLabel } from '../content/results.js';
import { PROGRAMS } from '../content/programs.jsx';
import { CENTRES } from '../content/centres.js';
import { FOUNDER } from '../content/about.js';
import { HERO_WORDS, TESTS, GROWTH, YEARS_OF_EXCELLENCE } from '../content/home.js';
import { LANDING_SLUGS, landingPath } from '../lib/seoPages.js';
import { LANDINGS } from '../content/landing.js';

const NB = ' ';
const wrap = { position: 'relative', maxWidth: 1280, margin: '0 auto', padding: '88px 32px', display: 'flex', flexDirection: 'column', gap: 40 };
const h2 = { margin: 0, fontSize: 44, lineHeight: 1.1, fontWeight: 800, letterSpacing: '-.015em' };
const btnRed = { height: 48, display: 'inline-flex', alignItems: 'center', gap: 10, padding: '0 24px', background: '#D90A0A', color: '#ffffff', fontWeight: 700, fontSize: 14, borderRadius: 4 };
const arrowCircle = { width: 28, height: 28, borderRadius: '50%', border: '1.5px solid #D90A0A', color: '#D90A0A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 };
const ico = (size, d, style) => <svg className="ico" viewBox="0 0 24 24" style={{ width: size, height: size, ...style }} aria-hidden="true">{d}</svg>;

// ---------------- Toppers explorer ----------------
function Toppers() {
  const tick = useRotate(4, 2200);
  const [exam, setExam] = useState('all');
  const [more, setMore] = useState(false);
  const filtered = exam === 'all' ? TOPPERS : TOPPERS.filter((t) => t.exam === exam);
  const shown = more ? filtered : filtered.slice(0, 4);
  const cur = EXAMS.find((e) => e.key === exam);
  const tabs = [{ key: 'all', label: 'All', name: 'All Exams' }, ...EXAMS];

  if (!TOPPERS.length) {
    return (
      <div style={{ background: '#ffffff', borderRadius: 14, padding: '28px 28px', boxShadow: '0 10px 30px rgba(11,29,69,.08)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 18 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 640 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, fontWeight: 800, letterSpacing: '.2em' }}>
            {ico(20, <><path d="M8 4h8v5a4 4 0 0 1-8 0z" /><path d="M12 13v4M8 20h8" /></>, { color: '#D90A0A' })}OUR TOPPERS
          </div>
          <h3 style={{ margin: 0, fontSize: 24, fontWeight: 800, lineHeight: 1.25 }}>Toppers, published with permission</h3>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: '#3E4860' }}>We show a student's name, exam, year and rank only after the student (or a parent, for students under 18) agrees in writing. Our verified results will appear here.</p>
        </div>
        <a className="btn-red" href="/results" style={{ ...btnRed, height: 50, padding: '0 28px', fontSize: 15 }}>About Our Results <Arrow size={18} /></a>
      </div>
    );
  }

  return (
    <>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, fontWeight: 800, letterSpacing: '.2em' }}>
            {ico(20, <><path d="M8 4h8v5a4 4 0 0 1-8 0z" /><path d="M12 13v4M8 20h8" /></>, { color: '#D90A0A' })}OUR TOPPERS
          </div>
          <h3 className="res-head" aria-live="polite" style={{ margin: 0, fontSize: 30, fontWeight: 800, lineHeight: 1.2 }}>
            Top performers in <span style={{ color: '#D90A0A', borderBottom: '3px solid #D90A0A' }}>{exam === 'all' ? EXAMS[tick % EXAMS.length].name : cur.name}</span>
          </h3>
        </div>
        <div role="group" aria-label="Filter results by exam" className="tabs-scroll" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, background: '#ffffff', padding: 6, borderRadius: 999, boxShadow: '0 6px 18px rgba(11,29,69,.08)' }}>
          {tabs.map((d) => {
            const active = d.key === exam;
            const count = d.key === 'all' ? TOPPERS.length : TOPPERS.filter((t) => t.exam === d.key).length;
            return (
              <button key={d.key} type="button" aria-pressed={active} onClick={() => { setExam(d.key); setMore(false); }}
                style={{ minHeight: 44, padding: '0 16px', borderRadius: 999, border: 0, cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, background: active ? '#D90A0A' : 'transparent', color: active ? '#ffffff' : '#0A1530' }}>
                {d.label}
                <span style={{ fontSize: 11, padding: '2px 7px', borderRadius: 999, background: active ? 'rgba(255,255,255,.25)' : '#EEF1F6', color: active ? '#ffffff' : '#3E4860' }}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {exam !== 'all' && EXAM_STATS[exam] && (
        <div style={{ background: '#0B1D45', color: '#ffffff', borderRadius: 14, padding: '22px 28px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 24, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(118deg,transparent 0 78%,#D90A0A 78% 80%,transparent 80%)' }} />
          <div style={{ position: 'relative', flex: '1 1 240px', fontSize: 18, fontWeight: 700 }}>HAwk ACademe in {cur.name}</div>
          <div style={{ position: 'relative', display: 'flex', flexWrap: 'wrap', gap: 32 }}>
            {EXAM_STATS[exam].map(([v, l], i) => (
              <div key={l} style={i ? { borderLeft: '1px solid rgba(255,255,255,.2)', paddingLeft: 32 } : undefined}>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#FF5A4E' }}>{v}</div><div style={{ fontSize: 13, color: '#C3CBE0' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
        {shown.map((t, i) => (
          <article key={i} className="card" style={{ background: '#ffffff', borderRadius: 14, overflow: 'hidden', boxShadow: '0 10px 30px rgba(11,29,69,.10)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'relative', height: 176, background: 'linear-gradient(135deg,#0B1D45,#163A85)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(118deg,transparent 0 66%,#D90A0A 66% 70%,transparent 70%)' }} />
              <div style={{ position: 'absolute', top: 14, left: 16, fontSize: 11, fontWeight: 700, letterSpacing: '.1em', color: '#C3CBE0' }}>{t.label || examLabel(t)}</div>
              {t.photo ? (
                <img src={t.photo} alt="" width="88" height="88" loading="lazy" style={{ position: 'relative', width: 88, height: 88, borderRadius: '50%', border: '4px solid #D90A0A', objectFit: 'cover' }} />
              ) : (
                <div aria-hidden="true" style={{ position: 'relative', width: 88, height: 88, borderRadius: '50%', border: '4px solid #D90A0A', background: '#ffffff', color: '#0B1D45', fontWeight: 800, fontSize: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{initials(t.name)}</div>
              )}
              <div style={{ position: 'absolute', left: 0, bottom: 0, background: '#D90A0A', color: '#ffffff', padding: '8px 16px 8px 14px', borderTopRightRadius: 14, display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 700 }}>{t.metricLabel}</span>
                <span style={{ fontSize: 26, fontWeight: 800, lineHeight: 1 }}>{t.metric}</span>
              </div>
            </div>
            {t.badge && <div style={{ background: '#FFF1F1', color: '#A80707', fontSize: 12, fontWeight: 700, padding: '6px 16px' }}>{t.badge}</div>}
            <div style={{ padding: '16px 18px 20px', display: 'flex', flexDirection: 'column', gap: 4, flexGrow: 1 }}>
              <h4 style={{ margin: 0, fontWeight: 800, fontSize: 17 }}>{t.name}</h4>
              <div style={{ fontSize: 12, color: '#5A6378' }}>{t.program}</div>
              <div style={{ marginTop: 12, display: 'flex', gap: 10, alignItems: 'center', background: '#F6F8FC', borderRadius: 8, padding: '10px 12px' }}>
                {ico(22, <><path d="M2 9l10-5 10 5-10 5z" /><path d="M6 11v5c3 2.5 9 2.5 12 0v-5" /></>, { color: '#D90A0A' })}
                <div><div style={{ fontWeight: 700, fontSize: 13 }}>{t.detail}</div><div style={{ fontSize: 11, color: '#5A6378' }}>{t.detailSub}</div></div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 14 }}>
        {filtered.length > 4 && (
          <button type="button" onClick={() => setMore((m) => !m)} aria-expanded={more} style={{ height: 50, display: 'flex', alignItems: 'center', gap: 10, padding: '0 26px', background: '#ffffff', color: '#D90A0A', border: '1.5px solid #D90A0A', fontFamily: 'inherit', fontWeight: 700, fontSize: 15, borderRadius: 4, cursor: 'pointer' }}>
            {more ? 'Show less' : `View more toppers (${filtered.length - 4})`}
          </button>
        )}
        <a className="btn-red" href="/results" style={{ ...btnRed, height: 50, padding: '0 28px', fontSize: 15 }}>View All Results <Arrow size={18} /></a>
      </div>
    </>
  );
}

// ---------------- Roadmap (fills as you scroll) ----------------
const STEPS = [
  ['STEP 01 · DIAGNOSE', 'Diagnostic Admission Test', "A test of aptitude and fundamentals that shows each student's starting point, so we place them in the right batch.", '#D90A0A', <><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4.5 4.5M8.5 11h5M11 8.5v5" /></>],
  ['STEP 02 · BUILD', 'Concept-First Teaching', 'We build understanding from first principles, so students can handle any question pattern, not just familiar ones.', '#0B1D45', <><path d="M3 5.5C5.5 4.5 9 4.5 12 6c3-1.5 6.5-1.5 9-.5V19c-2.5-1-6-1-9 .5-3-1.5-6.5-1.5-9-.5z" /><path d="M12 6v13.5" /></>],
  ['STEP 03 · LEARN', 'Expert Full-Time Faculty', 'Dedicated subject experts who stay with a batch through the year and know every student by name.', '#D90A0A', <><circle cx="12" cy="9" r="5.5" /><path d="M8.5 13.5L7 21l5-2.5 5 2.5-1.5-7.5" /></>],
  ['STEP 04 · PRACTISE', 'Regular Assessments', 'Weekly tests and full-length mocks with detailed analysis to track progress and fix weak areas early.', '#0B1D45', <><path d="M14 3H6v18h12V7z" /><path d="M14 3v4h4M9 12l2 2 4-4" /></>],
  ['STEP 05 · STRENGTHEN', 'Personal Doubt Resolution', 'One-on-one doubt sessions every week, so no question is left unanswered before the next topic begins.', '#D90A0A', <><path d="M4 5h16v11H9l-5 4z" /><path d="M10 9a2 2 0 1 1 2.5 1.9c-.4.1-.5.4-.5.8V12" /></>],
  ['STEP 06 · SUPPORT', 'Parent Progress Updates', 'Regular reports and parent-teacher meetings keep families informed and involved at every stage.', '#0B1D45', <><path d="M4 20h16" /><path d="M7 17v-5M12 17V7M17 17v-8" /></>]
];

function Roadmap() {
  const wrapRef = useRef(null);
  const [rm, setRm] = useState({ on: [true, false, false, false, false, false, false, false], h: 0 });
  useEffect(() => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    const calc = () => {
      raf = 0;
      const w = wrapRef.current;
      if (!w) return;
      const vh = window.innerHeight;
      const r = w.getBoundingClientRect();
      const rows = w.querySelectorAll('.rm-row');
      const on = [...rows].map((el) => reduced || el.getBoundingClientRect().top < vh * 0.84);
      const max = Math.max(0, r.height - 104);
      const h = reduced ? max : Math.round(Math.min(max, Math.max(0, vh * 0.66 - r.top - 24)) / 6) * 6;
      setRm((cur) => (cur.h === h && on.every((v, k) => v === cur.on[k]) ? cur : { on, h }));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(calc); };
    calc();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(raf); };
  }, []);
  const cls = (k) => (rm.on[k] ? 'rm-row on' : 'rm-row off');
  const marker = (n) => (
    <div className="rm-marker" style={{ display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
      <div aria-hidden="true" style={{ width: 68, height: 68, borderRadius: '50%', background: '#D90A0A', border: '6px solid #ffffff', boxShadow: '0 0 0 3px #0B1D45, 0 10px 24px rgba(217,10,10,.35)', color: '#ffffff', fontWeight: 800, fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{n}</div>
    </div>
  );

  return (
    <ol id="rm-wrap" ref={wrapRef} style={{ position: 'relative', display: 'flex', flexDirection: 'column', listStyle: 'none', margin: 0, padding: 0 }}>
      <div className="rm-road" aria-hidden="true" style={{ position: 'absolute', top: 24, bottom: 60, width: 40, marginLeft: -20, background: '#0B1D45', borderRadius: 20, boxShadow: 'inset 0 0 0 4px #13306B' }} />
      <div className="rm-road rm-fill" aria-hidden="true" style={{ position: 'absolute', top: 24, width: 40, marginLeft: -20, borderRadius: 20, background: 'linear-gradient(180deg,#D90A0A,#FF4A24)', boxShadow: '0 0 18px rgba(217,10,10,.45)', height: rm.h + 20, opacity: rm.h > 0 ? 1 : 0 }}>
        <div style={{ position: 'absolute', bottom: -10, left: '50%', marginLeft: -15, width: 30, height: 30, borderRadius: '50%', background: '#ffffff', border: '6px solid #D90A0A', boxShadow: '0 6px 16px rgba(217,10,10,.5)' }} />
      </div>
      <div className="rm-road" aria-hidden="true" style={{ position: 'absolute', top: 40, bottom: 76, width: 0, marginLeft: -2, borderLeft: '4px dashed rgba(255,255,255,.65)' }} />
      <li className={cls(0)} style={{ padding: '0 0 10px' }}>
        <div className="rm-empty" />
        <div className="rm-marker" style={{ display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
          <div className="rm-start" style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#D90A0A', color: '#ffffff', fontWeight: 800, fontSize: 13, letterSpacing: '.14em', padding: '12px 18px', borderRadius: 999, border: '4px solid #ffffff', boxShadow: '0 8px 20px rgba(217,10,10,.3)', whiteSpace: 'nowrap' }}>
            {ico(16, <path d="M5 21V4M5 4h12l-2 4 2 4H5" />)}START
          </div>
        </div>
        <div className="rm-slot" style={{ fontSize: 15, fontWeight: 700, color: '#3E4860', paddingLeft: 8 }}>You join HAwk ACademe</div>
      </li>
      {STEPS.map(([tag, title, text, bg, icon], i) => {
        const card = (
          <div className="rm-slot">
            <div className="card" style={{ background: '#ffffff', border: '1px solid #E7EAF0', borderRadius: 14, padding: '22px 24px', display: 'flex', gap: 16, alignItems: 'flex-start', boxShadow: '0 10px 28px rgba(11,29,69,.08)' }}>
              <div style={{ width: 48, height: 48, flexShrink: 0, borderRadius: 12, background: bg, color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{ico(24, icon)}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.16em', color: '#D90A0A' }}>{tag}</div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>{title}</h3>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: '#3E4860' }}>{text}</p>
              </div>
            </div>
          </div>
        );
        const left = i % 2 === 0;
        return (
          <li key={tag} className={cls(i + 1)} style={{ padding: '14px 0' }}>
            {left ? card : <div className="rm-empty" />}
            {marker(String(i + 1).padStart(2, '0'))}
            {left ? <div className="rm-empty" /> : card}
          </li>
        );
      })}
      <li className={cls(7)} style={{ padding: '14px 0 0' }}>
        <div className="rm-empty" />
        <div className="rm-marker" style={{ display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ width: 92, height: 92, borderRadius: '50%', background: '#0B1D45', border: '6px solid #D90A0A', boxShadow: '0 0 0 6px #ffffff, 0 14px 30px rgba(11,29,69,.3)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {ico(40, <><path d="M8 4h8v5a4 4 0 0 1-8 0z" /><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4" /><path d="M12 13v4M8 20h8M9.5 17h5" /></>)}
          </div>
        </div>
        <div className="rm-slot" style={{ paddingLeft: 8 }}>
          <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '.16em', color: '#D90A0A' }}>FINISH LINE</div>
          <div style={{ fontSize: 24, fontWeight: 800, lineHeight: 1.2, marginTop: 4 }}>Exam Day → Your Dream College</div>
        </div>
      </li>
    </ol>
  );
}

// ---------------- Page ----------------
export default function Home() {
  usePathMeta('/');
  const site = useSite();
  const wordIdx = useRotate(HERO_WORDS.length, 2200);
  const notices = useData('/notices?limit=4');
  const reviews = useData('/reviews');
  const badge = site.highlights?.[1];
  const reviewList = reviews.data?.reviews || [];

  return (
    <>
      {/* ============ HERO ============ */}
      <section id="home" style={{ position: 'relative', background: 'linear-gradient(180deg,#F6F8FC,#ffffff)', overflow: 'hidden' }}>
        <div className="hide-sm" style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '56%', background: '#0B1D45', clipPath: 'polygon(22% 0,100% 0,100% 100%,0 100%)' }} />
        <div className="hide-sm" style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '56%', background: 'linear-gradient(118deg,#D90A0A 0 30%,transparent 30%)', clipPath: 'polygon(22% 0,30% 0,8% 100%,0 100%)' }} />
        <div className="hide-sm" style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '56%', background: 'repeating-linear-gradient(118deg,rgba(255,255,255,.04) 0 18px,transparent 18px 60px)' }} />
        <div className="pad" style={{ position: 'relative', maxWidth: 1280, margin: '0 auto', padding: '72px 32px 80px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 460px), 1fr))', gap: 48, alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '.22em', color: '#0A1530' }}>DISCIPLINE{NB}{NB}|{NB}{NB}MENTORSHIP{NB}{NB}|{NB}{NB}RESULTS</div>
            <h1 className="h1" style={{ margin: 0, fontSize: 72, lineHeight: 1.02, fontWeight: 800, letterSpacing: '-.02em' }}>Building{' '}<br /><span style={{ color: '#D90A0A' }}>Brighter</span>{' '}<br />Futures</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 18, fontWeight: 700, color: '#0A1530' }}>
              Built upon <span style={{ display: 'inline-block', minWidth: 170, padding: '4px 12px', background: '#0B1D45', color: '#ffffff', borderRadius: 4, letterSpacing: '.06em' }}>{HERO_WORDS[wordIdx]}</span>
            </div>
            <p style={{ margin: 0, fontSize: 17, lineHeight: 1.6, color: '#3E4860', maxWidth: 460 }}>Focused academic programs for JEE, NEET and Foundation courses with expert faculty, structured learning and proven results, at our centres in Barasat, Madhyamgram and New Town, Kolkata.</p>
            <div className="hero-cta" style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 6 }}>
              <a className="btn-red" href="#programs" style={{ ...btnRed, height: 50, fontSize: 15 }}>Explore Programs <Arrow size={18} /></a>
              <a className="btn-ghost" href="/contact" style={{ height: 50, display: 'flex', alignItems: 'center', gap: 10, padding: '0 22px', border: '1.5px solid #D90A0A', color: '#D90A0A', fontWeight: 700, fontSize: 15, borderRadius: 4, background: '#ffffff' }}><Chat size={18} /> Talk to Counsellor</a>
            </div>
          </div>
          <div className="hero-visual" style={{ position: 'relative', minHeight: 440, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 20, overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,.35)' }}>
            <img src="/img/campus-night.webp" alt="HAwk ACademe campus at night" width="1000" height="700" fetchPriority="high" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            {badge && (
              <div className="hero-badge" style={{ position: 'absolute', left: 18, bottom: 22, background: '#ffffff', borderRadius: 10, padding: '14px 18px', display: 'flex', gap: 12, alignItems: 'center', boxShadow: '0 18px 40px rgba(0,0,0,.18)' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#FFECEC', color: '#D90A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {ico(24, <><path d="M8 4h8v5a4 4 0 0 1-8 0z" /><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4" /><path d="M12 13v4M8 20h8M9.5 17h5" /></>)}
                </div>
                <div><div style={{ fontWeight: 800, fontSize: 18, color: '#D90A0A' }}>{badge.value}</div><div style={{ fontSize: 12, color: '#3E4860' }}>{badge.label}</div></div>
              </div>
            )}
            <div className="hide-sm" aria-hidden="true" style={{ position: 'absolute', right: 28, top: 28, fontFamily: "'Caveat', cursive", fontSize: 46, lineHeight: 1.05, color: '#ffffff', transform: 'rotate(-12deg)', textAlign: 'left' }}>
              Learn<br />{NB}Grow<br />{NB}{NB}Achieve
              <div style={{ height: 3, width: 150, background: '#D90A0A', borderRadius: 3, marginTop: 4, marginLeft: 30 }} />
            </div>
          </div>
        </div>
      </section>

      {/* feature strip */}
      <section style={{ background: '#0B1D45', color: '#ffffff' }}>
        <div className="pad feat" style={{ maxWidth: 1280, margin: '0 auto', padding: '30px 32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
          {[
            ['Expert Faculty', 'Learn from experienced and dedicated mentors', <><circle cx="12" cy="9" r="5.5" /><path d="M8.5 13.5L7 21l5-2.5 5 2.5-1.5-7.5" /></>],
            ['Result-Oriented', 'Proven track record of academic excellence', <><path d="M4 20h16" /><path d="M6 17v-4M10 17v-6M14 17v-5M18 17V7" /><path d="M5 10l5-4 4 3 5-5" /></>],
            ['Structured Learning', 'Concept clarity with systematic study plans', <><path d="M3 5.5C5.5 4.5 9 4.5 12 6c3-1.5 6.5-1.5 9-.5V19c-2.5-1-6-1-9 .5-3-1.5-6.5-1.5-9-.5z" /><path d="M12 6v13.5" /></>],
            ['Personalized Support', 'Regular assessment and doubt resolution', <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="1.2" /><path d="M15 9l5-5M17 4h3v3" /></>]
          ].map(([t, d, icon]) => (
            <div key={t} style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <div style={{ color: '#FF3B30' }}>{ico(36, icon)}</div>
              <div><div style={{ fontWeight: 700, fontSize: 15 }}>{t}</div><div style={{ fontSize: 13, color: '#C3CBE0', lineHeight: 1.45 }}>{d}</div></div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ SECONDARY NAV ============ */}
      <div className="subnav">
        <nav aria-label="Sections" className="pad" style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', display: 'flex', gap: 4, overflowX: 'auto' }}>
          <a href="#results">Results</a><a href="#programs">Programs</a><a href="#tests">Admission Tests</a><a href="#news">News</a>
          <a href="#about">About</a><a href="#methodology">Roadmap</a><a href="#centres">Centres</a><a href="#students">Student Life</a>
        </nav>
      </div>

      {/* ============ RESULTS ============ */}
      <section id="results" style={{ position: 'relative', background: '#F6F8FC', overflow: 'hidden' }}>
        <div className="stripes-soft hide-sm" style={{ opacity: 0.9, height: 260 }} />
        <div className="pad" style={{ ...wrap, padding: '84px 32px', gap: 44 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))', gap: 40, alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Eyebrow>OUR RESULTS</Eyebrow>
              <h2 className="h2" style={{ ...h2, fontSize: 46, lineHeight: 1.08 }}>Proven Results,<br /><span style={{ color: '#D90A0A' }}>Real Success</span> Stories</h2>
              <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: '#3E4860', maxWidth: 480 }}>Year after year, HAwk ACademe students turn their ambitions into achievements with consistent top ranks in JEE, NEET and other competitive exams.</p>
            </div>
            <HighlightTiles />
          </div>
          <Toppers />
          <div style={{ background: '#ffffff', borderRadius: 14, padding: '20px 24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px 20px', boxShadow: '0 6px 18px rgba(11,29,69,.06)' }}>
            <div style={{ fontWeight: 800, fontSize: 15, marginRight: 8 }}>Quick Access</div>
            {['JEE Advanced Results', 'JEE Main Results', 'NEET-UG Results', 'Board Exam Results'].map((l) => (
              <a key={l} href="/results" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 600, color: '#0B1D45', padding: '10px 14px', borderRadius: 999, background: '#F6F8FC' }}>
                <Circled size={16} style={{ color: '#D90A0A' }} />{l}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PROGRAMS ============ */}
      <section id="programs" style={{ position: 'relative', background: '#ffffff', overflow: 'hidden' }}>
        <div className="hide-sm" style={{ position: 'absolute', top: 0, right: 0, width: '34%', height: '100%', background: 'linear-gradient(118deg,transparent 0 40%,#D90A0A 40% 43%,#0B1D45 43% 100%)', opacity: 0.95 }} />
        <div className="pad" style={wrap}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Eyebrow>OUR PROGRAMS</Eyebrow>
            <h2 className="h2" style={{ ...h2, fontSize: 46, lineHeight: 1.08 }}>Programs for <span style={{ color: '#D90A0A' }}>Every Aspirant</span></h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {PROGRAMS.map((p) => {
              const red = p.tone === 'red';
              return (
                <div key={p.key} className="card" style={{ background: '#ffffff', border: '1px solid #E7EAF0', borderRadius: 12, padding: 26, display: 'flex', flexDirection: 'column', gap: 12, boxShadow: '0 10px 30px rgba(11,29,69,.06)' }}>
                  <img src={p.img} alt={p.alt} width="1280" height="600" loading="lazy" style={{ display: 'block', width: 'calc(100% + 52px)', maxWidth: 'none', margin: '-26px -26px 6px', height: 140, objectFit: 'cover', borderRadius: '12px 12px 0 0' }} />
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: red ? '#FFECEC' : '#E9EEF8', color: red ? '#D90A0A' : '#0B1D45', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{ico(28, p.icon)}</div>
                  <h3 style={{ margin: '4px 0 0', fontSize: 19, fontWeight: 800 }}>{p.name}</h3>
                  <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: '#3E4860' }}>{p.card}</p>
                  <ul style={{ listStyle: 'none', margin: '4px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 9, fontSize: 13, color: '#3E4860', flexGrow: 1 }}>
                    {p.cardBullets.map((b) => <li key={b} style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Tick color={red ? '#D90A0A' : '#0B1D45'} />{b}</li>)}
                  </ul>
                  <a className={red ? 'btn-red' : 'btn-navy'} href={LANDING_SLUGS[p.key] ? landingPath(p.key) : `/programs#${p.key}`} aria-label={LANDING_SLUGS[p.key] ? LANDINGS[p.key].h1 : `Know more about ${p.name}`} style={{ marginTop: 8, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: red ? '#D90A0A' : '#0B1D45', color: '#ffffff', fontWeight: 700, fontSize: 14, borderRadius: 4 }}>Know More <Arrow size={16} /></a>
                </div>
              );
            })}
          </div>
          <div style={{ background: '#ffffff', borderRadius: 12, boxShadow: '0 10px 30px rgba(11,29,69,.08)', padding: '22px 28px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 20 }}>
            {[
              [site.highlights?.[0]?.value, site.highlights?.[0]?.label, '#D90A0A', <><path d="M2 9l10-5 10 5-10 5z" /><path d="M6 11v5c3 2.5 9 2.5 12 0v-5" /></>],
              [YEARS_OF_EXCELLENCE, 'Years of Excellence', '#0B1D45', <path d="M3 20h18M5 20V9M9 20V9M15 20V9M19 20V9M2 9l10-5 10 5z" />],
              [site.highlights?.[1]?.value, site.highlights?.[1]?.label, '#D90A0A', <><path d="M8 4h8v5a4 4 0 0 1-8 0z" /><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4" /><path d="M12 13v4M8 20h8" /></>],
              ['Personalized', 'Mentorship & Support', '#0B1D45', <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="1.2" /></>]
            ].filter(([v]) => v).map(([v, l, c, icon]) => (
              <div key={l} style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <div style={{ color: c }}>{ico(34, icon)}</div>
                <div><div style={{ fontWeight: 800, fontSize: 22, color: '#D90A0A' }}>{v}</div><div style={{ fontSize: 13, color: '#3E4860' }}>{l}</div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ UPCOMING ADMISSION TESTS ============ */}
      <section id="tests" style={{ position: 'relative', background: '#0B1D45', color: '#ffffff', overflow: 'hidden' }}>
        <img src="/img/hero-pattern.webp" alt="" loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(118deg,rgba(255,255,255,.035) 0 18px,transparent 18px 60px)' }} />
        <div className="hide-sm" style={{ position: 'absolute', top: 0, right: 0, width: '40%', height: '100%', background: 'linear-gradient(118deg,transparent 0 50%,#D90A0A 50% 53%,transparent 53%)' }} />
        <div className="pad" style={{ ...wrap, gap: 36 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 640 }}>
            <Eyebrow color="#C3CBE0" line="#FF3B30">ADMISSION &amp; SCHOLARSHIP</Eyebrow>
            <h2 className="h2" style={h2}>Upcoming Diagnostic cum <span style={{ color: '#FF5A4E' }}>Scholarship Tests</span></h2>
            <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: '#C3CBE0' }}>Every journey at HAwk ACademe starts with a diagnostic test, so we can place each student in the right program and reward merit with scholarships.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {TESTS.map((t) => {
              const red = t.tone === 'red';
              return (
                <div key={t.name} className="card" style={{ background: '#ffffff', color: '#0A1530', borderRadius: 12, padding: 26, display: 'flex', flexDirection: 'column', gap: 14, borderTop: `4px solid ${red ? '#D90A0A' : '#0B1D45'}` }}>
                  <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '.12em', color: red ? '#D90A0A' : '#0B1D45' }}>{t.tag}</div>
                  <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>{t.name}</h3>
                  <div style={{ fontSize: 14, color: '#3E4860' }}>{t.classes}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 700, flexGrow: 1 }}>
                    <Calendar size={18} style={{ color: '#D90A0A' }} />{t.date || 'Date to be announced'}
                  </div>
                  <a className={red ? 'btn-red' : 'btn-navy'} href={`/contact${t.program ? `?program=${t.program}` : ''}`} aria-label={`Enquire about the ${t.name}`} style={{ height: 46, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: red ? '#D90A0A' : '#0B1D45', color: '#ffffff', fontWeight: 700, fontSize: 14, borderRadius: 4 }}>
                    Enquire to Register <Arrow size={16} />
                  </a>
                </div>
              );
            })}
          </div>
          <div>
            <a href="/news" style={{ height: 46, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0 22px', border: '1.5px solid #ffffff', color: '#ffffff', fontWeight: 700, fontSize: 14, borderRadius: 4 }}>See all test dates</a>
          </div>
        </div>
      </section>

      {/* ============ LATEST ANNOUNCEMENTS ============ */}
      <section id="news" style={{ background: '#ffffff' }}>
        <div className="pad" style={{ ...wrap, maxWidth: 1180, padding: '80px 32px', gap: 28 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Eyebrow>LATEST ANNOUNCEMENTS</Eyebrow>
              <h2 className="h2" style={h2}>News &amp; <span style={{ color: '#D90A0A' }}>Notices</span></h2>
            </div>
            <a className="btn-ghost" href="/news" style={{ height: 46, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0 22px', border: '1.5px solid #D90A0A', color: '#D90A0A', background: '#ffffff', fontWeight: 700, fontSize: 14, borderRadius: 4 }}>View all news <Arrow size={16} /></a>
          </div>
          {notices.data?.notices?.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {notices.data.notices.map((n) => <NoticeRow key={n.id} notice={n} compact />)}
            </div>
          ) : (
            <div style={{ color: '#5A6378', fontSize: 15 }}>{notices.loading ? 'Loading announcements…' : 'No announcements right now. Please check back soon.'}</div>
          )}
        </div>
      </section>

      {/* ============ ABOUT ============ */}
      <section id="about" style={{ position: 'relative', background: '#F6F8FC', overflow: 'hidden' }}>
        <div className="pad" style={{ maxWidth: 1280, margin: '0 auto', padding: '88px 32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 460px), 1fr))', gap: 48, alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <Eyebrow>ABOUT HAwk ACademe</Eyebrow>
            <h2 className="h2" style={h2}>More Than Coaching,<br />A Commitment to <span style={{ color: '#D90A0A' }}>Your Future</span></h2>
            <p style={{ margin: 0, fontSize: 16, lineHeight: 1.65, color: '#3E4860' }}>HAwk ACademe is built on the belief that every student has the potential to achieve greatness. We combine expert guidance, structured learning and continuous support to help students succeed in JEE, NEET and beyond.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginTop: 4 }}>
              {[
                ['Experienced Faculty', 'IIT/NIT & subject experts', <><circle cx="12" cy="9" r="5.5" /><path d="M8.5 13.5L7 21l5-2.5 5 2.5-1.5-7.5" /></>],
                ['Student-Centric Approach', 'Personalized mentoring', <><path d="M4 20h16" /><path d="M7 17v-5M12 17V7M17 17v-8" /></>],
                ['Proven Track Record', 'Consistent top ranks', <><circle cx="12" cy="14" r="5" /><path d="M8.5 9.5L6 3h4l2 4 2-4h4l-2.5 6.5" /></>],
                ['Holistic Development', 'Academics + Life skills', <path d="M12 3l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.4 6.8 19.2l1-5.9L3.5 9.2l5.9-.8z" />]
              ].map(([t, d, icon]) => (
                <div key={t} style={{ background: '#ffffff', borderRadius: 10, padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'center', boxShadow: '0 6px 18px rgba(11,29,69,.07)' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#FFECEC', color: '#D90A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{ico(20, icon)}</div>
                  <div><div style={{ fontWeight: 700, fontSize: 14 }}>{t}</div><div style={{ fontSize: 12, color: '#5A6378' }}>{d}</div></div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 6 }}><a className="btn-red" href="/about" style={btnRed}>Know More About Us <Arrow size={18} /></a></div>
          </div>
          <CampusArt />
        </div>
      </section>

      {/* ============ METHODOLOGY ============ */}
      <section id="methodology" style={{ position: 'relative', background: '#ffffff', overflow: 'hidden' }}>
        <svg className="hide-sm" viewBox="0 0 400 600" preserveAspectRatio="none" style={{ position: 'absolute', left: 0, top: 0, width: '22%', height: '100%', opacity: 0.9 }} aria-hidden="true">
          <path d="M-40 60 H120 Q200 60 200 140 V460 Q200 540 280 540 H440" fill="none" stroke="#D90A0A" strokeWidth="34" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
        </svg>
        <svg className="hide-sm" viewBox="0 0 400 600" preserveAspectRatio="none" style={{ position: 'absolute', right: 0, top: 0, width: '22%', height: '100%', opacity: 0.12 }} aria-hidden="true">
          <path d="M440 120 H280 Q200 120 200 200 V420 Q200 500 120 500 H-40" fill="none" stroke="#0B1D45" strokeWidth="34" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
        </svg>
        <div className="pad" style={{ ...wrap, maxWidth: 1180 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center', textAlign: 'center' }}>
            <Eyebrow center>OUR METHODOLOGY</Eyebrow>
            <h2 className="h2" style={h2}>Your <span style={{ color: '#D90A0A' }}>Roadmap</span> to Success</h2>
            <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: '#3E4860', maxWidth: 600 }}>Six clear milestones that take every student from their first day at HAwk ACademe to exam day.</p>
          </div>
          <Roadmap />
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <a className="btn-red" href="/about" style={{ ...btnRed, padding: '0 26px' }}>Why HAwk ACademe <Arrow size={18} /></a>
          </div>
        </div>
      </section>

      {/* ============ CENTRES ============ */}
      <section id="centres" style={{ position: 'relative', background: '#ffffff', overflow: 'hidden' }}>
        <div className="pad" style={{ maxWidth: 1280, margin: '0 auto', padding: '88px 32px', display: 'flex', flexWrap: 'wrap', gap: 40, alignItems: 'flex-start' }}>
          <div style={{ flex: '2 1 560px', display: 'flex', flexDirection: 'column', gap: 22, minWidth: 0 }}>
            <Eyebrow>OUR CENTRES</Eyebrow>
            <h2 className="h2" style={h2}>Find a Centre <span style={{ color: '#D90A0A' }}>Near You</span></h2>
            <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: '#3E4860', maxWidth: 520 }}>Three centres, in Barasat, Madhyamgram and New Town, so students across North 24 Parganas can learn close to home.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14, marginTop: 6 }}>
              {CENTRES.map((c) => (
                <div key={c.key} className="card" style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', border: '1px solid #E7EAF0', background: '#ffffff' }}>
                  <img src={c.img} alt={c.alt} width="960" height="520" loading="lazy" style={{ display: 'block', width: '100%', height: 130, objectFit: 'cover' }} />
                  <div style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div><div style={{ fontWeight: 700, fontSize: 14 }}>{c.city}</div><div style={{ fontSize: 11, color: '#5A6378' }}>{c.area}</div></div>
                    <a href="/contact#centres" className="stretched" aria-label={`${c.city} centre details`} style={arrowCircle}><Arrow size={14} /></a>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ flex: '1 1 300px', background: '#F6F8FC', borderRadius: 12, padding: 26, display: 'flex', flexDirection: 'column', gap: 4, borderTop: '4px solid #D90A0A' }}>
            <h3 style={{ margin: '0 0 10px', fontSize: 20, fontWeight: 800 }}>Our Centres</h3>
            {CENTRES.map((c, i) => (
              <div key={c.key} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: i < CENTRES.length - 1 ? '1px solid #E1E6EF' : 0 }}>
                <Pin size={20} style={{ color: '#D90A0A' }} />
                <div><div style={{ fontWeight: 700, fontSize: 14 }}>{c.city}</div><div style={{ fontSize: 12, color: '#5A6378' }}>{c.address}</div></div>
              </div>
            ))}
            <a className="btn-red" href="/contact#centres" style={{ ...btnRed, marginTop: 14, justifyContent: 'center' }}>View All Centres <Arrow size={18} /></a>
          </div>
        </div>
      </section>

      {/* ============ GROWING WORLD ============ */}
      <section style={{ background: '#D90A0A', color: '#ffffff' }}>
        <div className="pad" style={{ maxWidth: 1280, margin: '0 auto', padding: '56px 32px', display: 'flex', flexDirection: 'column', gap: 28 }}>
          <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800, textAlign: 'center' }}>The Growing World of HAwk ACademe</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {GROWTH.map((g, i) => (
              <div key={g.label} style={{ background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.25)', borderRadius: 12, padding: 22, display: 'flex', gap: 16, alignItems: 'center' }}>
                {ico(36, [
                  <><path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z" /><circle cx="12" cy="9" r="2.5" /></>,
                  <><circle cx="12" cy="9" r="5.5" /><path d="M8.5 13.5L7 21l5-2.5 5 2.5-1.5-7.5" /></>,
                  <><rect x="3" y="4" width="18" height="12" rx="1" /><path d="M7 20l2-4M17 20l-2-4" /></>,
                  <path d="M3 20h18M5 20V9M9 20V9M15 20V9M19 20V9M2 9l10-5 10 5z" />
                ][i % 4])}
                <div><div style={{ fontSize: 34, fontWeight: 800, lineHeight: 1 }}>{g.value}</div><div style={{ fontSize: 14, marginTop: 4 }}>{g.label}</div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ STUDENT LIFE ============ */}
      <section id="students" style={{ position: 'relative', background: '#F6F8FC', overflow: 'hidden' }}>
        <div className="pad" style={{ ...wrap, gap: 36 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 580 }}>
              <Eyebrow>LIFE AT HAwk ACademe</Eyebrow>
              <h2 className="h2" style={h2}>Learn. Grow. <span style={{ color: '#D90A0A' }}>Belong.</span></h2>
              <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: '#3E4860' }}>At HAwk ACademe, it&apos;s not just about studies. We create a dynamic learning environment with activities, workshops and events that help you grow beyond academics.</p>
            </div>
            <div className="hide-sm" aria-hidden="true" style={{ fontFamily: "'Caveat', cursive", fontSize: 34, lineHeight: 1.1, color: '#0B1D45', transform: 'rotate(-8deg)' }}>“A community<br />that inspires you<br />to achieve more.”</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {[
              ['classroom', 'Classroom with blackboard and desks', 'Classroom Learning'],
              ['doubt-sessions', 'Doubt session chat bubbles', 'Doubt Sessions'],
              ['seminars', 'Seminar presentation screen', 'Seminars & Workshops'],
              ['activities', 'Chess, football and science activities', 'Student Activities'],
              ['celebrations', 'Trophy and confetti celebration', 'Celebrations']
            ].map(([img, alt, label]) => (
              <a key={img} className="card" href="/gallery" style={{ display: 'block', borderRadius: 10, overflow: 'hidden', background: '#ffffff', color: '#0A1530', boxShadow: '0 8px 22px rgba(11,29,69,.08)' }}>
                <img src={`/img/${img}.webp`} alt={alt} width="960" height="600" loading="lazy" style={{ display: 'block', width: '100%', height: 150, objectFit: 'cover' }} />
                <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 700, fontSize: 14 }}>
                  {label}<span style={arrowCircle} aria-hidden="true"><Arrow size={14} /></span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ============ RESOURCES ============ */}
      <section id="resources" style={{ position: 'relative', background: '#ffffff', overflow: 'hidden' }}>
        <div className="hide-sm" style={{ position: 'absolute', top: 0, right: 0, width: '30%', height: '100%', background: 'linear-gradient(118deg,transparent 0 30%,#D90A0A 30% 33%,#0B1D45 33% 100%)' }} />
        <div className="pad" style={{ position: 'relative', maxWidth: 1280, margin: '0 auto', padding: '88px 32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 40, alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Eyebrow>RESOURCES</Eyebrow>
            <h2 className="h2" style={h2}>Tools to Support<br />Your <span style={{ color: '#D90A0A' }}>Preparation</span></h2>
            <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: '#3E4860' }}>Exam tips, important updates, results and expert guidance, all in one place.</p>
            <div style={{ marginTop: 6 }}><a className="btn-red" href="/blog" style={btnRed}>Read the Blog <Arrow size={18} /></a></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
            {[
              ['/blog', 'Expert Blogs', 'Tips, strategies & insights', <><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8h8M8 12h8M8 16h5" /></>],
              ['/news', 'Important Updates', 'Exam news & notifications', <><path d="M4 10v4h3l7 4V6L7 10z" /><path d="M17 9a4 4 0 0 1 0 6" /></>],
              ['/blog?category=Study%20Plans', 'Study Plans', 'Routines that work', <><path d="M3 5.5C5.5 4.5 9 4.5 12 6c3-1.5 6.5-1.5 9-.5V19c-2.5-1-6-1-9 .5-3-1.5-6.5-1.5-9-.5z" /><path d="M12 6v13.5" /></>],
              ['/blog?category=Exam%20Tips', 'Exam Tips', 'Make every test count', <><path d="M14 3H6v18h12V7z" /><path d="M14 3v4h4M9 12h6M9 16h4" /></>]
            ].map(([href, t, d, icon]) => (
              <a key={t} className="card" href={href} style={{ background: '#ffffff', border: '1px solid #E7EAF0', borderRadius: 10, padding: 18, display: 'flex', gap: 14, alignItems: 'center', color: '#0A1530', boxShadow: '0 6px 18px rgba(11,29,69,.06)' }}>
                <div style={{ width: 46, height: 46, borderRadius: '50%', background: '#FFECEC', color: '#D90A0A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{ico(22, icon)}</div>
                <div><div style={{ fontWeight: 700, fontSize: 15 }}>{t}</div><div style={{ fontSize: 12, color: '#5A6378' }}>{d}</div></div>
              </a>
            ))}
          </div>
          <img src="/img/study-desk.webp" alt="Study books, laptop and notes on a desk" width="1600" height="1120" loading="lazy" style={{ display: 'block', width: '100%', height: 'auto', borderRadius: 16, boxShadow: '0 18px 40px rgba(11,29,69,.18)' }} />
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      {reviewList.length > 0 && (
        <section id="reviews" style={{ background: '#F6F8FC' }}>
          <div className="pad" style={{ ...wrap, gap: 36 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center', textAlign: 'center' }}>
              <Eyebrow center>TESTIMONIALS</Eyebrow>
              <h2 className="h2" style={h2}>What Students &amp; <span style={{ color: '#D90A0A' }}>Parents Say</span></h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 20 }}>
              {reviewList.slice(0, 6).map((r) => (
                <figure key={r.id} className="card" style={{ margin: 0, background: '#ffffff', border: '1px solid #E7EAF0', borderRadius: 14, padding: 28, display: 'flex', flexDirection: 'column', gap: 16, boxShadow: '0 10px 28px rgba(11,29,69,.06)', borderTop: '4px solid #D90A0A' }}>
                  <Quote size={32} />
                  <blockquote style={{ margin: 0, fontSize: 16, lineHeight: 1.65, color: '#0A1530', fontWeight: 500, flexGrow: 1 }}>{r.quote}</blockquote>
                  <figcaption style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div aria-hidden="true" style={{ width: 44, height: 44, borderRadius: '50%', background: '#0B1D45', color: '#ffffff', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{initials(r.name)}</div>
                    <div><div style={{ fontWeight: 800, fontSize: 15 }}>{r.name}</div>{r.role && <div style={{ fontSize: 13, color: '#5A6378' }}>{r.role}</div>}</div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ FOUNDER QUOTE ============ */}
      {FOUNDER && <section style={{ background: reviewList.length > 0 ? '#ffffff' : '#F6F8FC' }}>
        <div className="pad" style={{ maxWidth: 960, margin: '0 auto', padding: '80px 32px' }}>
          <FounderQuote founder={FOUNDER} />
        </div>
      </section>}

      {/* ============ CONTACT CTA ============ */}
      <section id="contact" style={{ position: 'relative', background: '#0B1D45', color: '#ffffff', overflow: 'hidden' }}>
        <img src="/img/hero-pattern.webp" alt="" loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />
        <div className="hide-sm" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(118deg,#F6F8FC 0 46%,#D90A0A 46% 49%,transparent 49%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(118deg,rgba(255,255,255,.04) 0 18px,transparent 18px 60px)' }} />
        <div className="pad" style={{ position: 'relative', maxWidth: 1280, margin: '0 auto', padding: '80px 32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))', gap: 40, alignItems: 'center' }}>
          <div className="cta-box" style={{ display: 'flex', flexDirection: 'column', gap: 14, background: '#F6F8FC', color: '#0A1530', padding: '8px 0', borderRadius: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '.22em' }}>READY TO BEGIN?</div>
            <h2 className="h2" style={{ ...h2, fontSize: 42 }}>Take the First Step Towards<br />Your <span style={{ color: '#D90A0A' }}>Bright Future</span></h2>
            <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: '#3E4860' }}>Get in touch with our counsellors and find the right program for you.</p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 6 }}>
              <a className="btn-red" href="/contact" style={{ ...btnRed, height: 50, padding: '0 26px', fontSize: 15 }}>Enquire Now <Arrow size={18} /></a>
              <a className="btn-ghost" href={site.phone ? telHref(site.phone) : '/contact'} style={{ height: 50, display: 'flex', alignItems: 'center', padding: '0 24px', border: '1.5px solid #D90A0A', color: '#D90A0A', background: '#ffffff', fontWeight: 700, fontSize: 15, borderRadius: 4 }}>Talk to Counsellor</a>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 28 }}>
            <div className="cta-quote" aria-hidden="true" style={{ fontFamily: "'Caveat', cursive", fontSize: 54, lineHeight: 1.05, color: '#ffffff', transform: 'rotate(-10deg)' }}>
              “Your Goals,<br />{NB}Our Guidance.”
              <div style={{ height: 3, width: 180, background: '#D90A0A', borderRadius: 3, marginTop: 6, marginLeft: 60 }} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// Campus illustration from the design (inline SVG, no photo needed).
function CampusArt() {
  const win = (x, y, w = 22, h = 30) => <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} />;
  return (
    <div className="about-art" style={{ position: 'relative', height: 460, borderRadius: 16, overflow: 'hidden', background: '#E3EAF7', boxShadow: '0 18px 40px rgba(11,29,69,.12)' }}>
      <svg viewBox="0 0 600 460" preserveAspectRatio="xMidYMax slice" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }} role="img" aria-label="Illustration of the HAwk ACademe campus building">
        <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#DDE6F6" /><stop offset="1" stopColor="#F4F7FC" /></linearGradient></defs>
        <rect x="0" y="0" width="600" height="460" fill="url(#sky)" />
        <path d="M430 0 L600 0 L600 210 Z" fill="#0B1D45" />
        <path d="M404 0 L430 0 L600 210 L600 242 Z" fill="#D90A0A" />
        <circle cx="520" cy="66" r="22" fill="#ffffff" opacity=".18" />
        <g fill="#C7D3E8"><rect x="18" y="250" width="54" height="150" /><rect x="78" y="290" width="40" height="110" /><rect x="486" y="240" width="46" height="160" /><rect x="538" y="280" width="50" height="120" /></g>
        <rect x="0" y="396" width="600" height="12" fill="#7FA977" />
        <rect x="0" y="408" width="600" height="52" fill="#CBD4E4" />
        <path d="M276 408 L324 408 L352 460 L248 460 Z" fill="#E8EDF5" />
        <rect x="125" y="160" width="130" height="14" fill="#0B1D45" /><rect x="130" y="174" width="120" height="222" fill="#ffffff" />
        <rect x="345" y="160" width="130" height="14" fill="#0B1D45" /><rect x="350" y="174" width="120" height="222" fill="#ffffff" />
        <g fill="#93A6C9">{[146, 179, 212, 366, 399, 432].flatMap((x) => [196, 246, 296].map((y) => win(x, y)))}</g>
        <rect x="240" y="116" width="120" height="14" fill="#D90A0A" />
        <rect x="245" y="130" width="110" height="266" fill="#F1F4FA" />
        <rect x="256" y="142" width="88" height="62" rx="6" fill="#ffffff" stroke="#DCE2EC" />
        <g transform="translate(284 148) scale(0.15)">
          <rect x="8" y="10" width="44" height="160" fill="#D90A0A" /><rect x="118" y="10" width="44" height="160" fill="#D90A0A" />
          <path d="M8 170 C 30 110, 80 78, 170 72 L 170 52 L 214 84 L 170 116 L 170 96 C 100 100, 60 128, 52 170 Z" fill="#A80707" />
        </g>
        <text x="300" y="196" textAnchor="middle" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="800" fontSize="9.5" fill="#0A1530">HAwk ACademe</text>
        <g fill="#93A6C9">{[262, 306].flatMap((x) => [218, 254, 290].map((y) => win(x, y, 32, 24)))}</g>
        <rect x="266" y="324" width="68" height="8" fill="#D90A0A" /><rect x="274" y="332" width="52" height="64" fill="#0B1D45" />
        <rect x="299" y="332" width="2" height="64" fill="#ffffff" /><rect x="264" y="394" width="72" height="6" fill="#AEB9CC" />
        <rect x="299" y="78" width="2" height="38" fill="#0B1D45" /><path d="M301 80 L326 87 L301 94 Z" fill="#D90A0A" />
        <g fill="#4E7D46"><circle cx="96" cy="364" r="26" /><circle cx="506" cy="362" r="26" /><circle cx="546" cy="378" r="17" /></g>
        <g fill="#3E5A34"><rect x="93" y="384" width="6" height="14" /><rect x="503" y="382" width="6" height="16" /><rect x="543" y="390" width="6" height="8" /></g>
      </svg>
      <div className="art-quote" style={{ position: 'absolute', left: 20, top: 20, maxWidth: '40%', background: '#0B1D45', color: '#ffffff', borderRadius: 14, padding: '12px 18px 14px', boxShadow: '0 12px 28px rgba(11,29,69,.25)' }}>
        <div style={{ fontFamily: "'Caveat', cursive", fontSize: 26, lineHeight: 1.1 }}>“Discipline today, Brighter tomorrow.”</div>
        <div style={{ height: 3, width: 56, background: '#D90A0A', borderRadius: 3, marginTop: 8 }} />
      </div>
    </div>
  );
}
