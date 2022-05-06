import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { Typography, Grid } from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import { ListItem } from "@material-ui/core";

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

  const handleLogout = () => {
    props.onAuthenticated(false);
    localStorage.removeItem("user_id");
    // console.log(props);
    navigate(`/`, { replace: true });
  };

  const classes = useStyles();
  return (
    <>
      <nav>
        {!props.authenticated ? (
          <>
            <div className="container-main">
              <div className="col-7">
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
                <Link to="/login">
                  <ListItem>
                    <Button
                      variant="contained"
                      // xs={6}
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
              <div className="col-3"></div>
            </div>
          </>
        ) : (
          <>
            <div className="container-main">
              <div className="col-6">
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
              <div className="col-3"></div>
            </div>
          </>
        )}
      </nav>
    </>
  );
};

export default Navbar;
