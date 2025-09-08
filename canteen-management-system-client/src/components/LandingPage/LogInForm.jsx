import {
  EyeOutlined,
  LockOutlined,
  UserOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { Button, Col, Divider, Input, Row, Typography } from "antd";
import "./LogInForm.css";
import { useRef, useState, useEffect, useContext } from "react";
import AuthContext from "../../context/AuthProvider";
import { useNavigate } from "react-router-dom";


const LogInForm = () => {
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(user, pwd);
    setUser("");
    setPwd("");
    setSuccess(true);
  };
  return (
    <>
      {success ? (
        <section>
          <h1>Success!</h1>
        </section>
      ) : (
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
              icon={<UserOutlined className="account-icon" />}
              htmlType="submit"
            >
              Log In
            </Button>
          </form>
          <Divider className="poppins-regular">Are you a new user?</Divider>
          <Button
            block
            size="large"
            icon={<UserAddOutlined className="create-account-icon" />}
            onClick={() => navigate("/register")}
          >
            Create Account
          </Button>
        </>
      )}
    </>
  );
};

export default LogInForm;
