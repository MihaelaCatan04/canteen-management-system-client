import { httpService } from "./HttpService";
import { API_ENDPOINTS } from "../api/API_ENDPOINTS";
import { jwtDecode } from "jwt-decode";
import axiosPublic from "../api/axios";

export class AuthService {
  async login(email, password) {
    try {
      const data = await httpService.publicPost(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });

      const accessToken = data?.access;
      const user_id = jwtDecode(accessToken).user_id;
      const role = [jwtDecode(accessToken).role];
      const isVerified = jwtDecode(accessToken).is_verified;

      httpService.setAuthToken(accessToken);

      return { user_id, accessToken, role, isVerified };
    } catch (err) {
      throw this.handleLoginError(err);
    }
  }

  async register(email, password, password2) {
    try {
      const data = await httpService.publicPost(
        API_ENDPOINTS.AUTH.REGISTER,
        { email, password, password2 }
      );

      const accessToken = data?.access;
      const user_id = jwtDecode(accessToken).user_id;
      const role = [jwtDecode(accessToken).role];
      const isVerified = jwtDecode(accessToken).is_verified;

      httpService.setAuthToken(accessToken);

      return { user_id, accessToken, role, isVerified };
    } catch (err) {
      throw new Error(err.message || "Registration failed");
    }
  }

  async refreshToken() {
    try {
      const res = await axiosPublic.post(
        API_ENDPOINTS.AUTH.REFRESH,
        {},
        { withCredentials: true }
      );
      const newToken = res?.data?.access;
      if (newToken) {
        httpService.setAuthToken(newToken);
      }
      return res?.data;
    } catch (err) {
      console.error("refresh token failed", err);
      throw err;
    }
  }

  async logout() {
    try {
      await httpService.privatePost(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      httpService.removeAuthToken();
    }
  }

  handleLoginError(err) {
    if (!err?.response) {
      return new Error("No Server Response");
    } else if (err.response?.status === 400) {
      return new Error("Missing Username or Password");
    } else if (err.response?.status === 401) {
      return new Error("Invalid email or password");
    } else {
      return new Error("Login Failed");
    }
  }
}

export const authService = new AuthService();
