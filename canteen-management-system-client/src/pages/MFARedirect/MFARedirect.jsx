import { useSearchParams, Navigate } from "react-router-dom";

const MFARedirect = () => {
  const [searchParams] = useSearchParams();
  const ticket = searchParams.get("ticket") || "";
  const type = searchParams.get("type") || "totp";

  // Redirect to login page with MFA params
  return <Navigate to={`/login?mfa=true&ticket=${ticket}&type=${type}`} replace />;
};

export default MFARedirect;
