import { axiosPrivate } from "./axios";
import { authService } from "../services/AuthService";

axiosPrivate.interceptors.request.use(
  (config) => {
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
        prevRequest.headers['Authorization'] = `Bearer ${newAuthData.accessToken}`;
        return axiosPrivate(prevRequest);
      } catch (refreshError) {
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);