import * as React from "react";
import { useState } from "react";
import axios from "axios";
import { TextField, Box, Grid, Button, Paper, Link } from "@mui/material";
import "./../grid.css";
import "./../styles.css";
import { makeStyles } from "@material-ui/core/styles";

import logo from "../Images/Prontotyper.png";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  drawerPaper: { width: "inherit" },
  navList: {
    // float: "right",
    textDecoration: "none",
    // color: theme.palette.text.primary,
  },
  navListButton: {
    // float: "right",
    textDecoration: "none",
  },
  link: { textDecoration: "none", color: theme.palette.text.primary },
}));

const Login = (props) => {
  const [form, setForm] = useState({});
  const classes = useStyles();

  const handleForm = (e) => {
    setForm((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  const submitForm = () => {
    console.log(form);

    axios
      .post("http://localhost:3030/login", {
        // name: form.name,
        email: form.email,
        password: form.password,
      })
      .then((response) => {
        console.log(response.data.token);
        props.onAuthenticated(true, response.data.token);
        // localStorage.setItem("userID", response.data);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <div className="container-main">
        <div className="col-4"></div>
        <Box
          component="form"
          noValidate
          className="col-4 centered"
          sx={{ borderRadius: 2 }}
        >
          <div>
            <img src={logo} alt="Logo" className=" logo-centered" />
          </div>

          <div>
            <p className="purple-text-login">Welcome!</p>
            <p className="primary-text-login">
              Enter your credentials to continue
            </p>
          </div>

          <div className="nested-main ">
            <div className="col-2"></div>
            <TextField
              className="col-8"
              onChange={handleForm}
              margin="normal"
              required
              fullWidth
              // sx={{ m: 1 }}
              id="email"
              // margin="dense"
              label="Email Address"
              name="email"
              variant="outlined"
              autoComplete="email"
              autoFocus
            />
            <div className="col-2"></div>
            <div className="col-2"></div>

            <TextField
              onChange={handleForm}
              margin="normal"
              className="col-8"
              // margin="dense"
              required
              fullWidth
              id="password"
              variant="outlined"
              // sx={{ width: 50 }}
              label="Password"
              name="password"
              autoComplete="password"
              // autoFocus
            />
            <div className="col-12"></div>
            <div className="col-12"></div>
            <div className="col-12"></div>
          </div>

          <div>
            <Button
              variant="contained"
              color="secondary"
              sx={{ width: 200, height: 50 }}
              onClick={submitForm}
            >
              Sign In
            </Button>

            <Link to="/">
              <Button
                color="secondary"
                xs={6}
                sx={{
                  color: "#790FFF",
                  width: 200,
                  height: 50,
                  textDecoration: "none",
                }}
              >
                Cancel
              </Button>
            </Link>
            <hr />

            <p className="purple-text-login-small">
              Not registered? Click&nbsp;<a href="/register">here</a>&nbsp;to sign up!
            </p>
          </div>
          {/* </Box> */}
          {/* </div> */}
        </Box>
      </div>
    </>
  );
};

export default Login;
