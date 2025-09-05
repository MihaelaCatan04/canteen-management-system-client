import { Col, Row } from "antd";
import React from "react";
import { useEffect } from "react";
import "./LandingPage.css";

const LandingPage = ({ left, right }) => {
  return (
    <Row className="row-container" justify="center" align="top">
      <Col span={15} className="col-container">
        {left}
      </Col>
      <Col span={9} className="col-container">
        {right}
      </Col>
    </Row>
  );
};

export default LandingPage;
