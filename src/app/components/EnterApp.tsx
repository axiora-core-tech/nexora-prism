import React from 'react';
import { CustomCursor } from './ui/CustomCursor';
import { ThresholdTransition } from './ThresholdTransition';
import { employees } from '../mockData';
import { useAuth } from '../auth/AuthContext';

const fallbackEmployee = employees[0];

export function EnterApp() {
  const { user } = useAuth();

  // Use the signed-in user's first name if available, fall back to first employee
  const displayName =
    user?.name?.split(' ')[0] ??
    fallbackEmployee?.name ??
    'Arjun Sharma';

  return (
    <div style={{ width: '100vw', height: '100vh', background: 'var(--p-bg)', cursor: 'none' }}>
      <CustomCursor />
      <ThresholdTransition name={displayName} />
    </div>
  );
}
