import {
  EyeOutlined,
  LockOutlined,
  UserOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { Button, Col, Divider, Input, Row, Typography } from "antd";
import "./LogInForm.css";
import { useRef, useState, useEffect } from "react";
import axios from "../../../api/axios";
import { jwtDecode } from "jwt-decode";
import useAuth from "../../../hooks/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";
const LOGIN_URL = "/auth/login/";

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

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ email: user, password: pwd }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      const accessToken = response?.data?.access;
      const refreshToken = response?.data?.refresh;
      const user_id = jwtDecode(accessToken).user_id;
      const role = [jwtDecode(accessToken).role];
      console.log(role);
      setAuth({ user_id, accessToken, refreshToken, role });
      setUser("");
      setPwd("");
      navigate(from, { replace: true });
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.response?.status === 401) {
        setErrMsg("Invalid email or password");
      } else {
        setErrMsg("Login Failed");
      }
      errRef.current.focus();
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
          classNames={"login-input"}
          autoComplete="off"
          onChange={(e) => setPwd(e.target.value)}
          value={pwd}
          required
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
      >
        Create Account
      </Button>
    </>
  );
};

export default LogInForm;
