import { createContext, useContext, useEffect, useState } from 'react';
import { cachedGet, seedCache, ApiError } from './api.js';
import { PAGES } from './seoPages.js';

// Data the server already loaded for the first page view: { [apiPath]: { data } | { error } }.
// On the server it also records any path a page asked for but did not get (missing).
export const PreloadContext = createContext(null);

function fromPreload(pre, path) {
  const hit = path && pre?.values?.[path];
  if (!hit) {
    if (path && pre?.missing) pre.missing.add(path);
    return null;
  }
  return hit.error
    ? { data: null, error: new ApiError(hit.error.message, hit.error.status), loading: false }
    : { data: hit.data, error: null, loading: false };
}

// Loads public data: { data, error, loading }.
export function useData(path) {
  const pre = useContext(PreloadContext);
  const [state, setState] = useState(() => fromPreload(pre, path) || { data: null, error: null, loading: !!path });
  useEffect(() => {
    if (!path) return undefined;
    const hit = pre?.values?.[path];
    if (hit) {
      // Use the server's copy once (it is also cached for quick back-navigation).
      if (hit.data) seedCache(path, hit.data);
      delete pre.values[path];
      const s = fromPreload({ values: { [path]: hit } }, path);
      setState((cur) => (cur.data === s.data && cur.error?.status === s.error?.status ? cur : s));
      return undefined;
    }
    let live = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    cachedGet(path).then(
      (data) => live && setState({ data, error: null, loading: false }),
      (error) => live && setState({ data: null, error, loading: false })
    );
    return () => { live = false; };
  }, [path, pre]);
  return state;
}

// Sets the page title and description when moving between pages in the browser.
// The server already puts the right tags in the HTML for the first load.
export function usePageMeta(title, description) {
  useEffect(() => {
    if (!title) return;
    document.title = title;
    const set = (sel, val) => { const el = document.head.querySelector(sel); if (el && val) el.setAttribute('content', val); };
    set('meta[name="description"]', description);
    set('meta[property="og:title"]', title);
    set('meta[property="og:description"]', description);
  }, [title, description]);
}

// Title and description for a fixed page, from the central list in seoPages.js.
export function usePathMeta(path) {
  usePageMeta(PAGES[path]?.title, PAGES[path]?.description);
}

// Cycles through a list on a timer (hero words). Stops for reduced-motion users.
export function useRotate(length, ms) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;
    const t = setInterval(() => setI((x) => (x + 1) % length), ms);
    return () => clearInterval(t);
  }, [length, ms]);
  return i;
}
