import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { PreloadContext } from './lib/hooks.js';
import './site.css';

// Pages rendered on the server ship their data as JSON next to the HTML. The browser
// "hydrates" that HTML instead of rebuilding it. Admin pages are rendered in the browser only.
const root = document.getElementById('root');
const dataEl = document.getElementById('ha-data');
const pre = dataEl ? { values: JSON.parse(dataEl.textContent) } : null;

const app = (
  <StrictMode>
    <PreloadContext.Provider value={pre}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PreloadContext.Provider>
  </StrictMode>
);

if (pre && root.firstElementChild) hydrateRoot(root, app);
else createRoot(root).render(app);
