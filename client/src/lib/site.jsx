import { createContext, useContext } from 'react';
import { useData } from './hooks.js';

// Contact details, office hours, highlights and programme details, edited in
// Admin > Timings & highlights. Shown everywhere (header, footer, Contact...).
const FALLBACK = {
  phone: '', whatsapp: '', email: '', address: '', mapsLink: '', mapEmbed: '', officeHours: [], responseTime: '',
  social: {}, highlights: [], programs: [], turnstileSiteKey: ''
};

const SiteContext = createContext(FALLBACK);

export function SiteProvider({ children }) {
  const { data } = useData('/site');
  return <SiteContext.Provider value={data || FALLBACK}>{children}</SiteContext.Provider>;
}

export const useSite = () => useContext(SiteContext);
