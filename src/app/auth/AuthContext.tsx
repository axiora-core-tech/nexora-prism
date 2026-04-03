import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { userAccounts } from '../mockData';

type RoleLevel = 'ceo' | 'department_head' | 'manager' | 'employee';

interface AuthUser {
  email: string;
  name?: string;
  role_level: RoleLevel;
  available_roles: readonly RoleLevel[];
  employeeId?: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, name?: string) => void;
  logout: () => void;
  switchRole: (role: RoleLevel) => void;
}

const AUTH_KEY = 'prism_auth_user';

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem(AUTH_KEY);
      if (!stored) return null;
      const parsed = JSON.parse(stored) as AuthUser;
      // Legacy sessions: backfill missing fields
      if (!parsed.role_level) parsed.role_level = 'ceo';
      if (!parsed.available_roles) parsed.available_roles = [parsed.role_level];
      return parsed;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_KEY);
    }
  }, [user]);

  // Login: look up email in userAccounts to auto-determine role(s)
  const login = useCallback((email: string, name?: string) => {
    const account = userAccounts.find(a => a.email.toLowerCase() === email.trim().toLowerCase());
    if (account) {
      setUser({
        email: account.email,
        name: account.name,
        role_level: account.defaultRole,
        available_roles: account.availableRoles,
        employeeId: account.employeeId,
      });
    } else {
      // Unknown email: default to CEO for demo (allows any email to log in)
      setUser({
        email: email.trim(),
        name: name || email.split('@')[0],
        role_level: 'ceo',
        available_roles: ['ceo'],
        employeeId: null,
      });
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  // Switch active role (only if the role is in available_roles)
  const switchRole = useCallback((role: RoleLevel) => {
    setUser(prev => {
      if (!prev) return null;
      if (!prev.available_roles.includes(role)) return prev;
      return { ...prev, role_level: role };
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
