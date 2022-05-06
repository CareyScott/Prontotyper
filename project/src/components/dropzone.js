import { Grid } from "@mui/material";
import React from "react";
import { useDropzone } from "react-dropzone";
import "./../App.css";
import "./../grid.css";
import "./../button.css";

function Dropzone(props) {
  let UserID = localStorage.getItem("user_id");
  const { open, acceptedFiles } = useDropzone({
    noClick: true,
    noKeyboard: true,
  });

  const files = acceptedFiles.map((file) => {
    props.setFileRecieved(1);
    return <li key={file.path}>{file.name}</li>;
  });

  // Adding Azure Storage Endpoints
  const { BlobServiceClient } = require("@azure/storage-blob");
  const blobSasUrl =
    "https://sketch2codestoresc.blob.core.windows.net/?sv=2020-08-04&ss=bfqt&srt=sco&sp=rwdlacupitfx&se=2022-09-01T15:55:24Z&st=2022-04-25T07:55:24Z&spr=https&sig=kT52sph2xMa4nwrsf0szfKehC6%2F%2FJsxKHxNfRgztWm4%3D";
  const blobServiceClient = new BlobServiceClient(blobSasUrl);
  // containers must be lowercase
  const containerName = props.containerName.toLowerCase();
  // setting current container to Users Container
  const containerClient = blobServiceClient.getContainerClient(UserID);

  const uploadFiles = async () => {
    // creating a container for the Users ID if not exists
    await containerClient.createIfNotExists();

    // tries to upload file
    try {
      console.log("Uploading files...");
      const promises = [];

      // can accept multiple files -- only one in this instance
      acceptedFiles.forEach((file) => {
        // blob options for blob filetype setup
        const blobOptions = {
          blobHTTPHeaders: {
            blobContentType: file.type,
            contentLength: file.length,
          },
        };

        // using the project name + blobName to create a blob within a project folder - will create a folder if it does not exist
        const blockBlobClient = containerClient.getBlockBlobClient(
          `${containerName}/ ${props.blobName.blobName}`
        );
        // const uploadBlobResponse = blockBlobClient.upload(
        // uploading blockBlobClient + file + file size
        blockBlobClient.upload(file, file.size, blobOptions);
        // console.log(`Upload block blob ${file.name} successfully`);
      });
      // resolving async promise
      await Promise.all(promises);
      // console.log("Done.");
    } catch (error) {
      console.log(error.message);
    }
  };

  // if the file is sumbitted in multiStepForm + name can be used from form - run upload function
  if (props.submitFile === true) {
    uploadFiles();
  }

  return (
    <>
      <Grid container spacing={2}>
        <Grid item sx={{ margin: "0 auto", mb: 2, mt: 4 }}>
          <label htmlFor="contained-button-file">
            <div className="upload-button" onClick={open}>
              <span>Choose</span>
              <div className="liquid"></div>
            </div>
          </label>
        </Grid>
        <Grid
          item
          sx={{ margin: "0 auto", mb: 4, textAlign: "center" }}
          xs={12}
        >
          {/* Displays the file added */}
          <p>Files: </p>
          <p>{files}</p>
        </Grid>
      </Grid>
    </>
  );
}

export default Dropzone;
