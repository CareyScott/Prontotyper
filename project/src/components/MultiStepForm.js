import React from "react";
import {
  Button,
  Grid,
  Paper,
  Container,
  TextField,
  Typography,
  ButtonBase,
} from "@mui/material";
import { MultiStepForm, Step } from "react-multi-form";
import Dropzone from "./dropzone";
import { useState, useEffect } from "react";
import axios from "axios";
import download from "f-downloads";
import { getParameters } from "codesandbox/lib/api/define";
import Loading from "./loadingBar";
import { Box } from "@mui/system";
import { Validate, ValidationGroup, AutoDisabler } from "mui-validate";

let token = localStorage.getItem("token");
let downloaded;

const CreateProject = (props) => {
  const [active, setActive] = React.useState(1);
  const [blobName, setBlobName] = useState({});
  const [submitFile, setSubmitFile] = useState(false);
  const [form, setForm] = useState({});
  const [prediction, setPrediction] = useState();
  const [status, setStatus] = useState("");
  const [html, setHtml] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDonePredicting, setIsDonePredicting] = useState(false);

  let containerName = props.containerName.toLowerCase();

  // let reader = new FileReader();
  // console.log(reader.readAsText(positionsCSS))

  const positionsCSS = `.container {
  padding-top: 40px;
  width: 1200px;
  margin: auto;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-column-gap: 2em;
  grid-row-gap: 1em;
  grid-row: auto;
}

.nested {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-column-gap: 1.5em;
  grid-row-gap: 1em;
  height: fit-content;
}


.width-1 {
  grid-column: span 1;
}

.width-2 {
  grid-column: span 2;
}

.width-3 {
  grid-column: span 3;
}

.width-4 {
  grid-column: span 4;
}

.width-5 {
  grid-column: span 5;
}

.width-6 {
  grid-column: span 6;
}

.width-7 {
  grid-column: span 7;
}

.width-8 {
  grid-column: span 8;
}

.width-9 {
  grid-column: span 9;
}

.width-10 {
  grid-column: span 10;
}

.width-11 {
  grid-column: span 11;
}

.width-12 {
  grid-column: span 12;
}

.flex {
  display: flex;
  gap: 12px;
}

.flexWidth {
  flex-grow: 1;
}


.left-1 {
  grid-column: span 1;
}

.left-2 {
  grid-column: span 2;
}

.left-3 {
  grid-column: span 3;
}

.left-4 {
  grid-column: span 4;
}

.left-5 {
  grid-column: span 5;
}

.left-6 {
  grid-column: span 6;
}

.left-7 {
  grid-column: span 7;
}

.left-8 {
  grid-column: span 8;
}

.left-9 {
  grid-column: span 9;
}

.left-10 {
  grid-column: span 10;
}

.left-11 {
  grid-column: span 11;
}

.left-12 {
  grid-column: span 12;
}

.break {
  grid-column: span 12;

}


.same{


  
}`;

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

    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(
      blobName.blobName + ".html"
    );
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
    setIsDonePredicting(false);
    setIsLoading(true);
    setStatus("Predicting...");
    console.log(props);

    axios
      .get(
        `http://localhost:3030/predict/${blobName.blobName}/container/${containerName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setPrediction(response.data.id);
        setStatus("Predicting Complete");
        setIsLoading(false);
        setIsDonePredicting(true);
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
      });
  };

  const generateCode = () => {
    setIsLoading(true);

    setTimeout(() => {
      setStatus("Code Generated.");
    }, 500);
    setTimeout(() => {
      setStatus("Code Generated.");
    }, 1000);
    setTimeout(() => {
      setStatus("Uploading Code To Storage...");
    }, 1500);
    axios
      .get(
        `http://localhost:3030/code/${prediction}/frameworks/bootstrap/projects/${containerName}/sketch/${blobName.blobName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);

        setTimeout(() => {
          setStatus("Success! Code uploaded to storage...");
        }, 2000);
        setTimeout(() => {
          setIsLoading(false);
        }, 2500);
        setHtml(response.data);
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
    setStatus("");
    setIsDonePredicting(false);
  };
  const submitForm = () => {
    setSubmitFile((current) => true);

    setTimeout(() => {
      setSubmitFile((current) => false);
    }, 0.1);

    axios
      .post("http://localhost:3030/components", {
        component_name: form.component_name,
        project: props.projectID,
        password: form.password,
        description: form.description,
        blob_name: blobName.blobName
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((err) => console.log(err));
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
    }));
  };

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
        content: positionsCSS,
      },
    },
  });

  let compName = form.component_name;
  // console.log(props);
  return (
    <ValidationGroup>
      <Container>
        <MultiStepForm activeStep={active}>
          <Step label="Upload Sketch">
            <div>
              <p className="purple-text-login">Upload your file</p>
            </div>
            <Dropzone
              containerName={containerName}
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
              // required
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
              <p className="primary-text-login">
                {!form.blobName ? (
                  <div className="primary-text-login">
                    You Have not completed the form.
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
              <Button
                onClick={submitForm}
                variant="outlined"
                sx={{ display: "flex", margin: "0 auto", mt: 10, mb: 10 }}
              >
                Submit Component
              </Button>
            </div>
          </Step>
          <Step label="Prediction">
            <Grid container>
              <Grid item xs={12}>
                {isLoading ? (
                  <Loading />
                ) : isDonePredicting ? (
                  <>
                    <p className="primary-text-login">
                      Done Predicting! <br /> click below to generate your code
                    </p>
                    <Button
                      variant="outlined"
                      sx={{ display: "flex", margin: "0 auto" }}
                      onClick={generateCode}
                    >
                      Generate
                    </Button>
                  </>
                ) : (
                  <p className="primary-text-login">Click Below to predict.</p>
                )}
              </Grid>
            </Grid>

            <Button
              variant="outlined"
              sx={{ display: "flex", margin: "0 auto", mt: 10, mb: 10 }}
              onClick={predict}
            >
              Predict
            </Button>
            <p className="primary-text-login">{status}</p>
          </Step>
          <Step label="Download">
            <Button
              onClick={handleDownload}
              variant="outlined"
              sx={{ display: "flex", margin: "0 auto", mt: 10 }}
            >
              Download Code
            </Button>
            <Button
              onClick={returnState}
              variant="outlined"
              sx={{ display: "flex", margin: "0 auto", mt: 6 }}
            >
              Reset Values
            </Button>
            <form
              action="https://codesandbox.io/api/v1/sandboxes/define"
              method="POST"
              target="_blank"
            >
              <input type="hidden" name="parameters" value={parameters} />
              <Button
                type="submit"
                sx={{
                  display: "flex",
                  margin: "0 auto",
                  textAlign: "center",
                  mt: 6,
                  mb: 6,
                }}
                variant="outlined"
              >
                Open in sandbox
              </Button>
            </form>{" "}
            {status}
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

          {active !== 5 && (
            <>
              <Button
                onClick={() => returnState(setActive(active + 1))}
                sx={{ float: "right", color: "#790FFF" }}
              >
                Next
              </Button>
            </>
          )}
        </Box>
      </Container>
    </ValidationGroup>
  );
};

export default CreateProject;
