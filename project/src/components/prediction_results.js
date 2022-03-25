import { Prediction } from "@azure/cognitiveservices-customvision-prediction/esm/models/mappers";
import classNames from "classnames";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { Code, ConstructionOutlined } from "@mui/icons-material";
import React from "react";
import "../positions.css";
import parse from "html-react-parser";
import { stateToHTML } from "draft-js-export-html";

import { useState, useEffect } from "react";
import Helmet from "react-helmet";

const PredictionResults = (props, importFrom) => {
  console.log(props.importFrom.predictions);
  console.log(props.code);
  console.log(props);

  // function positioning(props) {
  //   if (isLoggedIn) {
  //     return <UserGreeting />;
  //   }
  //   return <GuestGreeting />;
  // }

  // function downloadCode() {
  //   // let html = stateToHTML(contentState);
  //   return (
  //     <a href={html} download="code.html">
  //       Download Code
  //     </a>
  //   );
  // }

  function checkTagName(prediction, props) {
    let value;
    console.log(prediction);
    props.code.forEach((element, index) => {
      if (element.tagName === prediction.tagName) {
        value = element;
      }
    });
    return value;
  }

  return (
    <>
      <Helmet>{parse(props.frameworkScript)}</Helmet>

      {props.importFrom.predictions.map((prediction, i) => {
        // document.getElementById("element").innerHTML = codeResponse();

        {
          if (props.isLoading) {
            return <div className="">Loading...</div>;
          } else if (prediction.boundingBox.range === "nextRow") {
            return (
              <>
                <div className="break flex"></div>
                <div
                  key={`spacing-${i}`}
                  className={`element ${prediction.boundingBox.pushLeft}  flex flexWidth`}
                >
                  {/* {props.code.tagName === prediction.tagName} */}
                  {/* {i} */}
                </div>
                <div
                  key={`object-${i}`}
                  className={`${prediction.boundingBox.width} flex flexWidth`}
                >
                  {/* {props.code.forEach((code) => {
                    if (code.tagName === prediction.tagName) {
                      let codeReturned = code.tagName;
                      console.log(codeReturned);
                      return code.tagName ? "Loading" : code.tagName;
                    }
                  })} */}

                  {parse(checkTagName(prediction, props).code)}
                </div>
              </>
            );
          } else if (prediction.boundingBox.range === "firstElement") {
            return (
              <>
                <div
                  key={`first-${i}`}
                  className={`${prediction.boundingBox.pushLeft}  flex flexWidth`}
                >
                  {/* {i} */}
                </div>
                <div
                  key={`same-${i}`}
                  className={`flex  ${prediction.boundingBox.width}`}
                >
                  {parse(checkTagName(prediction, props).code)}
                </div>
              </>
            );
          } else {
            return (
              <>
                <div
                  key={`same-${i}`}
                  className={`flex  ${prediction.boundingBox.width}`}
                >
                  {parse(checkTagName(prediction, props).code)}{" "}
                </div>
              </>
            );
          }
        }
      })}

      {/* {downloadCode()} */}
    </>
  );
};

export default PredictionResults;
