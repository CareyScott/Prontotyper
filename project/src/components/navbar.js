import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { Typography, Grid } from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import { ListItem } from "@material-ui/core";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import logo from "../Images/Prontotyper.png";

import "./../App.css";
import "./../grid.css";

const useStyles = makeStyles((theme) => ({
  drawerPaper: { width: "inherit" },
  navList: {
    float: "right",
    textDecoration: "none",
    color: theme.palette.text.primary,
  },
  navListButton: {
    float: "right",
    textDecoration: "none",
  },
  link: { textDecoration: "none", color: theme.palette.text.primary },
}));

const Navbar = (props) => {
  const [navbar, setNavbar] = useState(false);
  let navigate = useNavigate();

  const changeBackground = () => {
    if (window.scrollY >= 60) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

  const handleLogout = () => {
    props.onAuthenticated(false);
    console.log(props);
    navigate(`/`, { replace: true });

  };

  window.addEventListener("scroll", changeBackground);

  const classes = useStyles();
  return (
    <>
      <nav>
        <div className="container-main">
          {!props.authenticated ? (
            <>
              <div className="col-9">
                <Link to="/">
                  <img src={logo} alt="Logo" className="logo-nav" />
                </Link>
              </div>
              {/* </div> */}
              <div className="col-1">
                <Link to="/">
                  <ListItem>
                    <Button sx={{ color: "#000000" }}>
                      <Typography
                        variant="h6"
                        component="p"
                        className={classes.navList}
                      >
                        Home
                      </Typography>
                    </Button>
                  </ListItem>
                </Link>
              </div>{" "}
              <div className="col-1">
                <Link to="/login">
                  <ListItem>
                    <Button
                      variant="contained"
                      xs={6}
                      sx={{ backgroundColor: "#790FFF", width: 200 }}
                    >
                      <Typography
                        variant="h6"
                        component="p"
                        className={classes.navListButton}
                      >
                        Login
                      </Typography>
                    </Button>
                  </ListItem>
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="col-8">
                <Link to="/">
                  <img src={logo} alt="Logo" className="logo-nav" />
                </Link>
              </div>
              {/* </div> */}

              <div className="col-1">
                <Link to="/">
                  <ListItem>
                    <Button sx={{ color: "#000000" }}>
                      <Typography
                        variant="h6"
                        component="p"
                        className={classes.navList}
                      >
                        Home
                      </Typography>
                    </Button>
                  </ListItem>
                </Link>
              </div>
              <div className="col-1">
                <Link to="/dashboard">
                  <ListItem>
                    <Button sx={{ color: "#000000" }}>
                      <Typography
                        variant="h6"
                        component="p"
                        className={classes.navList}
                      >
                        Dashboard
                      </Typography>
                    </Button>
                  </ListItem>
                </Link>
              </div>

              <div className="col-1">
                <ListItem>
                  <Button
                    onClick={handleLogout}
                    variant="contained"
                    xs={6}
                    sx={{ backgroundColor: "#790FFF", width: 200 }}
                  >
                    <Typography
                      variant="h6"
                      component="p"
                      className={classes.navListButton}
                    >
                      Logout
                    </Typography>
                  </Button>
                </ListItem>
              </div>
            </>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
