const util = require("util");
const fs = require("fs");
const res = require("express/lib/response");
const TrainingApi = require("@azure/cognitiveservices-customvision-training");
const PredictionApi = require("@azure/cognitiveservices-customvision-prediction");
const msRest = require("@azure/ms-rest-js");

const trainingKey = "de15aea8800e4aacb1695ef40ab9d87a";
const trainingEndpoint = "https://westus2.api.cognitive.microsoft.com/";
const predictionKey = "de15aea8800e4aacb1695ef40ab9d87a";
const predictionEndpoint = "https://westus2.api.cognitive.microsoft.com/";

const publishIterationName = "Iteration1";

const credentials = new msRest.ApiKeyCredentials({
  inHeader: { "Training-key": trainingKey },
});
const trainer = new TrainingApi.TrainingAPIClient(
  credentials,
  trainingEndpoint
);
const predictor_credentials = new msRest.ApiKeyCredentials({
  inHeader: { "Prediction-key": predictionKey },
});
const predictor = new PredictionApi.PredictionAPIClient(
  predictor_credentials,
  predictionEndpoint
);

function findTopPosition(data) {
  var predictionArray = [];

  for (var i = 0; i < data.predictions.length; i++) {
    var arrayItem = data.predictions[i];
    predictionArray.push(arrayItem);
  }
  console.log(predictionArray.sort());
  // var array = [];
  // predictionArray.forEach( function(key, value) {
  //   // console.log(value);
  //     array.push(value);
  // });
  // array.sort(function(a, b) {
  //   // console.log(a , b);
  //     return a.boundingBox.top - b.boundingBox.top;
  // });

  // predictionArray.forEach(array, function(index, entry) {
  //   display("Entry " + index + ": " +
  //           entry);
  // });

  //   let arr = data.predictions;

  //   function getTopN(arr, prop, n) {
  //     // clone before sorting, to preserve the original array
  //     var clone = arr;

  //     // sort descending
  //     clone.sort(function(x, y) {
  //       // console.log(x);

  //         if (x.boundingBox.prop == y.boundingBox.prop) return 0;
  //         else if (parseInt(x.boundingBox.prop) > parseInt(y.boundingBox.prop)) return 1;
  //         else return -1;
  //     });

  //     return clone.slice(0, n || 1);
  // }

  // var prop;

  // var topScorers = getTopN(arr,  "left", 2);
  // topScorers.forEach(function(item, index) {
  //     console.log("#" + (index+1) + ": " + item.boundingBox.left + "  -  " + item.tagName);
  // });

  // function sortByProperty(property){
  //   return function(a,b){
  //      if(a.boundingBox[property] > b.boundingBox[property])
  //         return 1;
  //      else if(a.boundingBox[property] < b.boundingBox[property])
  //         return -1;

  //      return 0;
  //   }

  // }

  // console.log(data.predictions);
  // data.predictions.forEach(prediction => {

  // var topPositions = [];
  //  topPositions = prediction.boundingBox.left;

  // });
}
function positioningAlgorithm(data) {
  data.predictions.forEach((prediction) => {
    let left = prediction.boundingBox.left;
    let top = prediction.boundingBox.top;

    // console.log(prediction);

    // if (left < 0.3) {
    //   // console.log("Set in grid left- 1/1");
    //   prediction.boundingBox.left = "left-left";
    // } else if (left > 0.3 && left < 0.6) {
    //   // prediction.boundingBox["position"] = 'center';
    //   prediction.boundingBox.left = "left-center";
    // } else if (left > 0.6 && left < 1) {
    //   prediction.boundingBox.left = "left-right";
    //   // prediction.boundingBox["position"] = 'right';
    // }

    if (top < 0.3) {
      // console.log("Set in grid left- 1/1");
      prediction.boundingBox.top = "top-top";
    } else if (top > 0.3 && top < 0.6) {
      // prediction.boundingBox["position"] = 'center';
      prediction.boundingBox.top = "top-center";
    } else if (top > 0.6 && top < 1) {
      prediction.boundingBox.top = "top-bottom";
      // prediction.boundingBox["position"] = 'right';
    }
  });
}
const predict = async (req, res) => {
  const domains = await trainer.getDomains();
  const objDetectDomain = domains.find(
    (domain) => domain.type === "ObjectDetection"
  );
  const sampleProject = await trainer.getProject(
    "1eab146a-0e50-449a-b2d2-d14c7664008c",
    { domainId: objDetectDomain.id }
  );

  const sampleDataRoot = "Images";

  const testFile = fs.readFileSync(`${sampleDataRoot}/alltest.jpg`);
  const results = await predictor
    .detectImage(sampleProject.id, publishIterationName, testFile)

    .then((data) => {
      if (data) {
        data.predictions = data.predictions.filter(
          (prediction) => prediction.probability >= 0.9
        );

        // let left = data.prediction.boundingBox.left;
        findTopPosition(data);
        positioningAlgorithm(data);

        ///////////////////

        //   if (left < 0.2) {
        //     console.log("Set in grid left- 1/1");
        //     // setLeftPosition("component4");
        //     data.prediction.boundingBox["position"] = "div1";
        //     console.log(data.prediction.boundingBox);
        //   } else if (left > 0.2 && left < 0.3) {
        //     console.log("grid left 2/2");
        //     prediction.boundingBox["position"] = "div1";
        //     data.prediction.boundingBox.left = 'far left';

        //   } else if (left > 0.3 && left < 0.4) {
        //     console.log("grid left 3/3");
        //     data.prediction.boundingBox["position"] = "div1";
        //   } else if (left > 0.4 && left < 0.5) {
        //     console.log("grid left 4/4");
        //     data.prediction.boundingBox["position"] = "div1";
        //   } else if (left > 0.5 && left < 0.6) {
        //     console.log("grid left 5/5");
        //     data.prediction.boundingBox["position"] = "div1";
        //   } else if (left > 0.6 && left < 0.7) {
        //     console.log("grid left 6/6");
        //     data.prediction.boundingBox["position"] = "div1";
        //   } else if (left > 0.7 && left < 0.8) {
        //     console.log("grid left 7/7");
        //     data.prediction.boundingBox["position"] = "div1";
        //   } else if (left > 0.8 && left < 0.9) {
        //     console.log("grid left 8/8");
        //     data.prediction.boundingBox["position"] = "div1";
        //   } else if (left > 0.9) {
        //     console.log("grid left 9/9");
        //     data.prediction.boundingBox["position"] = "component9";
        //   }

        //  data.prediction.boundingBox.left = left;

        //////////////////

        // console.log(data);
        res.status(200).json(data);
      } else {
        res.status(404).json("No prediction can be made");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json(err);
    });

  // Show results
  // console.log("Results:");
  // let probabilityThreshold;
  // results.predictions.forEach(predictedResult => {
  // console.log(`\t ${predictedResult.tagName}: ${(predictedResult.probability * 100.0).toFixed(2)}% ${predictedResult.boundingBox.left},${predictedResult.boundingBox.top},${predictedResult.boundingBox.width},${predictedResult.boundingBox.height}`);
  // console.log(`\t ${predictedResult.tagName}: ${(predictedResult.probability * 100.0).toFixed(2)}% `);
  // probabilityThreshold = predictedResult.probability > 0.80;
  // console.log(probabilityThreshold)
  //     if (probabilityThreshold === true){
  //     // console.log(`\t ${predictedResult.tagName}: ${(predictedResult.probability * 100.0).toFixed(2)}%  `);
  //     // console.log(predictedResult);
  // }
  // res.status(201).json(results.predictions);
  // })
};

module.exports = {
  predict,
};
