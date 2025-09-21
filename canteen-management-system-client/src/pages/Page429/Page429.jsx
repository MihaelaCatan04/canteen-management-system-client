import "./Page429.css";

const Page429 = () => {
  return (
    <div className="page-429-container">
      <div className="error-container">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100"
          height="100"
          viewBox="0 0 100 100"
          fill="none"
        >
          <g clip-path="url(#clip0_2866_216)">
            <path d="M100 0H0V100H100V0Z" fill="white" />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M45.8327 54.1667C45.8327 56.4679 47.6981 58.3333 49.9994 58.3333C52.3006 58.3333 54.166 56.4679 54.166 54.1667V41.6667C54.166 39.3655 52.3006 37.5 49.9994 37.5C47.6981 37.5 45.8327 39.3655 45.8327 41.6667V54.1667ZM54.166 66.62C54.166 64.3187 52.3006 62.4533 49.9994 62.4533C47.6981 62.4533 45.8327 64.3187 45.8327 66.62V66.6667C45.8327 68.9679 47.6981 70.8333 49.9994 70.8333C52.3006 70.8333 54.166 68.9679 54.166 66.6667V66.62ZM39.0716 19.4223C43.8344 10.8497 56.1631 10.8497 60.9256 19.4223L88.4298 68.9296C93.0581 77.2612 87.0335 87.5 77.5027 87.5H22.4946C12.9635 87.5 6.9389 77.2612 11.5676 68.9296L39.0716 19.4223Z"
              fill="#3474E7"
            />
          </g>
          <defs>
            <clipPath id="clip0_2866_216">
              <rect width="100" height="100" fill="white" />
            </clipPath>
          </defs>
        </svg>
        <div className="error-code poppins-extrabold">ERROR 429</div>
        <div className="error-title poppins-medium">Too Many Requests</div>
        <div className="error-description poppins-regular">
          You've made too many requests in a short time. 
          <br />
          Please wait a moment before trying again.
        </div>
      </div>
    </div>
  );
};

export default Page429;
