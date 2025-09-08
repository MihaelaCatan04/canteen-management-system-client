import LoginLayout from "../layouts/LandingPage";
import LandingPageLeft from "../components/LandingPage/LandingPageLeft";
import LandingPageRight from "../components/LandingPage/LandingPageRight";

const LandingPage = () => {
  return (
    <LoginLayout left={<LandingPageLeft />} right={<LandingPageRight />} />
  );
};

export default LandingPage;
