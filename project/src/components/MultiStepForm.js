import React from "react";
import { Button, Grid, Paper, Container, TextField } from "@mui/material";

import { MultiStepForm, Step } from "react-multi-form";
import Dropzone from "./dropzone";
import { useState, useEffect } from "react";

const CreateProject = (props) => {
  const [active, setActive] = React.useState(1);
  const [blobName, setBlobName] = useState({});
  const [submitFile, setSubmitFile] = useState(false);
  const [form, setForm] = useState({});
  const buttonHandler = () => {
    setSubmitFile((current) => !current);
  };
  const handleForm = (e) => {
    setForm((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFormSketch = (e) => {
    setBlobName((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
      // newBlobName === blobName
    }));
  };

  console.log(props);
  return (
    <Container>
      <MultiStepForm activeStep={active}>
        <Step label="Upload Sketch">
          <div>
            <p className="purple-text-login">Upload your Sketch file</p>
            {/* <p className="primary-text-login">
              Fill in the details below to create your component
            </p> */}
          </div>
          <Dropzone
            containerName={props.containerName}
            blobName={blobName}
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
          {/* <TextField
              className="col-8"
              onChange={handleForm}
              margin="normal"
              required
              fullWidth
              id="framework"
              label="Framework Name"
              name="framework"
              autoComplete="framework"
              autoFocus
            /> */}
        </Step>
        <Step label="Confirmation">
          <div>
            <p className="purple-text-login">Confirm Your Details</p>
            <p className="primary-text-login">
              Double check your details before continuing!
            </p>
          </div>
          <div>
            <p className="primary-text-login">
              {!form ? (
                <div className="primary-text-login">
                  You Have not submitted any info.
                </div>
              ) : (
                <div>
                  <div className="primary-text-login">
                    Component Name: {form.component_name}
                  </div>
                  
                  <div className="primary-text-login">
                    Sketch Name: {blobName.blobName}
                  </div>
                  <div className="primary-text-login">
                    Description: {form.description}
                  </div>
                </div>
              )}{" "}
            </p>
          </div>
          <Button onClick={buttonHandler}>Form</Button>
        </Step>
        <Step label="Prediction">
          <div>Hi</div>
        </Step>
      </MultiStepForm>

      {active !== 1 && (
        <Button onClick={() => setActive(active - 1)}>Previous</Button>
      )}
      {active !== 4 && (
        <Button
          onClick={() => setActive(active + 1)}
          style={{ float: "right" }}
        >
          Next
        </Button>
      )}
    </Container>
  );
};

export default CreateProject;
