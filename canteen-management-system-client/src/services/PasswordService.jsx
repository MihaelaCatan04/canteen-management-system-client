import { httpService } from "./HttpService";
import { API_ENDPOINTS } from "../api/API_ENDPOINTS";

export class PasswordService {
  // change password for authenticated users
  async changePassword(oldPassword, newPassword, confirmNewPassword) {
    try {
      const data = await httpService.privatePost(API_ENDPOINTS.AUTH.PASSWORD_CHANGE, {
        old_password: oldPassword,
        new_password: newPassword,
        confirm_new_password: confirmNewPassword,
      });
      return data;
    } catch (err) {
      // re-throw with full error data for field-specific errors
      throw err;
    }
  }

  // request password reset email (forgot password)
  async requestPasswordReset(email) {
    try {
      const data = await httpService.publicPost(API_ENDPOINTS.AUTH.PASSWORD_RESET, {
        email,
      });
      return data;
    } catch (err) {
      throw err;
    }
  }

  // confirm password reset with token from email
  async confirmPasswordReset(token, newPassword, confirmNewPassword) {
    try {
      const data = await httpService.publicPost(API_ENDPOINTS.AUTH.PASSWORD_RESET_CONFIRM, {
        token,
        new_password: newPassword,
        confirm_new_password: confirmNewPassword,
      });
      return data;
    } catch (err) {
      throw err;
    }
  }
}

export const passwordService = new PasswordService();
