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

const { BlobServiceClient } = require("@azure/storage-blob");

const blobSasUrl =
  "https://sketch2codestoresc.blob.core.windows.net/?sv=2020-08-04&ss=bfqt&srt=sco&sp=rwdlacupitfx&se=2022-09-01T15:55:24Z&st=2022-04-25T07:55:24Z&spr=https&sig=kT52sph2xMa4nwrsf0szfKehC6%2F%2FJsxKHxNfRgztWm4%3D";
const blobServiceClient = new BlobServiceClient(blobSasUrl);

// const { BlobServiceClient } = require("@azure/storage-blob");

// const blobSasUrl =
//   "https://sketch2codestoresc.blob.core.windows.net/?sv=2020-08-04&ss=bfqt&srt=sco&sp=rwdlacupitfx&se=2022-09-01T15:55:24Z&st=2022-04-25T07:55:24Z&spr=https&sig=kT52sph2xMa4nwrsf0szfKehC6%2F%2FJsxKHxNfRgztWm4%3D";
// const blobServiceClient = new BlobServiceClient(blobSasUrl);

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
  display: "flex",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

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

  // const navigateComponent = (id) => {
  //   navigate(`/components/${id}`, { replace: true });
  // };

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

  let { id } = useParams();
  let token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`https://pronto-api-rest.azurewebsites.net/projects/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // console.log(response.data);
        setProject(response.data);
        setComponents(response.data.components);
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
      });
  }, [token]);

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
      .then((response) => {
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };

  async function handleDelete() {
    // Delete container
    console.log("\nDeleting container...");

    // let UserID = localStorage.getItem("user_id");

    // const containerClient = blobServiceClient.getContainerClient(`${UserID}/ ${project.project_name}`);
    // let token = localStorage.getItem("token");

    axios
      .delete(
        `https://pronto-api-rest.azurewebsites.net/projects/${project._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        // console.log(response.data);
        window.location.replace("/dashboard");
      })
      .catch((err) => console.log(err));

    // const deleteContainerResponse = await containerClient.delete();
    // console.log(
    //   "Container was deleted successfully. requestId: ",
    //   // deleteContainerResponse.requestId
    // );
  }

  // const columns = [
  //   { field: "_id", headerName: "ID", width: 150 },
  //   { field: "project", headerName: "Project ID", width: 150 },
  //   { field: "component_name", headerName: "component_name", width: 150 },
  //   { field: "createdAt", headerName: "Created At", width: 150 },
  //   { field: "updatedAt", headerName: "Last Updated", width: 150 },
  //   // { field: 'file_url', headerName: 'File Location', width: 150 },
  // ];

  // console.log(props)
  async function handleDownload(fileToDownload, blobName) {
    let downloaded;
    console.log(fileToDownload);
    console.log(blobName);

    let UserID = localStorage.getItem("user_id");
    const containerClient = blobServiceClient.getContainerClient(UserID);
    // console.log(funcProjectName);
    const blobClient = containerClient.getBlobClient(fileToDownload);
    const downloadBlockBlobResponse = await blobClient.download();
    downloaded = await blobToString(await downloadBlockBlobResponse.blobBody);
    console.log("Downloaded blob content", downloaded);

    if (fileToDownload.includes(".html")) {
      download(downloaded, blobName + ".html", "text/html");
    } else download(downloaded, blobName, "image/jpeg");

    async function blobToString(blob) {
      const fileReader = new FileReader();
      return new Promise((resolve, reject) => {
        fileReader.onloadend = (ev) => {
          resolve(ev.target.result);
        };
        fileReader.onerror = reject;
        fileReader.readAsDataURL(blob);
      });
    }
  }

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
                         
                          state:{framework: framework},
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
                    {/* <Button disabled sx={{ color: "orange" }}>Edit</Button> */}
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
                // onAuthenticated={props.onAuthenticated}
                // authenticated={props.authenticated}
              />
            </Box>
          </Fade>
        </Modal>
      </div>
    </>
  );
};

export default ShowProject;
