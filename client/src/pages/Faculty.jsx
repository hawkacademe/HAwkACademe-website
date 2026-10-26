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

const BADGE_COLORS = {
  chemistry: '#D90A0A',
  physics: '#0B1D45',
  maths: '#1B4290',
  biology: '#0D7A48',
  computer: '#23396C',
  mentorship: '#8F1414'
};

export default function Faculty() {
  usePathMeta('/faculty');
  const [subject, setSubject] = useState('all');
  const shown = subject === 'all' ? FACULTY_LIST : FACULTY_LIST.filter((f) => f.subject === subject);
  const tabs = [['all', `All (${FACULTY_LIST.length})`], ...SUBJECTS.map((s) => [s.key, `${s.name} (${FACULTY_LIST.filter((f) => f.subject === s.key).length})`])];

  return (
    <>
      <PageHero crumb="Faculty" title={<>Meet Our <span style={{ color: '#FF4A3A' }}>Faculty &amp; Mentors</span></>}
        intro="Experienced, full-time subject experts and dedicated academic mentors of HAwk ACademe who guide students from the first class to exam day." />

      <section style={{ background: '#ffffff' }}>
        <div className="pad" style={{ maxWidth: 1280, margin: '0 auto', padding: '56px 32px 72px', display: 'flex', flexDirection: 'column', gap: 28 }}>
          {FACULTY_UNDER_MAINTENANCE ? (
            <div style={{ textAlign: 'center', padding: '48px 24px', background: '#ffffff', border: '1px dashed #C9D0DE', borderRadius: 14, color: '#3E4860' }}><div style={{ fontSize: 18, fontWeight: 800, color: '#0B1D45' }}>Faculty section under maintenance</div><p style={{ margin: '8px 0 0', fontSize: 15 }}>We are updating our faculty profiles. Please check back soon.</p></div>
          ) : (<>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div id="f-subject" style={{ fontSize: 12, fontWeight: 800, letterSpacing: '.14em', color: '#5A6378' }}>FILTER BY SUBJECT &amp; SPECIALIZATION</div>
            <div role="group" aria-labelledby="f-subject" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {tabs.map(([k, label]) => (
                <button key={k} type="button" className={subject === k ? 'pill on' : 'pill'} aria-pressed={subject === k} onClick={() => setSubject(k)}>{label}</button>
              ))}
            </div>
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#0B1D45' }} aria-live="polite">Showing {shown.length} of {FACULTY_LIST.length} educators</div>
          {shown.length === 0 ? <Empty>No faculty listed for this subject yet.</Empty> : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: 24 }}>
              {shown.map((f) => {
                const badgeBg = BADGE_COLORS[f.subject] || '#D90A0A';
                return (
                  <article key={f.id} id={f.id} className="card" style={{ scrollMarginTop: 120, background: '#ffffff', border: '1px solid #E7EAF0', borderRadius: 14, overflow: 'hidden', boxShadow: '0 8px 22px rgba(11,29,69,.06)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ position: 'relative' }}>
                      <img src={f.photo} alt={f.placeholder ? '' : f.name} width="600" height="600" loading="lazy" style={{ display: 'block', width: '100%', height: 'auto', aspectRatio: '1 / 1', objectFit: 'cover', objectPosition: 'center top', background: '#E9EEF8' }} />
                      <div style={{ position: 'absolute', left: 0, bottom: 0, background: badgeBg, color: '#ffffff', fontSize: 11, fontWeight: 800, letterSpacing: '.14em', padding: '7px 14px', borderTopRightRadius: 10 }}>{subjectName(f.subject).toUpperCase()}</div>
                      {f.isFounder && (
                        <div style={{ position: 'absolute', top: 12, right: 12, background: 'linear-gradient(135deg, #D90A0A 0%, #A00707 100%)', color: '#ffffff', fontSize: 11, fontWeight: 800, letterSpacing: '.14em', padding: '5px 12px', borderRadius: 20, boxShadow: '0 4px 14px rgba(217,10,10,.4)' }}>FOUNDER</div>
                      )}
                    </div>
                    <div style={{ padding: '18px 20px 22px', display: 'flex', flexDirection: 'column', gap: 6, flexGrow: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
                        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#0B1D45' }}>{f.name}</h2>
                        {f.isFounder && (
                          <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.12em', color: '#D90A0A', background: '#FFEBEA', border: '1px solid #FFCDCB', padding: '2px 8px', borderRadius: 999 }}>FOUNDER</span>
                        )}
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#D90A0A' }}>{f.role}</div>
                      <div style={{ fontSize: 13, color: '#5A6378' }}>{f.qualification} · {f.experience}</div>
                      {f.quote && (
                        <blockquote style={{
                          margin: '8px 0 4px',
                          padding: '10px 14px',
                          background: 'linear-gradient(135deg, #F8FAFD 0%, #EEF2F8 100%)',
                          borderLeft: '3px solid #D90A0A',
                          borderRadius: '0 8px 8px 0',
                          fontStyle: 'italic',
                          fontSize: 13.5,
                          lineHeight: 1.5,
                          color: '#0B1D45',
                          fontWeight: 600
                        }}>
                          “{f.quote}”
                        </blockquote>
                      )}
                      <p style={{ margin: '6px 0 0', fontSize: 14, lineHeight: 1.6, color: '#3E4860', flexGrow: 1 }}>{f.bio}</p>
                      {f.programs?.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                          {f.programs.map((p) => <span key={p} style={{ fontSize: 12, fontWeight: 700, color: '#0B1D45', background: '#EEF1F6', borderRadius: 999, padding: '4px 10px' }}>{p}</span>)}
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
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
