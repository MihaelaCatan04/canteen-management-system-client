import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

const RequireVerified = () => {
  const { auth } = useAuth();
  const location = useLocation();

  // If not authenticated, send to login
  if (!auth?.accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const isVerified = Boolean(auth?.isVerified ?? auth?.verified ?? false);

  // If authenticated but not verified, redirect to order (menu)
  if (!isVerified) {
    return <Navigate to="/order" state={{ from: location }} replace />;
  }

  // Verified user
  return <Outlet />;
};

export default RequireVerified;
