import {
  EyeOutlined,
  LockOutlined,
  UserOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { Button, Col, Divider, Input, Row, Typography } from "antd";
import "./LogInForm.css";

const { Text } = Typography;

const LogInForm = () => {
  return (
    <>
      <label className="login-label poppins-regular" htmlFor="email">
        Email Address:
      </label>
      <Input
        size="large"
        placeholder="Email Address"
        prefix={<UserOutlined />}
        className="login-input"
        id="email"
      />
      <label className="login-label poppins-regular" htmlFor="password">
        Password:
      </label>
      <Input.Password
        size="large"
        placeholder="Password"
        prefix={<LockOutlined />}
        iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeOutlined />)}
        className="login-input"
        id="password"
      />
      <Row justify="start" className="login-row">
        <Col>
          <Text type="link" className="forgot-link poppins-medium">
            Forgot password?
          </Text>
        </Col>
      </Row>
      <Button
        type="primary"
        block
        size="large"
        className="login-button"
        icon={<UserOutlined className="account-icon" />}
      >
        Log In
      </Button>
      <Divider className="poppins-regular">Are you a new user?</Divider>
      <Button
        block
        size="large"
        icon={<UserAddOutlined className="create-account-icon" />}
      >
        Create Account
      </Button>
    </>
  );
};

export default LogInForm;
