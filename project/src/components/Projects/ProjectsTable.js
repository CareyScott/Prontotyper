import * as React from "react";
import Table from "@mui/material/Table";
import { useState, useEffect } from "react";
import axios from "axios";
import Moment from "react-moment";

import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button, Link } from "@mui/material";
import ProjectsEdit from "../../pages/Projects/Edit";
import DeleteProjectModal from "./Delete";

const projectsTable = () => {
  function preventDefault(event) {
    event.preventDefault();
  }

  const [projects, setProjects] = useState([]);
  let token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`http://localhost:3030/projects`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setProjects(response.data);
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
      });
  }, []);


  if (!projects) return null;

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Project Name</TableCell>
            <TableCell align="right"> # Of Components</TableCell>
            <TableCell align="right">Framework</TableCell>
           
            <TableCell align="right">Date Created</TableCell>
            <TableCell align="right">Last Modified</TableCell>
            <TableCell align="center">Edit</TableCell>
            <TableCell align="center">Delete</TableCell>

          </TableRow>
        </TableHead>
        <TableBody>
          {projects.map((project, i) => (
            <TableRow
              key={i}
              data-id={project._id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {project.project_name}
              </TableCell>
              <TableCell align="right">{project.components.length}</TableCell>
              <TableCell align="right">{project.project_framework}</TableCell>

              <TableCell align="right"><Moment fromNow>{project.createdAt}</Moment></TableCell>
              <TableCell align="right"><Moment fromNow>{project.updatedAt}</Moment></TableCell>
              <TableCell align="center"><Link project_id={project._id} href={"/projects/"+ project._id + "/edit"} >Edit</Link></TableCell>
              <TableCell align="center"><DeleteProjectModal project_id={project._id}/></TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default projectsTable;
