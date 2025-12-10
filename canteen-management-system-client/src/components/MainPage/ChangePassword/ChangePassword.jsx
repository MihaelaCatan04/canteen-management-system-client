import { useState, useEffect } from "react";
import { Button, Typography, Input, Alert } from "antd";
import { LockOutlined, KeyOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { passwordService } from "../../../services/PasswordService";
import {
  validatePassword,
  checkPasswordsMatch,
  checkNewPasswordDifferent,
} from "../../../utils/passwordValidation";
import "./ChangePassword.css";

const { Title, Text } = Typography;

const ChangePassword = ({ onComplete }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState(false);

  // validation states
  const [validNewPwd, setValidNewPwd] = useState(false);
  const [validMatch, setValidMatch] = useState(false);
  const [validDifferent, setValidDifferent] = useState(true);
  
  // focus states for showing instructions
  const [newPwdFocus, setNewPwdFocus] = useState(false);
  const [confirmPwdFocus, setConfirmPwdFocus] = useState(false);

  // validate new password in real-time
  useEffect(() => {
    const validation = validatePassword(newPassword);
    setValidNewPwd(validation.isValid);
    
    // also check if new password is different from old
    const differentCheck = checkNewPasswordDifferent(oldPassword, newPassword);
    setValidDifferent(differentCheck.isEmpty || differentCheck.isValid);
  }, [newPassword, oldPassword]);

  // validate password match in real-time
  useEffect(() => {
    const matchCheck = checkPasswordsMatch(newPassword, confirmPassword);
    setValidMatch(matchCheck.isEmpty || matchCheck.isValid);
  }, [newPassword, confirmPassword]);

  // clear general error when user types
  useEffect(() => {
    setError("");
    setFieldErrors({});
  }, [oldPassword, newPassword, confirmPassword]);

  const isFormValid = () => {
    return (
      oldPassword.length > 0 &&
      validNewPwd &&
      validDifferent &&
      confirmPassword.length > 0 &&
      validMatch
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    // final validation check
    if (!oldPassword) {
      setFieldErrors({ old_password: "Please enter your current password" });
      return;
    }

    if (!validNewPwd) {
      setFieldErrors({ new_password: "Password does not meet requirements" });
      return;
    }

    if (!validDifferent) {
      setFieldErrors({ new_password: "New password must be different from current password" });
      return;
    }

    if (!validMatch) {
      setFieldErrors({ confirm_new_password: "Passwords do not match" });
      return;
    }

    setLoading(true);
    try {
      await passwordService.changePassword(oldPassword, newPassword, confirmPassword);
      setSuccess(true);
      // clear form
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      // handle field-specific errors from backend
      if (err.status === 400) {
        const errorData = err.data || {};
        const newFieldErrors = {};

        if (errorData.old_password) {
          newFieldErrors.old_password = Array.isArray(errorData.old_password)
            ? errorData.old_password[0]
            : errorData.old_password;
        }
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
        } else {
          setError(err.message || "Failed to change password");
        }
      } else {
        setError(err.message || "Failed to change password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDone = () => {
    setSuccess(false);
    onComplete?.();
  };

  if (success) {
    return (
      <div className="change-password-container">
        <div className="change-password-title-container">
          <KeyOutlined className="change-password-title-icon" />
          <Title level={3} className="poppins-medium2 change-password-title">
            Password Changed
          </Title>
        </div>
        <Alert
          message="Success"
          description="Your password has been changed successfully."
          type="success"
          showIcon
          className="change-password-alert"
        />
        <Button
          type="primary"
          block
          size="large"
          onClick={handleDone}
          className="poppins-medium change-password-button"
        >
          Done
        </Button>
      </div>
    );
  }

  return (
    <div className="change-password-container">
      <div className="change-password-title-container">
        <KeyOutlined className="change-password-title-icon" />
        <Title level={3} className="poppins-medium2 change-password-title">
          Change Password
        </Title>
      </div>
      <div className="change-password-description">
        <Text className="poppins-regular change-password-description-text">
          Enter your current password and choose a new one
        </Text>
      </div>

      {error && <Alert message={error} type="error" showIcon className="change-password-alert" />}

      <form onSubmit={handleSubmit}>
        <div className="change-password-field">
          <label className="change-password-label poppins-regular">
            Current Password
          </label>
          <Input.Password
            size="large"
            placeholder="Enter current password"
            prefix={<LockOutlined />}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            disabled={loading}
            status={fieldErrors.old_password ? "error" : ""}
            className="poppins-regular"
          />
          {fieldErrors.old_password && (
            <Text type="danger" className="change-password-field-error poppins-regular">
              {fieldErrors.old_password}
            </Text>
          )}
        </div>

        <div className="change-password-field">
          <label className="change-password-label poppins-regular">
            New Password
            <span className={validNewPwd && validDifferent ? "valid" : "hide"}>
              <FontAwesomeIcon icon={faCheck} />
            </span>
            <span className={(!validNewPwd || !validDifferent) && newPassword ? "invalid" : "hide"}>
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
            status={fieldErrors.new_password || (!validDifferent && newPassword) ? "error" : ""}
            className="poppins-regular"
          />
          <p
            className={newPwdFocus && !validNewPwd ? "instructions" : "offscreen"}
          >
            <FontAwesomeIcon icon={faInfoCircle} style={{ color: "#3678eb" }} />
            &nbsp; Password must include at least 8 characters, 1 uppercase
            letter, 1 lowercase letter, 1 number, and 1 special character (@$!%*?&).
          </p>
          {!validDifferent && newPassword && !newPwdFocus && (
            <Text type="danger" className="change-password-field-error poppins-regular">
              New password must be different from current password
            </Text>
          )}
          {fieldErrors.new_password && (
            <Text type="danger" className="change-password-field-error poppins-regular">
              {fieldErrors.new_password}
            </Text>
          )}
        </div>

        <div className="change-password-field">
          <label className="change-password-label poppins-regular">
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
            <Text type="danger" className="change-password-field-error poppins-regular">
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
          className="poppins-medium change-password-button"
        >
          Change Password
        </Button>
      </form>
    </div>
  );
};

export default ChangePassword;
