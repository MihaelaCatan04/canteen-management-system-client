import { Alert, Button } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import "./VerificationBanner.css";

const VerificationBanner = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();

  // Don't show if not authenticated or already verified
  if (!auth?.accessToken) return null;

  const isVerified = Boolean(auth?.isVerified ?? auth?.verified ?? false);

  if (isVerified) return null;

  return (
    <div className="verification-banner-wrapper">
      <Alert
        type="warning"
        showIcon
        icon={<MailOutlined />}
        message={
          <span className="poppins-medium verification-banner-message">
            Your email is not verified
          </span>
        }
        description={
          <span className="poppins-regular verification-banner-description">
            Some features are restricted until you verify your email.{" "}
            <Button
              type="link"
              className="verification-banner-link poppins-medium"
              onClick={() => navigate("/resend-verification")}
            >
              Resend verification email
            </Button>
          </span>
        }
        className="verification-banner"
      />
    </div>
  );
};

export default VerificationBanner;
