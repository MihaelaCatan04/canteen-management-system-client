import "./Page403.css";

const Page403 = () => {
  return (
    <div className="page-403-container">
      <div className="error-container">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100"
          height="100"
          viewBox="0 0 100 100"
          fill="none"
        >
          <g clip-path="url(#clip0_2866_240)">
            <path d="M100 0H0V100H100V0Z" fill="white" />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M45.8327 54.1667C45.8327 56.468 47.6981 58.3334 49.9994 58.3334C52.3006 58.3334 54.166 56.468 54.166 54.1667V41.6667C54.166 39.3656 52.3006 37.5001 49.9994 37.5001C47.6981 37.5001 45.8327 39.3656 45.8327 41.6667V54.1667ZM54.166 66.6201C54.166 64.3188 52.3006 62.4534 49.9994 62.4534C47.6981 62.4534 45.8327 64.3188 45.8327 66.6201V66.6667C45.8327 68.968 47.6981 70.8334 49.9994 70.8334C52.3006 70.8334 54.166 68.968 54.166 66.6667V66.6201ZM39.0716 19.4224C43.8344 10.8498 56.1631 10.8498 60.9256 19.4224L88.4298 68.9296C93.0581 77.2613 87.0335 87.5001 77.5027 87.5001H22.4946C12.9635 87.5001 6.9389 77.2613 11.5676 68.9296L39.0716 19.4224Z"
              fill="#782B21"
            />
          </g>
          <defs>
            <clipPath id="clip0_2866_240">
              <rect width="100" height="100" fill="white" />
            </clipPath>
          </defs>
        </svg>
        <div className="error-code poppins-extrabold">ERROR 403</div>
        <div className="error-title poppins-medium">Forbidden</div>
        <div className="error-description poppins-regular">
          You don't have permission to view this page. <br />
          Please log in or contact support if you believe this is an error.
        </div>
      </div>
    </div>
  );
};

export default Page403;
