import React from "react";
import { Link } from "react-router-dom";

function NoPage() {
  return (
    <div id="notfound">
      <div className="notfound">
        <div className="notfound-404">
          <h1>:(</h1>
        </div>
        <h2>
          <span>404</span> - Page not found
        </h2>
        <p>
          The page you are looking for might have been removed had its name
          changed or is temporarily unavailable.
        </p>
        <center>
          {" "}
          <Link to="/home">Home Page</Link>
        </center>
      </div>
      <p>&copy; {new Date().getFullYear()} OpinionHarbor. All Rights Reserved</p>
    </div>
  );
}

export default NoPage;
