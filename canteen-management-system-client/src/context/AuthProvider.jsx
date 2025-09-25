import React, { createContext, useEffect, useState } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import { httpService } from "../services/HttpService";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [loadingAuth, setLoadingAuth] = useState(true);
  const refresh = useRefreshToken();

  useEffect(() => {
    let mounted = true;
    const restore = async () => {
      try {
        const newAccess = await refresh();
        if (!mounted) return;
        if (newAccess) {
          httpService.setAuthToken(newAccess);
        }
      } catch (err) {
        console.warn("refresh failed", err);
      } finally {
        if (mounted) setLoadingAuth(false);
      }
    };
    restore();
    return () => {
      mounted = false;
    };
  }, []); 

  if (loadingAuth) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
