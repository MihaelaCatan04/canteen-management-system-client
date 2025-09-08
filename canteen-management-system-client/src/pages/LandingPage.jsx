import LoginLayout from "../layouts/LandingPage";
import LandingPageLeft from "../components/LandingPageLeft";
import LandingPageRight from "../components/LandingPageRight";

const LandingPage = () => {
  return (
    <LoginLayout left={<LandingPageLeft />} right={<LandingPageRight />} />
  );
};

export default LandingPage;
