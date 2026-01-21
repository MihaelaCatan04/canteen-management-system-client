import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, Result, Button, Spin, Typography } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { walletsService } from "../../services/WalletsService";

const { Text, Paragraph } = Typography;

const TopUpReturnPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const [sessionData, setSessionData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    
    if (!sessionId) {
      setStatus("error");
      setError("No session ID found in URL");
      return;
    }

    const checkStatus = async () => {
      try {
        const data = await walletsService.getSessionStatus(sessionId);
        setSessionData(data);
        
        // Check both Stripe payment status and local transaction status
        if (data.payment_status === "paid" && data.status === "complete") {
          setStatus("success");
        } else if (data.status === "expired") {
          setStatus("expired");
        } else {
          setStatus("pending");
        }
      } catch (err) {
        setStatus("error");
        setError(err.message || "Failed to verify payment status");
      }
    };

    checkStatus();
    
    // Poll every 2 seconds for up to 10 seconds to catch webhook updates
    const pollInterval = setInterval(checkStatus, 2000);
    const timeout = setTimeout(() => clearInterval(pollInterval), 10000);
    
    return () => {
      clearInterval(pollInterval);
      clearTimeout(timeout);
    };
  }, [searchParams]);

  const renderContent = () => {
    switch (status) {
      case "loading":
        return (
          <Card style={{ maxWidth: 600, margin: "48px auto", textAlign: "center" }}>
            <Spin size="large" indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
            <Paragraph style={{ marginTop: 24, fontSize: 16 }}>
              Verifying your payment...
            </Paragraph>
          </Card>
        );

      case "success":
        return (
          <Card style={{ maxWidth: 600, margin: "48px auto" }}>
            <Result
              status="success"
              icon={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
              title="Payment Successful!"
              subTitle={
                <>
                  <Paragraph>
                    Your wallet has been topped up successfully.
                  </Paragraph>
                  {sessionData && (
                    <div style={{ marginTop: 16, textAlign: "left", backgroundColor: "#f5f5f5", padding: 16, borderRadius: 8 }}>
                      <Text strong>Transaction Details:</Text>
                      <br />
                      <Text>Amount: {sessionData.amount_total} {sessionData.currency?.toUpperCase()}</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        Transaction Status: {sessionData.transaction_status || "Processing"}
                      </Text>
                    </div>
                  )}
                </>
              }
              extra={[
                <Button type="primary" key="home" onClick={() => navigate("/order")} size="large">
                  Go to Home
                </Button>,
                <Button key="transactions" onClick={() => navigate("/transaction-history")} size="large">
                  View Transactions
                </Button>,
              ]}
            />
          </Card>
        );

      case "pending":
        return (
          <Card style={{ maxWidth: 600, margin: "48px auto" }}>
            <Result
              status="info"
              icon={<LoadingOutlined style={{ fontSize: 48 }} spin />}
              title="Payment Processing"
              subTitle="Your payment is being processed. This may take a few moments."
              extra={[
                <Button type="primary" key="home" onClick={() => navigate("/order")}>
                  Go to Home
                </Button>,
              ]}
            />
          </Card>
        );

      case "expired":
        return (
          <Card style={{ maxWidth: 600, margin: "48px auto" }}>
            <Result
              status="warning"
              title="Session Expired"
              subTitle="Your payment session has expired. Please try adding balance again."
              extra={[
                <Button type="primary" key="retry" onClick={() => navigate("/add-balance")}>
                  Try Again
                </Button>,
                <Button key="home" onClick={() => navigate("/order")}>
                  Go to Home
                </Button>,
              ]}
            />
          </Card>
        );

      case "error":
        return (
          <Card style={{ maxWidth: 600, margin: "48px auto" }}>
            <Result
              status="error"
              icon={<CloseCircleOutlined style={{ color: "#ff4d4f" }} />}
              title="Payment Verification Failed"
              subTitle={error || "We couldn't verify your payment status. Please check your transaction history or contact support."}
              extra={[
                <Button type="primary" key="retry" onClick={() => navigate("/add-balance")}>
                  Try Again
                </Button>,
                <Button key="transactions" onClick={() => navigate("/transaction-history")}>
                  View Transactions
                </Button>,
                <Button key="home" onClick={() => navigate("/order")}>
                  Go to Home
                </Button>,
              ]}
            />
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f0f2f5", paddingTop: 24 }}>
      {renderContent()}
    </div>
  );
};

export default TopUpReturnPage;
