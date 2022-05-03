import React from "react";
import "../positions.css";

import axios from "axios";
import { useState, useEffect } from "react";
import Hello from '../components/prediction_results';


const Testing = (props, leftPosition) => {
  const [prediction, setPrediction] = useState({});
  const [code, setCode] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [framework, setFramework] = useState("HTML");

  let token = localStorage.getItem("token");

  let frameworkScript;

  let BootStrapScript = "<link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap.min.css\" integrity=\"sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u\" crossorigin=\"anonymous\">"


  if (framework == "bootstrap") {
    frameworkScript = BootStrapScript
  }else {
    frameworkScript = ""
  }

  useEffect(() => {
    axios
    .get(`https://pronto-api-rest.azurewebsites.net/predict/${"Sketch1.jpg"}/container/${"new"}`, {
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
      .get(`https://pronto-api-rest.azurewebsites.net/code/${framework}`, {
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
        <Hello importFrom={prediction} frameworkScript={frameworkScript} code={code}/>
        </div>
    </>
  );
};

export default Testing;
