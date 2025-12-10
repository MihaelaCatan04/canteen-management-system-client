import { axiosPrivate } from "../api/axios";
import { httpService } from "./HttpService";
import { API_ENDPOINTS } from "../api/API_ENDPOINTS";

export class WalletsService {
  async getBalance() {
    try {
      const data = await httpService.privateGet(API_ENDPOINTS.WALLETS.BALANCE);
      return data;
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
      throw error;
    }
  }

  async createCheckoutSession(amount, currency = "mdl") {
    try {
      const data = await httpService.privatePost(
        API_ENDPOINTS.WALLETS.CREATE_CHECKOUT_SESSION,
        { amount, currency }
      );
      return data;
    } catch (error) {
      console.error("Error creating checkout session:", error);
      throw error;
    }
  }

  async getSessionStatus(sessionId) {
    try {
      const data = await httpService.privateGet(
        `${API_ENDPOINTS.WALLETS.SESSION_STATUS}?session_id=${sessionId}`
      );
      return data;
    } catch (error) {
      console.error("Error fetching session status:", error);
      throw error;
    }
  }
}

export const walletsService = new WalletsService();
