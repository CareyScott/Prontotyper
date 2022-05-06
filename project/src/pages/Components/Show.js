import * as React from "react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { Button, Grid } from "@mui/material";
import download from "f-downloads";
import Loading from "../../components/loadingBar";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { getParameters } from "codesandbox/lib/api/define";
import { useLocation } from "react-router-dom";

// Azure Connection Strings + properties -- Should be added to environement var. Hosting would not allow
const { BlobServiceClient } = require("@azure/storage-blob");
const blobSasUrl =
  "https://sketch2codestoresc.blob.core.windows.net/?sv=2020-08-04&ss=bfqt&srt=sco&sp=rwdlacupitfx&se=2022-09-01T15:55:24Z&st=2022-04-25T07:55:24Z&spr=https&sig=kT52sph2xMa4nwrsf0szfKehC6%2F%2FJsxKHxNfRgztWm4%3D";
const blobServiceClient = new BlobServiceClient(blobSasUrl);

const ComponentsShow = (props) => {
  // react hooks
  const location = useLocation();
  const [component, setComponent] = useState({});
  const [project, setProject] = useState("");
  const [blobName, setBlobName] = useState("");
  const [isLoading, setLoad] = useState(true);
  const [status, setStatus] = useState("");
  const [framework, setFramework] = useState(
    `${location.state.framework ? location.state.framework : "HTML"}`
  );
  const [html, setHTML] = useState("");
  const [sandboxName, setSandboxName] = useState("");
  const [prediction, setPrediction] = useState("");
  const [project_id, setProjectID] = useState("");

  let { id } = useParams();

  // token + userID
  let token = localStorage.getItem("token");
  let UserID = localStorage.getItem("user_id");
  let frameworkHeader;

  // effect hook runs on load once to predict
  useEffect(async () => {
    await predictionRun();
  }, []);

  // values used to pass params from function to function
  let funcBlobName = "";
  let funcComponentName = "";
  let funcProjectName = "";
  let funcPrediction = "";
  let funcHtml = "";

  // CSS classes used and passed to codesandbox
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

  // setting HTML root for Sandbox
  let htmlRoot = '<div id="root"></div>';

  // functions run in order for prediction
  const predictionRun = async () => {
    // setting new status
    setStatus("Getting things ready!");
    // gets component from CosmosDB
    await getComponentData();
    // setting new status
    setStatus("Predicting your code...");
    // Predicts from image uploaded
    await predict(funcBlobName, funcProjectName);
    // setting new status
    setStatus("Done Predicting...");
    // Waits for 3000 until prediction is fully complete
    setTimeout(async () => {
      // setting new status
      setStatus("Generating code...");
      // uses prediction id to generate code + upload to Azure
      await generateCode(funcPrediction);
    }, 3000);
  };

  //get components
  const getComponentData = async () => {
    try {
      const resp = await axios.get(
        `https://pronto-api-rest.azurewebsites.net/components/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // setting hooks
      setBlobName(await resp.data.blob_name);
      setProject(await resp.data.project.project_name.toLowerCase());
      setProjectID(await resp.data.project._id);
      setComponent(await resp.data);

      funcBlobName = await resp.data.blob_name;
      funcProjectName = await resp.data.project.project_name.toLowerCase();
      funcComponentName = await resp.data.component_name;
    } catch (err) {
      console.log(`Error: ${err}`);
    }
  };

  //predict
  const predict = async () => {
    try {
      const resp = await axios.get(
        `https://pronto-api-rest.azurewebsites.net/predict/${funcBlobName}/container/${funcProjectName}/user/${UserID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      funcPrediction = await resp.data.id;
      setPrediction(await resp.data.id);
    } catch (err) {
      console.log(`Error: ${err}`);
    }
  };

  // code generation
  const generateCode = async () => {
    try {
      const resp = await axios.get(
        `https://pronto-api-rest.azurewebsites.net/code/${funcPrediction}/frameworks/${framework}/projects/${funcProjectName}/user/${UserID}/sketch/${funcBlobName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setHTML(await resp.data);
      funcHtml = await resp.data;
      await openSandbox(funcHtml);
      // console.log(funcHtml)
    } catch (err) {
      console.log(`Error: ${err}`);
    }
  };

  // if statement to include bootstrap import link to sandbox
  if (framework === "bootstrap") {
    frameworkHeader = `<Helmet><link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap.min.css\" integrity=\"sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u\" crossorigin=\"anonymous\" /></Helmet>`;
  } else {
    frameworkHeader = "";
  }

  // opening sandbox
  const openSandbox = async (funcHtml) => {
    // used to create an index.js file within sandbox
    // framework + html code added to template literal
    const htmlHead = `import React from "react";
    import ReactDOM from "react-dom";
    import "./css/grid.css";
    import Helmet from "react-helmet";
   
    const element = (
  <>
${frameworkHeader}
  <div className="container">
      ${funcHtml}
   </div>
   </> 
   );
  
    
    ReactDOM.render(
      element,
      document.getElementById('root')
    );`;

    // parameter list for insertion to sandbox
    // sets files + their data
    // imports and installs dependencies
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

    // creates sandbox using the API + uses parameters created above
    try {
      const resp = await axios.post(
        `https://codesandbox.io/api/v1/sandboxes/define?json=1`,
        {
          parameters: parameters,
        }
      );
      // gets sandbox ID
      await setSandboxName(resp.data.sandbox_id);

      // hook - sets code generation complete + removes loading screen
      setLoad(false);
    } catch (err) {
      console.log(`Error: ${err}`);
    }
  };

  // uses sandbox name to get sandbox created above and renders in page
  const Sandbox = () => {
    return (
      <>
        <iframe
          src={`https://codesandbox.io/embed/${sandboxName}`}
          width="100%"
          height="800"
          allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
          sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
        ></iframe>
      </>
    );
  };

  // downlaod code + image function
  async function handleDownload(funcProjectName, fileToDownload) {
    let downloaded;

    // getting by container
    const containerClient = blobServiceClient.getContainerClient(UserID);
    // getting blob with fileToDownload -- 'FOLDER/ BLOBNAME'
    const blobClient = containerClient.getBlobClient(fileToDownload);
    //Download using blob  + container client merged as blob client
    const downloadBlockBlobResponse = await blobClient.download();
    // response contains blob data - converted to dataURL for download
    downloaded = await blobToString(await downloadBlockBlobResponse.blobBody);
    // if is HTML file, format with 'text/html' else format as an image for download
    if (fileToDownload.includes(".html")) {
      download(downloaded, blobName + ".html", "text/html");
    } else download(downloaded, blobName, "image/jpeg");
    // blobToDataURL for download by client
    async function blobToString(blob) {
      const fileReader = new FileReader();
      return new Promise((resolve, reject) => {
        fileReader.onloadend = (ev) => {
          resolve(ev.target.result);
        };
        fileReader.onerror = reject;
        // blob convertion to DataURL
        fileReader.readAsDataURL(blob);
      });
    }
  }

  // development testing delete container  NON WORKING attempting to delete folder. Only deletes container

  // async function handleDelete() {
  //   // Delete container
  //   console.log("\nDeleting container...");

  //   const containerClient = blobServiceClient.getContainerClient(UserID);

  //   const deleteContainerResponse = await containerClient.delete(`${project}/${blobName}`);
  //   console.log(
  //     "Container was deleted successfully. requestId: ",
  //     // deleteContainerResponse.requestId
  //   );

  //     let token = localStorage.getItem("token");

  //       axios
  //         .delete(`https://pronto-api-rest.azurewebsites.net/projects/${component._id}`, {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         })
  //         .then((response) => {
  //           console.log(response.data);
  //         })
  //         .catch((err) => console.log(err));
  // }

  //render loading screen if hook isLoading is true. Once false, render show component
  if (isLoading === true) {
    return (
      <>
        <Grid container>
          <Grid item xs={12}>
            <Loading />
          </Grid>
          <Grid item xs={12}>
            <p className="statusCode">{status}</p>
          </Grid>
        </Grid>
      </>
    );
  } else {
    return (
      <>
        <div className="container-main">
          <div className="col-1"></div>
          <div className="col-11 line-1">{component.component_name}</div>
          <div className="col-1 paragraph-gap "></div>
          <div className="col-1 paragraph-gap">
            <Button
              variant="outlined"
              color="secondary"
              xs={6}
              onClick={() =>
                handleDownload(funcProjectName, `${project}/ ${blobName}.html`)
              }
              sx={{ color: "#790FFF", width: 250, height: 50, mb: 4 }}
            >
              Download Component <FileDownloadIcon />
            </Button>
          </div>
          <div className="col-1 paragraph-gap">
            <Button
              variant="outlined"
              color="secondary"
              xs={6}
              onClick={() =>
                handleDownload(funcProjectName, `${project}/ ${blobName}`)
              }
              sx={{ color: "#790FFF", width: 250, height: 50, mb: 4 }}
            >
              Download Sketch <FileDownloadIcon />
            </Button>
            {/* <Button variant="outlined"
              color="error"
              xs={6}
              onClick={() =>
                handleDelete()
              }
              sx={{ color: "#790FFF", width: 250, height: 50, mb: 4 }}>Delete</Button> */}
          </div>
          <div className="col-9 paragraph-gap"></div>
          <div className="col-1"></div>
          <div className="col-10">
            {sandboxName === "" ? <></> : <Sandbox />}
          </div>
          <div className="col-12"></div>
        </div>
      </>
    );
  }
};

export default ComponentsShow;
