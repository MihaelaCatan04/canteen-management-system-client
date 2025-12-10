import { Card, Col, Typography, Button, Tooltip, message } from "antd";
import { WalletOutlined } from "@ant-design/icons";
import "./CurrentBalance.css";
import { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { walletsService } from "../../../services/WalletsService";

const { Title, Text } = Typography;

const CurrentBalance = () => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { auth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getBalance = async () => {
      if (!auth?.user_id) {
        console.log("No user_id found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const data = await walletsService.getBalance();

        if (isMounted) {
          setBalance(data.available_balance || 0);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error fetching balance:", err);
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    getBalance();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [auth?.user_id, navigate, location]);

  if (loading) {
    return (
      <Col xs={24} md={16}>
        <Card className="current-balance-card">
          <div>
            <Text className="current-balance-text poppins-medium">
              Current Balance
            </Text>
            <div className="balance-container">
              <div className="balance-amount">
                <Title
                  className="poppins-bold"
                  level={2}
                  style={{ color: "white", margin: "0", fontSize: "2rem" }}
                >
                  Loading...
                </Title>
              </div>
            </div>
          </div>
        </Card>
      </Col>
    );
  }

  if (error) {
    return (
      <Col xs={24} md={16}>
        <Card className="current-balance-card">
          <div>
            <Text className="current-balance-text poppins-medium">
              Current Balance
            </Text>
            <div className="balance-container">
              <div className="balance-amount">
                <Title
                  className="poppins-bold"
                  level={2}
                  style={{ color: "white", margin: "0", fontSize: "2rem" }}
                >
                  Error loading balance
                </Title>
              </div>
            </div>
          </div>
        </Card>
      </Col>
    );
  }

  return (
    <Col xs={24} md={16}>
      <Card className="current-balance-card">
        <div>
          <Text className="current-balance-text poppins-medium">
            Current Balance
          </Text>
          <div className="balance-container">
            <div className="balance-amount">
              <Title
                className="poppins-bold"
                level={2}
                style={{ color: "white", margin: "0", fontSize: "2rem" }}
              >
                MDL {balance}
              </Title>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M3 0.556641C1.34531 0.556641 0 2.02282 0 3.82617V20.1738C0 21.9772 1.34531 23.4434 3 23.4434H21C22.6547 23.4434 24 21.9772 24 20.1738V8.73047C24 6.92712 22.6547 5.46094 21 5.46094H3.75C3.3375 5.46094 3 5.09312 3 4.64355C3 4.19399 3.3375 3.82617 3.75 3.82617H21C21.8297 3.82617 22.5 3.09564 22.5 2.19141C22.5 1.28718 21.8297 0.556641 21 0.556641H3ZM19.5 12.8174C19.8978 12.8174 20.2794 12.9896 20.5607 13.2962C20.842 13.6028 21 14.0186 21 14.4521C21 14.8857 20.842 15.3015 20.5607 15.6081C20.2794 15.9147 19.8978 16.0869 19.5 16.0869C19.1022 16.0869 18.7206 15.9147 18.4393 15.6081C18.158 15.3015 18 14.8857 18 14.4521C18 14.0186 18.158 13.6028 18.4393 13.2962C18.7206 12.9896 19.1022 12.8174 19.5 12.8174Z"
                  fill="white"
                />
              </svg>
            </div>
          </div>
        </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 12 }}>
          <div
            className="view-transactions-button"
            role="button"
            tabIndex={0}
            onClick={() => navigate("/transaction-history")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                navigate("/transaction-history");
              }
            }}
            style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
          >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="10"
            viewBox="0 0 12 10"
            fill="none"
          >
            <path
              d="M1.7 0.800006C1.7 0.412819 1.38719 0.100006 1 0.100006C0.612816 0.100006 0.300003 0.412819 0.300003 0.800006V8.15001C0.300003 9.11688 1.08313 9.90001 2.05 9.90001H10.8C11.1872 9.90001 11.5 9.58719 11.5 9.20001C11.5 8.81282 11.1872 8.50001 10.8 8.50001H2.05C1.8575 8.50001 1.7 8.34251 1.7 8.15001V0.800006ZM10.5944 2.69438C10.8678 2.42094 10.8678 1.97688 10.5944 1.70344C10.3209 1.43001 9.87688 1.43001 9.60344 1.70344L7.3 4.00907L6.04438 2.75344C5.77094 2.48001 5.32688 2.48001 5.05344 2.75344L2.60344 5.20344C2.33 5.47688 2.33 5.92094 2.60344 6.19438C2.87688 6.46782 3.32094 6.46782 3.59438 6.19438L5.55 4.24094L6.80563 5.49657C7.07907 5.77001 7.52313 5.77001 7.79657 5.49657L10.5966 2.69657L10.5944 2.69438Z"
              fill="white"
            />
          </svg>
          <Text
            className="poppins-medium"
            style={{
              color: "white",
              margin: "0",
              textAlign: "center",
              marginLeft: "8px",
            }}
          >
            View Transactions
          </Text>
          </div>

          {/* Add money control styled like View Transactions so visual language matches */}
          <div
            className="view-transactions-button"
            role="button"
            tabIndex={0}
            onClick={() => {
              const isVerified = Boolean(auth?.isVerified ?? auth?.is_verified ?? auth?.verified ?? false);
              if (isVerified) {
                navigate("/add-balance");
              } else {
                message.info("Please verify your account to add funds. Use the Verify button in the Menu.");
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                const isVerified = Boolean(auth?.isVerified ?? auth?.is_verified ?? auth?.verified ?? false);
                if (isVerified) navigate("/add-balance");
                else message.info("Please verify your account to add funds. Use the Verify button in the Menu.");
              }
            }}
            style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          >
            {/* wallet SVG icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M21 7H3C1.9 7 1 7.9 1 9V19C1 20.1 1.9 21 3 21H21C22.1 21 23 20.1 23 19V9C23 7.9 22.1 7 21 7Z" fill="rgba(255,255,255,0.9)" />
              <circle cx="18" cy="14" r="1.5" fill="white" />
            </svg>
            <Text className="poppins-medium" style={{ color: "white", margin: 0, marginLeft: 8 }}>Add Balance</Text>
          </div>
        </div>
      </Card>
    </Col>
  );
};

export default CurrentBalance;
