import { Box, Grid, Input, Paper, Typography } from "@material-ui/core";
import React from "react";
import { useDropzone } from "react-dropzone";
import { styled } from "@mui/material/styles";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
function Dropzone(props) {
  const { getRootProps, getInputProps, open, acceptedFiles } = useDropzone({
    // Disable click and keydown behavior
    noClick: true,
    noKeyboard: true,
  });

  const files = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

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

  const reportStatus = (message) => {
    status.innerHTML += `${message}<br/>`;
    status.scrollTop = status.scrollHeight;
  };

  const uploadFiles = async () => {
    try {
      // reportStatus("Uploading files...");
      const promises = [];
      for (const file of files) {
        const blockBlobClient = containerClient.getBlockBlobClient(file.name);
        promises.push(blockBlobClient.uploadBrowserData(file));
      }
      await Promise.all(promises);
      // reportStatus("Done.");
      // listFiles();
    } catch (error) {
      // reportStatus(error.message);
      console.log("comething went wrong uploading the file");
    }
  };

  // selectButton.addEventListener("click", () => fileInput.click());
  // fileInput.addEventListener("change", uploadFiles);

  // Update <placeholder> with your Blob service SAS URL string
  const blobSasUrl = "https://sketch2codestoresc.blob.core.windows.net/?sv=2020-08-04&ss=bfqt&srt=sco&sp=rwdlacupitfx&se=2022-02-17T18:51:06Z&st=2022-02-17T10:51:06Z&spr=https&sig=qRpQbKPwW2s13z%2Bm61PkSAj02R20Aikvi0RNUnA6DLc%3D";
  // Create a new BlobServiceClient
  const blobServiceClient = new BlobServiceClient(blobSasUrl);

  // Create a unique name for the container by
  // appending the current time to the file name
  const containerName = "newboi1645026222612";

  // Get a container client from the BlobServiceClient
  const containerClient = blobServiceClient.getContainerClient(containerName);

  const handleUpload = () => {
    uploadFiles();
    console.log("done");
  };

  return (
    <div className="container">
      <div {...getRootProps({ className: "dropzone" })}>
        <Box
          sx={{
            mt: 2,
            justifyContent: "center",
            display: "flex",
            flexWrap: "wrap",
            "& > :not(style)": {
              m: 1,
              width: "90%",
              height: 300,
            },
          }}
        >
          <Paper elevation={3} className="upload-area">
            <Grid sx={{ mt: 2 }}>
              <FileUploadIcon sx={{ fontSize: 60, mt: 12 }} />
              <Typography variant="h6" sx={{ mt: 6 }}>
                Upload
              </Typography>
            </Grid>
          </Paper>
        </Box>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files above</p>
        {/* <button type="button" onClick={open}> */}
        <label htmlFor="contained-button-file">
          <btn className="btn" onClick={open}>
            <span>Upload</span>
            <div className="liquid"></div>
          </btn>
        </label>
        {/* </button> */}
      </div>
      <aside>
        <h4>Files</h4>
        <ul>{files}</ul>
      </aside>
      <CheckCircleIcon button onClick={handleUpload} />
    </div>
  );
}

export default Dropzone;
