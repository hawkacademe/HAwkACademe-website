import { useParams } from 'react-router-dom';
import PageHero, { Eyebrow } from '../components/PageHero.jsx';
import { CtaBand } from '../components/Blocks.jsx';
import { Tick, Phone, Pin, Arrow, WhatsApp } from '../components/Icons.jsx';
import NotFound from './NotFound.jsx';
import { LANDINGS, ADMISSION } from '../content/landing.js';
import { PROGRAMS, withDetails } from '../content/programs.jsx';
import { CENTRES } from '../content/centres.js';
import { LANDING_SLUGS, landingPath } from '../lib/seoPages.js';
import { useSite } from '../lib/site.jsx';
import { usePathMeta } from '../lib/hooks.js';
import { telHref, hasPlaceholder } from '../lib/format.js';

const wrap = { maxWidth: 1280, margin: '0 auto', padding: '64px 32px', display: 'flex', flexDirection: 'column', gap: 28 };
const h2 = { margin: 0, fontSize: 34, lineHeight: 1.15, fontWeight: 800, letterSpacing: '-.01em' };
const card = { background: '#ffffff', border: '1px solid #E7EAF0', borderRadius: 12, padding: '22px 22px', display: 'flex', flexDirection: 'column', gap: 8 };
const p = { margin: 0, fontSize: 16, lineHeight: 1.7, color: '#3E4860' };
const btn = { minHeight: 48, display: 'inline-flex', alignItems: 'center', gap: 10, padding: '0 22px', borderRadius: 4, fontWeight: 700, fontSize: 15 };

const keyForSlug = (slug) => Object.keys(LANDING_SLUGS).find((k) => LANDING_SLUGS[k] === slug);
const shown = (v) => (v && !hasPlaceholder(v) ? v : '');

export default function ProgramLanding() {
  const { slug } = useParams();
  const key = keyForSlug(slug);
  usePathMeta(key ? landingPath(key) : null);
  const site = useSite();
  if (!key) return <NotFound />;

  const page = LANDINGS[key];
  const program = withDetails(PROGRAMS.find((x) => x.key === key), site.programs);
  const wa = site.whatsapp ? `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(`Hello HAwk ACademe, I would like to know about the ${program.name} program.`)}` : '';
  const details = [
    ['Who can join', shown(program.classes)], ['Subjects', program.subjects], ['Duration', shown(program.duration)],
    ['Batch size', shown(program.batchSize)], ['Mode', shown(program.mode)], ['Batch timings', shown(program.timings)]
  ];
  const others = Object.keys(LANDING_SLUGS).filter((k) => k !== key);

  return (
    <>
      <PageHero crumbs={[{ href: '/', label: 'Home' }, { href: '/programs', label: 'Programs' }, { label: page.crumb }]} title={page.h1} intro={page.intro}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 6 }}>
          {site.phone && <a className="btn-red" href={telHref(site.phone)} data-track="call" style={{ ...btn, background: '#D90A0A', color: '#ffffff' }}><Phone size={18} />Call {site.phone}</a>}
          {wa && <a href={wa} target="_blank" rel="noopener noreferrer" data-track="whatsapp" style={{ ...btn, background: '#25D366', color: '#ffffff' }}><span style={{ width: 20, height: 20, display: 'flex' }}><WhatsApp /></span>WhatsApp us</a>}
          <a href={`/contact?program=${key}#enquiry`} data-track="enquire" style={{ ...btn, border: '1.5px solid #ffffff', color: '#ffffff' }}>Send an enquiry <Arrow size={16} /></a>
        </div>
      </PageHero>

      <section style={{ background: '#ffffff' }}>
        <div className="pad" style={wrap}>
          <Eyebrow>WHAT WE COVER</Eyebrow>
          <h2 className="h2" style={h2}>Subjects and syllabus</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 18 }}>
            {page.cover.map(([title, text]) => (
              <div key={title} style={card}>
                <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>{title}</h3>
                <p style={{ ...p, fontSize: 15 }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: '#F6F8FC' }}>
        <div className="pad" style={{ ...wrap, flexDirection: 'row', flexWrap: 'wrap', gap: 40 }}>
          <div style={{ flex: '1 1 420px', display: 'flex', flexDirection: 'column', gap: 18, minWidth: 0 }}>
            <Eyebrow>HOW WE TEACH</Eyebrow>
            <h2 className="h2" style={h2}>How the {program.name} program works</h2>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {program.bullets.map((b) => <li key={b} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 16, lineHeight: 1.55 }}><span style={{ marginTop: 3 }}><Tick /></span>{b}</li>)}
            </ul>
          </div>
          <div style={{ flex: '1 1 360px', minWidth: 0 }}>
            <h3 style={{ margin: '0 0 12px', fontSize: 20, fontWeight: 800 }}>Batch details</h3>
            <table className="tbl" style={{ minWidth: 0 }}>
              <tbody>
                {details.map(([label, value]) => (
                  <tr key={label}><th scope="row" style={{ width: '40%' }}>{label}</th><td>{value || 'Ask us for the current details'}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section style={{ background: '#ffffff' }}>
        <div className="pad" style={{ ...wrap, maxWidth: 960 }}>
          <Eyebrow>KNOW THE EXAM</Eyebrow>
          <h2 className="h2" style={h2}>{page.exam.heading}</h2>
          <ul style={{ margin: 0, paddingLeft: 22, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {page.exam.points.map((t) => <li key={t} style={{ ...p }}>{t}</li>)}
          </ul>
        </div>
      </section>

      <section style={{ background: '#F6F8FC' }}>
        <div className="pad" style={wrap}>
          <Eyebrow>ADMISSION</Eyebrow>
          <h2 className="h2" style={h2}>How to join</h2>
          <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 230px), 1fr))', gap: 16 }}>
            {ADMISSION.map(([title, text], i) => (
              <li key={title} style={card}>
                <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '.14em', color: '#D90A0A' }}>STEP {i + 1}</div>
                <h3 style={{ margin: 0, fontSize: 19, fontWeight: 800 }}>{title}</h3>
                <p style={{ ...p, fontSize: 15 }}>{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section style={{ background: '#ffffff' }}>
        <div className="pad" style={wrap}>
          <Eyebrow>CENTRES</Eyebrow>
          <h2 className="h2" style={h2}>Where classes are held</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 16 }}>
            {CENTRES.map((c) => (
              <div key={c.key} style={card}>
                <h3 style={{ margin: 0, fontSize: 19, fontWeight: 800 }}>{c.city}</h3>
                <p style={{ ...p, fontSize: 15 }}>{c.address}</p>
                {c.mapsLink && <a href={c.mapsLink} target="_blank" rel="noopener noreferrer" data-track="directions" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: 15 }}><Pin size={16} />Get directions</a>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: '#F6F8FC' }}>
        <div className="pad" style={{ ...wrap, maxWidth: 960 }}>
          <Eyebrow>FAQ</Eyebrow>
          <h2 className="h2" style={h2}>Frequently asked questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {page.faqs.map(([q, a]) => (
              <div key={q} style={card}>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>{q}</h3>
                <p style={{ ...p, fontSize: 15 }}>{a}</p>
              </div>
            ))}
          </div>
          <p style={{ ...p, fontSize: 15 }}>
            Also see: {others.map((k, i) => (
              <span key={k}>{i > 0 && ' · '}<a href={landingPath(k)}>{LANDINGS[k].h1}</a></span>
            ))} · <a href="/programs">all programs</a> · <a href="/blog">exam tips on our blog</a>
          </p>
        </div>
      </section>

      <CtaBand title={`Start your ${program.name} preparation`} text="Talk to our counsellors about the right batch and centre for you." secondary={{ href: '/programs', label: 'Compare Programs' }} />
    </>
  );
}
