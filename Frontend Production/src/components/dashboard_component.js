import * as React from "react";
import { Paper, Grid, Button } from "@mui/material";
import FirstProject from "../pages/Projects/FirstProject";

import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom";


const DashboardComponent = () => {
  let navigate = useNavigate();

  const routeProjects = () => {
    let path = "/projects";
    navigate(path);
  };
//   let token = localStorage.getItem("token");


//   useEffect(() => {
//     axios
//       .get(`https://pronto-api-rest.azurewebsites.net/projects`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       })
//       .then((response) => {
//         console.log(response.data);
//         setProjects(response.data);
//       })
//       .catch((err) => {
//         console.log(`Error: ${err}`);
//       });
//   }, [token]);

  return (
    <>
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
    </>
  );
};

export default DashboardComponent;
