import React from "react";
import { Button, Grid, Paper, Container, TextField } from "@mui/material";
import { MultiStepForm, Step } from "react-multi-form";
import Dropzone from "./dropzone";
import { useState, useEffect } from "react";
import axios from "axios";
import download from "f-downloads";
import { getParameters } from "codesandbox/lib/api/define";
let token = localStorage.getItem("token");
let downloaded;

const CreateProject = (props) => {
  const [active, setActive] = React.useState(1);
  const [blobName, setBlobName] = useState({});
  const [submitFile, setSubmitFile] = useState(false);
  const [form, setForm] = useState({});
  const [prediction, setPrediction] = useState();

  const [html, setHtml] = useState("");
  const htmlHead = `import React from "react";
  import ReactDOM from "react-dom";
  import "./css/grid.css";
  import Helmet from "react-helmet";
 
  const element = (
<>
<Helmet><link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap.min.css\" integrity=\"sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u\" crossorigin=\"anonymous\" /></Helmet>

<div className="container">
 ${html}
 </div>
 </> 
 );

  
  ReactDOM.render(
    element,
    document.getElementById('root')
  );`;

  let htmlRoot = '<div id="root"></div>';

  const { BlobServiceClient } = require("@azure/storage-blob");

  const blobSasUrl =
    "https://sketch2codestoresc.blob.core.windows.net/?sv=2020-08-04&ss=bfqt&srt=sco&sp=rwdlacupitfx&se=2022-04-15T16:16:40Z&st=2022-03-31T08:16:40Z&spr=https&sig=UQvWQe5%2BbCMWl4vf5%2FJl5aOWH96O0lri0lwNBD7CkIs%3D";
  const blobServiceClient = new BlobServiceClient(blobSasUrl);

  async function handleDownload() {
    console.log(blobName.blobName);

    const containerClient = blobServiceClient.getContainerClient(
      props.containerName
    );
    const blobClient = containerClient.getBlobClient(
      blobName.blobName + ".html"
    );

    // Get blob content from position 0 to the end
    // In Node.js, get downloaded data by accessing downloadBlockBlobResponse.readableStreamBody
    const downloadBlockBlobResponse = await blobClient.download();
    downloaded = await blobToString(await downloadBlockBlobResponse.blobBody);
    console.log("Downloaded blob content", downloaded);

    download(downloaded, blobName.blobName + ".html", "text/html");

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
  let predictionID;
  const predict = async () => {
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
        // predictionID = response.data.id
        // console.log(response.data);
        setPrediction(response.data.id);
        // setLoading(false);
        // if (prediction) {

        // }
        // console.log(prediction);
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
      });
    // }, [token]);
  };

  const generateCode = () => {
    console.log("Generating code");
    axios
      .get(
        `http://localhost:3030/code/${prediction}/frameworks/bootstrap/projects/${props.containerName}/sketch/${blobName.blobName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        setHtml(response.data);
        console.log("Prediction Code Generated");
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
      });
    // }, [token]);
  };
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

  const returnState = () => {
    setHtml('')
  }
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
  // console.log(downloaded)

  // const cssFile = fs.readFileSync("./positions.css");
  // console.log(cssFile);

  const parameters = getParameters({
    files: {
      "package.json": {
        content: {
          dependencies: {
            react: "latest",
            "react-dom": "latest",
            "react-helmet": "^6.1.0",

            bootstrap: "^5.1.3",
          },
        },
      },
      "index.js": {
        content: htmlHead,
      },
      "index.html": {
        content: htmlRoot,
      },
      "/css/grid.css": {
        isBinary: true,
        content:
          "https://sketch2codestoresc.blob.core.windows.net/new/positions.css",
      },
    },
  });

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
          <Button onClick={generateCode}>Generate</Button>
          <Button onClick={handleDownload}>Download</Button>
          <Button onClick={returnState}>Reset Values</Button>
          <form
            action="https://codesandbox.io/api/v1/sandboxes/define"
            method="POST"
            target="_blank"
          >
            <input type="hidden" name="parameters" value={parameters} />
            <input type="submit" value="Open in sandbox" />
            
          </form>{" "}
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
