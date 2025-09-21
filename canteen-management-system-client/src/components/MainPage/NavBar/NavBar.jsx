import React, { useState, useRef, useEffect } from "react";
import "./NavBar.css";
import { Typography, Avatar, Space } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Card } from "antd";
const { Title, Text } = Typography;
import useAuth from "../../../hooks/useAuth";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";

const NavBar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const arrowRef = useRef(null);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { auth, setAuth } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        arrowRef.current &&
        !arrowRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleChangePassword = () => {
    console.log("Change Password clicked");
    setIsDropdownOpen(false);
    // Add logic here
  };

  const handleLogOut = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    setIsDropdownOpen(false);
    try {
      await axiosPrivate.post("/auth/logout/", {
        withCredentials: true
      });

      setAuth({});
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      setAuth({});
      navigate("/login", { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getUserName = async () => {
      try {
        const response = await axiosPrivate.get("/users/me", {
          signal: controller.signal, withCredentials: true
        });
        if (isMounted) {
          setName(response?.data.first_name);
          setSurname(response?.data.last_name);
        }
      } catch (err) {
        if (err.name !== "CanceledError") {
          console.error("Error fetching user name:", err);
          navigate("/login", { state: { from: location }, replace: true });
        }
      }
    };

    getUserName();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [auth?.user_id, axiosPrivate]);

  return (
    <div className="nav-bar-container">
      <Title
        className="poppins-medium2 app-title"
        level={2}
        style={{
          margin: 0,
          color: "#000",
          cursor: "pointer",
        }}
        onClick={() => navigate("/order")} 
      >
        TrayGo
      </Title>
      <div className="user-section">
        <Space size="middle">
          <Text
            style={{
              margin: 0,
              fontSize: "1.375rem",
              lineHeight: "2.375rem",
              color: "#000",
            }}
            className="poppins-medium user-name"
          >
            {name} {surname}
          </Text>
          <Avatar icon={<UserOutlined />} className="user-avatar" />
          <div className="dropdown-container">
            <svg
              ref={arrowRef}
              onClick={toggleDropdown}
              className={`dropdown-arrow ${isDropdownOpen ? "rotated" : ""}`}
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="10"
              viewBox="0 0 14 10"
              fill="none"
            >
              <path
                d="M7.70415 9.04081C7.31353 9.46653 6.67915 9.46653 6.28853 9.04081L0.288525 2.50175C-0.1021 2.07603 -0.1021 1.38466 0.288525 0.958939C0.67915 0.533218 1.31353 0.533218 1.70415 0.958939L6.9979 6.7283L12.2917 0.962344C12.6823 0.536624 13.3167 0.536624 13.7073 0.962344C14.0979 1.38806 14.0979 2.07943 13.7073 2.50515L7.70728 9.04422L7.70415 9.04081Z"
                fill="#4B5563"
              />
            </svg>

            {isDropdownOpen && (
              <Card ref={dropdownRef} className="dropdown-menu">
                <div
                  className="dropdown-item poppins-medium"
                  onClick={handleChangePassword}
                >
                  Change Password
                </div>
                <div className="dropdown-divider"></div>
                <div
                  className="dropdown-item poppins-medium"
                  onClick={handleLogOut}
                  style={{ 
                    opacity: isLoggingOut ? 0.6 : 1,
                    cursor: isLoggingOut ? 'not-allowed' : 'pointer'
                  }}
                >
                  Log Out
                </div>
              </Card>
            )}
          </div>
        </Space>
      </div>
    </div>
  );
};

export default NavBar;
