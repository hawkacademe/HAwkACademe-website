import PageHero, { Eyebrow } from '../components/PageHero.jsx';
import { CtaBand, RedButton } from '../components/Blocks.jsx';
import { Tick, Phone } from '../components/Icons.jsx';
import { PROGRAMS, withDetails } from '../content/programs.jsx';
import { useSite } from '../lib/site.jsx';
import { usePathMeta } from '../lib/hooks.js';
import { telHref, hasPlaceholder } from '../lib/format.js';
import { LANDING_SLUGS, landingPath } from '../lib/seoPages.js';
import { LANDINGS } from '../content/landing.js';

const fact = { background: '#F6F8FC', borderRadius: 10, padding: '14px 16px' };
const factLabel = { fontSize: 11, fontWeight: 800, letterSpacing: '.14em', color: '#5A6378' };
const factValue = { fontSize: 15, fontWeight: 700, marginTop: 4, lineHeight: 1.4 };

const orAsk = (v) => (v && !hasPlaceholder(v) ? v : 'Ask us');

function Fact({ label, value, wide }) {
  if (!value || hasPlaceholder(value)) return null;
  return (
    <div style={{ ...fact, gridColumn: wide ? '1 / -1' : undefined }}>
      <div style={factLabel}>{label}</div>
      <div style={{ ...factValue, whiteSpace: 'pre-line' }}>{value}</div>
    </div>
  );
}

export default function Programs() {
  usePathMeta('/programs');
  const site = useSite();
  const programs = PROGRAMS.map((p) => withDetails(p, site.programs));

  return (
    <>
      <PageHero crumb="Programs" title={<>Programs for <span style={{ color: '#FF4A3A' }}>Every Aspirant</span></>}
        intro="Four clear paths, one standard of teaching. Pick the program that matches your class and your target exam." />

      <div style={{ background: '#ffffff', borderBottom: '1px solid #E7EAF0' }}>
        <nav aria-label="Programs on this page" className="pad" style={{ maxWidth: 1280, margin: '0 auto', padding: '16px 32px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {programs.map((p) => <a key={p.key} href={`#${p.key}`} className="pill">{p.name}</a>)}
        </nav>
      </div>

      {programs.map((p, i) => (
        <section key={p.key} id={p.key} style={{ background: i % 2 ? '#F6F8FC' : '#ffffff', scrollMarginTop: 120 }}>
          <div className="pad" style={{ maxWidth: 1280, margin: '0 auto', padding: '72px 32px', display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))', gap: 48, alignItems: 'center' }}>
              <div>
                <img src={p.img} alt={p.alt} width="1280" height="600" loading={i ? 'lazy' : undefined} style={{ display: 'block', width: '100%', height: 'auto', borderRadius: 16, boxShadow: '0 18px 40px rgba(11,29,69,.18)' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <Eyebrow>PROGRAM {String(i + 1).padStart(2, '0')}</Eyebrow>
                <h2 className="h2" style={{ margin: 0, fontSize: 34, lineHeight: 1.1, fontWeight: 800, letterSpacing: '-.015em' }}>{p.name}</h2>
                <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: '#3E4860' }}>{p.summary}</p>
                {LANDING_SLUGS[p.key] && <a href={landingPath(p.key)} style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: 15 }}>{LANDINGS[p.key].h1}: syllabus, batches and FAQs<span aria-hidden="true">→</span></a>}
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {p.bullets.map((b) => (
                    <li key={b} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 15, lineHeight: 1.5, color: '#3E4860' }}>
                      <span style={{ marginTop: 3, display: 'flex' }}><Tick /></span><span>{b}</span>
                    </li>
                  ))}
                </ul>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
                  <Fact label="CLASSES" value={p.classes} />
                  <Fact label="DURATION" value={p.duration} />
                  <Fact label="BATCH SIZE" value={p.batchSize} />
                  <Fact label="MODE" value={p.mode} />
                  <Fact label="BATCH TIMINGS" value={p.timings} wide />
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                  <RedButton href={`/contact?program=${p.key}`} style={{ height: 48, fontSize: 15, gap: 8 }}>Enquire Now</RedButton>
                  {site.phone && (
                    <a className="btn-ghost" href={telHref(site.phone)} style={{ height: 48, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0 24px', border: '1.5px solid #D90A0A', color: '#D90A0A', fontWeight: 700, fontSize: 15, borderRadius: 4, background: '#ffffff' }}>
                      <Phone size={16} />Call a Counsellor
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      <section style={{ background: '#ffffff' }}>
        <div className="pad" style={{ maxWidth: 1280, margin: '0 auto', padding: '72px 32px', display: 'flex', flexDirection: 'column', gap: 32 }}>
          <Eyebrow center>COMPARE</Eyebrow>
          <h2 className="h2" style={{ margin: 0, fontSize: 38, lineHeight: 1.1, fontWeight: 800, letterSpacing: '-.015em', textAlign: 'center' }}>Which program is <span style={{ color: '#D90A0A' }}>right for you?</span></h2>
          <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid #E7EAF0' }} tabIndex={0} role="region" aria-label="Program comparison">
            <table className="tbl">
              <thead><tr><th scope="col">Program</th><th scope="col">Classes</th><th scope="col">Goal</th><th scope="col">Subjects</th><th scope="col">Mode</th></tr></thead>
              <tbody>
                {programs.map((p) => (
                  <tr key={p.key}>
                    <td style={{ fontWeight: 800, color: '#0A1530' }}><a href={`#${p.key}`} style={{ color: '#0A1530' }}>{p.name}</a></td>
                    <td>{orAsk(p.classes)}</td><td>{p.goal}</td><td>{p.subjects}</td><td>{orAsk(p.mode)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <CtaBand title="Not sure which program fits?" text="Talk to a counsellor and we will recommend a path based on your class and goals."
        secondary={site.phone ? { href: telHref(site.phone), label: 'Call Us' } : undefined} />
    </>
  );
}
