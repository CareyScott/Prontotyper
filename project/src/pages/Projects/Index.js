import { Button, Grid, Paper } from "@mui/material";
import * as React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom";

// const [predictions, setPredictions] = useState({});
import sketchhome from "./.././../Images/sketch-home.png";

const ProjectsIndex = (props) => {
  let token = localStorage.getItem("token");

  const [projects, setProjects] = useState(null);
  function preventDefault(event) {
    event.preventDefault();
  }
  let navigate = useNavigate();

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

  if (!projects) return null;

  const projectsList = projects.map((project) => {
    let projectID = project._id.toString();
    const showProject = (project) => {
      navigate(`/projects/${projectID}`, { replace: true });
    };

    // console.log(projectID);
    return (
      // <Grid item xs={3} md={3}>
      <Box
        key={project._id}
        sx={{
          display: "flex",
          float: "left",
          flexWrap: "wrap",
          "& > :not(style)": {
            m: 1,
            width: "100%",
            height: 180,
          },
        }}
      >
        <Paper className="centered" elevation={3}>
          <p className="project-title centered ">{project.project_name}</p>
          <Grid item>
            <Button
              onClick={showProject}
              color="secondary"
              xs={6}
              sx={{ color: "#790FFF", width: 200, height: 50 }}
            >
              View
            </Button>
          </Grid>
        </Paper>
      </Box>
      // </Grid>
    );
  });

  return (
    <>
      <div className="container-main">
        <div className="col-1"></div>
        <div className="col-11 line-1">Your Projects</div>

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
        <div className="col-8"></div>

        <div className="col-1"></div>
        <div className="col-4">
          <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={3}>
            {projectsList}
          </Box>{" "}
        </div>
      </div>

      <img src={sketchhome} alt="Logo" className="home-img" />
    </>
  );
};

export default ProjectsIndex;
