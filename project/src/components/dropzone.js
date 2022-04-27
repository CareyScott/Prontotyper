import { Button, Grid, Paper, Typography, Box } from "@mui/material";
import React, { useEffect } from "react";
import { useDropzone } from "react-dropzone";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import "./../App.css";
import "./../grid.css";
import "./../button.css";

function Dropzone(props) {
  
  let UserID = localStorage.getItem("user_id");

  const { getRootProps, getInputProps, open, acceptedFiles } = useDropzone({
    noClick: true,
    noKeyboard: true,
  });

  const files = acceptedFiles.map((file) => 
    {          props.setFileRecieved(1)
     return (
    <li key={file.path}>{file.name}</li>)
    });

console.log(props);

      // useEffect((props) =>{
      //   if ( files === !null ) {
      //     }
      // })

  

  const { BlobServiceClient } = require("@azure/storage-blob");

  const blobSasUrl =
    "https://sketch2codestoresc.blob.core.windows.net/?sv=2020-08-04&ss=bfqt&srt=sco&sp=rwdlacupitfx&se=2022-09-01T15:55:24Z&st=2022-04-25T07:55:24Z&spr=https&sig=kT52sph2xMa4nwrsf0szfKehC6%2F%2FJsxKHxNfRgztWm4%3D";
  const blobServiceClient = new BlobServiceClient(blobSasUrl);

  const containerName = props.containerName.toLowerCase();

  const containerClient = blobServiceClient.getContainerClient(UserID);



  const uploadFiles = async () => {
    await containerClient.createIfNotExists();
    try {
      console.log("Uploading files...");
      const promises = [];

      acceptedFiles.forEach((file) => {
        const blobOptions = {
          blobHTTPHeaders: {
            blobContentType: file.type,
            contentLength: file.length,
          },
        };

        const blockBlobClient = containerClient.getBlockBlobClient(
         `${containerName}/ ${props.blobName.blobName}`
        );
        const uploadBlobResponse = blockBlobClient.upload(
          file,
          file.size,
          blobOptions
        );
        console.log(`Upload block blob ${file.name} successfully`);
      });
      await Promise.all(promises);
      console.log("Done.");
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
        {/* <Grid item xs={12}>
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
              <FileUploadIcon sx={{ fontSize: 60}} />
              <p>Upload</p>
            </Paper>
            <div {...getRootProps({ className: "dropzone" })}>
            <div className="centered">
              <input {...getInputProps()} />
              <p>Drag 'n' drop some files here</p>
            </div>
          </div>
          </Box>
        </Grid> */}
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
          <p>Files: </p>
          <p>{files}</p>
        </Grid>
      </Grid>
    </>
  );
}

export default Dropzone;
