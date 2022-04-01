import { Container, Grid, Paper, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import React from "react";
import { Box } from "@mui/system";
import Stack from "@mui/material/Stack";
import "../../src/scroll.css";
import logo from "../Images/Prontotyper.png";
import "./../styles.css";

const PageNotFound = () => {
  // let location = useLocation();

  // console.log(location);

  return (
    <React.Fragment>
      {/* <Container fixed>
        <Box justifyContent="center">
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: "100vh" }}
          >
            <Typography variant="h1">404 </Typography>
            <Typography>Page Not Found </Typography>
          </Grid>
        </Box>
      </Container>
       */}

      <div className="container-main">
        <div className=" fourohfour-left">404</div>

        <div className=" fourohfour-center centered">404</div>

        <div className=" fourohfour-right">404</div>

   
        <div className="col-12 centered">
          <img src={logo} alt="Logo" className="logo-centered-small " />
        </div>


     
        <div className="col-12 centered fourohfour-text-purple">Oops!</div>
 
        <div className="col-12 centered fourohfour-text-primary">Something’s wrong here. </div>
      
        <div className="col-12 centered fourohfour-text-primary">Please try again in a few moments. </div>
        

      </div>
    </React.Fragment>
  );
};

export default PageNotFound;
