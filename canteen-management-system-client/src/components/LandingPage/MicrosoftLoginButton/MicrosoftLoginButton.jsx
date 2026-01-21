import { useState } from "react";
import { Button, Alert } from "antd";
import { WindowsOutlined } from "@ant-design/icons";
import { authService } from "../../../services/AuthService";
import "./MicrosoftLoginButton.css";

const MicrosoftLoginButton = ({ disabled = false, text = "Sign in with Microsoft" }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleMicrosoftLogin = async () => {
    setIsLoading(true);
    setError("");

    try {
      const data = await authService.getMicrosoftAuthUrl();

      if (data?.auth_url) {
        window.location.href = data.auth_url;
      } else {
        setError("Failed to get Microsoft login URL");
        setIsLoading(false);
      }
    } catch (err) {
      setError(err.message || "Failed to initiate Microsoft login");
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
        loading={isLoading}
        disabled={disabled || isLoading}
      >
        {text}
      </Button>
    </div>
  );
};

export default MicrosoftLoginButton;
