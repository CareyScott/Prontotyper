import React from "react";
import { Button, Grid, Paper, Container, TextField } from "@mui/material";

import { MultiStepForm, Step } from "react-multi-form";
import Dropzone from "./dropzone";
import { useState, useEffect } from "react";
import axios from "axios";
import download from "f-downloads";

let token = localStorage.getItem("token");



const CreateProject = (props) => {
  const [active, setActive] = React.useState(1);
  const [blobName, setBlobName] = useState({});
  const [submitFile, setSubmitFile] = useState(false);
  const [form, setForm] = useState({});
  const [prediction, setPrediction] = useState({});
  const { BlobServiceClient } = require("@azure/storage-blob");

  const blobSasUrl =
    "https://sketch2codestoresc.blob.core.windows.net/?sv=2020-08-04&ss=bfqt&srt=sco&sp=rwdlacupitfx&se=2022-04-15T16:16:40Z&st=2022-03-31T08:16:40Z&spr=https&sig=UQvWQe5%2BbCMWl4vf5%2FJl5aOWH96O0lri0lwNBD7CkIs%3D";
  const blobServiceClient = new BlobServiceClient(blobSasUrl);



  async function handleDownload() {
      console.log("Downloading blob content");
      
      const containerClient = blobServiceClient.getContainerClient(props.containerName);
      const blobClient = containerClient.getBlobClient(blobName.blobName);
    
      // Get blob content from position 0 to the end
      // In Node.js, get downloaded data by accessing downloadBlockBlobResponse.readableStreamBody
      const downloadBlockBlobResponse = await blobClient.download();
      const downloaded = await blobToString(await downloadBlockBlobResponse.blobBody);
      console.log("Downloaded blob content", downloaded);

      download(
        downloaded,
        blobName.blobName + ".html",
        "text/html"
      );

      async function blobToString(blob) {
        const fileReader = new FileReader();
        return new Promise((resolve, reject) => {
          fileReader.onloadend = (ev) => {
            resolve(ev.target.result);
          };
          fileReader.onerror = reject;
          fileReader.readAsDataURL(blob);
          
        });
      }
    }
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
        // console.log(response.data);
         setPrediction(response.data);
        // setLoading(false);
        generateCode(prediction)
        // console.log(prediction);

      })
      .catch((err) => {
        console.log(`Error: ${err}`);
      });
    // }, [token]);
  };


  const generateCode = () => {
    axios
      .get(
        `http://localhost:3030/code/${prediction.id}/frameworks/HTML/projects/${props.containerName}/sketch/${blobName.blobName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log("Prediction Code Generated")
        
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
      });
    // }, [token]);
  }
  // useEffect(() => {
  //   axios
  // .get(`http://localhost:3030/code/${framework}`, {
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //   },
  // })
  // .then((response) => {
  //   // console.log(response.data);
  //   setCode(response.data);
  //   // setLoading(false);

  //   // console.log(setPredictions);
  // })
  // .catch((err) => {
  //   console.log(`Error: ${err}`);
  // });

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

    setSubmitFile((current) => true);
    // downloadCodeFromAzure()
    axios
      .post("http://localhost:3030/components", {
        component_name: form.component_name,
        project: props.projectID,
        password: form.password,
        description: form.description,
      })
      .then((response) => {
        // console.log(response.data.token);
        props.onAuthenticated(true, response.data.token);
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

  
  // console.log(props);
  return (
    <Container>
      <MultiStepForm activeStep={active}>
        <Step label="Upload Sketch">
          <div>
            <p className="purple-text-login">Upload your Sketch file</p>
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
        </Step>
        <Step label="Prediction">
        <Button onClick={submitForm}>Submit</Button>

        </Step>
        <Step label="Download">
        <Button onClick={predict}>Predict</Button>

          <Button onClick={handleDownload}>Download</Button>
          {/* <a
            href="https://sketch2codestoresc.blob.core.windows.net/new/alltest2.jpg?sv=2020-08-04&ss=bfqt&srt=sco&sp=rwdlacupitfx&se=2022-04-15T16:16:40Z&st=2022-03-31T08:16:40Z&spr=https&sig=UQvWQe5%2BbCMWl4vf5%2FJl5aOWH96O0lri0lwNBD7CkIs%3D&_=1649241528906"
            download="ScottCareyCV.docx"
          >
            Download
          </a> */}
          {/* <Button
            // onClick={
             
            // }
          >
            submit
          </Button> */}
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
