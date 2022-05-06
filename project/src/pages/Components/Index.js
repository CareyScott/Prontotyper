// depricated + not in use

// import * as React from "react";
// import Grid from "@mui/material/Grid";
// import Paper from "@mui/material/Paper";
// import Box from "@mui/material/Box";
// import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
// import { Typography } from "@mui/material";
// import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";

// const Item = styled(Paper)(({ theme }) => ({
//   ...theme.typography.body2,
//   textAlign: "center",
//   display: "flex",
//   color: theme.palette.text.secondary,
//   height: 200,
//   width: 200,
//   "&:hover": {
//     color: "white",
//     backgroundColor: "#0B132B",
//   },
// }));

// const HoverItem = styled(Paper)(({ theme }) => ({
//   ...theme.typography.body2,
//   color: theme.palette.text.secondary,
//   height: 200,
//   display: "flex",
//   textAlign: "center",
//   width: 200,
//   "&:hover": {
//     color: "black",
//     backgroundColor: "#5BC0BE",
//   },
// }));

// // index.js
// const { BlobServiceClient } = require("@azure/storage-blob");
// // Now do something interesting with BlobServiceClient

// const fileInput = document.getElementById("file-input");
// const deleteButton = document.getElementById("delete-button");
// const status = document.getElementById("status");
// const fileList = document.getElementById("file-list");

// const reportStatus = (message) => {
//   status.innerHTML += `${message}<br/>`;
//   status.scrollTop = status.scrollHeight;
// };

// // Update <placeholder> with your Blob service SAS URL string
// const blobSasUrl =
//   "https://sketch2codestoresc.blob.core.windows.net/?sv=2020-08-04&ss=bfqt&srt=sco&sp=rwdlacupitfx&se=2022-02-18T20:49:00Z&st=2022-02-18T12:49:00Z&spr=https&sig=ev6PFs9GCWbO5ISYRk4E%2B3Z2e67e%2BbW4hZaEDwdrJBk%3D";

// // Create a new BlobServiceClient
// const blobServiceClient = new BlobServiceClient(blobSasUrl);

// // Create a unique name for the container by
// // appending the current time to the file name
// const containerName = "scottsconstiner" + new Date().getTime();

// // Get a container client from the BlobServiceClient
// const containerClient = blobServiceClient.getContainerClient(containerName);

// const handleCreate = () => {
//   createContainer();
//   console.log("done");
// };
// const createContainer = async () => {
//   try {
//     // reportStatus(`Creating container "${containerName}"...`);
//     await containerClient.create();
//     // reportStatus(`Done.`);
//   } catch (error) {
//     // reportStatus(error.message);

//     console.log("something went wrong creating the container");
//   }
// };

// // deleteButton.addEventListener("click", deleteFiles);

// const darkTheme = createTheme({ palette: { mode: "dark" } });
// const ProjectsIndex = (props) => {
//   let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
//   return (
//     <>
//       <div className="projects-index">
//         <div className="projects-title">
//           <Typography container variant="h3" component="h2">
//             Projects
//           </Typography>
//         </div>
//         <Grid  spacing={4}>
//           {[darkTheme].map((theme, index) => (
//             <Grid item key={index}>
//               <ThemeProvider theme={theme}>
//                 <Box button
//                   sx={{
//                     p: 2,
//                     display: "grid",
//                     gridTemplateColumns: "repeat(5, 3fr)",
//                     gap: 4,
//                   }}
//                 >
//                   <HoverItem button
//                     elevation={3}
//                     onClick={handleCreate}
//                     id="create-container-button"
//                   >
//                     <Typography variant="h1" sx={{ my: "auto", mx: "auto" }}>
//                       <CreateNewFolderIcon sx={{ fontSize: 80 }} />
//                       <Typography>New Project</Typography>
//                     </Typography>
//                   </HoverItem>

//                   {numbers.map((numbers) => (
//                     <Item key={numbers} elevation={3} button>
//                       <Typography
//                         sx={{ my: "auto", mx: "auto" }}
//                         variant="h6"
//                         component="p"
//                       >
//                         {`Project=${numbers}`}
//                       </Typography>
//                     </Item>
//                   ))}
//                 </Box>
//               </ThemeProvider>
//             </Grid>
//           ))}
//         </Grid>
//       </div>
//     </>
//   );
// };

// export default ProjectsIndex;
