import React, { createContext, useState } from "react";
import axiosPublic from "../api/axios";
import { jwtDecode } from "jwt-decode";
import { httpService } from "../services/HttpService";
import { useCallback } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});

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
      isVerified: decoded.is_verified,
    }));
    return accessToken;
  }, [setAuth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth, refresh }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
