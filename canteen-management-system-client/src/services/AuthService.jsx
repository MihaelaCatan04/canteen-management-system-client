import { httpService } from "./HttpService";
import { API_ENDPOINTS } from "../api/API_ENDPOINTS";
import { jwtDecode } from "jwt-decode";
import axiosPublic from "../api/axios";

export class AuthService {
  async login(email, password, setAuth) {
    try {
      const data = await httpService.publicPost(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });

      // Check if MFA is required
      if (data?.mfa_required) {
        return {
          requiresMFA: true,
          mfaTicket: data.mfa_ticket,
          mfaType: data.mfa_type,
          message: data.message || "MFA verification required"
        };
      }

      // Normal login flow (no MFA)
      const accessToken = data?.access;
      const decoded = jwtDecode(accessToken);
      const user_id = decoded.user_id;
      const role = [decoded.role];
      const isVerified = decoded.verified;
      
      httpService.setAuthToken(accessToken);
      
      // Fetch user profile to get MFA status
      const userProfile = await httpService.privateGet(API_ENDPOINTS.USER.PROFILE);
      
      const authData = {
        accessToken,
        user_id,
        role,
        isVerified,
        mfaEnabled: !!userProfile?.mfa_enabled,
      };
      
      setAuth(authData);

      return { requiresMFA: false, ...authData };
    } catch (err) {
      throw this.handleLoginError(err);
    }
  }

  async register(email, password, password2, setAuth) {
    try {
      const data = await httpService.publicPost(
        API_ENDPOINTS.AUTH.REGISTER,
        { email, password, password2 }
      );

      const accessToken = data?.access;
      const decoded = jwtDecode(accessToken);
      const user_id = decoded.user_id;
      const role = [decoded.role];
      const isVerified = decoded.verified;
      
      setAuth({
        accessToken,
        user_id,
        role,
        isVerified,
      });

      httpService.setAuthToken(accessToken);

      return { user_id, accessToken, role, isVerified };
    } catch (err) {
      throw new Error(err.message || "Registration failed");
    }
  }

  async verifyMFA(ticket, code, setAuth) {
    try {
      const data = await httpService.publicPost(API_ENDPOINTS.MFA.VERIFY, {
        ticket,
        code,
      });

      const accessToken = data?.access;
      const decoded = jwtDecode(accessToken);
      const user_id = decoded.user_id;
      const role = [decoded.role];
      const isVerified = decoded.verified;
      
      httpService.setAuthToken(accessToken);
      
      // Fetch user profile to get MFA status
      const userProfile = await httpService.privateGet(API_ENDPOINTS.USER.PROFILE);
      
      const authData = {
        accessToken,
        user_id,
        role,
        isVerified,
        mfaEnabled: !!userProfile?.mfa_enabled,
      };
      
      setAuth(authData);

      return authData;
    } catch (err) {
      throw new Error(err.message || "MFA verification failed");
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
      await axiosPublic.post(API_ENDPOINTS.AUTH.LOGOUT, {}, { withCredentials: true });
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
