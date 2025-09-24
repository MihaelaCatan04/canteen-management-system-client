import axiosPublic, { axiosPrivate } from "../api/axios";

class HttpService {
  async publicPost(url, data, config = {}) {
    try {
      const response = await axiosPublic.post(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async publicGet(url, config = {}) {
    try {
      const response = await axiosPublic.get(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async privatePost(url, data, config = {}) {
    try {
      const response = await axiosPrivate.post(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async privateGet(url, config = {}) {
    try {
      const response = await axiosPrivate.get(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async privatePut(url, data, config = {}) {
    try {
      const response = await axiosPrivate.put(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async privateDelete(url, config = {}) {
    try {
      const response = await axiosPrivate.delete(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    const errorMessage = {
      message: error.message || "An error occurred",
      status: error.response?.status,
      data: error.response?.data,
    };

    console.error("HTTP Error:", errorMessage);

    return new Error(errorMessage.message);
  }

  setAuthToken(token) {
    if (token) {
      axiosPrivate.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axiosPrivate.defaults.headers.common["Authorization"];
    }
  }

  removeAuthToken() {
    delete axiosPrivate.defaults.headers.common["Authorization"];
  }
}

export const httpService = new HttpService();
