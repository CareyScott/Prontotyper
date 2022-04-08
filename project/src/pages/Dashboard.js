import * as React from "react";
import { Paper, Grid, Button, Link } from "@mui/material";
import FirstProject from "../pages/Projects/FirstProject";

import axios from "axios";
import { useState, useEffect } from "react";
import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom";

import { styled } from "@mui/material/styles";
import Login from "./LoginForm";
import DashboardComponent from "../components/dashboard_component";

const Dashboard = (props) => {
  function preventDefault(event) {
    event.preventDefault();
  }
  // console.log(props);
  const [projects, setProjects] = useState({});

  // const [predictions, setPredictions] = useState({});

  let navigate = useNavigate();

  const routeProjects = () => {
    let path = "/projects";
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
    return <>{!projects ? <FirstProject /> : <DashboardComponent />}</>;
  }
};

export default Dashboard;
