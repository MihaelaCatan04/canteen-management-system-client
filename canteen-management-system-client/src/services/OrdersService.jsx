import { httpService } from "./HttpService";
import { API_ENDPOINTS } from "../api/API_ENDPOINTS.jsx";

const OrdersService = {
  async createOrder(payload) {
    try {
      return await httpService.privatePost(API_ENDPOINTS.ORDERS.CREATE, payload);
    } catch (err) {
      console.error("Error creating order:", err);
      throw err;
    }
  },
};

export default OrdersService;