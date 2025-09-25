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
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "../../../services/AuthService";

const LogInForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/order";
  const { setAuth } = useAuth();
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    userRef.current?.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const authData = await authService.login(user, pwd);

      setAuth(authData);
      setUser("");
      setPwd("");
      navigate(from, { replace: true });
    } catch (err) {
      setErrMsg(err.message);
      errRef.current?.focus();
    } finally {
      setIsLoading(false);
    }
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
      </form>
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
  );
};

export default LogInForm;
