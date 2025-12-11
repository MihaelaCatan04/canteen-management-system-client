export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login/",
    REGISTER: "/auth/register/",
    REFRESH: "/auth/refresh/",
    LOGOUT: "/auth/logout/",
    EMAIL_VERIFY: "/auth/email/verify/",
    EMAIL_RESEND: "/auth/email/resend/",
    PASSWORD_CHANGE: "/auth/password/change/",
    PASSWORD_RESET: "/auth/password/reset/",
    PASSWORD_RESET_CONFIRM: "/auth/password/reset/confirm/",
  },
  MFA: {
    SETUP_START: "/auth/mfa/setup/start",
    SETUP_CONFIRM: "/auth/mfa/setup/confirm",
    VERIFY: "/auth/mfa/verify",
    DISABLE: "/auth/mfa/disable",
    REGENERATE_CODES: "/auth/mfa/setup/regenerate",
  },
  USER: {
    PROFILE: "/users/me",
  },
  WALLETS: {
    BALANCE: "/wallets/me/",
  },
  MENUS: {
    LIST: "/menus",
  },
  ORDERS: {
    CREATE: "/orders/",
    LIST: "/orders/",
  },
  TRANSACTIONS: {
    LIST: "/wallets/me/transactions/",
  },
};