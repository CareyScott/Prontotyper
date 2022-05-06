import {
  Button,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import * as React from "react";
import { useParams } from "react-router-dom";
import Moment from "react-moment";
import { useTheme } from "@mui/material/styles";
import { useState, useEffect } from "react";
import axios from "axios";
import CreateProject from "../../components/MultiStepForm";
import PropTypes from "prop-types";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useSpring, animated } from "react-spring/web.cjs";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import TablePagination from "@mui/material/TablePagination";
import TableFooter from "@mui/material/TableFooter";
import { useNavigate } from "react-router-dom";
import download from "f-downloads";
import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";

// Azure Connection Strings -- Should be added to environement var. Hosting would not allow
const { BlobServiceClient } = require("@azure/storage-blob");
const blobSasUrl =
  "https://sketch2codestoresc.blob.core.windows.net/?sv=2020-08-04&ss=bfqt&srt=sco&sp=rwdlacupitfx&se=2022-09-01T15:55:24Z&st=2022-04-25T07:55:24Z&spr=https&sig=kT52sph2xMa4nwrsf0szfKehC6%2F%2FJsxKHxNfRgztWm4%3D";
const blobServiceClient = new BlobServiceClient(blobSasUrl);

// modal fade effect
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

  // animate
  return (
    <animated.div ref={ref} style={style} {...other}>
      {children}
    </animated.div>
  );
});

// fade properties
Fade.propTypes = {
  children: PropTypes.element,
  in: PropTypes.bool.isRequired,
  onEnter: PropTypes.func,
  onExited: PropTypes.func,
};

// modal styles
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  display: "flex",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
// pagination for table of components -- MUI Component
const TablePaginationActions = (props) => {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
};

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const ShowProject = (props) => {
  const [project, setProject] = useState([]);
  const [components, setComponents] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [framework, setFramework] = React.useState("");

  let navigate = useNavigate();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - components.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChange = (event) => {
    setFramework(event.target.value);
  };

  // getting params and token for api request to get project
  let { id } = useParams();
  let token = localStorage.getItem("token");
  // getting project by ObjectID
  useEffect(() => {
    axios
      .get(`https://pronto-api-rest.azurewebsites.net/projects/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setProject(response.data);
        setComponents(response.data.components);
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
      });
  }, [token]);

  // delete component function -- Delete by ID
  const deleteComponent = (ComponentID) => {
    let token = localStorage.getItem("token");
    axios
      .delete(
        `https://pronto-api-rest.azurewebsites.net/components/${ComponentID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };

  // delete project + components
  async function handleDelete() {
    console.log("\nDeleting container...");
    axios
      .delete(
        `https://pronto-api-rest.azurewebsites.net/projects/${project._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        window.location.replace("/dashboard");
      })
      .catch((err) => console.log(err));
  }

  // download file to pc
  async function handleDownload(fileToDownload, blobName) {
    // file + userID
    let downloaded;
    let UserID = localStorage.getItem("user_id");

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
  // render
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
            onClick={handleDelete}
            xs={6}
            sx={{ color: "#790FFF", width: 200, height: 50 }}
          >
            Delete Project
          </Button>
        </div>
        <div className="col-8"></div>
        <div className="col-12"></div>
        <div className="col-1"></div>

        {/* <div className="col-7">{componentTable}</div> */}
        <TableContainer className="col-10" component={Paper}>
          <Table sx={{ minWidth: 800 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Component Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Last Modified</TableCell>
                <TableCell align="left">Framework &nbsp; &nbsp;</TableCell>
                <TableCell align="left">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? components.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : components
              ).map((component) => (
                <TableRow
                  key={component._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{component.component_name}</TableCell>
                  <TableCell>{component.description}</TableCell>
                  <TableCell>
                    <Moment fromNow ago>
                      {component.createdAt}
                    </Moment>
                  </TableCell>
                  <TableCell>
                    <Moment fromNow ago>
                      {component.updatedAt}
                    </Moment>
                  </TableCell>
                  <TableCell>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        Framework
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={framework}
                        label="Framework"
                        onChange={handleChange}
                      >
                        <MenuItem value={"bootstrap"}>Bootstrap</MenuItem>
                        <MenuItem value={"HTML"}>HTML</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => {
                        navigate(`/components/${component._id}`, {
                          state: { framework: framework },
                          replace: true,
                        });
                      }}
                    >
                      View
                    </Button>

                    <Button
                      sx={{ color: "green" }}
                      onClick={() =>
                        handleDownload(
                          `${project.project_name.toLowerCase()}/ ${
                            component.blob_name
                          }`,
                          component.blob_name
                        )
                      }
                    >
                      Download
                    </Button>
                    <Button
                      onClick={() => deleteComponent(component._id)}
                      sx={{ color: "red" }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 7]}
                  // colSpan={3}
                  count={components.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: {
                      "aria-label": "rows per page",
                    },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
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
              />
            </Box>
          </Fade>
        </Modal>
      </div>
    </>
  );
};

export default ShowProject;
