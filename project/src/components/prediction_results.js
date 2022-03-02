import { Prediction } from "@azure/cognitiveservices-customvision-prediction/esm/models/mappers";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { ConstructionOutlined } from "@mui/icons-material";
import React from "react";
import "../positions.css";


import { useState, useEffect } from "react";

const PredictionResults = (props, importFrom) => {


  // console.log(props.importFrom.predictions + 'index');

  // const [predictions, setPredictions] = useState([]);
  // setPredictions(props.importFrom.predictions);
  // console.log(props + 'hello');

  const filteredPredictions = props.importFrom.predictions.filter(
    (prediction) => prediction.probability >= 0.9
  );

  console.log(filteredPredictions);
    filteredPredictions.forEach(prediction => {

      let left = prediction.boundingBox.left;

       if (left < 0.2) {
        console.log("Set in grid left- 1/1");
        setLeftPosition("component4");

      } else if (left > 0.2 && left < 0.3) {
        console.log("grid left 2/2");
      } else if (left > 0.3 && left < 0.4) {
        console.log("grid left 3/3");
      } else if (left > 0.4 && left < 0.5) {
        console.log("grid left 4/4");
      } else if (left > 0.5 && left < 0.6) {
        console.log("grid left 5/5");
      } else if (left > 0.6 && left < 0.7) {
        console.log("grid left 6/6");
      } else if (left > 0.7 && left < 0.8) {
        console.log("grid left 7/7");
      } else if (left > 0.8 && left < 0.9) {
        console.log("grid left 8/8");
      } else if (left > 0.9) {
        console.log("grid left 9/9");
      }
  
    });
  // .filter(filteredPredictions[0].probability <= 0.1)
  return (
    // <TableContainer >
    //   <Table sx={{ minWidth: 650 }} aria-label="simple table">
    //     <TableHead>
    //       <TableRow>
    //         <TableCell>Name</TableCell>
    //         <TableCell align="right"> Top</TableCell>
    //         <TableCell align="right">Width</TableCell>
    //         <TableCell align="right">Height</TableCell>

    //         <TableCell align="right">Probability</TableCell>

    //       </TableRow>
    //     </TableHead>
    //     <TableBody>
    //       { filteredPredictions.map((prediction, i) => (
    //         <TableRow
    //           key={i}
    //           sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    //         >
    //           <TableCell component="th" scope="row">
    //             {prediction.tagName}
    //           </TableCell>
    //           <TableCell align="right">{prediction.probability}</TableCell>
    //           <TableCell align="right">{prediction.boundingBox.left}</TableCell>
    //           <TableCell align="right">{prediction.boundingBox.top}</TableCell>
    //           <TableCell align="right">{prediction.probability}</TableCell>

    //         </TableRow>
    //       ))}
    //     </TableBody>
    //   </Table>
    // </TableContainer>

    <>
      {filteredPredictions.map((prediction, i) => (
        <div>His</div>
      ))}
    </>
  );
};

export default PredictionResults;
