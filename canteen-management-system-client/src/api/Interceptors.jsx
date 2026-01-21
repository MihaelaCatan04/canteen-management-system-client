import { axiosPrivate } from "./axios";
import { authService } from "../services/AuthService";

axiosPrivate.interceptors.request.use(
  (config) => {
    // axiosPrivate.defaults.headers.common["Authorization"] is set by HttpService.setAuthToken
    // keep request as-is (or attach fallback token from context if you expose it globally)
    return config;
  },
  (error) => Promise.reject(error)
);

axiosPrivate.interceptors.response.use(
  (response) => response,
  async (error) => {
    const prevRequest = error?.config;

    if (error?.response?.status === 401 && !prevRequest?.sent) {
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
          // If token decoding fails, just return the error
        }
      }
    }

    return Promise.reject(error);
  }
);