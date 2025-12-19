import { useNavigate, useLocation } from 'react-router-dom';
import AuditLogs from './AuditLogs';

function SecurityEnhanced() {
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect /security to /security/all
  if (location.pathname === '/security' || location.pathname === '/security/') {
    navigate('/security/all', { replace: true });
    return null;
  }

  return (
    <div className="w-full">
      <AuditLogs />
    </div>
  );
}

export default SecurityEnhanced;






