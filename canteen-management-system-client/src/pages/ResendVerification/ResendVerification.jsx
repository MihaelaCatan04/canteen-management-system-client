import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Result } from "antd";
import { MailOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { authService } from "../../services/AuthService";
import "./ResendVerification.css";

const ResendVerification = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // 'idle' | 'loading' | 'success' | 'error'
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessage("Please enter your email address");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      await authService.resendVerification(email);
      setStatus("success");
      setMessage(
        "If an account exists with this email, a verification link has been sent."
      );
    } catch (error) {
      // Check if email is already verified (400 status)
      if (error?.response?.status === 400) {
        setStatus("error");
        setMessage(
          error?.response?.data?.message || "Email is already verified"
        );
      } else {
        setStatus("success");
        // Return success message for security (prevent email enumeration)
        setMessage(
          "If an account exists with this email, a verification link has been sent."
        );
      }
    }
  };

  if (status === "success") {
    return (
      <div className="resend-verification-container">
        <Result
          icon={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
          title={<span className="poppins-medium">Email Sent!</span>}
          subTitle={<span className="poppins-regular">{message}</span>}
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
    <div className="resend-verification-container">
      <div className="resend-verification-card">
        <div className="resend-verification-header">
          <MailOutlined className="resend-icon" />
          <h1 className="poppins-medium resend-title">
            Resend Verification Email
          </h1>
          <p className="poppins-regular resend-subtitle">
            Enter your email address and we'll send you a new verification link.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="resend-form">
          <Input
            type="email"
            size="large"
            placeholder="Enter your email"
            prefix={<MailOutlined />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "loading"}
            className="resend-input"
          />

          {status === "error" && message && (
            <p className="resend-error poppins-regular">{message}</p>
          )}

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={status === "loading"}
            className="resend-button poppins-medium"
          >
            {status === "loading" ? "Sending..." : "Resend Verification Email"}
          </Button>

          <Button
            type="link"
            onClick={() => navigate("/login")}
            className="back-link poppins-regular"
          >
            Back to Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResendVerification;
