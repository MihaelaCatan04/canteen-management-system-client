import { axiosPrivate } from "../api/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";

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

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
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
              const newAccessToken = await refresh();
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
  }, [auth, refresh]);

  return axiosPrivate;
};

export default useAxiosPrivate;
