import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useState, useEffect } from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Importing Pages
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/navbar";
import PageNotFound from "./pages/PageNotFound";

//Importing Projects Pages
import ProjectsIndex from "./pages/Projects/Index";
import ProjectsCreate from "./pages/Projects/Create";
import ProjectsShow from "./pages/Projects/Show";
import ProjectsEdit from "./pages/Projects/Edit";

//Importing Components Pages
import ComponentsIndex from "./pages/Components/Index";
import ComponentsCreate from "./pages/Components/Create";
import ComponentsShow from "./pages/Components/Show";
import ComponentsEdit from "./pages/Components/Edit";

// Auth Pages
import Login from "./auth/Login";
import Register from "./auth/Register";


import Testing from "./pages/Testing";


// StyleSheets
import "./styles.css";
import "./button.css";

const useStyles = makeStyles((theme) => ({
  drawerPaper: { width: "inherit" },
  link: { textDecoration: "none", color: theme.palette.text.primary },
}));

const App = () => {
  const [authenticated, setAuthenticated] = useState(false);
  let protectedPages;

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setAuthenticated(true);
    }
  }, []);

  const onAuthenticated = (auth, token) => {
    setAuthenticated(auth);
    console.log(token);
    if (auth) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  };

  if (authenticated) {
    protectedPages = (
      <>
        <Route path="/projects/create" element={<ProjectsCreate />} />
        <Route path="/projects/:id/edit" element={<ProjectsEdit />} />
        <Route path="/projects/:id" element={<ProjectsShow />} />

        <Route path="/components/create" element={<ComponentsCreate />} />
        <Route path="/components/:id/edit" element={<ComponentsEdit />} />
        <Route path="/components/:id" element={<ComponentsShow />} />
      </>
    );
  }

  const classes = useStyles();
  return (
    <Router classname="body">
      <Navbar onAuthenticated={onAuthenticated} authenticated={authenticated} />
      <div style={{ display: "flex" }}>
        <Routes>
          <Route
            exact
            path="/"
            element={
              <Home
                onAuthenticated={onAuthenticated}
                authenticated={authenticated}
              />
            }
          />
          <Route exact path="/projects" element={<ProjectsIndex />} /> 
          <Route exact path="/components" element={<ComponentsIndex />} />
          {protectedPages}
          <Route exact path="/dashboard" element={<Dashboard />} />
          <Route
            path="/register"
            element={
              <Register
                onAuthenticated={onAuthenticated}
                authenticated={authenticated}
              />
            }
          />
          <Route
            path="/login"
            element={
              <Login
                onAuthenticated={onAuthenticated}
                authenticated={authenticated}
              />
            }
          />
          <Route path="/register" element={<Register />} />

          <Route path="*" element={<PageNotFound />} />
          <Route path="/testing" element={<Testing />} />

        </Routes>
      </div>
    </Router>
  );
};

export default App;
