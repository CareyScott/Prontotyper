import { Button, Grid, Paper, Typography, Box } from "@mui/material";
import React from "react";
import { useDropzone } from "react-dropzone";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import "./../App.css";
import "./../grid.css";
import "./../button.css";

function Dropzone(props) {
  
  const { getRootProps, getInputProps, open, acceptedFiles } = useDropzone({
    // Disable click and keydown behavior
    noClick: true,
    noKeyboard: true,
  });

  const files = acceptedFiles.map((file) => (
    <li key={file.path}>
      {props.blobName.blobName }
    </li>
  ));

  // console.log(props);

  // index.js
  const { BlobServiceClient } = require("@azure/storage-blob");
  // Now do something interesting with BlobServiceClient

  const createContainerButton = document.getElementById(
    "create-container-button"
  );
  const deleteContainerButton = document.getElementById(
    "delete-container-button"
  );
  const selectButton = document.getElementById("select-button");
  const fileInput = document.getElementById("file-input");
  const listButton = document.getElementById("list-button");
  const deleteButton = document.getElementById("delete-button");
  const status = document.getElementById("status");
  const fileList = document.getElementById("file-list");

  // console.log(props.submitFiles);

  // const reportStatus = (message) => {
  //   status.innerHTML += `${message}<br/>`;
  //   status.scrollTop = status.scrollHeight;
  // };

  // selectButton.addEventListener("click", () => fileInput.click());
  // fileInput.addEventListener("change", uploadFiles);

  // Update <placeholder> with your Blob service SAS URL string
  const blobSasUrl =
    "https://sketch2codestoresc.blob.core.windows.net/?sv=2020-08-04&ss=bfqt&srt=sco&sp=rwdlacupitfx&se=2022-04-15T16:16:40Z&st=2022-03-31T08:16:40Z&spr=https&sig=UQvWQe5%2BbCMWl4vf5%2FJl5aOWH96O0lri0lwNBD7CkIs%3D";
  // Create a new BlobServiceClient
  const blobServiceClient = new BlobServiceClient(blobSasUrl);

  // Create a unique name for the container by
  // appending the current time to the file name
  const containerName = props.containerName.toLowerCase();

  // Get a container client from the BlobServiceClient
  const containerClient = blobServiceClient.getContainerClient(containerName);  

  const uploadFiles = async () => {
    await containerClient.createIfNotExists();
    try {
      console.log("Uploading files...");
      const promises = [];
      // blobName = "upload.html"

      acceptedFiles.forEach((file) => {
        // console.log(file);
        const blobOptions = {
          blobHTTPHeaders: {
            blobContentType: file.type,
            contentLength: file.length,
          },
        };

        const blockBlobClient = containerClient.getBlockBlobClient(props.blobName.blobName);
        const uploadBlobResponse = blockBlobClient.upload(
          file,
          file.size,
          blobOptions
        );
        console.log(
          `Upload block blob ${file.name} successfully`,
          // uploadBlobResponse
        );
      });
      await Promise.all(promises);
      console.log("Done.");
      // downloadCodeFromAzure();

      // listFiles();
    } catch (error) {
      console.log(error.message);
    }
  };



  if (props.submitFile === true) {
    uploadFiles();
  }
  
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box
            sx={{
              justifyContent: "center",
              display: "flex",
              flexWrap: "wrap",
              "& > :not(style)": {
                m: 1,
                height: 150,
                width: 200,
              },
            }}
          >
            <Paper elevation={3} sx={{ textAlign: "center" }}>
              <FileUploadIcon sx={{ fontSize: 60, mt: "10%" }} />
              <p>Upload</p>
            </Paper>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <div {...getRootProps({ className: "dropzone" })}>
            <div className="centered">
              <input {...getInputProps()} />
              <p>Drag 'n' drop some files here</p>
            </div>
          </div>
        </Grid>
        <Grid item xs={3}></Grid>
        <Grid item xs={6}>
          {/* <div className="centered" type="button" onClick={open}> */}
          <label htmlFor="contained-button-file">
            <div className="upload-button" onClick={open}>
              <span>Choose</span>
              <div className="liquid"></div>
            </div>
          </label>
          {/* </div> */}
        </Grid>
        {/* <Grid item xs={4}></Grid> */}
        <Grid item xs={12} sx={{ ml: 2 }}>
       <p className="centered">Files<p>{files}</p> </p> 
        </Grid>
      </Grid>

      
    </>
  );
}

export default Dropzone;

