import "./NavBar.css";
import { Typography, Avatar, Space } from "antd";
import { UserOutlined } from "@ant-design/icons";
const { Title, Text } = Typography;

const NavBar = () => {
  return (
    <div className="nav-bar-container">
      <Title
        className="poppins-medium2 app-title"
        level={2}
        style={{
          margin: 0,
          color: "#000",
        }}
      >
        TrayGo
      </Title>
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
          Name Surname
        </Text>
        <Avatar icon={<UserOutlined />} className="user-avatar" />
        <svg
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
      </Space>
    </div>
  );
};

export default NavBar;
