import axiosPublic from "../api/axios";
import useAuth from "./useAuth";
import { httpService } from "../services/HttpService";
import { useCallback } from "react";

const useRefreshToken = () => {
  const { setAuth } = useAuth();
  const refresh = useCallback(async () => {
    const response = await axiosPublic.post("/auth/refresh/", {}, { withCredentials: true });
    const accessToken = response?.data?.access || null;
    if (!accessToken) throw new Error("No access token in refresh response");
    httpService.setAuthToken(accessToken);
    // Dynamic import to handle both named and default exports from jwt-decode
    const mod = await import("jwt-decode");
    const jwtDecode = mod?.default ?? mod?.jwtDecode ?? mod;
    const decoded = jwtDecode(accessToken);
    const verifiedValue = decoded.is_verified ?? decoded.verified ?? false;
    setAuth((prev) => ({
      ...prev,
      accessToken,
      user_id: decoded.user_id,
      role: decoded.role ? [decoded.role] : prev.role,
      // normalize verification flags for the app (support both snake/camel)
      isVerified: Boolean(verifiedValue),
      is_verified: Boolean(verifiedValue),
      verified: Boolean(verifiedValue),
      // Keep existing mfaEnabled state if present
      mfaEnabled: prev.mfaEnabled,
    }));
    return accessToken;
  }, [setAuth]);
  return refresh;
};

export default useRefreshToken;
