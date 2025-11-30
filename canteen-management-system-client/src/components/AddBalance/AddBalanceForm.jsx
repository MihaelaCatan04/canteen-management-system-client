import React from "react";
import { Card, Form, Input, InputNumber, Button, Select, Typography, Divider, Row, Col, message } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const currencies = [
  { label: "MDL", value: "MDL" },
  { label: "USD", value: "USD" },
];

const AddBalanceForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = (values) => {
    // Placeholder: in future we'll call Stripe + backend
    console.log("Add balance values:", values);
    message.success("Payment flow simulated — implement Stripe integration later.");
    // Go back to main page or balance
    navigate("/order");
  };

  const onFinishFailed = (err) => {
    console.error(err);
    message.error("Please fix the errors in the form.");
  };

  return (
    <Card style={{ borderRadius: 12 }}>
      <Title level={4} style={{ marginBottom: 8 }}>Add Money to Wallet</Title>
      <Text type="secondary">Enter the amount and card details to add funds to your wallet. This is a static form — Stripe integration will be added later.</Text>
      <Divider />

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        initialValues={{ currency: 'MDL', amount: 50 }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Amount" name="amount" rules={[{ required: true, message: "Enter an amount" }] }>
              <InputNumber min={1} style={{ width: "100%" }} addonBefore={null} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Currency" name="currency">
              <Select options={currencies} />
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        <Title level={5}>Card Details</Title>
        <Text type="secondary">This is a placeholder UI. We'll replace this with Stripe Elements later.</Text>

        <Row gutter={16} style={{ marginTop: 12 }}>
          <Col span={24}>
            <Form.Item label="Cardholder name" name="card_name" rules={[{ required: true }] }>
              <Input placeholder="Full name as on card" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="Card number" name="card_number" rules={[{ required: true, len: 16, message: 'Enter 16 digit card number' }] }>
              <Input placeholder="4242 4242 4242 4242" maxLength={19} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Expiry (MM/YY)" name="expiry" rules={[{ required: true }] }>
              <Input placeholder="MM/YY" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="CVC" name="cvc" rules={[{ required: true }] }>
              <Input placeholder="CVC" maxLength={4} />
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        <Form.Item>
          <Button type="primary" htmlType="submit" icon={<PlusCircleOutlined />}>Add funds</Button>
          <Button style={{ marginLeft: 12 }} onClick={() => navigate(-1)}>Cancel</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AddBalanceForm;
