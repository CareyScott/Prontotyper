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
import DeleteComponentModal from "./Delete";

const ComponentsTable = () => {
  function preventDefault(event) {
    event.preventDefault();
  }

  const [components, setComponents] = useState([]);
  let token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`http://localhost:3030/components`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setComponents(response.data);
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
      });
  }, []);


  if (!components) return null;

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Component Name</TableCell>
            <TableCell align="right"> file_url</TableCell>
            <TableCell align="right">code_output_url</TableCell>
            <TableCell align="right">project</TableCell>
           
            <TableCell align="right">Date Created</TableCell>
            <TableCell align="right">Last Modified</TableCell>
            <TableCell align="center">Edit</TableCell>
            <TableCell align="center">Delete</TableCell>

          </TableRow>
        </TableHead>
        <TableBody>
          {components.map((component, i) => (
            <TableRow
              key={i}
              data-id={component._id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {component.component_name}
              </TableCell>
              <TableCell align="right">{component.file_url}</TableCell>
              <TableCell align="right">{component.code_output_url}</TableCell>
              <TableCell align="right">{component.project}</TableCell>

              <TableCell align="right"><Moment fromNow>{component.createdAt}</Moment></TableCell>
              <TableCell align="right"><Moment fromNow>{component.updatedAt}</Moment></TableCell>
              <TableCell align="center"><Button href={"/components/"+ component._id + "/edit"} component_id={component._id}>Edit</Button></TableCell>
              <TableCell align="center"><DeleteComponentModal component_id={component._id}/></TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default ComponentsTable;
