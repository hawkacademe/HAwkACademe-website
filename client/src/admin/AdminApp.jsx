import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import PageHero from '../components/PageHero.jsx';
import { AuthProvider, useAuth } from './auth.jsx';
import { useAdmin, Spinner } from './ui.jsx';
import { usePageMeta } from '../lib/hooks.js';
import Overview from './sections/Overview.jsx';
import BlogList from './sections/BlogList.jsx';
import GalleryAdmin from './sections/Gallery.jsx';
import Notices from './sections/Notices.jsx';
import Settings from './sections/Settings.jsx';
import Reviews from './sections/Reviews.jsx';
import Enquiries from './sections/Enquiries.jsx';
import Account from './sections/Account.jsx';
import './admin.css';

// The editor bundle (TipTap) only loads when a post is opened.
const PostEditor = lazy(() => import('./sections/PostEditor.jsx'));

const NAV = [
  ['', 'Overview'], ['blog', 'Blog'], ['gallery', 'Gallery'], ['news', 'Notices / News'],
  ['highlights', 'Timings & highlights'], ['reviews', 'Reviews'], ['enquiries', 'Enquiries'], ['account', 'Account']
];

function Shell() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const sec = pathname.replace(/^\/admin\/?/, '').split('/')[0];
  // Badge counts in the sidebar (refreshed when the page changes).
  const counts = useAdmin(user ? `/admin/overview?nav=${sec}` : null);
  const s = counts.data?.stats;
  const count = { blog: s ? s.published + s.drafts : '', gallery: s?.photos, news: s?.notices, reviews: s?.reviews, enquiries: s?.newEnq };

  if (user === undefined) return <Spinner label="Checking your session…" />;
  if (!user) {
    return (
      <div style={{ maxWidth: 760, width: '100%', margin: '0 auto' }}>
        <div className="a-card">
          <h2 style={{ fontSize: 24 }}>Admin login required</h2>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: '#3E4860' }}>Please log in to see the dashboard. For your security you are signed out after 2 hours without activity.</p>
          <div><a className="a-btn" href="/admin/login">Go to Admin Login</a></div>
        </div>
      </div>
    );
  }
  // A temporary password must be changed before anything else.
  if (user.mustChangePassword && sec !== 'account') return <Navigate to="/admin/account" replace />;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'flex-start' }}>
      <aside className="a-side" aria-label="Admin sections">
        <nav className="a-navs" style={{ background: '#ffffff', border: '1px solid #E7EAF0', borderRadius: 14, padding: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {NAV.map(([k, label]) => {
            const on = sec === k;
            const c = count[k];
            return (
              <a key={k} href={`/admin${k ? `/${k}` : ''}`} className={`a-nav${on ? ' on' : ''}`} aria-current={on ? 'page' : undefined}>
                <span>{label}</span>
                {c !== undefined && c !== '' && <span className={`cnt${k === 'enquiries' && c > 0 ? ' hot' : ''}`}>{c}</span>}
              </a>
            );
          })}
        </nav>
        <div style={{ fontSize: 13, color: '#5A6378', padding: '0 4px' }}>Signed in as <strong style={{ color: '#0A1530' }}>{user.name}</strong></div>
        <button type="button" className="a-ghost" onClick={logout} style={{ width: '100%' }}>Log out of Admin</button>
      </aside>
      <div style={{ flex: '1 1 520px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <Suspense fallback={<Spinner />}>
          <Routes>
            <Route index element={<Overview />} />
            <Route path="blog" element={<BlogList />} />
            <Route path="blog/:id" element={<PostEditor />} />
            <Route path="gallery" element={<GalleryAdmin />} />
            <Route path="news" element={<Notices />} />
            <Route path="highlights" element={<Settings />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="enquiries" element={<Enquiries />} />
            <Route path="account" element={<Account />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
}

export default function AdminApp() {
  usePageMeta('Admin | Hawk Academe', 'Hawk Academe site administration.');
  return (
    <AuthProvider>
      <PageHero compact crumbs={[{ href: '/', label: 'Home' }, { label: 'Admin' }]} title="Admin Dashboard" />
      <section style={{ background: '#F6F8FC' }}>
        <div className="pad" style={{ maxWidth: 1360, margin: '0 auto', padding: '48px 32px 88px', display: 'flex', flexDirection: 'column', gap: 24 }}>
          <Shell />
        </div>
      </section>
    </AuthProvider>
  );
}
