import React from "react";
import "../positions.css";
// var perf =require('../Snippets/h1.html');

import axios from "axios";
import { useState, useEffect } from "react";
import Hello from '../components/prediction_results';


const Testing = (props, leftPosition) => {
  const [prediction, setPrediction] = useState({});
  const [code, setCode] = useState({});
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


  useEffect(() => {
        axios
      .get(`http://localhost:3030/code/react`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // console.log(response.data);
        setCode(response.data);
        // setLoading(false);

        
        // console.log(setPredictions);
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
      });

  }, [token]);
  



  
// console.log(leftPosition);
  if (isLoading) {
    return <div className="">Loading...</div>;
  }

  
  return (
    <>
    <div className="container">
        <Hello importFrom={prediction} code={code}/>
        </div>
    </>
  );
};

export default Testing;
