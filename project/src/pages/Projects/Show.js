import { Button, Paper, Grid } from "@mui/material";
import * as React from "react";
import sketchhome from "./.././../Images/sketch-home.png";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { Project } from "@azure/cognitiveservices-customvision-training/esm/models/mappers";
import { DataGrid } from "@mui/x-data-grid";
import CreateProject from "../../components/MultiStepForm";
import download from "f-downloads";


import PropTypes from "prop-types";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
// web.cjs is required for IE11 support
import { useSpring, animated } from "react-spring/web.cjs";
const { BlobServiceClient } = require("@azure/storage-blob");

// async function handleDownload() {
//   console.log("Downloading blob content");
//   const blobSasUrl =
//     "https://sketch2codestoresc.blob.core.windows.net/?sv=2020-08-04&ss=bfqt&srt=sco&sp=rwdlacupitfx&se=2022-04-15T16:16:40Z&st=2022-03-31T08:16:40Z&spr=https&sig=UQvWQe5%2BbCMWl4vf5%2FJl5aOWH96O0lri0lwNBD7CkIs%3D";
//   const blobServiceClient = new BlobServiceClient(blobSasUrl);

//   const containerClient = blobServiceClient.getContainerClient("new");
//   const blobClient = containerClient.getBlobClient("codeforContainer4.html");

//   // Get blob content from position 0 to the end
//   // In Node.js, get downloaded data by accessing downloadBlockBlobResponse.readableStreamBody
//   const downloadBlockBlobResponse = await blobClient.download();
//   const downloaded = await blobToString(
//     await downloadBlockBlobResponse.blobBody
//   );
//   console.log("Downloaded blob content", downloaded);

//   async function blobToString(blob) {
//     const fileReader = new FileReader();
//     return new Promise((resolve, reject) => {
//       fileReader.onloadend = (ev) => {
//         resolve(ev.target.result);
//       };
//       fileReader.onerror = reject;
//       // fileReader.readAsDataURL(blob);
//       download(
//         fileReader.readAsDataURL(blob),
//         "dlDataUrlText.html",
//         "text/html"
//       );
//     });
//   }
// }

const Fade = React.forwardRef(function Fade(props, ref) {
  const { in: open, children, onEnter, onExited, ...other } = props;
  const style = useSpring({
    from: { opacity: 0 },
    to: { opacity: open ? 1 : 0 },
    onStart: () => {
      if (open && onEnter) {
        onEnter();
      }
    },
    onRest: () => {
      if (!open && onExited) {
        onExited();
      }
    },
  });

  return (
    <animated.div ref={ref} style={style} {...other}>
      {children}
    </animated.div>
  );
});

Fade.propTypes = {
  children: PropTypes.element,
  in: PropTypes.bool.isRequired,
  onEnter: PropTypes.func,
  onExited: PropTypes.func,
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  height: 550,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const ShowProject = (props) => {
  const [project, setProject] = useState([]);
  const [components, setComponents] = useState([]);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  let { id } = useParams();
  let token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`http://localhost:3030/projects/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setProject(response.data);
        setComponents(response.data.components);
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
      });
  }, [token]);

  const columns = [
    { field: "_id", headerName: "ID", width: 150 },
    { field: "project", headerName: "Project ID", width: 150 },
    { field: "component_name", headerName: "component_name", width: 150 },
    { field: "createdAt", headerName: "Created At", width: 150 },
    { field: "updatedAt", headerName: "Last Updated", width: 150 },
    // { field: 'file_url', headerName: 'File Location', width: 150 },
  ];

  // console.log(props)

  return (
    <>
      <div className="container-main">
        <div className="col-1"></div>
        <div className="col-11 line-1">{project.project_name}</div>
        <div className="col-1 paragraph-gap "></div>
        <div className="col-1 paragraph-gap">
          <Button
            variant="contained"
            color="primary"
            xs={6}
            sx={{ backgroundColor: "#790FFF", width: 200, height: 50 }}
            onClick={handleOpen}
          >
            Create Component
          </Button>
          
        </div>
        <div className="col-2 paragraph-gap">
          <Button
            color="secondary"
            xs={6}
            sx={{ color: "#790FFF", width: 200, height: 50 }}
          >
            Help{" "}
          </Button>
        </div>
        <div className="col-8"></div>
        <div className="col-12"></div>
        <div className="col-2"></div>

        <div style={{ height: 400 }} className="col-7">
          <DataGrid
            rows={components}
            getRowId={(row) => row._id}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
          />
        </div>
        {/* <div className="col-7">{componentTable}</div> */}

        <Modal
          aria-labelledby="spring-modal-title"
          aria-describedby="spring-modal-description"
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <Box sx={style}>
              <CreateProject
                containerName={project.project_name}
                projectID={project._id}
                onAuthenticated={props.onAuthenticated}
                authenticated={props.authenticated}
              />
            </Box>
          </Fade>
        </Modal>
      </div>
    </>
  );
};

export default ShowProject;
