import { useState, useEffect } from "react";
import { Button, Typography, Input, Alert, Space, Image } from "antd";
import { CopyOutlined, CheckCircleOutlined, LockOutlined, KeyOutlined } from "@ant-design/icons";
import { mfaService } from "../../../services/MFAService";
import "./MFASetup.css";

const { Title, Text, Paragraph } = Typography;

const MFASetup = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [qrCode, setQrCode] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [backupCodes, setBackupCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedSecret, setCopiedSecret] = useState(false);

  useEffect(() => {
    startSetup();
  }, []);

  const startSetup = async () => {
    setLoading(true);
    try {
      const data = await mfaService.startMFASetup();
      console.log("MFA Setup Response:", data);
      const qrCodeData = data.qr_code.startsWith('data:image')
        ? data.qr_code
        : `data:image/png;base64,${data.qr_code}`;
      setQrCode(qrCodeData);
      const secret = data.manual_key || "";
      setSecretKey(secret);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to start MFA setup");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await mfaService.confirmMFASetup(verificationCode);
      setBackupCodes(data.backup_codes);
      setStep(3);
    } catch (err) {
      setError(err.message || "Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  const copySecret = () => {
    navigator.clipboard.writeText(secretKey);
    setCopiedSecret(true);
    setTimeout(() => setCopiedSecret(false), 2000);
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

  return (
    <div className="mfa-setup-container">
      {step === 1 && (
        <>
          <div className="mfa-title-container">
            <KeyOutlined className="mfa-title-icon" />
            <Title level={3} className="poppins-medium2 mfa-title">
              Set Up Multi-Factor Authentication
            </Title>
          </div>
          <div className="mfa-description">
            <Text className="poppins-regular mfa-description-text">
              Scan this QR code with your authenticator app
            </Text>
            <Text className="poppins-regular mfa-description-subtext">
              (Google Authenticator, Authy, etc.)
            </Text>
          </div>

          {error && <Alert message={error} type="error" showIcon className="mfa-alert" />}

          {qrCode && (
            <div className="mfa-qr-container">
              <Image 
                src={qrCode} 
                alt="MFA QR Code" 
                preview={false} 
                className="mfa-qr-image"
              />
            </div>
          )}

          <Text className="poppins-regular mfa-manual-label">
            Or enter this code manually:
          </Text>
          <Space.Compact className="mfa-secret-input">
            <Input value={secretKey} readOnly className="poppins-regular" />
            <Button
              icon={copiedSecret ? <CheckCircleOutlined /> : <CopyOutlined />}
              onClick={copySecret}
              className="poppins-regular"
            >
              {copiedSecret ? "Copied!" : "Copy"}
            </Button>
          </Space.Compact>

          <Button 
            type="primary" 
            block 
            size="large" 
            onClick={() => setStep(2)} 
            loading={loading}
            className="poppins-medium mfa-button"
          >
            Next
          </Button>
        </>
      )}

      {step === 2 && (
        <>
          <div className="mfa-title-container">
            <KeyOutlined className="mfa-title-icon" />
            <Title level={3} className="poppins-medium2 mfa-title">
              Verify Your Setup
            </Title>
          </div>
          <div className="mfa-description">
            <Text className="poppins-regular mfa-description-text">
              Enter the 6-digit code from your authenticator app
            </Text>
          </div>

          {error && <Alert message={error} type="error" showIcon className="mfa-alert" />}

          <Input
            size="large"
            placeholder="000000"
            maxLength={6}
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            prefix={<LockOutlined />}
            className="poppins-regular mfa-code-input"
          />

          <Button
            type="primary"
            block
            size="large"
            onClick={handleVerify}
            loading={loading}
            disabled={verificationCode.length !== 6}
            className="poppins-medium mfa-button"
          >
            Verify & Enable
          </Button>
        </>
      )}

      {step === 3 && (
        <>
          <div className="mfa-title-container">
            <KeyOutlined className="mfa-title-icon" />
            <Title level={3} className="poppins-medium2 mfa-title">
              Save Your Backup Codes
            </Title>
          </div>
          <Alert
            message="Important"
            description="Save these backup codes in a safe place. Each code can only be used once."
            type="warning"
            showIcon
            className="mfa-alert"
          />

          <div className="backup-codes-container">
            {backupCodes.map((code, index) => (
              <div key={index} className="backup-code poppins-medium">
                {code}
              </div>
            ))}
          </div>

          <Button
            type="primary"
            block
            size="large"
            onClick={downloadBackupCodes}
            className="poppins-medium mfa-button"
          >
            Download Codes
          </Button>

          <Button 
            block 
            size="large" 
            onClick={onComplete}
            className="poppins-medium mfa-done-button"
          >
            Done
          </Button>
        </>
      )}
    </div>
  );
};

export default MFASetup;
