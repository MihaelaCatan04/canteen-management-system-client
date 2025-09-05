import { Col, Row, Typography } from "antd";
import "./LandingPageRight.css";
import WelcomeBack from "./WelcomeBack";
import LogInForm from "./LogInForm";

const { Text, Paragraph } = Typography;

const LandingPageRight = () => {
  return (
    <Row className="right-container" justify="center" align="middle">
      <Col span={24} className="right-col">
        <WelcomeBack />
        <LogInForm />
        <Paragraph className="signin-paragraph poppins-regular">
          By signing in, you agree to our{" "}
          <Text type="link" className="signin-link">Terms of Service</Text> and{" "}
          <Text type="link" className="signin-link">Privacy Policy</Text>
        </Paragraph>
      </Col>
    </Row>
  );
};

export default LandingPageRight;
