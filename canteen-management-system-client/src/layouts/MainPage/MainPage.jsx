import NavBar from "../../components/MainPage/NavBar/NavBar";
import "./MainPage.css";

const MainPageLayout = ({ children }) => {
  return (
    <div>
      <NavBar />
      <div className="mainpage-layout">
        <div className="mainpage-content">{children}</div>
      </div>
    </div>
  );
};

export default MainPageLayout;
