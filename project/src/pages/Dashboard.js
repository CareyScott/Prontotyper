import * as React from "react";
import {
  Container,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import ProjectsTable from "../components/Projects/ProjectsTable";
import axios from "axios";
import { useState, useEffect } from "react";

const Dashboard = (props) => {
  function preventDefault(event) {
    event.preventDefault();
  }
  const [predictions, setPredictions] = useState({});

  let token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`http://localhost:3030/predict`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setPredictions(response.data);
        // console.log(setPredictions);
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
      });
  }, [token]);

  if (!predictions) return null;

//   let probabilityThreshold;
//   predictions.forEach(predictedResult => {
//       console.log(`\t ${predictedResult.tagName}: ${(predictedResult.probability * 100.0).toFixed(2)}% ${predictedResult.boundingBox.left},${predictedResult.boundingBox.top},${predictedResult.boundingBox.width},${predictedResult.boundingBox.height}`);
//       // console.log(`\t ${predictedResult.tagName}: ${(predictedResult.probability * 100.0).toFixed(2)}% `);
//       probabilityThreshold = predictedResult.probability > 0.80;
//       console.log(probabilityThreshold)
//       if (probabilityThreshold === true){
//       console.log(`\t ${predictedResult.tagName}: ${(predictedResult.probability * 100.0).toFixed(2)}%  `);
//       console.log(predictedResult);
//   };

  
// })


  return (
    <>
      <div className="app">
        <div className="left-side"></div>
        <div className="right-side">
          {predictions.map((prediction, i) =>  prediction.probability)}
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>

          <TableCell>Probability</TableCell>
          <TableCell>Top</TableCell>
          <TableCell>Left</TableCell>
            

          </TableRow>
        </TableHead>
        <TableBody>
          {predictions.map((prediction, i) => (
            <TableRow
              key={i}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {prediction.probability}
              </TableCell>
              <TableCell component="th" scope="row">
                {prediction.boundingBox.top}
              </TableCell>
              <TableCell component="th" scope="row">
                {prediction.boundingBox.left}
              </TableCell>
              
            </TableRow>
          ))}
        </TableBody>
      </Table>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
