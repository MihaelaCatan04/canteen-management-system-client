import { httpService } from "./HttpService";
import { API_ENDPOINTS } from "../api/API_ENDPOINTS";
import { jwtDecode } from "jwt-decode";

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
      const data = await httpService.publicPost(API_ENDPOINTS.AUTH.REFRESH);
      const accessToken = data?.access;

      if (accessToken) {
        httpService.setAuthToken(accessToken);
        const user_id = jwtDecode(accessToken).user_id;
        const role = [jwtDecode(accessToken).role];
        const isVerified = jwtDecode(accessToken).is_verified;
        return { user_id, accessToken, role, isVerified };
      }

      throw new Error("No access token received");
    } catch (err) {
      httpService.removeAuthToken();
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
