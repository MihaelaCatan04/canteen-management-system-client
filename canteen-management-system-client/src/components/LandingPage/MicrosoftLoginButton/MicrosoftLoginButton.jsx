import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Alert } from "antd";
import { WindowsOutlined } from "@ant-design/icons";
import { useMicrosoftAuth } from "../../../hooks/useMicrosoftAuth";
import { authService } from "../../../services/AuthService";
import useAuth from "../../../hooks/useAuth";
import "./MicrosoftLoginButton.css";

const MicrosoftLoginButton = ({ disabled = false, text = "Sign in with Microsoft" }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, isLoading: msalLoading } = useMicrosoftAuth();
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const handleMicrosoftLogin = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Step 1: Login with Microsoft via MSAL popup
      const msalResponse = await login();
      
      if (!msalResponse?.accessToken) {
        setError("Failed to get Microsoft access token");
        setIsLoading(false);
        return;
      }

      // Step 2: Use the Microsoft token to authenticate with backend
      // This calls /users/me with the MS token - backend validates and returns user info
      await authService.authenticateWithMicrosoft(
        msalResponse.accessToken,
        setAuth
      );

      // Step 3: Navigate to main app on success
      navigate("/order", { replace: true });
    } catch (err) {
      console.error("Failed to complete Microsoft login:", err);
      // Handle user cancelled popup
      if (err.errorCode === "user_cancelled") {
        setError("Login was cancelled");
      } else {
        setError(err.message || "Failed to sign in with Microsoft");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="microsoft-login-container">
      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          closable
          onClose={() => setError("")}
          className="microsoft-error-alert"
        />
      )}
      <Button
        block
        size="large"
        className="microsoft-login-button poppins-medium"
        icon={<WindowsOutlined className="microsoft-icon" />}
        onClick={handleMicrosoftLogin}
        loading={isLoading || msalLoading}
        disabled={disabled || isLoading || msalLoading}
      >
        {text}
      </Button>
    </div>
  );
};

export default MicrosoftLoginButton;
