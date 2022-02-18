import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";

import HomeIcon from "@material-ui/icons/Home";
import InfoIcon from "@material-ui/icons/Info";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/navbar";
import Login from "./auth/login";
import "./styles.css";
import "./button.css";


const useStyles = makeStyles((theme) => ({
  drawerPaper: { width: "inherit" },
  link: { textDecoration: "none", color: theme.palette.text.primary },
}));

function App() {
  const classes = useStyles();
  return (
    <Router classname="body">
      <Navbar />

      <div style={{ display: "flex" }}>

        <Routes>
          <Route exact path="/" element={<Home />} />

          <Route exact path="/dashboard" element={<Dashboard />} />

          <Route exact path="/projects" element={<Projects />} />

          <Route exact path="/login" element={<Login />} />


        </Routes>
      </div>
    </Router>
  );
}

export default App;
