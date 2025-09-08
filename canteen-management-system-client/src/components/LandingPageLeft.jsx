import {
  CheckCircleOutlined,
  CoffeeOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";
import { Col, Row, Typography } from "antd";
import "./LandingPageLeft.css";

const { Title, Text, Paragraph } = Typography;

const Left = () => {
  return (
    <div className="left-container">
      <Row gutter={[0, 32]}>
        <Col span={24}>
          <Title level={1} className="title-main poppins-bold">
            TrayGo
          </Title>
        </Col>
        <Col span={24}>
          <Title level={3} className="title-sub poppins-light">
            Simplify your lunch experience
          </Title>
        </Col>
        <Col span={24}>
          <Paragraph className="paragraph poppins-regular">
            Skip the lines, skip the carry. Order your favorite campus meals
            <br />
            with just a few taps and pick them up when it's convenient for you!
          </Paragraph>
        </Col>
        <Col span={24}>
          <Row align="middle">
            <Col>
              <CheckCircleOutlined className="icon" />
            </Col>
            <Col style={{ marginLeft: 8 }}>
              <Text className="text poppins-regular">
                Quick ordering in under 2 minutes
              </Text>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row align="middle">
            <Col>
              <CoffeeOutlined className="icon" />
            </Col>
            <Col style={{ marginLeft: 8 }}>
              <Text className="text poppins-regular">
                Fresh meals from based on your wants
              </Text>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row align="middle">
            <Col>
              <CreditCardOutlined className="icon" />
            </Col>
            <Col style={{ marginLeft: 8 }}>
              <Text className="text poppins-regular">
                You pay off your balance
              </Text>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default Left;
