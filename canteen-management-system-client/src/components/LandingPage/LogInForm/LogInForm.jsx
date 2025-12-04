import {
  EyeOutlined,
  LockOutlined,
  UserOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { Button, Col, Divider, Input, Row } from "antd";
import "./LogInForm.css";
import { useRef, useState, useEffect } from "react";
import useAuth from "../../../hooks/useAuth";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { authService } from "../../../services/AuthService";
import { jwtDecode } from "jwt-decode";
import MicrosoftLoginButton from "../MicrosoftLoginButton/MicrosoftLoginButton";

const LogInForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const from = location.state?.from?.pathname || "/order";
  const { setAuth } = useAuth();
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // mfa state
  const [requiresMFA, setRequiresMFA] = useState(false);
  const [mfaTicket, setMfaTicket] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [isMicrosoftMFA, setIsMicrosoftMFA] = useState(false);

  // check for mfa redirect from microsoft oauth or error params
  useEffect(() => {
    const mfaParam = searchParams.get("mfa");
    const ticketParam = searchParams.get("ticket");
    const errorParam = searchParams.get("error");

    // handle error from microsoft callback
    if (errorParam) {
      const errorMessages = {
        microsoft_auth_failed: "Microsoft authentication failed. Please try again.",
        no_token: "No authentication token received. Please try again.",
        callback_failed: "Failed to complete Microsoft login. Please try again."
      };
      setErrMsg(errorMessages[errorParam] || "An error occurred during login.");
    }

    // handle mfa redirect from microsoft oauth
    if (mfaParam === "true" && ticketParam) {
      setRequiresMFA(true);
      setMfaTicket(ticketParam);
      setIsMicrosoftMFA(true);
    }
  }, [searchParams]);

  useEffect(() => {
    userRef.current?.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd, mfaCode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await authService.login(user, pwd, setAuth);
      
      if (result.requiresMFA) {
        // mfa is required, show mfa input
        setRequiresMFA(true);
        setMfaTicket(result.mfaTicket);
        setIsMicrosoftMFA(false);
        setErrMsg(""); // clear any previous errors
      } else {
        // login successful without mfa
        setUser("");
        setPwd("");
        navigate(from, { replace: true });
      }
    } catch (err) {
      setErrMsg(err.message);
      errRef.current?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleMFASubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await authService.verifyMFA(mfaTicket, mfaCode, setAuth);
      
      // mfa verification successful
      setUser("");
      setPwd("");
      setMfaCode("");
      setRequiresMFA(false);
      setMfaTicket("");
      setIsMicrosoftMFA(false);
      
      // clear microsoft mfa pending flag
      sessionStorage.removeItem("microsoft_mfa_pending");
      
      navigate(from, { replace: true });
    } catch (err) {
      setErrMsg(err.message || "Invalid MFA code");
      errRef.current?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setRequiresMFA(false);
    setMfaTicket("");
    setMfaCode("");
    setErrMsg("");
    setIsMicrosoftMFA(false);
    
    // clear microsoft mfa pending flag and query params
    sessionStorage.removeItem("microsoft_mfa_pending");
    navigate("/login", { replace: true });
  };

  return (
    <>
      <p
        ref={errRef}
        className={errMsg ? "errmsg" : "offscreen"}
        aria-live="assertive"
      >
        {errMsg}
      </p>
      
      {!requiresMFA ? (
        // regular login form
        <form onSubmit={handleSubmit}>
          <label className="login-label poppins-regular" htmlFor="email">
            Email Address:
          </label>
          <Input
            size="large"
            placeholder="Email Address"
            prefix={<UserOutlined />}
            className="login-input"
            id="email"
            type="email"
            ref={userRef}
            autoComplete="on"
            onChange={(e) => setUser(e.target.value)}
            value={user}
            required
            disabled={isLoading}
          />
          <label className="login-label poppins-regular" htmlFor="password">
            Password:
          </label>
          <Input.Password
            size="large"
            placeholder="Password"
            prefix={<LockOutlined />}
            iconRender={(visible) =>
              visible ? <EyeOutlined /> : <EyeOutlined />
            }
            className="login-input"
            id="password"
            type="password"
            autoComplete="off"
            onChange={(e) => setPwd(e.target.value)}
            value={pwd}
            required
            disabled={isLoading}
          />
          <Row justify="start" className="login-row">
            <Col>
              <a href="#" className="forgot-link poppins-medium">
                Forgot password?
              </a>
            </Col>
          </Row>
          <Button
            type="primary"
            block
            size="large"
            className="login-button"
            icon={<UserOutlined className="account-icon-login" />}
            htmlType="submit"
            loading={isLoading}
          >
            Log In
          </Button>
          
          {/* microsoft oauth login */}
          <Divider className="poppins-regular">Or</Divider>
          <MicrosoftLoginButton disabled={isLoading} />
        </form>
      ) : (
        // mfa verification form
        <form onSubmit={handleMFASubmit}>
          {isMicrosoftMFA && (
            <p className="poppins-regular" style={{ marginBottom: '16px', color: '#666' }}>
              Your Microsoft account requires two-factor authentication.
            </p>
          )}
          <label className="login-label poppins-regular" htmlFor="mfa-code">
            Two-Factor Authentication Code:
          </label>
          <Input
            size="large"
            placeholder="Enter 6-digit code"
            prefix={<LockOutlined />}
            className="login-input"
            id="mfa-code"
            type="text"
            maxLength={8}
            autoComplete="off"
            onChange={(e) => setMfaCode(e.target.value)}
            value={mfaCode}
            required
            disabled={isLoading}
            autoFocus
          />
          <p className="poppins-regular" style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
            Enter the 6-digit code from your authenticator app or an 8-character backup code
          </p>
          <Button
            type="primary"
            block
            size="large"
            className="login-button"
            icon={<LockOutlined className="account-icon-login" />}
            htmlType="submit"
            loading={isLoading}
            disabled={mfaCode.length < 6}
          >
            Verify Code
          </Button>
          <Button
            block
            size="large"
            onClick={handleBackToLogin}
            disabled={isLoading}
            style={{ marginTop: '12px' }}
          >
            Back to Login
          </Button>
        </form>
      )}
      
      {!requiresMFA && (
        <>
          <Divider className="poppins-regular">Are you a new user?</Divider>
          <Button
            block
            size="large"
            icon={<UserAddOutlined className="create-account-icon-login" />}
            onClick={() => navigate("/register")}
            disabled={isLoading}
          >
            Create Account
          </Button>
        </>
      )}
    </>
  );
};

export default LogInForm;
