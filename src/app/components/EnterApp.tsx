import React from 'react';
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
    'Alex Mercer';

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#f4f2ed' }}>
      <ThresholdTransition name={displayName} />
    </div>
  );
}
