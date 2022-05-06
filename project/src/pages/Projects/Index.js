import { Button, Modal } from "@mui/material";
import * as React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { useSpring, animated } from "react-spring/web.cjs";
import PropTypes from "prop-types";
import Backdrop from "@mui/material/Backdrop";
import sketchhome from "./.././../Images/sketch-home.png";
import CreateProject from "../../components/createProject";
import ProjectListComponent from "../../components/projectListComponent";

// effects from modal
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

  // animation of model
  return (
    <animated.div ref={ref} style={style} {...other}>
      {children}
    </animated.div>
  );
});

// fade properties of modal
Fade.propTypes = {
  children: PropTypes.element,
  in: PropTypes.bool.isRequired,
  onEnter: PropTypes.func,
  onExited: PropTypes.func,
};

// modal style
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  height: 400,
  bgcolor: "white",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const ProjectsIndex = () => {
  let token = localStorage.getItem("token");
  let UserID = localStorage.getItem("user_id");
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [projects, setProjects] = useState([]);

  let navigate = useNavigate();

  // getting projects array
  useEffect(() => {
    axios
      .get(`https://pronto-api-rest.azurewebsites.net/users/${UserID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setProjects(response.data.projects);
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
      });
  }, [token]);

  if (!projects) return null;

  // displaying project list comonent
  const projectsList = projects.map((project) => {
    let projectID = project._id.toString();
    const showProject = (project) => {
      navigate(`/projects/${projectID}`, { replace: true });
    };
    return <ProjectListComponent project={project} />;
  });

  // render
  return (
    <>
      <div className="container-main">
        <div className="col-1"></div>

        {projects[0] ? (
          <div className="col-11 line-1">Your Projects</div>
        ) : (
          <div className="col-11 line-1">Create your first project!</div>
        )}

        <div className="col-1 paragraph-gap "></div>
        <div className="col-1 paragraph-gap">
          <Button
            variant="contained"
            color="primary"
            xs={6}
            onClick={handleOpen}
            sx={{ backgroundColor: "#790FFF", width: 200, height: 50 }}
          >
            Create
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

        <div className="col-1"></div>
        <div className="col-4">
          <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={3}>
            {projectsList}{" "}
          </Box>{" "}
        </div>
      </div>

      <img src={sketchhome} alt="Logo" className="home-img" />

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
            <CreateProject />
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default ProjectsIndex;
