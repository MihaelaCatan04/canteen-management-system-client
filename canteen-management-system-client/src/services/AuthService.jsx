import { httpService } from "./HttpService";
import { API_ENDPOINTS } from "../api/API_ENDPOINTS";
import axiosPublic from "../api/axios";

export class AuthService {
  // Authenticate with Microsoft - fetches user profile using MS token
  // The backend validates the Microsoft token and returns user info
  async authenticateWithMicrosoft(microsoftAccessToken, setAuth) {
    try {
      // Call /users/me with Microsoft token to validate and get user info
      // The backend's MicrosoftBearerAuthentication will validate the token
      const response = await axiosPublic.get(API_ENDPOINTS.USER.PROFILE, {
        headers: {
          Authorization: `Bearer ${microsoftAccessToken}`,
        },
      });

      const userProfile = response.data;

      // Set auth state for Microsoft user
      const authData = {
        // No app JWT - we use Microsoft token directly
        accessToken: null,
        microsoftToken: microsoftAccessToken,
        isMicrosoftAuth: true,
        user_id: userProfile.id,
        email: userProfile.email,
        role: [userProfile.role || "customer"],
        isVerified: userProfile.is_verified ?? userProfile.verified ?? true, // MS users are typically verified
        mfaEnabled: !!userProfile.mfa_enabled,
      };

      setAuth(authData);

      return authData;
    } catch (err) {
      throw new Error(err.response?.data?.detail || err.message || "Failed to authenticate with Microsoft");
    }
  }

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
      const mod = await import("jwt-decode");
      const jwtDecode = mod?.default ?? mod?.jwtDecode ?? mod;
      const decoded = jwtDecode(accessToken);
      const user_id = decoded.user_id;
      const role = [decoded.role];
      const isVerified = decoded.verified;
      
      httpService.setAuthToken(accessToken);
      
      // Fetch user profile to get MFA status
      const userProfile = await httpService.privateGet(API_ENDPOINTS.USER.PROFILE);
      
      const authData = {
        accessToken,
        isMicrosoftAuth: false,
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
      const mod = await import("jwt-decode");
      const jwtDecode = mod?.default ?? mod?.jwtDecode ?? mod;
      const decoded = jwtDecode(accessToken);
      const user_id = decoded.user_id;
      const role = [decoded.role];
      const isVerified = decoded.verified;
      
      setAuth({
        accessToken,
        isMicrosoftAuth: false,
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
      const mod = await import("jwt-decode");
      const jwtDecode = mod?.default ?? mod?.jwtDecode ?? mod;
      const decoded = jwtDecode(accessToken);
      const user_id = decoded.user_id;
      const role = [decoded.role];
      const isVerified = decoded.verified;
      
      httpService.setAuthToken(accessToken);
      
      // Fetch user profile to get MFA status
      const userProfile = await httpService.privateGet(API_ENDPOINTS.USER.PROFILE);
      
      const authData = {
        accessToken,
        isMicrosoftAuth: false,
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

  async verifyEmail(token) {
    try {
      const data = await httpService.publicPost(API_ENDPOINTS.AUTH.EMAIL_VERIFY, { token });
      return data;
    } catch (err) {
      console.error("Failed to verify email:", err);
      throw err;
    }
  }

  async resendVerification(email) {
    try {
      const data = await httpService.publicPost(API_ENDPOINTS.AUTH.EMAIL_RESEND, { email });
      return data;
    } catch (err) {
      console.error("Failed to resend verification email:", err);
      throw err;
    }
  }

  handleLoginError(err) {
    // The error message is already properly extracted by HttpService.handleError
    // Just return it as-is
    return err;
  }
}

export const authService = new AuthService();
