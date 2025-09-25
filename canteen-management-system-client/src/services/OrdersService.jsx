import { axiosPrivate } from "../api/axios.jsx";
import { API_ENDPOINTS } from "../api/API_ENDPOINTS.jsx";

const OrdersService = {
  async createOrder(payload) {

    try {
      const res = await axiosPrivate.post(API_ENDPOINTS.ORDERS.CREATE, payload);
      return res.data;
    } catch (err) {
        console.error("Error creating order:", err);
      throw err;
    }

  },
};

export default OrdersService;