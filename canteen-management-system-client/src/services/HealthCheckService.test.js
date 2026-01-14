import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import { healthCheckService } from './HealthCheckService';

vi.mock('axios');

describe('HealthCheckService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    healthCheckService.isHealthy = false;
    healthCheckService.lastCheck = null;
  });

  describe('checkAPIHealth', () => {
    it('should return healthy status when API responds with 200', async () => {
      axios.get.mockResolvedValue({
        status: 200,
        data: { message: 'API is healthy' }
      });

      const result = await healthCheckService.checkAPIHealth();

      expect(result.healthy).toBe(true);
      expect(result.status).toBe(200);
      expect(result.message).toBe('API is healthy');
      expect(healthCheckService.isHealthy).toBe(true);
    });

    it('should return unhealthy status when API is not reachable', async () => {
      axios.get.mockRejectedValue(new Error('Network Error'));

      const result = await healthCheckService.checkAPIHealth();

      expect(result.healthy).toBe(false);
      expect(result.message).toBe('Network Error');
      expect(healthCheckService.isHealthy).toBe(false);
    });

    it('should update lastCheck timestamp', async () => {
      axios.get.mockResolvedValue({
        status: 200,
        data: { message: 'OK' }
      });

      await healthCheckService.checkAPIHealth();

      expect(healthCheckService.lastCheck).toBeInstanceOf(Date);
    });

    it('should handle API timeout', async () => {
      axios.get.mockRejectedValue({
        code: 'ECONNABORTED',
        message: 'timeout of 5000ms exceeded'
      });

      const result = await healthCheckService.checkAPIHealth();

      expect(result.healthy).toBe(false);
      expect(result.error).toBe('ECONNABORTED');
    });
  });

  describe('performStartupCheck', () => {
    it('should log success message when API is healthy', async () => {
      const consoleSpy = vi.spyOn(console, 'log');
      axios.get.mockResolvedValue({
        status: 200,
        data: { message: 'OK' }
      });

      await healthCheckService.performStartupCheck();

      expect(consoleSpy).toHaveBeenCalledWith('✅ API health check passed');
      consoleSpy.mockRestore();
    });

    it('should log warning when API is unhealthy', async () => {
      const warnSpy = vi.spyOn(console, 'warn');
      axios.get.mockRejectedValue(new Error('Connection refused'));

      await healthCheckService.performStartupCheck();

      expect(warnSpy).toHaveBeenCalledWith(
        '⚠️ API health check failed:',
        'Connection refused'
      );
      warnSpy.mockRestore();
    });
  });

  describe('getStatus', () => {
    it('should return current health status', async () => {
      axios.get.mockResolvedValue({
        status: 200,
        data: {}
      });

      await healthCheckService.checkAPIHealth();
      const status = healthCheckService.getStatus();

      expect(status.healthy).toBe(true);
      expect(status.lastCheck).toBeInstanceOf(Date);
    });
  });

  describe('startPeriodicChecks', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should call callback with health check results', async () => {
      const callback = vi.fn();
      axios.get.mockResolvedValue({
        status: 200,
        data: { message: 'OK' }
      });

      const stopChecks = healthCheckService.startPeriodicChecks(callback);

      // Fast-forward time
      await vi.advanceTimersByTimeAsync(30000);

      expect(callback).toHaveBeenCalled();
      stopChecks();
    });
  });
});
