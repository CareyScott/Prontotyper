import * as React from "react";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";

import { Container, Button, Grid, Box, Paper } from "@mui/material";
import { Typography } from "@material-ui/core";
import "../button.css";
import Dropzone from "../components/dropzone";
import { Image } from "@mui/icons-material";
import sketchhome from "../Images/sketch-home.png";
import { Link } from "react-router-dom";

const Home = (props) => {
  return (
    <>
      <div className="app">
        {/* <Grid spacing={3}>
          <Grid  xs="3" >
            <div>hi</div>
            </Grid>
            <Grid item xs="auto" className="line-1">
             variable width content
            </Grid>
            <Grid item xs={12}  className="line-2">
           variable width content
            </Grid>
            <Grid item xs="auto"  className="line-3">
            variable width content
            </Grid>
          </Grid> */}

        <div className="container-main">
          <div className="col-1"></div>
          <div className="col-11 line-1">Build</div>
          <div className="col-1"></div>
          <div className="col-11 line-2">Your Sketches,</div>
          <div className="col-1"></div>
          <div className="col-11 line-3">Your Ideas.</div>

          <div className="col-1"></div>
          <div className="col-11 paragraph-home paragraph-gap">
            Prontotyper is an intuiotive and unique application which utilisesa
            trained Artificial Intelligence to make your hand drawn web-designs
            into a functioning webpage in seconds.{" "}
          </div>
          <div className="col-1 "></div>
          <div className="col-1 paragraph-gap">
            <Link to="/dashboard">
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
        {/* <p className="paragraph-home">Prontotyper is an intuiotive and unique application which utilisesa trained Artificial Intelligence to make your hand drawn web-designs into a functioning webpage in seconds. </p>

          <button type="button" className="button-primary">Try Now</button>
          <button type="button" className="button-secondary">Find Out More</button>  */}

        {/* <Paper elevation={3}> */}
        {/* <Dropzone /> */}
        {/* </Paper> */}
        {/* </Box> */}
        {/* </div> */}
        {/* <div className="right-side"> */}
        {/* <Grid> */}

        <img src={sketchhome} alt="Logo" className="home-img" />

        {/* </Grid> */}
      </div>
      {/* </div> */}
    </>
  );
};

export default Home;
