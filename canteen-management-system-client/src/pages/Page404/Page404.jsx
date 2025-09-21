import "./Page404.css";

const Page404 = () => {
  return (
    <div className="page-404-container">
      <div className="error-container">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="82"
          height="75"
          viewBox="0 0 82 75"
          fill="none"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M36.8327 41.1667C36.8327 43.468 38.6981 45.3334 40.9994 45.3334C43.3006 45.3334 45.166 43.468 45.166 41.1667V28.6667C45.166 26.3656 43.3006 24.5001 40.9994 24.5001C38.6981 24.5001 36.8327 26.3656 36.8327 28.6667V41.1667ZM45.166 53.6201C45.166 51.3188 43.3006 49.4534 40.9994 49.4534C38.6981 49.4534 36.8327 51.3188 36.8327 53.6201V53.6667C36.8327 55.968 38.6981 57.8334 40.9994 57.8334C43.3006 57.8334 45.166 55.968 45.166 53.6667V53.6201ZM30.0716 6.42239C34.8344 -2.15024 47.1631 -2.15024 51.9256 6.42239L79.4298 55.9296C84.0581 64.2613 78.0335 74.5001 68.5027 74.5001H13.4946C3.96348 74.5001 -2.0611 64.2613 2.56757 55.9296L30.0716 6.42239Z"
            fill="#C2AC6A"
          />
        </svg>
        <div className="error-code poppins-extrabold">ERROR 404</div>
        <div className="error-title poppins-medium">Page Not Found</div>
        <div className="error-description poppins-regular">
          The page you're looking for doesn't exist or has been moved.
          <br />
          Check the URL or return to the homepage.
        </div>
      </div>
    </div>
  );
};

export default Page404;
