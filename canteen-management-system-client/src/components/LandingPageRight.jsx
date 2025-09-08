import { Col, Row, Typography } from "antd";
import "./LandingPageRight.css";
import SignUp from "./SignUp";
import LogIn from "./LogIn";

const LandingPageRight = () => {
  return (
    <Row className="right-container" justify="center" align="middle">
      <Col xs={22} sm={20} md={24} className="right-col">
        {/* <SignUp /> */}
        <LogIn />
      </Col>
    </Row>
  );
};

export default LandingPageRight;
