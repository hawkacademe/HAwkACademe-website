import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api.js';

const AuthContext = createContext(null);

// Who is signed in to the admin panel. Checked with the server on load.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined); // undefined = checking, null = signed out
  const refresh = useCallback(async () => {
    try { setUser((await api('/auth/me')).user); } catch { setUser(null); }
  }, []);
  useEffect(() => { refresh(); }, [refresh]);
  useEffect(() => {
    const out = () => setUser(null);
    window.addEventListener('ha:signed-out', out);
    return () => window.removeEventListener('ha:signed-out', out);
  }, []);
  const logout = useCallback(async () => {
    try { await api('/auth/logout', { method: 'POST' }); } catch { /* signed out anyway */ }
    setUser(null);
  }, []);
  return <AuthContext.Provider value={{ user, setUser, refresh, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
