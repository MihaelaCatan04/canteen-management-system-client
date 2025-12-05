import NavBar from "../../components/MainPage/NavBar/NavBar";
import VerificationBanner from "../../components/MainPage/VerificationBanner/VerificationBanner";
import "./MainPage.css";

const MainPageLayout = ({ children }) => {
  return (
    <div>
      <NavBar />
      <div className="mainpage-layout">
        <div className="mainpage-content">
          <VerificationBanner />
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainPageLayout;
