import { Col, Row, Typography } from "antd";

const { Text, Paragraph } = Typography;
import "./LandingPageRight.css";
import WelcomeBack from "./WelcomeBack";
import LogInForm from "./LogInForm";

const LandingPageRight = () => {
  return (
    <Row className="right-container" justify="center" align="middle">
      <Col span={24} style={{ maxWidth: "400px", width: "100%" }}>
        <WelcomeBack />
        <LogInForm />
        <Paragraph style={{ textAlign: "center", marginTop: "16px" }}>
          By signing in, you agree to our{" "}
          <Text type="link" style={{ color: "#3678eb" }}>Terms of Service</Text> and{" "}
          <Text type="link" style={{ color: "#3678eb" }}>Privacy Policy</Text>
        </Paragraph>
      </Col>
    </Row>
  );
};

export default LandingPageRight;
