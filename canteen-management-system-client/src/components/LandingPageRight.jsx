import { Col, Row, Typography } from "antd";
import "./LandingPageRight.css";
import SignUp from "./SignUp";
import LogIn from "./LogIn";
import { useLocation } from "react-router-dom";

const LandingPageRight = () => {
  
  const location = useLocation();
  const isRegisterPage = location.pathname === "/register";
  return (
    <Row className="right-container" justify="center" align="middle">
      <Col xs={22} sm={20} md={24} className="right-col">
        {isRegisterPage ? <SignUp /> : <LogIn />}
      </Col>
    </Row>
  );
};

export default LandingPageRight;
