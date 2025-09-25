import { httpService } from "./HttpService";
import { API_ENDPOINTS } from "../api/API_ENDPOINTS";

export class OrderService {
    async getOrders() {
        try {
            const data = await httpService.privateGet(API_ENDPOINTS.ORDERS.LIST);
            return data;
        } catch (error) {
            console.error("Error fetching orders:", error);
            throw error;
        }
    }
}

export const orderService = new OrderService();