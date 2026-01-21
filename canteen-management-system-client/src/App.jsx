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
import AddBalancePage from "./pages/AddBalancePage/AddBalancePage.jsx";
import TopUpReturnPage from "./pages/TopUpReturnPage/TopUpReturnPage.jsx";
import MicrosoftCallback from "./pages/MicrosoftCallback/MicrosoftCallback.jsx";
import MFARedirect from "./pages/MFARedirect/MFARedirect.jsx";
import VerifyEmail from "./pages/VerifyEmail/VerifyEmail.jsx";
import ResendVerification from "./pages/ResendVerification/ResendVerification.jsx";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword/ResetPassword.jsx";
import "./api/Interceptors";
const ROLES = {
  Customer: "customer",
  ConfirmedCustomer: "confirmedCustomer",
};

function App() {
  return (
    <Routes>
      {/* Public routes - with auth check for redirect */}
      <Route element={<PersistentLogIn />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LandingPage />} />
        <Route path="/register" element={<LandingPage />} />
      </Route>
      
      {/* OAuth and other public routes without auth check */}
      <Route path="/auth/microsoft/callback" element={<MicrosoftCallback />} />
      <Route path="/auth/mfa" element={<MFARedirect />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/resend-verification" element={<ResendVerification />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      {/* Protected routes */}
      <Route element={<PersistentLogIn />}>
        <Route element={<RequireAuth allowedRoles={[ROLES.Customer]} />}>
          <Route path="/order" element={<MainPage />} />

          <Route element={<RequireVerified />}>
            <Route path="/order-history" element={<OrderHistoryPage />} />
            <Route path="/transaction-history" element={<TransactionHistoryPage />} />
            <Route path="/add-balance" element={<AddBalancePage />} />
            <Route path="/wallet/top-up/return" element={<TopUpReturnPage />} />
          </Route>
        </Route>
      </Route>
      
      {/* Error pages */}
      <Route path="/forbidden" element={<Page403 />} />
      <Route path="/429" element={<Page429 />} />
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
}
export default App;
