import axiosPublic, { axiosPrivate } from "../api/axios";

export class HttpService {
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
    // Extract error message from backend response
    let message = "An error occurred";
    
    if (error.response?.data) {
      // Handle different error response formats from backend
      if (typeof error.response.data === 'string') {
        message = error.response.data;
      } else if (error.response.data.detail) {
        message = error.response.data.detail;
      } else if (error.response.data.error) {
        message = error.response.data.error;
      } else if (error.response.data.message) {
        message = error.response.data.message;
      } else if (error.response.data.non_field_errors) {
        message = Array.isArray(error.response.data.non_field_errors)
          ? error.response.data.non_field_errors[0]
          : error.response.data.non_field_errors;
      } else {
        // Try to get first field error
        const firstFieldError = Object.values(error.response.data)[0];
        if (firstFieldError) {
          message = Array.isArray(firstFieldError) ? firstFieldError[0] : firstFieldError;
        }
      }
    } else if (error.message) {
      message = error.message;
    }

    const errorInfo = {
      message,
      status: error.response?.status,
      data: error.response?.data,
    };

    console.error("HTTP Error:", errorInfo);

    const err = new Error(message);
    err.status = error.response?.status;
    err.data = error.response?.data;
    return err;
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
