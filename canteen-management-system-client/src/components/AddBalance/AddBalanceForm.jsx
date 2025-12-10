import React, { useState } from "react";
import { Card, Form, InputNumber, Button, Typography, Divider, Row, Col, message, Spin } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { walletsService } from "../../services/WalletsService";

const { Title, Text } = Typography;

// Initialize Stripe with your publishable key
const stripePromise = loadStripe("pk_test_51Rh3loFo0T5zwQpbtUeKIxnEiyF8pI7edziDCA73kegC2Osm6GoqXB3uaXhdTAIMF0Mi8FB0eTZBJmlUZ2hu1e6z00gV0EkWO0");

const AddBalanceForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const amount = parseFloat(values.amount);
      
      // Validate amount range (20-500 MDL based on your settings)
      if (amount < 20) {
        message.error("Minimum top-up amount is 20 MDL");
        setLoading(false);
        return;
      }
      if (amount > 500) {
        message.error("Maximum top-up amount is 500 MDL");
        setLoading(false);
        return;
      }

      // Create checkout session with MDL currency
      const response = await walletsService.createCheckoutSession(amount, "mdl");
      
      if (response.client_secret) {
        setClientSecret(response.client_secret);
        setShowCheckout(true);
        message.success("Checkout session created! Complete your payment below.");
      } else {
        message.error("Failed to create checkout session");
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      message.error(error.response?.data?.error || "Failed to create checkout session. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (err) => {
    console.error(err);
    message.error("Please enter a valid amount.");
  };

  const fetchClientSecret = () => {
    return clientSecret;
  };

  if (showCheckout && clientSecret) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "48px 24px", minHeight: "100vh" }}>
        <div style={{ width: "100%", maxWidth: "500px" }}>
          <Card className="items-card" style={{ padding: "24px 48px 48px" }}>
            <div className="order-total-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <Title level={4} className="poppins-bold" style={{ margin: 0 }}>Complete Payment</Title>
              <Button type="link" onClick={() => { setShowCheckout(false); setClientSecret(null); }}>
                Back
              </Button>
            </div>

            <EmbeddedCheckoutProvider
              stripe={stripePromise}
              options={{ clientSecret }}
            >
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: "800px" }}>
        <Card className="items-card" style={{ padding: 32 }}>
          <div className="order-total-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <Title level={4} className="poppins-bold" style={{ margin: 0 }}>Add Balance</Title>
            <Text className="poppins-medium" style={{ color: "#6b7280" }}>Secure payment via Stripe</Text>
          </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          initialValues={{ amount: 50 }}
        >
          <Row gutter={16}>
            <Col xs={24}>
              <Form.Item 
                label={<span className="poppins-medium">Amount (MDL)</span>} 
                name="amount" 
                rules={[
                  { required: true, message: "Enter an amount" },
                  { type: 'number', min: 20, message: "Minimum amount is 20 MDL" },
                  { type: 'number', max: 500, message: "Maximum amount is 500 MDL" }
                ]}
                help="Min: 20 MDL, Max: 500 MDL"
              >
                <InputNumber 
                  min={20} 
                  max={500}
                  step={10}
                  style={{ width: "100%" }} 
                  addonAfter="MDL"
                  size="large"
                  placeholder="Enter amount between 20-500"
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          <div style={{ backgroundColor: "#f5f5f5", padding: 16, borderRadius: 8, marginBottom: 16 }}>
            <Text className="poppins-medium" style={{ display: "block", marginBottom: 8 }}>
              💳 Payment Information
            </Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              After clicking "Continue to Payment", you'll be redirected to a secure Stripe checkout page to complete your payment. 
            </Text>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 12 }}>
            <Button
              type="default"
              onClick={() => navigate(-1)}
              disabled={loading}
              style={{
                height: 48,
                borderRadius: "0.5rem",
                padding: "0 24px",
                fontWeight: 600,
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={loading ? <Spin size="small" /> : <PlusCircleOutlined />}
              loading={loading}
              style={{
                height: 48,
                borderRadius: "0.5rem",
                padding: "0 24px",
                fontWeight: 600,
              }}
            >
              Continue to Payment
            </Button>
          </div>
        </Form>
        </Card>
      </div>
    </div>
  );
};

export default AddBalanceForm;
