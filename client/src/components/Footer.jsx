import { useSite } from '../lib/site.jsx';
import { telHref } from '../lib/format.js';
import { Pin, Phone, Mail, Clock, Social } from './Icons.jsx';

const col = { display: 'flex', flexDirection: 'column', gap: 9, fontSize: 13 };
const head = { fontWeight: 800, fontSize: 14, marginBottom: 4 };
const link = { color: '#3E4860' };
const row = { display: 'flex', gap: 8 };
const icon = { width: 16, height: 16, color: '#D90A0A', marginTop: 1 };

export default function Footer() {
  const site = useSite();
  const socials = ['youtube', 'instagram', 'linkedin', 'facebook'].filter((k) => site.social?.[k]);
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: '#ffffff', borderTop: '4px solid #D90A0A' }}>
      <div className="pad" style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 32px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 28 }}>
        <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 }}>
          <img src="/img/logo.webp" alt="HAwk ACademe" width="233" height="34" loading="lazy" style={{ height: 34, width: 'auto', alignSelf: 'flex-start' }} />
          <div style={{ fontSize: 13, color: '#5A6378' }}>Discipline | Mentorship | Results</div>
          {socials.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 6 }}>
              <div style={{ fontWeight: 800, fontSize: 14 }}>Follow Us</div>
              <div style={{ display: 'flex', gap: 2, flexWrap: 'wrap', marginLeft: -10 }}>
                {socials.map((k) => {
                  const Icon = Social[k];
                  return (
                    <a key={k} href={site.social[k]} target="_blank" rel="noopener noreferrer" aria-label={k[0].toUpperCase() + k.slice(1)} style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0A1530' }}>
                      <Icon size={20} />
                    </a>
                  );
                })}
              </div>
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, color: '#3E4860', marginTop: 8 }}>
            <div style={{ fontWeight: 800, fontSize: 14, color: '#0A1530', marginBottom: 4 }}>Contact Us</div>
            {site.address && <div style={row}><Pin style={icon} />{site.address}</div>}
            {site.phone && <div style={row}><Phone style={icon} /><a href={telHref(site.phone)} style={link}>{site.phone}</a></div>}
            {site.email && <div style={row}><Mail style={icon} /><a href={`mailto:${site.email}`} style={link}>{site.email}</a></div>}
          </div>
        </div>
        <div style={col}>
          <div style={head}>Quick Links</div>
          <a href="/" style={link}>Home</a>
          <a href="/about" style={link}>About</a>
          <a href="/programs" style={link}>Programs</a>
          <a href="/results" style={link}>Results</a>
        </div>
        <div style={col}>
          <div style={head}>Student Life</div>
          <a href="/gallery" style={link}>Gallery</a>
          <a href="/blog" style={link}>Blog</a>
          <a href="/news" style={link}>News</a>
        </div>
        <div style={col}>
          <div style={head}>Programs</div>
          <a href="/programs#jee" style={link}>JEE</a>
          <a href="/programs#neet" style={link}>NEET</a>
          <a href="/programs#foundation" style={link}>Foundation</a>
          <a href="/programs#integrated" style={link}>Integrated</a>
        </div>
        <div style={col}>
          <div style={head}>Support</div>
          <a href="/contact" style={link}>Contact</a>
          {site.officeHours?.length > 0 && (
            <div style={{ ...row, color: '#3E4860' }}>
              <Clock style={icon} />
              <div>{site.officeHours.map((h, i) => <div key={i}>{h.days}: {h.hours}</div>)}</div>
            </div>
          )}
        </div>
      </div>
      <div className="pad" style={{ maxWidth: 1280, margin: '0 auto', padding: '14px 32px 18px', borderTop: '1px solid #E7EAF0', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12, fontSize: 12, color: '#5A6378' }}>
        <div>© {year} HAwk ACademe. All rights reserved.</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 24px' }}>
          <a href="/admin/login" style={{ color: '#5A6378' }}>Admin</a>
        </div>
      </div>
    </footer>
  );
}
