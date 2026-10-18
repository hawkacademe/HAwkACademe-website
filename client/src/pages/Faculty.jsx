import { useState } from 'react';
import PageHero, { Eyebrow } from '../components/PageHero.jsx';
import { CtaBand, Empty } from '../components/Blocks.jsx';
import { Tick } from '../components/Icons.jsx';
import { FACULTY_LIST, FACULTY_UNDER_MAINTENANCE, SUBJECTS, subjectName } from '../content/faculty.js';
import { usePathMeta } from '../lib/hooks.js';

const WHY = [
  ['Full-time subject experts', 'Every teacher here teaches one subject, full time, and prepares students for JEE, NEET and board exams every year.'],
  ['One batch, one team', 'The same teachers stay with a batch through the year, so they know each student’s strengths and gaps.'],
  ['Doubts answered every week', 'Faculty hold one-on-one doubt sessions every week, so no question waits until the next test.']
];

export default function Faculty() {
  usePathMeta('/faculty');
  const [subject, setSubject] = useState('all');
  const shown = subject === 'all' ? FACULTY_LIST : FACULTY_LIST.filter((f) => f.subject === subject);
  const tabs = [['all', 'All Subjects'], ...SUBJECTS.map((s) => [s.key, s.name])];

  return (
    <>
      <PageHero crumb="Faculty" title={<>Meet Our <span style={{ color: '#FF4A3A' }}>Faculty</span></>}
        intro="Experienced, full-time teachers of Physics, Chemistry, Mathematics and Biology who guide HAwk ACademe students from the first class to exam day." />

      <section style={{ background: '#ffffff' }}>
        <div className="pad" style={{ maxWidth: 1280, margin: '0 auto', padding: '56px 32px 72px', display: 'flex', flexDirection: 'column', gap: 28 }}>
          {FACULTY_UNDER_MAINTENANCE ? (
            <div style={{ textAlign: 'center', padding: '48px 24px', background: '#ffffff', border: '1px dashed #C9D0DE', borderRadius: 14, color: '#3E4860' }}><div style={{ fontSize: 18, fontWeight: 800, color: '#0B1D45' }}>Faculty section under maintenance</div><p style={{ margin: '8px 0 0', fontSize: 15 }}>We are updating our faculty profiles. Please check back soon.</p></div>
          ) : (<>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div id="f-subject" style={{ fontSize: 12, fontWeight: 800, letterSpacing: '.14em', color: '#5A6378' }}>SUBJECT</div>
            <div role="group" aria-labelledby="f-subject" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {tabs.map(([k, label]) => (
                <button key={k} type="button" className={subject === k ? 'pill on' : 'pill'} aria-pressed={subject === k} onClick={() => setSubject(k)}>{label}</button>
              ))}
            </div>
          </div>
          <div style={{ fontSize: 15, fontWeight: 700 }} aria-live="polite">Showing {shown.length} of {FACULTY_LIST.length} teachers</div>
          {shown.length === 0 ? <Empty>No faculty listed for this subject yet.</Empty> : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 270px), 1fr))', gap: 22 }}>
              {shown.map((f) => (
                <article key={f.id} id={f.id} className="card" style={{ scrollMarginTop: 120, background: '#ffffff', border: '1px solid #E7EAF0', borderRadius: 14, overflow: 'hidden', boxShadow: '0 8px 22px rgba(11,29,69,.06)', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ position: 'relative' }}>
                    <img src={f.photo} alt={f.placeholder ? '' : f.name} width="400" height="400" loading="lazy" style={{ display: 'block', width: '100%', height: 'auto', aspectRatio: '1 / 1', objectFit: 'cover', objectPosition: 'center top', background: '#E9EEF8' }} />
                    <div style={{ position: 'absolute', left: 0, bottom: 0, background: '#D90A0A', color: '#ffffff', fontSize: 11, fontWeight: 800, letterSpacing: '.14em', padding: '7px 14px', borderTopRightRadius: 10 }}>{subjectName(f.subject).toUpperCase()}</div>
                  </div>
                  <div style={{ padding: '18px 20px 22px', display: 'flex', flexDirection: 'column', gap: 6, flexGrow: 1 }}>
                    <h2 style={{ margin: 0, fontSize: 19, fontWeight: 800 }}>{f.name}</h2>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#0B1D45' }}>{f.role}</div>
                    <div style={{ fontSize: 13, color: '#5A6378' }}>{f.qualification} · {f.experience}</div>
                    <p style={{ margin: '6px 0 0', fontSize: 14, lineHeight: 1.6, color: '#3E4860', flexGrow: 1 }}>{f.bio}</p>
                    {f.programs?.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                        {f.programs.map((p) => <span key={p} style={{ fontSize: 12, fontWeight: 700, color: '#0B1D45', background: '#EEF1F6', borderRadius: 999, padding: '4px 10px' }}>{p}</span>)}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
          </>)}
        </div>
      </section>

      <section style={{ background: '#F6F8FC' }}>
        <div className="pad" style={{ maxWidth: 1280, margin: '0 auto', padding: '64px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>
          <Eyebrow>HOW OUR FACULTY TEACH</Eyebrow>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 18 }}>
            {WHY.map(([t, d]) => (
              <div key={t} style={{ background: '#ffffff', borderRadius: 12, padding: 22, boxShadow: '0 8px 24px rgba(11,29,69,.08)', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <Tick color="#D90A0A" />
                <div><h3 style={{ margin: 0, fontSize: 17, fontWeight: 800 }}>{t}</h3><p style={{ margin: '6px 0 0', fontSize: 14, lineHeight: 1.6, color: '#3E4860' }}>{d}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand title="Learn from the best" text="Book a demo class and meet our faculty in person at a centre near you."
        secondary={{ href: '/programs', label: 'Explore Programs' }} />
    </>
  );
}
