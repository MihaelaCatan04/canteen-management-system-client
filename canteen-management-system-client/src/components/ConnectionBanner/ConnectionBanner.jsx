import { useState, useEffect } from 'react';
import healthCheckService from '../../services/HealthCheckService';
import './ConnectionBanner.css';

function ConnectionBanner() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Start periodic health checks
    const stopChecks = healthCheckService.startPeriodicChecks((result) => {
      setIsOffline(!result.healthy);
    });

    // Initial check
    healthCheckService.checkAPIHealth().then((result) => {
      setIsOffline(!result.healthy);
    });

    // Cleanup on unmount
    return () => stopChecks();
  }, []);

  if (!isOffline) return null;

  return (
    <div className="connection-banner">
      <div className="connection-banner-content">
        <span className="connection-banner-icon">⚠️</span>
        <span className="connection-banner-text">
          Service temporarily unavailable.
        </span>
      </div>
    </div>
  );
}

export default ConnectionBanner;
