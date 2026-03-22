import { useEffect } from 'react';
import { useNavigate } from 'react-router';
export function Dashboard() {
  const navigate = useNavigate();
  useEffect(() => { navigate('/app', { replace: true }); }, [navigate]);
  return null;
}
