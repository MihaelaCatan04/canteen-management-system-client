import { useState } from "react";
import "./App.css";
import LandingPage from "./pages/LandingPage.jsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LandingPage />} />
        <Route path="/register" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}
export default App;
