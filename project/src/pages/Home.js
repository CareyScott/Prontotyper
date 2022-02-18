import * as React from "react";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";

import { Container, Button, Grid, Box, Paper } from "@mui/material";
import { Typography } from "@material-ui/core";
import "../button.css";
import Dropzone from "../components/dropzone";
import { Image } from "@mui/icons-material";
import upload from '../Images/upload.png';



const Home = (props) => {
  return (
    <>
      <div className="app" >
       
        <div className="left-side">
          <Box
            textAlign="center"
            sx={{
              justifyContent: "center",
              display: "flex",
              flexWrap: "wrap",

              "& > :not(style)": {
                m: 1,
                width: "100%",
                height: 600,
              },
            }}
          >
            <Paper elevation={3}>
              <Dropzone />
            </Paper>
          </Box>
        </div>
        <div className="right-side">
          <Grid>

           <img src={upload} alt="Logo" className="home-img"/>

            </Grid>
        </div>
      </div>
    </>
  );
};

export default Home;
