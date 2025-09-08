import {
  EyeOutlined,
  LockOutlined,
  UserOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { Button, Col, Divider, Input, Row, Typography } from "antd";
import "./SignUpForm.css";

const { Text } = Typography;

const SignUpForm = () => {
    return (
        <>
      <label className="signup-label poppins-regular" htmlFor="email">
        Email Address:
      </label>
      <Input
        size="large"
        placeholder="Email Address"
        prefix={<UserOutlined />}
        className="data-input"
        id="email"
        required
      />
      <label className="signup-label poppins-regular" htmlFor="password">
        Password:
      </label>
      <Input.Password
        size="large"
        placeholder="Password"
        prefix={<LockOutlined />}
        iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeOutlined />)}
        className="data-input"
        id="password"
        required
      />
      <label className="signup-label poppins-regular" htmlFor="confirm-password">
        Confirm Password:
      </label>
      <Input.Password
        size="large"
        placeholder="Password"
        prefix={<LockOutlined />}
        iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeOutlined />)}
        className="data-input"
        id="confirm-password"
        required
      />
      <Row justify="start" className="signup-row">
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
        className="signup-button"
        icon={<UserOutlined className="create-account-icon" />}
      >
        Log In
      </Button>
      <Divider className="poppins-regular">Are you an existing user?</Divider>
      <Button
        block
        size="large"
        icon={<UserAddOutlined className="account-icon" />}
      >
        Log In
      </Button>
    </>
    );
}
 
export default SignUpForm;