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

        console.log(`Token expires in ${Math.round(timeUntilExpiry / 1000)}s. Scheduling refresh in ${Math.round(refreshIn / 1000)}s`);

        // Schedule the refresh
        timeoutRef.current = setTimeout(async () => {
          try {
            console.log("Automatically refreshing token...");
            await refresh();
            console.log("Token refreshed successfully");
          } catch (error) {
            console.error("Automatic token refresh failed:", error);
          }
        }, refreshIn);
      } catch (error) {
        console.error("Failed to decode token for auto-refresh:", error);
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
