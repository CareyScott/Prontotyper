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
      .post("http://localhost:3030/register", {
        full_name: form.full_name,
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
      <Grid container component="main" sx={{ height: "91.2vh" }}>
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
      </Grid>
    </>
  );
}
