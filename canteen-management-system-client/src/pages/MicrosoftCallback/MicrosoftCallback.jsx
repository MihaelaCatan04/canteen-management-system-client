import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Spin, Typography, Alert } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import useAuth from "../../hooks/useAuth";
import { authService } from "../../services/AuthService";
import "./MicrosoftCallback.css";

const { Title, Text } = Typography;

const MicrosoftCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [status, setStatus] = useState("processing"); // processing, success, error
  const [message, setMessage] = useState("Processing Microsoft login...");
  const processedRef = useRef(false);

  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;

    const handleCallback = async () => {
      try {
        const accessToken = searchParams.get("access_token");
        const errorParam = searchParams.get("error");
        const errorDescription = searchParams.get("error_description");
        const mfaTicket = searchParams.get("ticket");
        const mfaType = searchParams.get("type");

        // Handle MFA redirect from backend
        if (mfaTicket) {
          sessionStorage.setItem("microsoft_mfa_pending", "true");
          sessionStorage.setItem("mfa_ticket", mfaTicket);
          sessionStorage.setItem("mfa_type", mfaType || "totp");
          navigate("/login?mfa=microsoft", { replace: true });
          return;
        }

        // Handle error from Microsoft or backend
        if (errorParam) {
          console.error("Microsoft auth error:", errorParam, errorDescription);
          setStatus("error");
          setMessage(errorDescription || errorParam || "Authentication failed");
          setTimeout(() => {
            navigate("/login", { replace: true });
          }, 3000);
          return;
        }

        // Handle success - process the access token
        if (accessToken) {
          setMessage("Completing login...");
          await authService.processMicrosoftCallback(accessToken, setAuth);
          
          sessionStorage.removeItem("oauth_state");
          sessionStorage.removeItem("microsoft_mfa_pending");
          
          setStatus("success");
          setMessage("Login successful! Redirecting...");
          
          setTimeout(() => {
            navigate("/order", { replace: true });
          }, 1000);
          return;
        }

        // No token and no error - unexpected state
        setStatus("error");
        setMessage("No access token received from Microsoft");
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 3000);
      } catch (err) {
        console.error("Failed to process Microsoft callback:", err);
        setStatus("error");
        setMessage(err.message || "Failed to complete Microsoft login");
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate, setAuth]);

  return (
    <div className="microsoft-callback-container">
      <div className="callback-card">
        <Title level={2} className="callback-title poppins-bold">
          TrayGo
        </Title>
        
        {status === "processing" && (
          <div className="callback-content">
            <Spin size="large" />
            <Text className="callback-message poppins-regular">{message}</Text>
          </div>
        )}

        {status === "success" && (
          <div className="callback-content">
            <CheckCircleOutlined className="callback-icon success" />
            <Text className="callback-message poppins-regular">{message}</Text>
          </div>
        )}

        {status === "error" && (
          <div className="callback-content">
            <CloseCircleOutlined className="callback-icon error" />
            <Alert
              message="Authentication Failed"
              description={message}
              type="error"
              showIcon={false}
              className="callback-alert"
            />
            <Text className="callback-redirect poppins-regular">
              Redirecting to login page...
            </Text>
          </div>
        )}
      </div>
    </div>
  );
};

export default MicrosoftCallback;
