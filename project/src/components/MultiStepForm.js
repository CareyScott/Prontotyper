import React from "react";
import { Button, Grid, Paper, Container, TextField } from "@mui/material";

import { MultiStepForm, Step } from "react-multi-form";
import Dropzone from "./dropzone";
import { useState, useEffect } from "react";
import axios from "axios";
const { BlobServiceClient } = require("@azure/storage-blob");
let token = localStorage.getItem("token");

const CreateProject = (props) => {
  const [active, setActive] = React.useState(1);
  const [blobName, setBlobName] = useState({});
  const [submitFile, setSubmitFile] = useState(false);
  const [form, setForm] = useState({});
  const [prediction, setPrediction] = useState();

  const predict = () => {
    // useEffect(() => {
      axios
        .get(
          `http://localhost:3030/predict/${blobName.blobName}/container/${props.containerName}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          console.log(response.data);
          setPrediction(response.data.predictions);
          // setLoading(false);

          // console.log(setPredictions);
        })
        .catch((err) => {
          console.log(`Error: ${err}`);
        });
    // }, [token]);
      }
  //   //     useEffect(() => {
  //   //       axios
  //   //     .get(`http://localhost:3030/code/${framework}`, {
  //   //       headers: {
  //   //         Authorization: `Bearer ${token}`,
  //   //       },
  //   //     })
  //   //     .then((response) => {
  //   //       // console.log(response.data);
  //   //       setCode(response.data);
  //   //       // setLoading(false);

  //   //       // console.log(setPredictions);
  //   //     })
  //   //     .catch((err) => {
  //   //       console.log(`Error: ${err}`);
  //   //     });

  //   // }, [token]);
  // };
  // const [code, setCode] = useState({});
  // const [isLoading, setLoading] = useState(true);
  // const [framework, setFramework] = useState("bootstrap");

  // if (framework == "bootstrap") {
  //   frameworkScript = BootStrapScript
  // }else {
  //   frameworkScript = ""
  // }
  // const buttonHandler = () => {
  //   setSubmitFile((current) => !current);
  // };

  const submitForm = () => {
    // console.log(form);

    setSubmitFile((current) => !current);
    // downloadCodeFromAzure()
    axios
      .post("http://localhost:3030/components", {
        component_name: form.component_name,
        project: props.projectID,
        password: form.password,
        description: form.description,
      })
      .then((response) => {
        console.log(response.data.token);
        props.onAuthenticated(true, response.data.token);
        // localStorage.setItem("userID", response.data);
      })
      .catch((err) => console.log(err));

      

    setActive(active + 1);
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

  // async function downloadCodeFromAzure() {

  //   const blobSasUrl =
  //   "https://sketch2codestoresc.blob.core.windows.net/?sv=2020-08-04&ss=bfqt&srt=sco&sp=rwdlacupitfx&se=2022-04-15T16:16:40Z&st=2022-03-31T08:16:40Z&spr=https&sig=UQvWQe5%2BbCMWl4vf5%2FJl5aOWH96O0lri0lwNBD7CkIs%3D";
  // // Create a new BlobServiceClient
  //     const blobServiceClient = new BlobServiceClient(blobSasUrl);

  //   const containerClient = blobServiceClient.getContainerClient(
  //     props.containerName
  //   );
  //   const blobClient = containerClient.getBlobClient(blobName.blobName);

  //   // Get blob content from position 0 to the end
  //   // In Node.js, get downloaded data by accessing downloadBlockBlobResponse.readableStreamBody
  //   const downloadBlockBlobResponse = await blobClient.download();
  //   const downloaded = await streamToBuffer(
  //     downloadBlockBlobResponse.readableStreamBody
  //   );
  //   // console.log("Downloaded blob content" + downloaded);

  //   // console.log("Downloaded blob content:", downloaded);

  //   // fs.writeFile(`./Images/${req.params.blobName}`, downloaded, function (err) {
  //   //   if (err) {
  //   //     return console.error(err);
  //   //   }
  //   //   console.log("File saved successfully!");
  //   //   fileSaved = true;
  //   //   downloadedFile = downloaded;
  //   //   return downloadedFile;
  //   // });

  //   // [Node.js only] A helper method used to read a Node.js readable stream into a Buffer
  //   async function streamToBuffer(readableStream) {
  //     return new Promise((resolve, reject) => {
  //       const chunks = [];
  //       readableStream.on("data", (data) => {
  //         chunks.push(data instanceof Buffer ? data : Buffer.from(data));
  //       });
  //       readableStream.on("end", () => {
  //         resolve(Buffer.concat(chunks));
  //       });
  //       readableStream.on("error", reject);
  //     });
  //   }

  //   return downloaded;
  // }

  // console.log(props);
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
          {/* <Button onClick={buttonHandler}>Form</Button> */}
        </Step>
        <Step label="Prediction">
          <Button onClick={submitForm}>submit</Button>
        </Step>
        <Step label="Download">
          <Button onClick={predict}>submit</Button>
        </Step>
      </MultiStepForm>

      {active !== 1 && (
        <Button onClick={() => setActive(active - 1)}>Previous</Button>
      )}
      {active !== 5 && (
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
