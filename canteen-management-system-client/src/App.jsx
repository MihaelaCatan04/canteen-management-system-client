import { useState } from "react";
import "./App.css";
import LandingPage from "./pages/LandingPage.jsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TrayGoApp from "./components/MainPage/draft.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LandingPage />} />
        <Route path="/register" element={<LandingPage />} />
        <Route path="/draft" element={<TrayGoApp />} />
      </Routes>
    </Router>
  );
}
export default App;
