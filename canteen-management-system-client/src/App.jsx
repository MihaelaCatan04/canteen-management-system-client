import { useState } from "react";
import "./App.css";
import LandingPage from "./pages/LandingPage/LandingPage.jsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainPage from "./pages/MainPage/MainPage.jsx";
// import TrayGoApp from "./components/MainPage/draft2.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LandingPage />} />
        <Route path="/register" element={<LandingPage />} />
        <Route path="/order" element={<MainPage />} />
        {/* <Route path="/draft2" element={<TrayGoApp />} /> */}
      </Routes>
    </Router>
  );
}
export default App;
