import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from "../../hooks/useRefreshToken";
import useAuth from "../../hooks/useAuth";
import { Spin, Typography } from "antd";

const PersistentLogIn = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const verifyRefreshToken = async () => {
      try {
        if (!auth?.accessToken) {
          await refresh();
        }
      } catch (err) {
        console.error("Token refresh failed:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (auth?.accessToken) {
      setIsLoading(false);
    } else {
      verifyRefreshToken();
    }

    return () => {
      isMounted = false;
    };
  }, []); 

  return (
    <>
      {isLoading ? (
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
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default PersistentLogIn;
