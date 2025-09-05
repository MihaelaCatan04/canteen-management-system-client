import { EyeOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Col, Divider, Input, Row, Typography } from "antd";
const { Text } = Typography;
import { UserAddOutlined } from "@ant-design/icons";

const LogInForm = () => {
  return (
    <>
      <Input
        size="large"
        placeholder="Email Address"
        prefix={<UserOutlined />}
        style={{ marginBottom: "16px" }}
      />
      <Input.Password
        size="large"
        placeholder="Password"
        prefix={<LockOutlined />}
        iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeOutlined />)}
        style={{ marginBottom: "16px" }}
      />
      <Row justify="start" style={{ marginBottom: "16px" }}>
        <Col>
          <Text type="link">Forgot password?</Text>
        </Col>
      </Row>
      <Button
        type="primary"
        block
        size="large"
        style={{ marginBottom: "16px" }}
      >
        Log In
      </Button>
      <Divider>Are you a new user?</Divider>
      <Button
        block
        size="large"
        icon={
          <span style={{ color: "#3678eb" }}>
            <UserAddOutlined />
          </span>
        }
      >
        Create Account
      </Button>
    </>
  );
};

export default LogInForm;
