import "./SignUp.css";
import CreateAccount from "./CreateAccount";
import SignUpForm from "./SignUpForm";
import { Typography } from "antd";

const { Text, Paragraph } = Typography;

const SignUp = () => {
  return (
    <>
      <CreateAccount />
      <SignUpForm />
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

export default SignUp;
