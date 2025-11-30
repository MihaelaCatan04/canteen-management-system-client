import React from "react";
import { Row, Col, Card, Typography } from "antd";
import AddBalanceForm from "../../components/AddBalance/AddBalanceForm";

const { Title } = Typography;

const AddBalancePage = () => {
  return (
    <Row justify="center">
      <Col xs={22} sm={20} md={16} lg={12} xl={10}>
        <Card style={{ marginTop: 24, borderRadius: 12 }}>
          <Title level={4}>Add Balance</Title>
          <AddBalanceForm />
        </Card>
      </Col>
    </Row>
  );
};

export default AddBalancePage;
