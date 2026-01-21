import { useEffect, useRef } from "react";
import useAuth from "./useAuth";
import useRefreshToken from "./useRefreshToken";

/**
 * Hook that automatically refreshes the access token before it expires.
 * Schedules refresh to happen 1 minute before token expiration.
 */
const useTokenRefresh = () => {
  const { auth } = useAuth();
  const refresh = useRefreshToken();
  const timeoutRef = useRef(null);

  useEffect(() => {
    const scheduleTokenRefresh = async () => {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      if (!auth?.accessToken) {
        return;
      }

      try {
        // Dynamically import jwt-decode to handle different export formats
        const mod = await import("jwt-decode");
        const jwtDecode = mod?.default ?? mod?.jwtDecode ?? mod;
        
        const decoded = jwtDecode(auth.accessToken);
        const expiresAt = decoded.exp * 1000; // Convert to milliseconds
        const now = Date.now();
        
        // Calculate time until expiration
        const timeUntilExpiry = expiresAt - now;
        
        // Refresh 1 minute (60000ms) before expiration, or immediately if already expired/close to expiry
        const refreshBuffer = 60000; // 1 minute
        const refreshIn = Math.max(0, timeUntilExpiry - refreshBuffer);

        // Schedule the refresh
        timeoutRef.current = setTimeout(async () => {
          try {
            await refresh();
          } catch (error) {
            // Token refresh failed silently
          }
        }, refreshIn);
      } catch (error) {
        // Failed to decode token
      }
    };

    scheduleTokenRefresh();

    // Cleanup timeout on unmount or when auth changes
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [auth?.accessToken, refresh]);
};

export default useTokenRefresh;
