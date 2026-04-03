import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { conversations as defaultConvos, conversationExtracts as defaultExtracts } from '../mockData';

export interface ConversationMessage {
  id: string; role: 'employee' | 'ai_manager';
  content: string; timestamp: string;
  audioUrl?: string; transcriptionConfidence?: number;
  isPrivate: boolean;
}

export interface Conversation {
  id: string; employeeId: string; date: string;
  type: 'daily_standup' | 'task_update' | 'growth_discussion' | 'concern' | 'negotiation';
  messages: ConversationMessage[];
  aiSummary: string; sentiment: 'positive' | 'neutral' | 'concerned' | 'frustrated';
  topicsDiscussed: string[]; actionItems: { description: string; taskId?: string }[];
  blockers: string[]; wins: string[];
  hasPrivateContent: boolean; privateMessageIds: string[];
}

export interface ConversationExtract {
  employeeId: string; extractedAt: string;
  ongoingBlockers: string[]; commitmentsMade: string[];
  winsNoted: string[]; concernsRaised: string[];
  keyTopics: string[]; sentimentTrend: 'improving' | 'stable' | 'declining';
}

interface ConversationContextType {
  conversations: Conversation[];
  extracts: ConversationExtract[];
  addConversation: (c: Conversation) => void;
  getEmployeeConversations: (empId: string) => Conversation[];
  getEmployeeExtracts: (empId: string) => ConversationExtract[];
}

const CONV_KEY = 'prism_conversations';
const ConversationContext = createContext<ConversationContextType | null>(null);

export function ConversationProvider({ children }: { children: React.ReactNode }) {
  const [convos, setConvos] = useState<Conversation[]>(() => {
    try {
      const s = localStorage.getItem(CONV_KEY);
      return s ? JSON.parse(s) : defaultConvos;
    } catch { return defaultConvos as Conversation[]; }
  });

  const [extracts] = useState<ConversationExtract[]>(defaultExtracts as ConversationExtract[]);

  useEffect(() => {
    localStorage.setItem(CONV_KEY, JSON.stringify(convos));
  }, [convos]);

  const addConversation = useCallback((c: Conversation) => {
    setConvos(prev => [c, ...prev]);
  }, []);

  const getEmployeeConversations = useCallback((empId: string) => {
    return convos.filter(c => c.employeeId === empId).sort((a, b) => b.date.localeCompare(a.date));
  }, [convos]);

  const getEmployeeExtracts = useCallback((empId: string) => {
    return extracts.filter(e => e.employeeId === empId);
  }, [extracts]);

  return React.createElement(ConversationContext.Provider,
    { value: { conversations: convos, extracts, addConversation, getEmployeeConversations, getEmployeeExtracts } },
    children
  );
}

export function useConversations() {
  const ctx = useContext(ConversationContext);
  if (!ctx) throw new Error('useConversations must be used within ConversationProvider');
  return ctx;
}
