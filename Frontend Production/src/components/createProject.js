import { Container, Button, TextField } from "@mui/material";
import * as React from "react";
import { MultiStepForm, Step } from "react-multi-form";
import { useState } from "react";
import axios from "axios";
import "../check.css";
export default function CreateProject() {
  let UserID = localStorage.getItem("user_id");

  const [active, setActive] = React.useState(1);
  const [form, setForm] = useState({});

  const handleForm = (e) => {
    setForm((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const submitForm = () => {
    // console.log(form);

    setActive(active + 1);
    // setSubmitFile((current) => true);
    // downloadCodeFromAzure()
    axios
      .post("https://pronto-api-rest.azurewebsites.net/projects", {
        project_name: form.project_name,
        user_id: UserID,
        description: form.description,
        components: [],
      })
      .then((response) => {
        // console.log(response.data);
        setTimeout(() => window.location.reload(), 3000);
      })
      .catch((err) => console.log(err));
    // setActive(active + 1);
  };

  return (
    <Container>
      <MultiStepForm activeStep={active}>
        <Step label="Create Project">
          <div>
            <p className="purple-text-login">Create your project</p>
            <p className="primary-text-login">Fill in the details below.</p>
          </div>
          <TextField
            className="col-8"
            onChange={handleForm}
            margin="normal"
            required
            fullWidth
            id="project_name"
            label="Name Your Project"
            name="project_name"
            autoComplete="project_name"
            autoFocus
          />
          <TextField
            className="col-8"
            onChange={handleForm}
            margin="normal"
            required
            fullWidth
            id="description"
            label="Describe Your Project"
            name="description"
            autoComplete="description"
            autoFocus
            sx={{ mb: 4 }}
          />
        </Step>
        <Step label="Done">
          <div class="wrapper">
            <svg
              class="checkmark"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 52 52"
            >
              <circle
                class="checkmark__circle"
                cx="26"
                cy="26"
                r="25"
                fill="none"
              />
              <path
                class="checkmark__check"
                fill="none"
                d="M14.1 27.2l7.1 7.2 16.7-16.8"
              />
            </svg>
          </div>
        </Step>
      </MultiStepForm>

      {active !== 1 && (
        <Button onClick={() => setActive(active - 1)}>Previous</Button>
      )}
      {/* {active !== 2 && (
        <Button
          onClick={() => setActive(active + 1)}
          style={{ float: "right" }}
        >
          Next
        </Button>
      )} */}
      {active !== 2 && (
        <Button style={{ float: "right" }} onClick={submitForm}>
          Submit
        </Button>
      )}
    </Container>
  );
}
