import React from 'react';
import { ThresholdTransition } from './ThresholdTransition';
import { employees } from '../mockData';

// The threshold passes the first employee's name.
// In production: pass the logged-in user's first direct report,
// or the user's own name, from your auth context.
const firstEmployee = employees[0];

export function EnterApp() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#f4f2ed' }}>
      <ThresholdTransition name={firstEmployee?.name ?? 'Alex Mercer'} />
    </div>
  );
}
