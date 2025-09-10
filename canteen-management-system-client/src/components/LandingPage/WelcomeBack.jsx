import { Col, Row, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import "./WelcomeBack.css";

const { Title, Text } = Typography;

const WelcomeBack = () => {
  return (
    <Col span={24} className="welcome-col">
      <Row justify="center" align="middle" className="welcome-row">
        <Col>
          <div className="icon-container">
            <UserOutlined className="icon" />
          </div>
        </Col>
      </Row>
      <Title level={2} className="poppins-bold">
        Welcome Back
      </Title>
      <Text className="poppins-regular">Sign in to your account</Text>
    </Col>
  );
};

export default WelcomeBack;
