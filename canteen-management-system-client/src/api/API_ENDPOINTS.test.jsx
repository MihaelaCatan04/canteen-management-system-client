import { describe, it, expect } from 'vitest';
import { API_ENDPOINTS } from './API_ENDPOINTS';

describe('API_ENDPOINTS Configuration', () => {
  it('should have all required AUTH endpoints', () => {
    expect(API_ENDPOINTS.AUTH).toBeDefined();
    expect(API_ENDPOINTS.AUTH.LOGIN).toBe('/auth/login/');
    expect(API_ENDPOINTS.AUTH.REGISTER).toBe('/auth/register/');
    expect(API_ENDPOINTS.AUTH.REFRESH).toBe('/auth/refresh/');
    expect(API_ENDPOINTS.AUTH.LOGOUT).toBe('/auth/logout/');
  });

  it('should have all MFA endpoints', () => {
    expect(API_ENDPOINTS.MFA).toBeDefined();
    expect(API_ENDPOINTS.MFA.SETUP_START).toBe('/auth/mfa/setup/start');
    expect(API_ENDPOINTS.MFA.VERIFY).toBe('/auth/mfa/verify');
    expect(API_ENDPOINTS.MFA.DISABLE).toBe('/auth/mfa/disable');
  });

  it('should have wallet endpoints', () => {
    expect(API_ENDPOINTS.WALLETS).toBeDefined();
    expect(API_ENDPOINTS.WALLETS.BALANCE).toBe('/wallets/me/');
    expect(API_ENDPOINTS.WALLETS.CREATE_CHECKOUT_SESSION).toBe(
      '/wallets/stripe/create-checkout-session/'
    );
  });

  it('should have order endpoints', () => {
    expect(API_ENDPOINTS.ORDERS).toBeDefined();
    expect(API_ENDPOINTS.ORDERS.CREATE).toBe('/orders/');
    expect(API_ENDPOINTS.ORDERS.LIST).toBe('/orders/');
  });

  it('should have menu endpoints', () => {
    expect(API_ENDPOINTS.MENUS).toBeDefined();
    expect(API_ENDPOINTS.MENUS.LIST).toBe('/menus');
  });

  it('should have transaction endpoints', () => {
    expect(API_ENDPOINTS.TRANSACTIONS).toBeDefined();
    expect(API_ENDPOINTS.TRANSACTIONS.LIST).toBe('/wallets/me/transactions/');
  });

  it('should have user endpoints', () => {
    expect(API_ENDPOINTS.USER).toBeDefined();
    expect(API_ENDPOINTS.USER.PROFILE).toBe('/users/me');
  });

  it('should have email verification endpoints', () => {
    expect(API_ENDPOINTS.AUTH.EMAIL_VERIFY).toBe('/auth/email/verify/');
    expect(API_ENDPOINTS.AUTH.EMAIL_RESEND).toBe('/auth/email/resend/');
  });

  it('should have Microsoft authentication endpoints', () => {
    expect(API_ENDPOINTS.AUTH.MICROSOFT).toBe('/auth/microsoft');
    expect(API_ENDPOINTS.AUTH.MICROSOFT_CALLBACK).toBe('/auth/microsoft/callback');
  });

  it('should have password reset endpoints', () => {
    expect(API_ENDPOINTS.AUTH.PASSWORD_RESET).toBe('/auth/password/reset/');
    expect(API_ENDPOINTS.AUTH.PASSWORD_RESET_CONFIRM).toBe(
      '/auth/password/reset/confirm/'
    );
  });
});
