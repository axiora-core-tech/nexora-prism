import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { roadmap as defaultRoadmap, visionDocument as defaultVision } from '../mockData';

export interface RoadmapOKR {
  id: string; title: string; target: number; current: number; unit: string;
}

export interface Milestone {
  id: string; title: string; description: string; departmentId: string;
  startDate?: string; targetDate: string;
  status: 'not_started' | 'in_progress' | 'at_risk' | 'completed';
  progress: number; okrs: RoadmapOKR[]; dependencies: string[];
}

export interface RoadmapRisk {
  id: string; title: string; severity: 'low' | 'medium' | 'high'; mitigation: string;
}

export interface Gap {
  id: string; type: 'skill' | 'resource' | 'process'; title: string; suggestion: string;
}

export interface Roadmap {
  id: string; visionId: string;
  status: 'draft' | 'approved' | 'active' | 'archived';
  milestones: Milestone[]; risks: RoadmapRisk[]; gaps: Gap[];
}

export interface VisionDocument {
  id: string; uploadedAt: string; rawText: string; mission: string;
  problemStatements?: string[];
  revenueTargets: { period: string; target: number }[];
  resources: { money: number; headcount: number; timeMonths: number };
  targetAudience: string; techApproach?: string; constraints: string[];
}

interface RoadmapContextType {
  roadmap: Roadmap | null;
  vision: VisionDocument | null;
  updateMilestone: (id: string, updates: Partial<Milestone>) => void;
  setRoadmap: (r: Roadmap) => void;
  setVision: (v: VisionDocument) => void;
}

const ROADMAP_KEY = 'prism_roadmap';
const VISION_KEY = 'prism_vision';
const RoadmapContext = createContext<RoadmapContextType | null>(null);

export function RoadmapProvider({ children }: { children: React.ReactNode }) {
  const [roadmap, setRoadmapState] = useState<Roadmap | null>(() => {
    try {
      const s = localStorage.getItem(ROADMAP_KEY);
      return s ? JSON.parse(s) : defaultRoadmap;
    } catch { return defaultRoadmap as Roadmap; }
  });

  const [vision, setVisionState] = useState<VisionDocument | null>(() => {
    try {
      const s = localStorage.getItem(VISION_KEY);
      return s ? JSON.parse(s) : defaultVision;
    } catch { return defaultVision as VisionDocument; }
  });

  useEffect(() => {
    if (roadmap) localStorage.setItem(ROADMAP_KEY, JSON.stringify(roadmap));
  }, [roadmap]);

  useEffect(() => {
    if (vision) localStorage.setItem(VISION_KEY, JSON.stringify(vision));
  }, [vision]);

  const updateMilestone = useCallback((id: string, updates: Partial<Milestone>) => {
    setRoadmapState(prev => {
      if (!prev) return prev;
      return { ...prev, milestones: prev.milestones.map(m => m.id === id ? { ...m, ...updates } : m) };
    });
  }, []);

  const setRoadmap = useCallback((r: Roadmap) => setRoadmapState(r), []);
  const setVision = useCallback((v: VisionDocument) => setVisionState(v), []);

  return React.createElement(RoadmapContext.Provider, { value: { roadmap, vision, updateMilestone, setRoadmap, setVision } }, children);
}

export function useRoadmap() {
  const ctx = useContext(RoadmapContext);
  if (!ctx) throw new Error('useRoadmap must be used within RoadmapProvider');
  return ctx;
}
