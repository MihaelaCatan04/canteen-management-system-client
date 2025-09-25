import { httpService } from "./HttpService";
import { API_ENDPOINTS } from "../api/API_ENDPOINTS";

export class TransactionService {
  async getTransactions() {
    try {
      const data = await httpService.privateGet(API_ENDPOINTS.TRANSACTIONS.LIST);
      return data;
    } catch (err) {
      console.error("Error fetching transactions:", err);
      throw err;
    }
  }
}

export const transactionService = new TransactionService();