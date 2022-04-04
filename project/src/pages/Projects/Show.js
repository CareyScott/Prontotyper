import { Button, Paper, Grid } from "@mui/material";
import * as React from "react";
import sketchhome from "./.././../Images/sketch-home.png";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { Project } from "@azure/cognitiveservices-customvision-training/esm/models/mappers";
import { DataGrid } from '@mui/x-data-grid';
import CreateProject from "../../components/MultiStepForm";

let token = localStorage.getItem("token");

import PropTypes from 'prop-types';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
// web.cjs is required for IE11 support
import { useSpring, animated } from 'react-spring/web.cjs';

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
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  height: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
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
    { field: '_id', headerName: 'ID', width: 150 },
    { field: 'project', headerName: 'Project ID', width: 150 },
    { field: 'createdAt', headerName: 'Created At', width: 150 },
    { field: 'updatedAt', headerName: 'Last Updated', width: 150 },
    { field: 'file_url', headerName: 'File Location', width: 150 },
    
   
  ];
  


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
           
           onClick={handleOpen}>
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

        <div style={{ height: 400}} className="col-7">
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
          <CreateProject containerName={project.project_name}/>
          </Box>
        </Fade>
      </Modal>
      </div>

     
    </>
  );
};

export default ShowProject
