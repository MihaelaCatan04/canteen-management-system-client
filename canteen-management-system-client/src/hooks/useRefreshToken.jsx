import axiosPublic from "../api/axios";
import useAuth from "./useAuth";
import { jwtDecode } from "jwt-decode";
import { httpService } from "../services/HttpService";
import { useCallback } from "react";

const useRefreshToken = () => {
  const { setAuth } = useAuth();
  const refresh = useCallback(async () => {
    const response = await axiosPublic.post(
      "/auth/refresh/",
      {},
      { withCredentials: true }
    );
    const accessToken = response?.data?.access || null;
    if (!accessToken) throw new Error("No access token in refresh response");
    httpService.setAuthToken(accessToken);
    const decoded = jwtDecode(accessToken);
    setAuth((prev) => ({
      ...prev,
      accessToken,
      user_id: decoded.user_id,
      role: decoded.role ? [decoded.role] : prev.role,
      isVerified: decoded.verified,
    }));
    return accessToken;
  }, [setAuth]);
  return refresh;
};

export default useRefreshToken;
