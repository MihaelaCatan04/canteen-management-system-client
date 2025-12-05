import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Button, Input, Typography, Alert, Card, Result } from "antd";
import { LockOutlined, CheckCircleOutlined, CloseCircleOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { passwordService } from "../../services/PasswordService";
import { validatePassword, checkPasswordsMatch } from "../../utils/passwordValidation";
import "./ResetPassword.css";

const { Title, Text } = Typography;

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [tokenError, setTokenError] = useState(false);

  // validation states
  const [validNewPwd, setValidNewPwd] = useState(false);
  const [validMatch, setValidMatch] = useState(false);

  // focus states for showing instructions
  const [newPwdFocus, setNewPwdFocus] = useState(false);
  const [confirmPwdFocus, setConfirmPwdFocus] = useState(false);

  useEffect(() => {
    if (!token) {
      setTokenError(true);
    }
  }, [token]);

  // validate new password in real-time
  useEffect(() => {
    const validation = validatePassword(newPassword);
    setValidNewPwd(validation.isValid);
  }, [newPassword]);

  // validate password match in real-time
  useEffect(() => {
    const matchCheck = checkPasswordsMatch(newPassword, confirmPassword);
    setValidMatch(matchCheck.isEmpty || matchCheck.isValid);
  }, [newPassword, confirmPassword]);

  // clear errors when user types
  useEffect(() => {
    setError("");
    setFieldErrors({});
  }, [newPassword, confirmPassword]);

  const isFormValid = () => {
    return validNewPwd && confirmPassword.length > 0 && validMatch;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    if (!token) {
      setTokenError(true);
      return;
    }

    if (!validNewPwd) {
      setFieldErrors({ new_password: "Password does not meet requirements" });
      return;
    }

    if (!validMatch) {
      setFieldErrors({ confirm_new_password: "Passwords do not match" });
      return;
    }

    setLoading(true);
    try {
      await passwordService.confirmPasswordReset(token, newPassword, confirmPassword);
      setSuccess(true);
    } catch (err) {
      // handle specific error types
      if (err.message === "Invalid or expired token" ||
        err.data?.error === "Invalid or expired token") {
        setTokenError(true);
      } else if (err.status === 400) {
        const errorData = err.data || {};
        const newFieldErrors = {};

        if (errorData.new_password) {
          newFieldErrors.new_password = Array.isArray(errorData.new_password)
            ? errorData.new_password[0]
            : errorData.new_password;
        }
        if (errorData.confirm_new_password) {
          newFieldErrors.confirm_new_password = Array.isArray(errorData.confirm_new_password)
            ? errorData.confirm_new_password[0]
            : errorData.confirm_new_password;
        }

        if (Object.keys(newFieldErrors).length > 0) {
          setFieldErrors(newFieldErrors);
        } else if (errorData.error) {
          setError(errorData.error);
        } else {
          setError(err.message || "Failed to reset password");
        }
      } else {
        setError(err.message || "Failed to reset password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // invalid or expired token
  if (tokenError) {
    return (
      <div className="reset-password-container">
        <Result
          icon={<CloseCircleOutlined style={{ color: "#ff4d4f" }} />}
          title={<span className="poppins-medium">Invalid or Expired Link</span>}
          subTitle={
            <span className="poppins-regular">
              This password reset link is invalid or has expired. Please request a new one.
            </span>
          }
          extra={[
            <Button
              type="primary"
              size="large"
              key="forgot"
              onClick={() => navigate("/forgot-password")}
              className="poppins-medium"
            >
              Request New Link
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
          className="reset-password-result"
        />
      </div>
    );
  }

  // success state
  if (success) {
    return (
      <div className="reset-password-container">
        <Result
          icon={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
          title={<span className="poppins-medium">Password Reset Successfully</span>}
          subTitle={
            <span className="poppins-regular">
              Your password has been changed. You can now log in with your new password.
            </span>
          }
          extra={
            <Button
              type="primary"
              size="large"
              onClick={() => navigate("/login")}
              className="poppins-medium"
            >
              Go to Login
            </Button>
          }
          className="reset-password-result"
        />
      </div>
    );
  }

  return (
    <div className="reset-password-container">
      <Card className="reset-password-card">
        <div className="reset-password-header">
          <LockOutlined className="reset-password-header-icon" />
          <Title level={3} className="poppins-medium2 reset-password-title">
            Reset Password
          </Title>
          <Text className="poppins-regular reset-password-description">
            Enter your new password below
          </Text>
        </div>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            className="reset-password-alert"
          />
        )}

        <form onSubmit={handleSubmit}>
          <div className="reset-password-field">
            <label className="reset-password-label poppins-regular">
              New Password
              <span className={validNewPwd ? "valid" : "hide"}>
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span className={!validNewPwd && newPassword ? "invalid" : "hide"}>
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </label>
            <Input.Password
              size="large"
              placeholder="Enter new password"
              prefix={<LockOutlined />}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              onFocus={() => setNewPwdFocus(true)}
              onBlur={() => setNewPwdFocus(false)}
              disabled={loading}
              status={fieldErrors.new_password ? "error" : ""}
              className="poppins-regular"
            />
            <p
              className={newPwdFocus && !validNewPwd ? "instructions" : "offscreen"}
            >
              <FontAwesomeIcon icon={faInfoCircle} style={{ color: "#3678eb" }} />
              &nbsp; Password must include at least 8 characters, 1 uppercase
              letter, 1 lowercase letter, 1 number, and 1 special character (@$!%*?&).
            </p>
            {fieldErrors.new_password && (
              <Text type="danger" className="reset-password-field-error poppins-regular">
                {fieldErrors.new_password}
              </Text>
            )}
          </div>

          <div className="reset-password-field">
            <label className="reset-password-label poppins-regular">
              Confirm New Password
              <span className={validMatch && confirmPassword ? "valid" : "hide"}>
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span className={!validMatch && confirmPassword ? "invalid" : "hide"}>
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </label>
            <Input.Password
              size="large"
              placeholder="Confirm new password"
              prefix={<LockOutlined />}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onFocus={() => setConfirmPwdFocus(true)}
              onBlur={() => setConfirmPwdFocus(false)}
              disabled={loading}
              status={fieldErrors.confirm_new_password || (!validMatch && confirmPassword) ? "error" : ""}
              className="poppins-regular"
            />
            <p
              className={confirmPwdFocus && !validMatch ? "instructions" : "offscreen"}
            >
              <FontAwesomeIcon icon={faInfoCircle} style={{ color: "#3678eb" }} />
              &nbsp; Passwords must match.
            </p>
            {fieldErrors.confirm_new_password && (
              <Text type="danger" className="reset-password-field-error poppins-regular">
                {fieldErrors.confirm_new_password}
              </Text>
            )}
          </div>

          <Button
            type="primary"
            block
            size="large"
            htmlType="submit"
            loading={loading}
            disabled={!isFormValid()}
            className="poppins-medium reset-password-button"
          >
            Reset Password
          </Button>
        </form>

        <div className="reset-password-back-link">
          <Link to="/login" className="poppins-medium">
            <ArrowLeftOutlined /> Back to Login
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default ResetPassword;
