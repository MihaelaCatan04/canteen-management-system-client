import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from "../../hooks/useRefreshToken";
import useTokenRefresh from "../../hooks/useTokenRefresh";
import useAuth from "../../hooks/useAuth";
import { Spin, Typography } from "antd";
import { httpService } from "../../services/HttpService";
import { API_ENDPOINTS } from "../../api/API_ENDPOINTS";
import axiosPublic from "../../api/axios";

const PersistentLogIn = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth, setAuth } = useAuth();
  
  // Automatically refresh token before expiration
  useTokenRefresh();

  useEffect(() => {
    let isMounted = true;

    const verifyRefreshToken = async () => {
      try {
        if (!auth?.accessToken) {
          // Get new access token from refresh token
          const newAccessToken = await refresh();
          
          // Fetch user profile to get MFA status
          if (newAccessToken && isMounted) {
            try {
              const response = await axiosPublic.get(API_ENDPOINTS.USER.PROFILE, {
                headers: {
                  Authorization: `Bearer ${newAccessToken}`
                },
                withCredentials: true
              });
              
              if (isMounted && response?.data) {
                setAuth(prev => ({
                  ...prev,
                  mfaEnabled: !!response.data.mfa_enabled
                }));
              }
            } catch (profileErr) {
              // Failed to fetch user profile
            }
          }
        }
      } catch (err) {
        // Token refresh failed
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
