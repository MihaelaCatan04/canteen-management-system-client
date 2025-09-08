import "./LogIn.css";
import WelcomeBack from "./WelcomeBack";
import LogInForm from "./LogInForm";

import { Typography } from "antd";

const { Text, Paragraph } = Typography;

const LogIn = () => {
  return (
    <>
      <WelcomeBack />
      <LogInForm />
      <Paragraph className="signin-paragraph poppins-regular">
        By signing in, you agree to our{" "}
        <Text type="link" className="signin-link">
          Terms of Service
        </Text>{" "}
        and{" "}
        <Text type="link" className="signin-link">
          Privacy Policy
        </Text>
      </Paragraph>
    </>
  );
};

export default LogIn;
