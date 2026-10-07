import PageHero, { Eyebrow } from '../components/PageHero.jsx';
import { CtaBand, HighlightTiles, RedButton, FounderQuote } from '../components/Blocks.jsx';
import { STORY, FOUNDED, FOUNDER, FACULTY, SUBJECT_BANDS } from '../content/about.js';
import { usePageMeta } from '../lib/hooks.js';

const PILLARS = [
  ['OUR MISSION', 'To make focused, concept-first preparation accessible to every aspirant, and to build discipline that lasts beyond the exam.',
    <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="1.2" /></>],
  ['OUR VISION', 'To be the academy students and parents trust most for honest guidance and consistent results.',
    <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></>],
  ['OUR PROMISE', 'Every student is known by name, taught by experts and measured regularly, so nobody is left behind.',
    <><path d="M12 21s-7-4.5-7-10V5l7-2 7 2v6c0 5.5-7 10-7 10z" /><path d="M9 12l2 2 4-4" /></>]
];

const VALUES = [
  ['Discipline', 'Consistent routines and high standards, every day.'],
  ['Mentorship', 'Faculty who guide, not just teach, and who know each student.'],
  ['Results', 'Honest measurement and steady improvement, test after test.']
];

const h2 = { margin: 0, fontSize: 38, lineHeight: 1.1, fontWeight: 800, letterSpacing: '-.015em' };
const wrap = (pad = '72px 32px') => ({ maxWidth: 1280, margin: '0 auto', padding: pad, display: 'flex', flexDirection: 'column', gap: 32 });

export default function About() {
  usePageMeta('About Us | HAwk ACademe', 'HAwk ACademe prepares students for JEE, NEET and Foundation exams with focused teaching, personal mentorship and a culture of hard work.');
  return (
    <>
      <PageHero crumb="About" title={<>Built on <span style={{ color: '#FF4A3A' }}>Discipline, Mentorship &amp; Results</span></>}
        intro="HAwk ACademe prepares students for JEE, NEET and Foundation exams with focused teaching, personal mentorship and a culture of hard work." />

      <section style={{ background: '#ffffff' }}>
        <div className="pad" style={wrap()}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))', gap: 48, alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Eyebrow>OUR STORY</Eyebrow>
              <h2 className="h2" style={h2}>Why <span style={{ color: '#D90A0A' }}>HAwk ACademe</span> exists</h2>
              {STORY.map((p, i) => <p key={i} style={{ margin: 0, fontSize: 16, lineHeight: 1.7, color: '#3E4860' }}>{p}</p>)}
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0B1D45' }}>Founded in {FOUNDED}</div>
              <div><RedButton href="/contact" arrow>Talk to Us</RedButton></div>
            </div>
            <img src="/img/campus-night.webp" alt="HAwk ACademe campus at night" width="1000" height="700" loading="lazy" style={{ display: 'block', width: '100%', height: 'auto', borderRadius: 16, boxShadow: '0 18px 40px rgba(11,29,69,.2)' }} />
          </div>
        </div>
      </section>

      <section style={{ background: '#F6F8FC' }}>
        <div className="pad" style={wrap('56px 32px')}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 20 }}>
            {PILLARS.map(([label, text, icon]) => (
              <div key={label} className="card" style={{ background: '#ffffff', border: '1px solid #E7EAF0', borderRadius: 14, padding: 28, display: 'flex', flexDirection: 'column', gap: 12, boxShadow: '0 10px 28px rgba(11,29,69,.06)' }}>
                <div style={{ width: 52, height: 52, borderRadius: 12, background: '#D90A0A', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg className="ico" viewBox="0 0 24 24" style={{ width: 26, height: 26 }} aria-hidden="true">{icon}</svg>
                </div>
                <h2 style={{ margin: 0, fontSize: 12, fontWeight: 800, letterSpacing: '.16em', color: '#D90A0A' }}>{label}</h2>
                <p style={{ margin: 0, fontSize: 15, lineHeight: 1.65, color: '#3E4860' }}>{text}</p>
              </div>
            ))}
          </div>
          <div>
            <h2 style={{ margin: '8px 0 16px', fontSize: 22, fontWeight: 800 }}>HAwk ACademe in numbers</h2>
            <HighlightTiles minWidth={200} />
          </div>
        </div>
      </section>

      <section style={{ background: '#ffffff' }}>
        <div className="pad" style={wrap()}>
          <Eyebrow center>OUR VALUES</Eyebrow>
          <h2 className="h2" style={{ ...h2, textAlign: 'center' }}>Three ideas <span style={{ color: '#D90A0A' }}>guide everything</span></h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: 20 }}>
            {VALUES.map(([t, d]) => (
              <div key={t} style={{ background: '#0B1D45', color: '#ffffff', borderRadius: 14, padding: 28, display: 'flex', flexDirection: 'column', gap: 10, borderBottom: '4px solid #D90A0A' }}>
                <h3 style={{ margin: 0, fontSize: 26, fontWeight: 800 }}>{t}</h3>
                <div style={{ fontSize: 15, lineHeight: 1.6, color: '#C3CBE0' }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: '#F6F8FC' }}>
        <div className="pad" style={wrap()}>
          <Eyebrow>OUR FACULTY</Eyebrow>
          <h2 className="h2" style={h2}>Meet the <span style={{ color: '#D90A0A' }}>mentors</span></h2>
          <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: '#3E4860', maxWidth: 620 }}>Experienced, full-time educators who stay with a batch through the year.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 230px), 1fr))', gap: 18 }}>
            {FACULTY.map((f, i) => {
              const band = SUBJECT_BANDS[f.subject] || SUBJECT_BANDS.physics;
              return (
                <div key={i} className="card" style={{ background: '#ffffff', border: '1px solid #E7EAF0', borderRadius: 12, overflow: 'hidden', boxShadow: '0 8px 22px rgba(11,29,69,.06)' }}>
                  {f.photo ? (
                    <img src={f.photo} alt={f.name} loading="lazy" style={{ display: 'block', width: '100%', height: 180, objectFit: 'cover' }} />
                  ) : (
                    <div aria-hidden="true" style={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 700, fontSize: 30, background: band.bg }}>{band.glyph}</div>
                  )}
                  <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.14em', color: '#D90A0A' }}>{band.label}</div>
                    <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800 }}>{f.name}</h3>
                    <div style={{ fontSize: 13, color: '#5A6378' }}>{f.qualification} · {f.experience}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section style={{ background: '#ffffff' }}>
        <div className="pad" style={{ maxWidth: 960, margin: '0 auto', padding: '72px 32px' }}>
          <FounderQuote founder={FOUNDER} compact />
        </div>
      </section>

      <CtaBand title="Join the HAwk ACademe family" text="Meet our team, visit a centre and find the program that fits you."
        secondary={{ href: '/programs', label: 'Explore Programs' }} />
    </>
  );
}
