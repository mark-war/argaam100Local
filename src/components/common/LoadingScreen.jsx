import React from "react";
// import Spinner from "react-bootstrap/Spinner";

const LoadingScreen = () => (
  <div className="loading-screen">
    <div className="spinner"></div>{" "}
    {/* You can use a spinner or any loading indicator */}
  </div>
  // <div className="loading-container">
  //   <Spinner  animation="border" role="spinbutton">
  //     <span className="sr-only">Loading...</span>
  //   </Spinner>
  // </div>
);

export default LoadingScreen;
