import { useNavigate } from "react-router-dom";

const UnauthorizedComponent = () => {
    const navigate = useNavigate();
    const goBack = () => navigate(-1);
  return (
    <div>
      <h1>Unauthorized Access</h1>
      <p>You do not have permission to view this page.</p>
      <button onClick={goBack}>Go Back</button>
    </div>
  );
};

export default UnauthorizedComponent;
