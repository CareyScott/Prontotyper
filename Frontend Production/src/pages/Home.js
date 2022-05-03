import * as React from "react";
import { Button} from "@mui/material";
import sketchhome from "../Images/sketch-home.png";
import { Link } from "react-router-dom";
import "../button.css";

const Home = (props) => {
  return (
    <>
      <div className="app">
       

        <div className="container-main">
          <div className="col-1"></div>
          <div className="col-11 line-1">Build</div>
          <div className="col-1"></div>
          <div className="col-11 line-2">Your Sketches,</div>
          <div className="col-1"></div>
          <div className="col-11 line-3">Your Ideas.</div>

          <div className="col-1"></div>
          <div className="col-11 paragraph-home paragraph-gap">
            Prontotyper is an intuitive and unique application which utilisesa
            trained Artificial Intelligence to make your hand drawn web-designs
            into a functioning webpage in seconds.{" "}
          </div>
          <div className="col-1 "></div>
          <div className="col-1 paragraph-gap">
            <Link to="/login">
            <Button
              variant="contained"
              color="primary"
              xs={6}
              sx={{ backgroundColor: "#790FFF", width: 200, height: 50 }}
            >
              Try Now
            </Button>
            </Link>
          </div>
          <div className="col-2 paragraph-gap">
            <Button
              color="secondary"
              xs={6}
              sx={{ color: "#790FFF", width: 200, height: 50 }}
            >
              Try Now
            </Button>
          </div>
        </div>
       

        <img src={sketchhome} alt="Logo" className="home-img" />

      </div>
    </>
  );
};

export default Home;
