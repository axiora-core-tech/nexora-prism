import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { companyConfig as defaultConfig } from '../mockData';

export interface CompanyConfig {
  id: string;
  name: string;
  privacyLevel: 'full_transparency' | 'summary_only' | 'layered';
  conversationMemoryDays: 7 | 30 | 90 | -1;
  annualRevenueTarget: number;
  departmentBudgets: { departmentId: string; budget: number }[];
  financialDataSource: 'manual' | 'quickbooks' | 'xero';
  standupReminderTime: string;
  standupTimezone: string;
  missedStandupEscalationHours: number;
  // Sanctum persona settings
  personaName: string;
  personaTone: 'warm' | 'direct' | 'coaching' | 'balanced';
  personaVoice: 'professional' | 'casual' | 'formal' | 'mentor';
  personaLength: 'concise' | 'detailed' | 'adaptive';
  personaTraits: string[];
  personaGreeting: string;
}

interface CompanyConfigContextType {
  config: CompanyConfig;
  updateConfig: (partial: Partial<CompanyConfig>) => void;
}

const STORAGE_KEY = 'prism_company_config';
const CompanyConfigContext = createContext<CompanyConfigContextType | null>(null);

export function CompanyConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<CompanyConfig>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : defaultConfig;
    } catch { return defaultConfig as CompanyConfig; }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }, [config]);

  const updateConfig = useCallback((partial: Partial<CompanyConfig>) => {
    setConfig(prev => ({ ...prev, ...partial }));
  }, []);

  return React.createElement(CompanyConfigContext.Provider, { value: { config, updateConfig } }, children);
}

export function useCompanyConfig() {
  const ctx = useContext(CompanyConfigContext);
  if (!ctx) throw new Error('useCompanyConfig must be used within CompanyConfigProvider');
  return ctx;
}
