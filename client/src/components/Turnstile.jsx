import { useEffect, useRef } from 'react';

// Cloudflare Turnstile "I am human" check. Only shown when a site key is configured.
let loader;
function loadScript() {
  loader ??= new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    s.async = true;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
  return loader;
}

export default function Turnstile({ siteKey, onToken, resetKey }) {
  const ref = useRef(null);
  const id = useRef(null);
  useEffect(() => {
    if (!siteKey) return undefined;
    let live = true;
    loadScript().then(() => {
      if (!live || !ref.current || !window.turnstile) return;
      id.current = window.turnstile.render(ref.current, {
        sitekey: siteKey, callback: onToken, 'expired-callback': () => onToken(''), 'error-callback': () => onToken('')
      });
    }).catch(() => {});
    return () => { live = false; if (id.current && window.turnstile) window.turnstile.remove(id.current); id.current = null; };
  }, [siteKey, resetKey]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!siteKey) return null;
  return <div ref={ref} style={{ gridColumn: '1 / -1', minHeight: 65 }} />;
}
