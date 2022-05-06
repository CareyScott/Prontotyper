// code used during testing + development -- testing for code Generation function

import React from "react";
import "../positions.css";
import parse from "html-react-parser";
import Helmet from "react-helmet";
const PredictionResults = (props, importFrom) => {
  function checkTagName(prediction, props) {
    let value;
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
