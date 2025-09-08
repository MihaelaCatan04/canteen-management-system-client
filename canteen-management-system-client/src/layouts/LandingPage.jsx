import { Col, Row } from "antd";
import "./LandingPage.css";

const LandingPage = ({ left, right }) => {
  return (
    <Row className="row-container" justify="center" align="top">
      <Col xs={24} sm={24} md={15} lg={15} xl={15} className="col-container">
        {left}
      </Col>
      <Col xs={24} sm={24} md={9} lg={9} xl={9} className="col-container">
        {right}
      </Col>
    </Row>
  );
};

export default LandingPage;