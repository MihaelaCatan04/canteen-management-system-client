import LoginLayout from "../../layouts/LandingPage/LandingPage";
import LandingPageLeft from "../../components/LandingPage/LandingPageLeft/LandingPageLeft";
import LandingPageRight from "../../components/LandingPage/LandingPageRight/LandingPageRight";
import { useState, useEffect } from "react";
import { Spin, Typography } from "antd";

const LandingPage = () => {
  const [right, setRight] = useState(null);
  const [left, setLeft] = useState(null);
  const [isPending, setIsPending] = useState(true);
  // useEffect(() => {
  //   setTimeout(() => {
  //     setRight(<LandingPageRight />);
  //     setLeft(<LandingPageLeft />);
  //     setIsPending(false);
  //   }, 1000);
  // }, []);

  useEffect(() => {
    setRight(<LandingPageRight />);
    setLeft(<LandingPageLeft />);
    setIsPending(false);
  }, []);
  if (isPending) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <Typography.Title
            level={1}
            className="loading-title poppins-bold"
            style={{ marginBottom: 8, color: "#ff8a00" }}
          >
            TrayGo
          </Typography.Title>
          <Typography.Paragraph
            className="poppins-regular"
            style={{ marginTop: 12 }}
          >
            Loading your experience...
          </Typography.Paragraph>
          <Spin size="large" style={{ marginTop: 18 }} />
        </div>
      </div>
    );
  }

  return <>{left && right && <LoginLayout left={left} right={right} />}</>;
};

export default LandingPage;
