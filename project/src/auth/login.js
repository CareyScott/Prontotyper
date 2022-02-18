import * as React from "react";
import { useState } from "react";
import axios from "axios";
import { TextField, Box, Grid, Button } from "@material-ui/core";

export default function LoginForm(props) {
  const [form, setForm] = useState({});

  const handleForm = (e) => {
    setForm((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  const submitForm = () => {
    console.log(form);

    axios
      .post("https://localhost:3000/api/user/login", {
        // name: form.name,
        email: form.email,
        password: form.password,
      })
      .then((response) => {
        // console.log(response.data.auth_token);
        // props.onAuthenticated(true, response.data.auth_token);
        // localStorage.setItem("userID", response.data);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Grid container component="main" sx={{ height: "91.2vh" }}>
        <Box component="form" noValidate sx={{ mt: 1 }}>
          {/* <TextField
            onChange={handleForm}
            margin="normal"
            required
            fullWidth
            id="email"
            label="Name"
            name="name"
            autoComplete="name"
            autoFocus
          /> */}
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
              </Button>        </Box>
      </Grid>
    </>
  );
}
