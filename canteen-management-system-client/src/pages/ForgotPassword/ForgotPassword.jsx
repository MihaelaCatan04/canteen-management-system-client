import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button, Input, Typography, Alert, Card } from "antd";
import { MailOutlined, CheckCircleOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { passwordService } from "../../services/PasswordService";
import "./ForgotPassword.css";

const { Title, Text } = Typography;

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      await passwordService.requestPasswordReset(email);
      setSubmitted(true);
    } catch (err) {
      // always show success to prevent email enumeration (security best practice)
      // but if there's a network error, show it
      if (err.status === undefined || err.status >= 500) {
        setError("Something went wrong. Please try again.");
      } else {
        // for 400 errors, still show success to prevent enumeration
        setSubmitted(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTryDifferentEmail = () => {
    setSubmitted(false);
    setEmail("");
    setError("");
  };

  if (submitted) {
    return (
      <div className="forgot-password-container">
        <Card className="forgot-password-card">
          <div className="forgot-password-success">
            <CheckCircleOutlined className="forgot-password-success-icon" />
            <Title level={3} className="poppins-medium2 forgot-password-success-title">
              Check Your Email
            </Title>
            <Text className="poppins-regular forgot-password-success-text">
              We've sent a password reset link to <strong>{email}</strong>.
            </Text>
            <Text className="poppins-regular forgot-password-success-subtext">
              The link will expire in 1 hour.
            </Text>
            <div className="forgot-password-success-actions">
              <Button
                type="primary"
                size="large"
                onClick={() => navigate("/login")}
                className="poppins-medium"
              >
                Back to Login
              </Button>
              <Button
                size="large"
                onClick={handleTryDifferentEmail}
                className="poppins-medium"
              >
                Try Different Email
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="forgot-password-container">
      <Card className="forgot-password-card">
        <div className="forgot-password-header">
          <MailOutlined className="forgot-password-header-icon" />
          <Title level={3} className="poppins-medium2 forgot-password-title">
            Forgot Password
          </Title>
          <Text className="poppins-regular forgot-password-description">
            Enter your email and we'll send you a reset link
          </Text>
        </div>

        {error && (
          <Alert 
            message={error} 
            type="error" 
            showIcon 
            className="forgot-password-alert" 
          />
        )}

        <form onSubmit={handleSubmit}>
          <div className="forgot-password-field">
            <label className="forgot-password-label poppins-regular">
              Email Address
            </label>
            <Input
              size="large"
              placeholder="Enter your email"
              prefix={<MailOutlined />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              type="email"
              className="poppins-regular"
            />
          </div>

          <Button
            type="primary"
            block
            size="large"
            htmlType="submit"
            loading={loading}
            className="poppins-medium forgot-password-button"
          >
            Send Reset Link
          </Button>
        </form>

        <div className="forgot-password-back-link">
          <Link to="/login" className="poppins-medium">
            <ArrowLeftOutlined /> Back to Login
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default ForgotPassword;
