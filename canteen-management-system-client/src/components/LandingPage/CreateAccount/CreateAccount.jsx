import { Col, Row, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import "./CreateAccount.css";

const { Title, Text } = Typography;

const CreateAccount = () => {
  return (
    <Col span={24} className="welcome-col">
      <Row justify="center" align="middle" className="welcome-row">
        <Col>
          <div
            className="icon-container"
            style={{ borderRadius: "50%", backgroundColor: "#3B82F6" }}
          >
            <UserOutlined className="icon" />
          </div>
        </Col>
      </Row>
      <Title level={2} className="poppins-bold">
        Create Account
      </Title>
      <Text className="poppins-regular">Register your new account</Text>
    </Col>
  );
};

export default CreateAccount;
