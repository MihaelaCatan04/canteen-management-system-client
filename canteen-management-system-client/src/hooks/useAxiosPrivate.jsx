import { axiosPrivate } from "../api/axios";
import { useEffect, useCallback } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";
import { useMicrosoftAuth } from "./useMicrosoftAuth";

// Shared state to avoid concurrent refresh attempts
let isRefreshing = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const { auth } = useAuth();
  const { getAccessToken: getMsToken } = useMicrosoftAuth();

  // Get the appropriate token based on auth type
  const getToken = useCallback(async () => {
    if (auth?.isMicrosoftAuth) {
      // For Microsoft users, get fresh token from MSAL
      return await getMsToken();
    }
    // For regular users, use the stored access token
    return auth?.accessToken;
  }, [auth?.isMicrosoftAuth, auth?.accessToken, getMsToken]);

  // Refresh token based on auth type
  const refreshToken = useCallback(async () => {
    if (auth?.isMicrosoftAuth) {
      // For Microsoft users, get fresh token from MSAL
      return await getMsToken();
    }
    // For regular users, use the refresh endpoint
    return await refresh();
  }, [auth?.isMicrosoftAuth, getMsToken, refresh]);

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      async (config) => {
        if (!config.headers["Authorization"]) {
          const token = await getToken();
          if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;

        // If status indicates auth error, attempt refresh once
        if ((error?.response?.status === 401 || error?.response?.status === 403) && !prevRequest?.sent) {
          // mark request to avoid loops
          prevRequest.sent = true;

          if (!isRefreshing) {
            isRefreshing = true;
            try {
              const newAccessToken = await refreshToken();
              isRefreshing = false;
              onRefreshed(newAccessToken);
              prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
              return axiosPrivate(prevRequest);
            } catch (err) {
              isRefreshing = false;
              refreshSubscribers = [];
              return Promise.reject(err);
            }
          }

          // If a refresh is already in progress, queue this request
          return new Promise((resolve, reject) => {
            subscribeTokenRefresh((token) => {
              if (!token) return reject(error);
              prevRequest.headers["Authorization"] = `Bearer ${token}`;
              resolve(axiosPrivate(prevRequest));
            });
          });
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [auth, getToken, refreshToken]);

  return axiosPrivate;
};

export default useAxiosPrivate;
