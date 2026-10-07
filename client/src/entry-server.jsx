// Server-side rendering: turns a URL plus preloaded data into the page's HTML, so
// crawlers and link previews get full content without running JavaScript.
import { prerenderToNodeStream } from 'react-dom/static';
import { StaticRouter } from 'react-router';
import App from './App.jsx';
import { PreloadContext } from './lib/hooks.js';

// values: { [apiPath]: { data } | { error } }. Returns { html, missing }, where missing
// lists API paths the page asked for that were not preloaded.
export async function render(url, values) {
  const pre = { values: { ...values }, missing: new Set() };
  const { prelude } = await prerenderToNodeStream(
    <PreloadContext.Provider value={pre}>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </PreloadContext.Provider>,
    // Write every section in place, in one piece: no hidden chunks moved by inline
    // scripts (the site's CSP forbids inline scripts, and crawlers would see hidden text).
    { progressiveChunkSize: Number.MAX_SAFE_INTEGER }
  );
  let html = '';
  for await (const chunk of prelude) html += chunk;
  return { html, missing: [...pre.missing] };
}
