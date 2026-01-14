// Environment Configuration
export const config = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Canteen Management System',
  APP_ENV: import.meta.env.VITE_APP_ENV || 'development',
  STRIPE_PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
  MICROSOFT_CLIENT_ID: import.meta.env.VITE_MICROSOFT_CLIENT_ID || '',
};

// Validate required environment variables in production
if (config.APP_ENV === 'production') {
  const requiredVars = ['API_BASE_URL'];
  const missing = requiredVars.filter(key => !config[key]);
  
  if (missing.length > 0) {
    console.error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
}

export default config;
