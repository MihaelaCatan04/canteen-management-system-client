import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button, Spin, Result } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { authService } from "../../services/AuthService";
import "./VerifyEmail.css";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("No verification token provided");
      return;
    }

    verifyEmail(token);
  }, [searchParams]);

  const verifyEmail = async (token) => {
    try {
      const data = await authService.verifyEmail(token);
      setStatus("success");
      setMessage(data?.message || "Email verified successfully!");
    } catch (error) {
      setStatus("error");
      const errorMessage =
        error?.response?.data?.error ||
        error?.message ||
        "Verification failed. The link may be invalid or expired.";
      setMessage(errorMessage);
    }
  };

  if (status === "loading") {
    return (
      <div className="verify-email-container">
        <div className="verify-email-content">
          <Spin size="large" />
          <p className="poppins-regular verify-loading-text">
            Verifying your email...
          </p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="verify-email-container">
        <Result
          icon={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
          title={<span className="poppins-medium">Email Verified!</span>}
          subTitle={
            <span className="poppins-regular">{message}</span>
          }
          extra={[
            <Button
              type="primary"
              size="large"
              key="login"
              onClick={() => navigate("/login")}
              className="poppins-medium"
            >
              Go to Login
            </Button>,
          ]}
        />
      </div>
    );
  }

  return (
    <div className="verify-email-container">
      <Result
        icon={<CloseCircleOutlined style={{ color: "#ff4d4f" }} />}
        title={<span className="poppins-medium">Verification Failed</span>}
        subTitle={<span className="poppins-regular">{message}</span>}
        extra={[
          <Button
            type="primary"
            size="large"
            key="resend"
            onClick={() => navigate("/resend-verification")}
            className="poppins-medium"
          >
            Resend Verification Email
          </Button>,
          <Button
            size="large"
            key="login"
            onClick={() => navigate("/login")}
            className="poppins-medium"
          >
            Back to Login
          </Button>,
        ]}
      />
    </div>
  );
};

export default VerifyEmail;
