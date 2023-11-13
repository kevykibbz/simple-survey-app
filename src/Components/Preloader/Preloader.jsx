import React from "react";
import { BallTriangle } from "react-loader-spinner";
import "./Styles.css"

function Preloader() {
  return (
    <div className="spinner-container">
      <div className="spinner-content">
        <BallTriangle
          height={160}
          width={160}
          radius={5}
          color="#4158d0"
          ariaLabel="ball-triangle-loading"
          wrapperClass={{ "custom-spinner": true }}
          wrapperStyle=""
          visible={true}
        />
      </div>
    </div>
  );
}

export default Preloader;
