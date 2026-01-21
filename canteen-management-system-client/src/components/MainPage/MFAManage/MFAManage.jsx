import { useState } from "react";
import { Button, Typography, Input, Alert, Tabs, Space, Modal, Card } from "antd";
import { LockOutlined, KeyOutlined, SafetyOutlined, ExclamationCircleOutlined, ReloadOutlined } from "@ant-design/icons";
import { mfaService } from "../../../services/MFAService";
import "./MFAManage.css";

const { Title, Text, Paragraph } = Typography;
const { confirm } = Modal;

const MFAManage = ({ onDisableSuccess, onRegenerateSuccess }) => {
  const [activeTab, setActiveTab] = useState("disable");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [backupCodes, setBackupCodes] = useState([]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);

  const handleDisableMFAClick = () => {
    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    // Clear any previous errors
    setError("");

    // Show confirmation modal
    confirm({
      title: "Disable Two-Factor Authentication",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure you want to disable MFA? This will make your account less secure.",
      okText: "Yes, Disable MFA",
      okType: "danger",
      cancelText: "Cancel",
      centered: true,
      onOk: async () => {
        setLoading(true);
        try {
          const response = await mfaService.disableMFA(password);
          setPassword("");

          if (onDisableSuccess) {
            onDisableSuccess(response.message || "MFA has been disabled successfully");
          }
        } catch (err) {
          // Extract error message from various possible locations
          let errorMessage = "Failed to disable MFA";

          if (err.response?.data) {
            errorMessage = err.response.data.error ||
                          err.response.data.detail ||
                          err.response.data.message ||
                          err.message;
          } else if (err.message) {
            errorMessage = err.message;
          }

          // Show user-friendly error message for incorrect password
          if (errorMessage.toLowerCase().includes("invalid password") ||
              errorMessage.toLowerCase().includes("incorrect password")) {
            setError("Incorrect password. Please try again.");
          } else if (err.status === 400) {
            // HTTP 400 typically means invalid password for this endpoint
            setError("Incorrect password. Please try again.");
          } else {
            setError(errorMessage);
          }
        } finally {
          setLoading(false);
        }
      },
      onCancel: () => {
        // Keep the password if user cancels
      },
    });
  };

  const handleRegenerateBackupCodes = async () => {
    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await mfaService.regenerateBackupCodes(password);
      setBackupCodes(response.backup_codes || []);
      setShowBackupCodes(true);
      setPassword("");
      setError("");
    } catch (err) {
      // Extract error message from various possible locations
      let errorMessage = "Failed to regenerate backup codes";

      if (err.response?.data) {
        errorMessage = err.response.data.error ||
                      err.response.data.detail ||
                      err.response.data.message ||
                      err.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      // Show user-friendly error message for incorrect password
      if (errorMessage.toLowerCase().includes("invalid password") ||
          errorMessage.toLowerCase().includes("incorrect password")) {
        setError("Incorrect password. Please try again.");
      } else if (err.status === 400) {
        setError("Incorrect password. Please try again.");
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const downloadBackupCodes = () => {
    const text = backupCodes.join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "traygo-backup-codes.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleBackupCodesComplete = () => {
    setShowBackupCodes(false);
    setBackupCodes([]);
    if (onRegenerateSuccess) {
      onRegenerateSuccess("Backup codes regenerated successfully");
    }
  };

  const tabItems = [
    {
      key: "disable",
      label: (
        <span className="poppins-medium">
          <SafetyOutlined /> Disable MFA
        </span>
      ),
      children: (
        <div className="mfa-manage-tab-content">
          <div className="mfa-manage-description">
            <Alert
              message="Warning"
              description="Disabling two-factor authentication will make your account less secure. You will only need your password to log in."
              type="warning"
              showIcon
              className="mfa-manage-alert"
            />
          </div>

          {error && <Alert message={error} type="error" showIcon className="mfa-manage-alert" />}

          <div className="mfa-manage-form">
            <Text className="poppins-regular mfa-manage-label">
              Confirm your password to disable MFA:
            </Text>
            <Input.Password
              size="large"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onPressEnter={handleDisableMFAClick}
              prefix={<LockOutlined />}
              className="poppins-regular mfa-manage-input"
            />

            <Button
              type="primary"
              danger
              block
              size="large"
              onClick={handleDisableMFAClick}
              loading={loading}
              disabled={!password.trim()}
              className="poppins-medium mfa-manage-button"
            >
              Disable Two-Factor Authentication
            </Button>
          </div>
        </div>
      ),
    },
    {
      key: "regenerate",
      label: (
        <span className="poppins-medium">
          <ReloadOutlined /> Regenerate Codes
        </span>
      ),
      children: (
        <div className="mfa-manage-tab-content">
          {!showBackupCodes ? (
            <>
              <div className="mfa-manage-description">
                <Text className="poppins-regular mfa-manage-description-text">
                  Generate new backup codes for your account. Your old backup codes will no longer work.
                </Text>
              </div>

              <Alert
                message="Important"
                description="Regenerating backup codes will invalidate all previous backup codes. Make sure to save the new codes in a safe place."
                type="info"
                showIcon
                className="mfa-manage-alert"
              />

              {error && <Alert message={error} type="error" showIcon className="mfa-manage-alert" />}

              <div className="mfa-manage-form">
                <Text className="poppins-regular mfa-manage-label">
                  Confirm your password to regenerate backup codes:
                </Text>
                <Input.Password
                  size="large"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onPressEnter={handleRegenerateBackupCodes}
                  prefix={<LockOutlined />}
                  className="poppins-regular mfa-manage-input"
                />

                <Button
                  type="primary"
                  block
                  size="large"
                  onClick={handleRegenerateBackupCodes}
                  loading={loading}
                  disabled={!password.trim()}
                  className="poppins-medium mfa-manage-button"
                >
                  Regenerate Backup Codes
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="mfa-title-container">
                <KeyOutlined className="mfa-title-icon" />
                <Title level={4} className="poppins-medium2 mfa-manage-subtitle">
                  Your New Backup Codes
                </Title>
              </div>

              <Alert
                message="Important"
                description="Save these backup codes in a safe place. Each code can only be used once. Your old backup codes are no longer valid."
                type="warning"
                showIcon
                className="mfa-manage-alert"
              />

              <div className="backup-codes-container">
                {backupCodes.map((code, index) => (
                  <div key={index} className="backup-code poppins-semibold">
                    {code}
                  </div>
                ))}
              </div>

              <Space direction="vertical" style={{ width: '100%' }} size="large">
                <Button
                  type="primary"
                  block
                  size="large"
                  onClick={downloadBackupCodes}
                  className="poppins-medium mfa-manage-button"
                >
                  Download Codes
                </Button>

                <Button
                  block
                  size="large"
                  onClick={handleBackupCodesComplete}
                  className="poppins-medium mfa-done-button"
                >
                  Done
                </Button>
              </Space>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="mfa-manage-container">
      <div className="mfa-title-container">
        <KeyOutlined className="mfa-title-icon" />
        <Title level={3} className="poppins-medium2 mfa-title">
          Manage Two-Factor Authentication
        </Title>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        className="mfa-manage-tabs"
      />
    </div>
  );
};

export default MFAManage;
