import { Col, Row, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import React from "react";

const { Title, Text } = Typography;
import "./WelcomeBack.css";

const WelcomeBack = () => {
  return (
    <Col span={24} style={{ textAlign: "center", padding: "60px" }}>
      <Row justify="center" align="middle" style={{ marginBottom: "20px" }}>
        <Col>
          <div className="icon-container">
            <UserOutlined className="icon" />
          </div>
        </Col>
      </Row>
      <Title level={2} className="poppins-bold">Welcome Back</Title>
      <Text className="poppins-regular">Sign in to your account</Text>
    </Col>
  );
};

export default WelcomeBack;
