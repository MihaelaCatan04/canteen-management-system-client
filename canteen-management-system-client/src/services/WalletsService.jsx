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
}

export const walletsService = new WalletsService();
