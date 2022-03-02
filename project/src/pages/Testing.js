import React from "react";
import "../positions.css";
// var perf =require('../Snippets/h1.html');

import axios from "axios";
import { useState, useEffect } from "react";
import Hello from '../components/prediction_results';

function Positioning(prediction) {

    const [leftPosition, setLeftPosition] = useState('');
    // let leftPositionString = leftPosition.toString();
  
  
    if (!prediction) return null;
  
    if (prediction.predictions) {
      let left = prediction.predictions[0].boundingBox.left;
      let top = prediction.predictions[0].boundingBox.top;
  
      let width = prediction.predictions[0].boundingBox.width;
      let height = prediction.predictions[0].boundingBox.height;
  
      // console.log(left, top, width, height);
  
      // if (left < 2) {
      //   console.log("Set in grid - 1/1");
      //   setLeftPosition("component4");
      // } else if (left > 2 && left < 3) {
      //   console.log("grid 2/2");
      // } else if (left > 3 && left < 4) {
      //   console.log("grid 3/3");
      // } else if (left > 4 && left < 5) {
      //   console.log("grid 4/4");
      // } else if (left > 5 && left < 6) {
      //   console.log("grid 5/5");
      // } else if (left > 6 && left < 7) {
      //   console.log("grid 6/6");
      // } else if (left > 7 && left < 8) {
      //   console.log("grid 7/7");
      // } else if (left > 8 && left < 9) {
      //   console.log("grid 8/8");
      // } else if (left > 9) {
      //   console.log("grid 9/9");
      // }
  
      // if ( top < 2 ){
      //     console.log('Set in grid - 1/1');
      // } else if(top > 2 && top < 3){
      //     console.log('grid 2/2');
      // } else if(top > 3 && top < 4){
      //     console.log('grid 3/3');
      // }else if(top > 4 && top < 5){
      //     console.log('grid 4/4');
      // }else if(top > 5 && top < 6){
      //     console.log('grid 5/5');
      // }else if(top > 6 && top < 7){
      //     console.log('grid 6/6');
      // }else if(top > 7 && top < 8){
      //     console.log('grid 7/7');
      // }else if(top > 8 && top < 9){
      //     console.log('grid 8/8');
      // }else if(top > 9){
      //     console.log('grid 9/9');
      // }
    }
  
}
const Testing = (props, leftPosition) => {
  const [prediction, setPrediction] = useState({});
  const [isLoading, setLoading] = useState(true);




  let token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`http://localhost:3030/predict`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // console.log(response.data);
        setPrediction(response.data);
        setLoading(false);

        
        // console.log(setPredictions);
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
      });
  }, [token]);

  
// console.log(leftPosition);
  if (isLoading) {
    return <div className="App">Loading...</div>;
  }

  
  return (
    <>
      <div container className="parent">
        <div><Hello importFrom={prediction}/></div>
      </div>
    </>
  );
};

export default Testing;
