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
    <div className="order-total-inner" style={{ maxWidth: 1100, margin: "24px auto" }}>
      <Card className="items-card" style={{ padding: 24 }}>
        <div className="order-total-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <Title level={4} className="poppins-bold" style={{ margin: 0 }}>Add Balance</Title>
          <Text className="poppins-medium" style={{ color: "#6b7280" }}>Secure payment</Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          initialValues={{ currency: 'MDL', amount: 50 }}
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item label={<span className="poppins-medium">Amount</span>} name="amount" rules={[{ required: true, message: "Enter an amount" }] }>
                <InputNumber min={1} style={{ width: "100%" }} addonBefore={null} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label={<span className="poppins-medium">Currency</span>} name="currency">
                <Select options={currencies} />
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          <Title level={5} className="poppins-medium" style={{ marginBottom: 8 }}>Card Details</Title>
          <Text type="secondary">This is a placeholder UI. We'll replace this with Stripe Elements later.</Text>

          <Row gutter={16} style={{ marginTop: 12 }}>
            <Col span={24}>
              <Form.Item label={<span className="poppins-medium">Cardholder name</span>} name="card_name" rules={[{ required: true }] }>
                <Input placeholder="Full name as on card" />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label={<span className="poppins-medium">Card number</span>} name="card_number" rules={[{ required: true, len: 16, message: 'Enter 16 digit card number' }] }>
                <Input placeholder="4242 4242 4242 4242" maxLength={19} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label={<span className="poppins-medium">Expiry (MM/YY)</span>} name="expiry" rules={[{ required: true }] }>
                <Input placeholder="MM/YY" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label={<span className="poppins-medium">CVC</span>} name="cvc" rules={[{ required: true }] }>
                <Input placeholder="CVC" maxLength={4} />
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 12 }}>
            <Button
              type="primary"
              htmlType="submit"
              icon={<PlusCircleOutlined />}
              style={{
                height: 48,
                borderRadius: "0.5rem",
                padding: "0 16px",
                fontWeight: 600,
              }}
            >
              Add funds
            </Button>
            <Button
              type="default"
              onClick={() => navigate(-1)}
              style={{
                height: 48,
                borderRadius: "0.5rem",
                padding: "0 16px",
                fontWeight: 600,
              }}
            >
              Cancel
            </Button>

            
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default AddBalanceForm;
