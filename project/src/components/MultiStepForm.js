import React from "react";
import { Button, Grid, Container, TextField } from "@mui/material";
import { MultiStepForm, Step } from "react-multi-form";
import Dropzone from "./dropzone";
import { useState } from "react";
import axios from "axios";
import { Box } from "@mui/system";
import { ValidationGroup } from "mui-validate";
import "../check.css";

const CreateProject = (props) => {
  const [active, setActive] = React.useState(1);
  const [blobName, setBlobName] = useState({});
  const [submitFile, setSubmitFile] = useState(false);
  const [form, setForm] = useState({});
  const [fileRecieved, setFileRecieved] = useState(0);
  let containerName = props.containerName.toLowerCase();

  const submitForm = () => {
    setSubmitFile((current) => true);
    //wait for for form to complete before submitting image to Azure
    setTimeout(() => {
      // passing function to Dropzone
      setSubmitFile((current) => false);
    }, 0.1);

    // add component with API
    axios
      .post("https://pronto-api-rest.azurewebsites.net/components", {
        component_name: form.component_name,
        project: props.projectID,
        password: form.password,
        description: form.description,
        blob_name: blobName.blobName,
      })
      .then((response) => {
        // console.log(response.data);
      })
      .catch((err) => console.log(err));
  };

  // handle form changes
  const handleForm = (e) => {
    setForm((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // getting the blobName to pass to Dropzone for blob naming
  const handleFormSketch = (e) => {
    setBlobName((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // closing modal
  const closeForm = () => {
    setActive(active + 1);
    submitForm();

    // wait for completion and then reload page
    setTimeout(() => {
      window.location.reload();
    }, 5000);
  };
  // render
  return (
    <ValidationGroup>
      <Container>
        {/* Multi Step form plugin uses steps for file submission + form completion */}
        {/* Active + 1 moves to the next step */}
        <MultiStepForm activeStep={active}>
          <Step label="Upload Sketch">
            <div>
              <p className="purple-text-login">Upload your file</p>
            </div>
            <Dropzone
              containerName={containerName}
              blobName={blobName}
              setFileRecieved={setFileRecieved}
              submitFile={submitFile}
            />
          </Step>
          <Step label="Details">
            <div>
              <p className="purple-text-login">Your Component</p>
              <p className="primary-text-login">
                Fill in the details below to create your component
              </p>
            </div>

            <TextField
              className="col-8"
              onChange={handleForm}
              margin="normal"
              required
              fullWidth
              id="component_name"
              label="Name Your Component"
              name="component_name"
              autoComplete="component_name"
              autoFocus
            />
            <TextField
              className="col-8"
              onChange={handleFormSketch}
              margin="normal"
              required
              fullWidth
              id="blobName"
              label="Name Your Sketch File"
              name="blobName"
              autoComplete="blobName"
              autoFocus
            />

            <TextField
              sx={{ mb: 5 }}
              className="col-8"
              onChange={handleForm}
              margin="normal"
              required
              fullWidth
              id="description"
              label="Description"
              name="description"
              autoComplete="description"
              autoFocus
            />
          </Step>
          <Step label="Confirmation">
            <div>
              <p className="purple-text-login">Confirm Your Details</p>
            </div>
            <div>
              <p className="">
                {!form.blobName && !form.component_name && !form.description ? (
                  <div className="primary-text-login">
                    You Have not completed the form.
                  </div>
                ) : (
                  <Grid sx={{ mt: 12, mb: 12 }}>
                    <Grid>
                      <Grid item>
                        <p className="showFormHeading">
                          Component Name: {form.component_name}
                        </p>
                      </Grid>
                    </Grid>

                    <Grid item>
                      <p className="showFormHeading">
                        Description: {form.description}
                      </p>
                    </Grid>

                    <Grid item>
                      <p className="showFormHeading">
                        Sketch Name: {blobName.blobName}
                      </p>
                    </Grid>
                  </Grid>
                )}{" "}
              </p>
            </div>
          </Step>

          <Step label="Complete">
            {/* CSS Green Tick  */}
            <div class="wrapper">
              {" "}
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

        <Box>
          {active !== 1 && (
            <Button
              style={{ color: "#790FFF" }}
              onClick={() => setActive(active - 1)}
            >
              Previous
            </Button>
          )}

          {active !== 3 ? (
            <>
              {active === 1 ? (
                <Button
                  onClick={() => setActive(active + 1)}
                  sx={{ float: "right", color: "#790FFF" }}
                  disabled={fileRecieved === 0 || active === 4}
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={() => setActive(active + 1)}
                  sx={{ float: "right", color: "#790FFF" }}
                  disabled={
                    (!form.blobName && !form.component_name) ||
                    !form.description ||
                    active === 4
                  }
                >
                  Next
                </Button>
              )}
            </>
          ) : (
            <>
              <Button
                onClick={() => closeForm()}
                sx={{ float: "right", color: "#790FFF" }}
              >
                Submit
              </Button>
            </>
          )}
        </Box>
      </Container>
    </ValidationGroup>
  );
};

export default CreateProject;
