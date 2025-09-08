import LoginLayout from "../layouts/LandingPage";
import LandingPageLeft from "../components/LandingPage/LandingPageLeft";
import LandingPageRight from "../components/LandingPage/LandingPageRight";
import { useState, useEffect } from "react";


const LandingPage = () => {
  const [right, setRight] = useState(null);
  const [left, setLeft] = useState(null);
  const [isPending, setIsPending] = useState(true);
  // useEffect(() => {
  //   setTimeout(() => {
  //     setRight(<LandingPageRight />);
  //     setLeft(<LandingPageLeft />);
  //     setIsPending(false);
  //   }, 1000);
  // }, []);

  useEffect(() => {
    setRight(<LandingPageRight />);
    setLeft(<LandingPageLeft />);
    setIsPending(false);
  }, []);
  return (
    <>
      {isPending && <div>loading...</div>}
      {left && right && <LoginLayout left={left} right={right} />}
    </>
  );
};

export default LandingPage;
