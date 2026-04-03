import React, { createContext, useContext, useState, useCallback } from 'react';
import { avatarConfigs as defaultConfigs } from '../mockData';

export interface AvatarConfig {
  id: string; managerId: string; departmentId?: string;
  photoUrl: string; animatedAvatarId: string;
  voiceType: 'clone' | 'prism'; clonedVoiceId: string;
  adaptiveRules: {
    highPerformer: string; steadyPerformer: string;
    underperformer: string; newEmployee: string;
  };
}

interface AvatarContextType {
  avatars: AvatarConfig[];
  getAvatar: (managerId: string) => AvatarConfig | undefined;
  updateAvatar: (id: string, updates: Partial<AvatarConfig>) => void;
}

const AvatarContext = createContext<AvatarContextType | null>(null);

export function AvatarProvider({ children }: { children: React.ReactNode }) {
  const [avatars, setAvatars] = useState<AvatarConfig[]>(defaultConfigs as AvatarConfig[]);

  const getAvatar = useCallback((managerId: string) => {
    return avatars.find(a => a.managerId === managerId);
  }, [avatars]);

  const updateAvatar = useCallback((id: string, updates: Partial<AvatarConfig>) => {
    setAvatars(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  }, []);

  return React.createElement(AvatarContext.Provider, { value: { avatars, getAvatar, updateAvatar } }, children);
}

export function useAvatars() {
  const ctx = useContext(AvatarContext);
  if (!ctx) throw new Error('useAvatars must be used within AvatarProvider');
  return ctx;
}
