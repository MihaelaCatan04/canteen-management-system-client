import { httpService } from "./HttpService";
import { API_ENDPOINTS } from "../api/API_ENDPOINTS";

export class MFAService {
  async startMFASetup() {
    try {
      const data = await httpService.privatePost(API_ENDPOINTS.MFA.SETUP_START);
      return data; 
    } catch (error) {
      console.error("Error starting MFA setup:", error);
      throw error;
    }
  }

  async confirmMFASetup(code) {
    try {
      const data = await httpService.privatePost(
        API_ENDPOINTS.MFA.SETUP_CONFIRM,
        { code }
      );
      console.log("MFA confirmation response:", data);
      return data; 
    } catch (error) {
      console.error("Error confirming MFA setup:", error);
      throw error;
    }
  }

  async verifyMFA(ticket, code) {
    try {
      const data = await httpService.publicPost(API_ENDPOINTS.MFA.VERIFY, {
        ticket,
        code,
      });
      return data; 
    } catch (error) {
      console.error("Error verifying MFA:", error);
      throw error;
    }
  }

  async disableMFA(password) {
    try {
      const data = await httpService.privatePost(API_ENDPOINTS.MFA.DISABLE, {
        password,
      });
      return data;
    } catch (error) {
      console.error("Error disabling MFA:", error);
      throw error;
    }
  }

  async regenerateBackupCodes(password) {
    try {
      const data = await httpService.privatePost(
        API_ENDPOINTS.MFA.REGENERATE_CODES,
        { password }
      );
      return data; 
    } catch (error) {
      console.error("Error regenerating backup codes:", error);
      throw error;
    }
  }
}

export const mfaService = new MFAService();
