import { useState } from "react";
import "./App.css";
import LandingPage from "./pages/LandingPage/LandingPage.jsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainPage from "./pages/MainPage/MainPage.jsx";
import RequireAuth from "./components/LandingPage/RequireAuth/RequireAuth.jsx";
import RequireVerified from "./components/LandingPage/RequireVerified/RequireVerified.jsx";
import PersistentLogIn from "./components/PersistentLogIn/PersistentLogIn.jsx";
import OrderHistoryPage from "./pages/OrderHistoryPage/OrderHistoryPage.jsx";
import Page404 from "./pages/Page404/Page404.jsx";
import Page429 from "./pages/Page429/Page429.jsx";
import Page403 from "./pages/Page403/Page403.jsx";
import TransactionHistoryPage from "./pages/TransactionHistoryPage/TransactionHistoryPage";
import MicrosoftCallback from "./pages/MicrosoftCallback/MicrosoftCallback.jsx";
import MFARedirect from "./pages/MFARedirect/MFARedirect.jsx";
import VerifyEmail from "./pages/VerifyEmail/VerifyEmail.jsx";
import ResendVerification from "./pages/ResendVerification/ResendVerification.jsx";
import "./api/Interceptors";
const ROLES = {
  Customer: "customer",
  ConfirmedCustomer: "confirmedCustomer",
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LandingPage />} />
      <Route path="/register" element={<LandingPage />} />
      {/* microsoft oauth callback route */}
      <Route path="/auth/microsoft/callback" element={<MicrosoftCallback />} />
      {/* mfa redirect for microsoft oauth users with mfa enabled */}
      <Route path="/auth/mfa" element={<MFARedirect />} />
      {/* email verification routes */}
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/resend-verification" element={<ResendVerification />} />
      <Route element={<PersistentLogIn />}>
        <Route element={<RequireAuth allowedRoles={[ROLES.Customer]} />}>
          {/* Main menu is open to authenticated customers (verified or not) */}
          <Route path="/order" element={<MainPage />} />

          {/* Restrict history and transactions to verified customers */}
          <Route element={<RequireVerified />}>
            <Route path="/order-history" element={<OrderHistoryPage />} />
            <Route path="/transaction-history" element={<TransactionHistoryPage />} />
          </Route>
        </Route>
      </Route>
      <Route path="/forbidden" element={<Page403 />} />
      <Route path="/429" element={<Page429 />} />
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
}
export default App;
