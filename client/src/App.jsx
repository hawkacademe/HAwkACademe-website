import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import { SiteProvider } from './lib/site.jsx';
import { Loading } from './components/Blocks.jsx';
import Home from './pages/Home.jsx';
import NotFound from './pages/NotFound.jsx';

// Home loads with the first visit; other pages load when they are opened.
const About = lazy(() => import('./pages/About.jsx'));
const Programs = lazy(() => import('./pages/Programs.jsx'));
const Results = lazy(() => import('./pages/Results.jsx'));
const Gallery = lazy(() => import('./pages/Gallery.jsx'));
const Blog = lazy(() => import('./pages/Blog.jsx'));
const BlogPost = lazy(() => import('./pages/BlogPost.jsx'));
const News = lazy(() => import('./pages/News.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));

// The admin panel (with the blog editor) is loaded only when someone opens /admin.
const AdminLogin = lazy(() => import('./admin/AdminLogin.jsx'));
const AdminApp = lazy(() => import('./admin/AdminApp.jsx'));

const wait = <div className="pad" style={{ maxWidth: 1280, margin: '0 auto', padding: '64px 32px' }}><Loading /></div>;

export default function App() {
  return (
    <SiteProvider>
      <Routes>
        <Route element={<Layout fallback={wait} />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="programs" element={<Programs />} />
          <Route path="results" element={<Results />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:slug" element={<BlogPost />} />
          <Route path="news" element={<News />} />
          <Route path="contact" element={<Contact />} />
          <Route path="admin/login" element={<Suspense fallback={wait}><AdminLogin /></Suspense>} />
          <Route path="admin/*" element={<Suspense fallback={wait}><AdminApp /></Suspense>} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </SiteProvider>
  );
}
