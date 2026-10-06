import { useEffect, useState } from 'react';
import { cachedGet } from './api.js';

// Loads public data: { data, error, loading }.
export function useData(path) {
  const [state, setState] = useState({ data: null, error: null, loading: !!path });
  useEffect(() => {
    if (!path) return undefined;
    let live = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    cachedGet(path).then(
      (data) => live && setState({ data, error: null, loading: false }),
      (error) => live && setState({ data: null, error, loading: false })
    );
    return () => { live = false; };
  }, [path]);
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
