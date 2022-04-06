import * as React from "react";
import { Paper, Grid, Button, Link } from "@mui/material";
import FirstProject from "../pages/Projects/FirstProject";

import axios from "axios";
import { useState, useEffect } from "react";
import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom";

import { styled } from "@mui/material/styles";
import Login from "./Login";

const Dashboard = (props) => {
  function preventDefault(event) {
    event.preventDefault();
  }

  const [projects, setProjects] = useState({});

  // const [predictions, setPredictions] = useState({});

  let token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`http://localhost:3030/projects`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setProjects(response.data);
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
      });
  }, [token]);

  let navigate = useNavigate();

  const routeProjects = () => {
    let path = "/projects"
    navigate(path);
  };

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  
  {
    if (!projects) {
      return (

        
        <>
         {props.authenticated ? (
          <div className="container-main">
            <FirstProject />
          </div>): (
        <Login onAuthenticated={props.onAuthenticated}  authenticated={props.authenticated} />
      )}
        </>
      );
    } else {
     
      return (
        <>
                 {props.authenticated ? (

          <div className="container-main">
            <div className="col-2"></div>
            <div className="col-10">
              <p className="dashboard-title">Hi, Welcome Back</p>
            </div>{" "}
            <div className="col-2"></div>
            <Box
              className="col-2  centered-content"
              sx={{
                display: "flex",
                flexWrap: "wrap",
                "& > :not(style)": {
                  m: 1,
                  width: "100%",
                  height: 230,
                },
              }}
            >
              <Paper elevation={3}>
                <Grid container spacing={2}>
                  <Grid item xs={1} md={1}></Grid>
                  <Grid item xs={6} md={8}>
                    Projects
                  </Grid>
                  <Grid item xs={5} md={3}></Grid>
                  <Grid item xs={6} md={12}>
                    <Button
                      onClick={routeProjects}
                      color="secondary"
                      xs={6}
                      sx={{ color: "#790FFF", width: 200, height: 50 }}
                    >
                      View{" "}
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Box>{" "}
            <Box
              className="col-2"
              sx={{
                display: "flex",
                flexWrap: "wrap",
                "& > :not(style)": {
                  m: 1,
                  width: "100%",
                  height: 230,
                },
              }}
            >
              <Paper elevation={3}>
                <Grid container spacing={2}>
                  <Grid item xs={1} md={1}></Grid>
                  <Grid item xs={6} md={8}>
                    Components
                  </Grid>
                  <Grid item xs={5} md={3}></Grid>
                  <Grid item xs={6} md={12}>
                    <Button
                      color="secondary"
                      xs={6}
                      sx={{ color: "#790FFF", width: 200, height: 50 }}
                    >
                      View{" "}
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Box>{" "}
            <Box
              className="col-2"
              sx={{
                display: "flex",
                flexWrap: "wrap",
                "& > :not(style)": {
                  m: 1,
                  width: "100%",
                  height: 230,
                },
              }}
            >
              <Paper elevation={3}></Paper>
            </Box>{" "}
            <Box
              className="col-2"
              sx={{
                display: "flex",
                flexWrap: "wrap",
                "& > :not(style)": {
                  m: 1,
                  width: "100%",
                  height: 230,
                },
              }}
            >
              <Paper elevation={3}></Paper>
            </Box>{" "}
            <div className="col-2"></div>
            <div className="col-2"></div>
            <Box
              className="col-6"
              sx={{
                display: "flex",
                flexWrap: "wrap",
                "& > :not(style)": {
                  m: 1,
                  width: "100%",
                  height: 300,
                },
              }}
            >
              {" "}
              <Paper elevation={3}></Paper>
            </Box>{" "}
            <Box
              className="col-2"
              sx={{
                display: "flex",
                flexWrap: "wrap",
                "& > :not(style)": {
                  m: 1,
                  width: "100%",
                  height: 300,
                },
              }}
            >
              <Paper elevation={3}></Paper>
            </Box>{" "}
            <div className="col-2"></div>
          </div>

):  (
  <Login onAuthenticated={props.onAuthenticated}   authenticated={props.authenticated} />
)}
        </>
      );
    }
  }
};

export default Dashboard;
