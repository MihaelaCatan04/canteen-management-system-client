import { useState, useEffect } from 'react';
import healthCheckService from '../services/HealthCheckService';

/**
 * Custom hook to check API health status
 * @returns {boolean} isHealthy - Whether the API is reachable
 */
export function useHealthCheck() {
  const [isHealthy, setIsHealthy] = useState(true);

  useEffect(() => {
    // Get initial status
    const status = healthCheckService.getStatus();
    setIsHealthy(status.healthy);

    // Start periodic health checks
    const stopChecks = healthCheckService.startPeriodicChecks((result) => {
      setIsHealthy(result.healthy);
    });

    // Cleanup on unmount
    return () => stopChecks();
  }, []);

  return isHealthy;
}

export default useHealthCheck;
