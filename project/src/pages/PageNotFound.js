import React from "react";
import "../../src/scroll.css";
import logo from "../Images/Prontotyper.png";
import "./../styles.css";

// 404 Page
const PageNotFound = () => {
  return (
    <React.Fragment>
      <div className="container-main">
        <div className=" fourohfour-left">404</div>

        <div className=" fourohfour-center centered">404</div>

        <div className=" fourohfour-right">404</div>

        <div className="col-12 centered">
          <img src={logo} alt="Logo" className="logo-centered-small " />
        </div>

        <div className="col-12 centered fourohfour-text-purple">Oops!</div>

        <div className="col-12 centered fourohfour-text-primary">
          Something’s wrong here.{" "}
        </div>

        <div className="col-12 centered fourohfour-text-primary">
          Please try again in a few moments.{" "}
        </div>
      </div>
    </React.Fragment>
  );
};

export default PageNotFound;
