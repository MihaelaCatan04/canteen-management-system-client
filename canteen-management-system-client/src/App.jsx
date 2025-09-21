import { useState } from "react";
import "./App.css";
import LandingPage from "./pages/LandingPage/LandingPage.jsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainPage from "./pages/MainPage/MainPage.jsx";
import RequireAuth from "./components/LandingPage/RequireAuth/RequireAuth.jsx";
import UnauthorizedComponent from "./components/UnauthorizedPage/UnauthorizedComponent/UnauthorizedComponent.jsx";
import PersistentLogIn from "./components/PersistentLogIn/PersistentLogIn.jsx";
import OrderHistoryPage from "./pages/OrderHistoryPage/OrderHistoryPage.jsx";
import Page404 from "./pages/Page404/Page404.jsx";
import Page429 from "./pages/Page429/Page429.jsx";

const ROLES = {
  "Customer": "customer",
  "ConfirmedCustomer": "confirmedCustomer"
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LandingPage />} />
      <Route path="/register" element={<LandingPage />} />
      <Route element={<PersistentLogIn />}>
      <Route element={<RequireAuth allowedRoles={[ROLES.Customer]} />}>
        {/* Later to be replaced with verified customers */}
        <Route path="/order" element={<MainPage />} />
        <Route path="/order-history" element={<OrderHistoryPage />} />
      </Route>
      </Route>
      <Route path="/unauthorized" element={<UnauthorizedComponent />} />
      <Route path="/429" element={<Page429 />} />
      <Route path="*" element={<Page404 />} />
      
    </Routes>
  );
}
export default App;
