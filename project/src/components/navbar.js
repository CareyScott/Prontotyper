import { Link, useNavigate } from "react-router-dom";
import { AppBar } from "@mui/material";
import { Box } from "@mui/system";
import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { Typography, Grid } from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";



<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
/>;



const useStyles = makeStyles((theme) => ({
  drawerPaper: { width: "inherit" },
  navList: {float:"left", textDecoration: "none", color: theme.palette.text.primary},
  link: { textDecoration: "none", color: theme.palette.text.primary },
}));

const Navbar = (props) => {
  const [navbar, setNavbar] = useState(false);

  // if (props.authenticated) {
  //   <>
  //     <Button sx={{ my: 2, color: "white", display: "block" }}>Logout</Button>
  //   </>;
  // }

  const changeBackground = () => {
    if (window.scrollY >= 80) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

  window.addEventListener("scroll", changeBackground);

  const classes = useStyles();
  return (
    <>
      <nav className={navbar ? "navbar active" : "navbar"}>
      <Grid
          sx={{ flexGrow: 2, display: { xs: "flex", md: "flex", lg: "flex" } }}
        >
          <div className="navbar-left">
          <Typography variant="h3" component="h4" sx={{ml: 2}} className={navbar ? "navbarFont active" : "navbarFont"}>
            Logo
          </Typography>
          </div>
          <div className="navbar-right">
          <Link to="/" className={classes.navList}>
            <ListItem button>
              <Typography variant="h6" component="p" className={navbar ? "navbarFont active" : "navbarFont"}>
                Home
              </Typography>
            </ListItem>
          </Link>

          <Link to="/dashboard" className={classes.navList}>
            <ListItem button>
              <Typography variant="h6" component="p" className={navbar ? "navbarFont active" : "navbarFont"}>
                Dashboard
              </Typography>
            </ListItem>
          </Link>

          <Link to="/projects" className={classes.navList}>
            <ListItem button>
              <Typography variant="h6" component="p" className={navbar ? "navbarFont active" : "navbarFont"}>
                Projects
              </Typography>
            </ListItem>
          </Link>
          </div>
        
        </Grid>
      </nav>
    </>
  );
};

export default Navbar;
