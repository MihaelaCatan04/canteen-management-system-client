import axios from "../api/axios";
import useAuth from "./useAuth";
import { jwtDecode } from "jwt-decode";

const useRefreshToken = () => {
  const { setAuth } = useAuth();
  const refresh = async () => {
    const response = await axios.post("/auth/refresh/cookie/", {}, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    const accessToken = response?.data?.access;
    const decoded = jwtDecode(accessToken);
    setAuth((prev) => ({
      ...prev,
      accessToken,
      user_id: decoded.user_id,
      role: [decoded.role],
    }));
    return accessToken;
  };
  return refresh;
};

export default useRefreshToken;