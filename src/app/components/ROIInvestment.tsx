/**
 * ROI page — redirects to Analytics (Capital Dynamics tab)
 * Content has been consolidated into the Analytics page.
 */
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export function ROIInvestment() {
  const navigate = useNavigate();
  useEffect(() => { navigate('/app', { replace: true }); }, [navigate]);
  return null;
}
