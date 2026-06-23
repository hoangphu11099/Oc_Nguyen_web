import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { authApi, tokenStore } from '../lib/api';
import type { User } from '../types';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      if (!tokenStore.get()) {
        setLoading(false);
        return;
      }
      try {
        const profile = await authApi.profile();
        setUser(profile);
      } catch {
        tokenStore.clear();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === 'ADMIN',
    login: async (email: string, password: string) => {
      const data = await authApi.login({ email, password });
      tokenStore.set(data.accessToken);
      setUser(data.user);
      return data.user;
    },
    register: async (name: string, email: string, password: string) => {
      const data = await authApi.register({ name, email, password });
      tokenStore.set(data.accessToken);
      setUser(data.user);
      return data.user;
    },
    logout: () => {
      tokenStore.clear();
      setUser(null);
    },
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
