import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { InteractionStatus } from "@azure/msal-browser";
import { loginRequest, apiRequest } from "../config/msalConfig";

export function useMicrosoftAuth() {
  const { instance, accounts, inProgress } = useMsal();
  const isMsAuthenticated = useIsAuthenticated();

  const login = async () => {
    try {
      const response = await instance.loginPopup(loginRequest);
      return response;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const loginRedirect = async () => {
    try {
      await instance.loginRedirect(loginRequest);
    } catch (error) {
      console.error("Login redirect failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await instance.logoutPopup();
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  };

  const getAccessToken = async () => {
    if (!accounts[0]) return null;

    try {
      const response = await instance.acquireTokenSilent({
        ...apiRequest,
        account: accounts[0],
      });
      return response.accessToken;
    } catch (error) {
      // If silent token acquisition fails, try interactive
      try {
        const response = await instance.acquireTokenPopup(apiRequest);
        return response.accessToken;
      } catch (interactiveError) {
        console.error("Token acquisition failed:", interactiveError);
        return null;
      }
    }
  };

  const user = accounts[0]
    ? {
        email: accounts[0].username,
        name: accounts[0].name,
      }
    : null;

  return {
    isMsAuthenticated,
    isLoading: inProgress !== InteractionStatus.None,
    user,
    accounts,
    login,
    loginRedirect,
    logout,
    getAccessToken,
  };
}
