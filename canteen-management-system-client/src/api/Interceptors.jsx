import { axiosPrivate } from "./axios";
import { authService } from "../services/AuthService";

// Global request interceptor
// Note: For Microsoft users, the useAxiosPrivate hook handles token injection
// This interceptor is a fallback for regular users
axiosPrivate.interceptors.request.use(
  (config) => {
    // The Authorization header is set by:
    // 1. useAxiosPrivate hook (for both regular and Microsoft users)
    // 2. httpService.setAuthToken for regular users
    return config;
  },
  (error) => Promise.reject(error)
);

// Global response interceptor
axiosPrivate.interceptors.response.use(
  (response) => response,
  async (error) => {
    const prevRequest = error?.config;

    // Only attempt refresh for regular (non-Microsoft) auth
    // Microsoft auth refresh is handled by useAxiosPrivate with MSAL
    if (error?.response?.status === 401 && !prevRequest?.sent) {
      // Check if this is a Microsoft auth request by looking at the token
      const authHeader = prevRequest?.headers?.["Authorization"];
      if (authHeader && typeof authHeader === "string") {
        // Microsoft tokens are typically longer and have different structure
        // For now, we'll let useAxiosPrivate handle the retry
        // This interceptor is mainly for non-hook based calls
      }

      prevRequest.sent = true;
      try {
        const newAuthData = await authService.refreshToken();
        const newToken =
          (newAuthData && (newAuthData.accessToken || newAuthData.access || newAuthData.token)) ||
          (typeof newAuthData === "string" ? newAuthData : null);
        if (!newToken) {
          return Promise.reject(error);
        }
        axiosPrivate.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        prevRequest.headers = prevRequest.headers || {};
        prevRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return axiosPrivate(prevRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    // Handle 403 errors - check if it's due to unverified email
    if (error?.response?.status === 403) {
      const token = axiosPrivate.defaults.headers.common["Authorization"];
      if (token && typeof token === "string" && token.startsWith("Bearer ")) {
        try {
          const accessToken = token.replace("Bearer ", "");
          const mod = await import("jwt-decode");
          const jwtDecode = mod?.default ?? mod?.jwtDecode ?? mod;
          const decoded = jwtDecode(accessToken);
          
          // If user is not verified, redirect to resend verification page
          if (decoded && !decoded.verified) {
            window.location.href = "/resend-verification";
            return Promise.reject(error);
          }
        } catch (decodeError) {
          // If token decoding fails (e.g., Microsoft token), just return the error
          // Microsoft tokens can't be decoded with jwt-decode
          console.debug("Token decode skipped (may be Microsoft token):", decodeError.message);
        }
      }
    }

    return Promise.reject(error);
  }
);
