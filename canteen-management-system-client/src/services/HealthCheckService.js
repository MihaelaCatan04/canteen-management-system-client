import axios from 'axios';
import config from '../config/env';

class HealthCheckService {
  constructor() {
    this.isHealthy = false;
    this.lastCheck = null;
    this.checkInterval = 30000; // 30 seconds
  }

  /**
   * Check if the backend API is accessible
   * @returns {Promise<Object>} Health check result
   */
  async checkAPIHealth() {
    try {
      const response = await axios.get(`${config.API_BASE_URL}/health`, {
        timeout: 5000,
        validateStatus: (status) => status < 500
      });

      this.isHealthy = response.status === 200;
      this.lastCheck = new Date();

      return {
        healthy: this.isHealthy,
        status: response.status,
        timestamp: this.lastCheck,
        message: response.data?.message || 'API is reachable'
      };
    } catch (error) {
      this.isHealthy = false;
      this.lastCheck = new Date();

      return {
        healthy: false,
        status: error.response?.status || 0,
        timestamp: this.lastCheck,
        message: error.message || 'API is not reachable',
        error: error.code
      };
    }
  }

  /**
   * Perform initial health check on app startup
   * @returns {Promise<Object>} Health check result
   */
  async performStartupCheck() {
    const result = await this.checkAPIHealth();

    return result;
  }

  /**
   * Start periodic health checks
   * @param {Function} callback - Called on each health check with result
   */
  startPeriodicChecks(callback) {
    const intervalId = setInterval(async () => {
      const result = await this.checkAPIHealth();
      if (callback) {
        callback(result);
      }
    }, this.checkInterval);

    return () => clearInterval(intervalId);
  }

  /**
   * Get the current health status
   * @returns {Object} Current health status
   */
  getStatus() {
    return {
      healthy: this.isHealthy,
      lastCheck: this.lastCheck
    };
  }
}

// Export singleton instance
export const healthCheckService = new HealthCheckService();
export default healthCheckService;
