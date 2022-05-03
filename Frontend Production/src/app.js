import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Importing Pages
import Home from "./pages/Home";
// import Dashboard from "./pages/Dashboard";
import Navbar from "./components/navbar";
import PageNotFound from "./pages/PageNotFound";

//Importing Projects Pages
import ProjectsIndex from "./pages/Projects/Index";
// import ProjectsCreate from "./pages/Projects/Create";
import ProjectsShow from "./pages/Projects/Show";
// import ProjectsEdit from "./pages/Projects/Edit";

//Importing Components Pages
// import ComponentsIndex from "./pages/Components/Index";
// import ComponentsCreate from "./pages/Components/Create";
import ComponentsShow from "./pages/Components/Show";
// import ComponentsEdit from "./pages/Components/Edit";

// Auth Pages
import Login from "./pages/LoginForm";
import Register from "./auth/Register";

// import Testing from "./pages/Testing";

// StyleSheets
import "./styles.css";
// import "./button.css";
import "./grid.css";

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

  (function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y); })(window, document, "clarity", "script", "bq6td5evmj");

  const onAuthenticated = (auth, token) => {
    setAuthenticated(auth);
    // console.log(token);
    if (auth) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  };
  

  // const [userID, setUserID] = useState(false);

  // useEffect(() => {
  //   if (localStorage.getItem("user_id")) {
  //     setAuthenticated(true);
  //   }
  // }, []);

  // const onUserID = (auth, token) => {
  //   setAuthenticated(auth);
  //   console.log(UserID);
  //   if (auth) {
  //     localStorage.setItem("user_id", UserID);
  //   } else {
  //     localStorage.removeItem("user_id");
  //   }
  // };



  if (authenticated) {
    protectedPages = (
      <>
        <Route exact path="/projects/:id" element={<ProjectsShow />} />
        {/* <Route exact path="/projects" element={<ProjectsIndex />} /> */}
        <Route exact path="/dashboard" element={<ProjectsIndex />} />
        <Route exact path="/components/:id" element={<ComponentsShow />} />
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

          {protectedPages}

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

          <Route path="*" element={<PageNotFound />} />
          {/* <Route path="/testing" element={<Testing />} /> */}
        </Routes>
      </div>
    </Router>
  );
};

export default App; 