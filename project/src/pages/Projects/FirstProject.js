import { Button } from "@mui/material";
import * as React from "react";

import sketchhome from "./.././../Images/sketch-home.png";

const FirstProject = (props) => {
  //   const [navbar, setNavbar] = useState(false);

  // if (props.authenticated) {
  //   <>
  //     <Button sx={{ my: 2, color: "white", display: "block" }}>Logout</Button>
  //   </>;
  // }

  //   const changeBackground = () => {
  //     if (window.scrollY >= 80) {
  //       setNavbar(true);
  //     } else {
  //       setNavbar(false);
  //     }
  //   };

  //   window.addEventListener("scroll", changeBackground);

  return (
    <>
      <div className="container-main">
        <div className="col-1"></div>
        <div className="col-11 line-1">Create</div>
        <div className="col-1"></div>
        <div className="col-11 line-2">Your First Project!</div>
        <div className="col-1 paragraph-gap "></div>
        <div className="col-1 paragraph-gap">
          <Button
            variant="contained"
            color="primary"
            xs={6}
            sx={{ backgroundColor: "#790FFF", width: 200, height: 50 }}
          >
            Create
          </Button>
        </div>
        <div className="col-2 paragraph-gap">
          <Button
            color="secondary"
            xs={6}
            sx={{ color: "#790FFF", width: 200, height: 50 }}
          >
            Help{" "}
          </Button>
        </div>
      </div>

      <img src={sketchhome} alt="Logo" className="home-img" />
    </>
  );
};

export default FirstProject;
