import { httpService } from "./HttpService";
import { API_ENDPOINTS } from "../api/API_ENDPOINTS";
import { jwtDecode } from "jwt-decode";

export class MenuService {
  async getMenu(weekOffset = 0) {
    try {
      const data = await httpService.privateGet(API_ENDPOINTS.MENU.LIST, {
        params: { weekOffset },
      });
      console.log("Menu data:", data);
      return data;
    } catch (error) {
      throw new Error("Failed to fetch menu");
    }
  }
}
