/**
 * useRoleAccess — Role-based access control for all Prism screens
 * 
 * Per PRODUCT_ARCHITECTURE_v3.md §5 + §13.8:
 *   CEO:             everything
 *   department_head: everything except Genesis, Calibration
 *   manager:         Team, Checkpoint, The Race, 360° Resonance, Orbital Presence, + employee screens
 *   employee:        Spectrum (personal), Tasks, KPIs, Meridian (parent OKRs only), Luminary
 */

import { useAuth } from './AuthContext';

type Role = 'ceo' | 'department_head' | 'manager' | 'employee';

interface RoleAccess {
  role: Role;
  isCeo: boolean;
  isDeptHead: boolean;
  isManager: boolean;
  isEmployee: boolean;
  isManagerOrAbove: boolean;  // manager + dept_head + ceo
  isDeptHeadOrAbove: boolean; // dept_head + ceo

  // Screen access
  canAccessGenesis: boolean;
  canAccessCalibration: boolean;
  canAccessSynthesis: boolean;
  canAccessCheckpoint: boolean;
  canAccessMeridian: boolean;
  canAccessTeam: boolean;
  canAccessRace: boolean;
  canAccessReviews: boolean;
  canAccessAttendance: boolean;
  canAccessSettings: boolean; // false for CEO (uses Calibration)

  // Dock items
  primaryNavItems: string[];   // paths visible in primary dock
  featureNavItems: string[];   // paths visible in feature tray
  showLuminary: boolean;
}

const ROLE_HIERARCHY: Record<Role, number> = {
  employee: 0,
  manager: 1,
  department_head: 2,
  ceo: 3,
};

export function useRoleAccess(): RoleAccess {
  const { user } = useAuth();
  const role: Role = user?.role_level || 'employee';
  const level = ROLE_HIERARCHY[role];

  const isCeo = role === 'ceo';
  const isDeptHead = role === 'department_head';
  const isManager = role === 'manager';
  const isEmployee = role === 'employee';
  const isManagerOrAbove = level >= ROLE_HIERARCHY.manager;
  const isDeptHeadOrAbove = level >= ROLE_HIERARCHY.department_head;

  // Screen access rules (PA §5)
  const canAccessGenesis = isCeo;
  const canAccessCalibration = isCeo;
  const canAccessSynthesis = isDeptHeadOrAbove;
  const canAccessCheckpoint = isManagerOrAbove;
  const canAccessMeridian = true; // all roles, content scoped
  const canAccessTeam = isManagerOrAbove;
  const canAccessRace = isManagerOrAbove;
  const canAccessReviews = isManagerOrAbove;
  const canAccessAttendance = isManagerOrAbove;
  const canAccessSettings = !isCeo; // CEO uses Calibration

  // Primary dock: Employee sees Spectrum + Sanctum + Tasks + KPIs
  //               Manager+: adds Team
  const primaryNavItems: string[] = ['/app/kpis', '/app', '/app/avatar', '/app/tasks'];
  if (isManagerOrAbove) {
    primaryNavItems.unshift('/app/team');
  }

  // Feature tray: role-filtered
  const featureNavItems: string[] = [];
  if (isManagerOrAbove) {
    featureNavItems.push('/app/leaderboard', '/app/review', '/app/attendance');
  }
  if (isDeptHeadOrAbove) {
    featureNavItems.push('/app/roadmap');
  }
  if (isManagerOrAbove) {
    featureNavItems.push('/app/approvals');
  }
  if (isDeptHeadOrAbove) {
    featureNavItems.push('/app/reports');
  }
  if (isCeo) {
    featureNavItems.push('/app/admin');
  } else {
    featureNavItems.push('/app/settings');
  }

  return {
    role, isCeo, isDeptHead, isManager, isEmployee,
    isManagerOrAbove, isDeptHeadOrAbove,
    canAccessGenesis, canAccessCalibration, canAccessSynthesis,
    canAccessCheckpoint, canAccessMeridian, canAccessTeam,
    canAccessRace, canAccessReviews, canAccessAttendance, canAccessSettings,
    primaryNavItems, featureNavItems,
    showLuminary: true, // all roles see Luminary
  };
}
