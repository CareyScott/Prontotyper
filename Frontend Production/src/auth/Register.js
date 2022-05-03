import * as React from "react";
import { useState } from "react";
import axios from "axios";
import { TextField, Box, Grid, Button, Paper, Link } from "@mui/material";
import "./../grid.css";
import "./../styles.css";
import logo from "../Images/Prontotyper.png";
import { useNavigate } from "react-router-dom";

export default function Register(props) {
  const [form, setForm] = useState({});
  const [failed, setFailed] = useState(false);

  let navigate = useNavigate();

  const navigateLogin = () => {
    navigate(`/login`, { replace: true });
  };

  const handleForm = (e) => {
    setForm((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  const submitForm = () => {
    // console.log(form);

    const navigateHome = () => {
      navigate(`/`, { replace: true });
    };

    
    axios
      .post("https://pronto-api-rest.azurewebsites.net/register", {
        full_name: form.full_name,
        email: form.email,
        password: form.password,
      })
      .then((response) => {
        // console.log(response.data.token);
        props.onAuthenticated(true, response.data.token);
        // localStorage.setItem("userID", response.data);
        localStorage.setItem("user_id", response.data.userID);

      })
      .then(() => {
        navigateHome();
      })
      .catch((err) => {
        setFailed(true);
        console.log(err);
      });  };

  return (
    <>
      {/* <Grid container component="main" sx={{ height: "91.2vh" }}>
        <Box component="form" noValidate sx={{ mt: 1 }}>
          <TextField
            onChange={handleForm}
            margin="normal"
            required
            fullWidth
            id="full_name"
            label="full_name"
            name="full_name"
            autoComplete="full_name"
            autoFocus
          />
          <TextField
            onChange={handleForm}
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            onChange={handleForm}
            margin="normal"
            required
            fullWidth
            id="password"
            label="Password"
            name="password"
            autoComplete="password"
            autoFocus
          />
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={submitForm}
          >
            Sign In
          </Button>{" "}
        </Box>
      </Grid> */}

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
              Enter your credentials to get started.
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
              error={failed}

              id="full_name"
              label="Full Name"
              helperText={failed ? "Invalid Entry." : ""}

              name="full_name"
              autoComplete="full_name"
              autoFocus
            />
            <div className="col-2"></div>
            <div className="col-2"></div>

            <TextField
              onChange={handleForm}
              margin="normal"
              className="col-8"
              required
              error={failed}

              fullWidth
              id="email"
              label="Email Address"
              name="email"
              helperText={failed ? "Invalid Email." : ""}
              autoComplete="email"
              autoFocus
            />
            <div className="col-2"></div>
            <div className="col-2"></div>

            <TextField
              onChange={handleForm}
              margin="normal"
              error={failed}

              required
              className="col-8"
              fullWidth
              helperText={failed ? "Invalid Password." : ""}
              id="password"
              type={ "password"}
              placeholder="password"
              label="Password"
              name="password"
              autoComplete="password"
              autoFocus
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
              Sign Up
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
              Already registered? Click&nbsp;<Link onClick={navigateLogin}>here</Link>&nbsp;to
              sign in!
            </p>
          </div>
          {/* </Box> */}
          {/* </div> */}
        </Box>
      </div>
    </>
  );
}
