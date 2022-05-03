import * as React from "react";

import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Fab from "@mui/material/Fab";
import DeleteIcon from "@mui/icons-material/Delete";
import { Grid } from "@mui/material";
import axios from "axios";
import { useState, useEffect } from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  bgcolor: "black",
  color: "white",
  border: "2px solid #000",
  boxShadow: 24,
  p: 5,
};

export default function DeleteProjectModal(props) {
  //   const id = props;
  const [projects, setProjects] = useState([]);

  let token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`https://pronto-api-rest.azurewebsites.net/projects/${props.project_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // console.log(response.data);
        setProjects(response.data);
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
      });
  }, []);

  //   console.log(props.project_id);
  //   let navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const submitForm = () => {
    let token = localStorage.getItem("token");

    axios
      .delete(`https://pronto-api-rest.azurewebsites.net/projects/${props.project_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <DeleteIcon button onClick={handleOpen} />
      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        // BackdropProps={{
        //   timeout: 500,
        // }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Grid
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justifyContent="center"
              style={{ minHeight: "40vh" }}
            >
              <Typography justifyContent="center">Are you Sure? </Typography>
              {projects.project_name}

              <Fab
                onClick={(handleClose, submitForm)}
                size="large"
                aria-label="add"
                sx={{
                  mt: 6,
                  color: "black",
                }}
              >
                <DeleteIcon />
              </Fab>

              <Button sx={{ mt: 3, color: "white" }} onClick={handleClose}>
                Close
              </Button>
            </Grid>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
