import NavBar from "../../components/MainPage/NavBar/NavBar";

const MainPageLayout = ({ children }) => {
  return (
    <div>
      <NavBar />
      <div
        style={{
          width: "100%",
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
          padding: "0",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "16px",
            minHeight: "100vh",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainPageLayout;
