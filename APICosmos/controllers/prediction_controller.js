const util = require("util");
const fs = require("fs");
const res = require("express/lib/response");
const TrainingApi = require("@azure/cognitiveservices-customvision-training");
const PredictionApi = require("@azure/cognitiveservices-customvision-prediction");
const msRest = require("@azure/ms-rest-js");
const { find } = require("../models/project_schema");

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
  // var predictionArray = [];

  // for (var i = 0; i < data.predictions.length; i++) {
  //   var arrayItem = data.predictions[i];
  //   predictionArray.push(arrayItem);
  // }
  // console.log(predictionArray.sort());

  let sortedTop = data.predictions.sort((prev, current) => {
    // console.log(prev.boundingBox.top)
    // console.log(current.boundingBox.top)
    return prev.boundingBox.top - current.boundingBox.top;
  });
  // console.log("sortedTop: ")
  // console.log(sortedTop)

  // sortedTop.filter(() => {});

  // console.log("sorting top");

  let topElements = [];

  sortedTop.forEach((element, index) => {
    let topElement = element.boundingBox.top;
    // console.log(element.boundingBox.left *100)
    topElements.push(element);
  });
  // console.log(topElements)

  let sortedLeft = data.predictions.sort((prev, current) => {
    return prev.boundingBox.left - current.boundingBox.left;
  });

  let leftElements = [];
  // console.log('sorting left')
  sortedLeft.forEach((element, index) => {
    let leftElement = element.boundingBox.left;
    // console.log(leftElement)#

    leftElements.push(element);
  });
  // console.log(leftElements)

  topElements.forEach((elementTop, index) => {
    let i = leftElements.findIndex((elementLeft) => {
      // console.log(elementTop.boundingBox.top)
      // console.log(elementLeft.boundingBox.top)
      return elementLeft.boundingBox.top === elementTop.boundingBox.top;
    });

    elementTop.boundingBox['elementLeft'] = i;

    // console.log(elementTop)
    // let top = sortedLeft.map(elementLeft => elementLeft.boundingBox.top);

    // let i = top.indexOf(elementTop.boundingBox.top);

    // console.log(`Top: ${index} Left: ${i}`)
  });

  for (let i = 0; i < topElements.length; i++) {
    let rangeTop;
    if (i === 0) {
      rangeTop = topElements[i].boundingBox.top;
    } else {
      rangeTop =
        topElements[i].boundingBox.top - topElements[i - 1].boundingBox.top;
    }

    console.log(
      `Range Top: for index ${i} with a difference of ${rangeTop} for ${topElements[i].tagName}`
    );

    // determining rows

    if (rangeTop > 0.03) {
      topElements[i].boundingBox["range"] = "nextRow";
    } else {
      // topElements[i].boundingBox["position"] = ;
      topElements[i].boundingBox["range"] = "sameRow";
    }

    if (i === 0){
      topElements[0].boundingBox["range"] = "firstElement";
    }
  

// determining columns

if (topElements[i].boundingBox.width >  0 &&  topElements[i].boundingBox.width < 0.0833333333333333) {
  topElements[i].boundingBox["column"] = "col-1";
} else if (topElements[i].boundingBox.width >  0.0833333333333333 &&  topElements[i].boundingBox.width < 0.1666666666666666){
  // topElements[i].boundingBox["position"] = ;
  topElements[i].boundingBox["column"] = "col-2";
}else if (topElements[i].boundingBox.width >  0.1666666666666666 &&  topElements[i].boundingBox.width < 0.2499999999999999){
  // topElements[i].boundingBox["position"] = ;
  topElements[i].boundingBox["column"] = "col-3";
}else if (topElements[i].boundingBox.width >  0.2499999999999999 &&  topElements[i].boundingBox.width < 0.3333333333333332 ){
  // topElements[i].boundingBox["position"] = ;
  topElements[i].boundingBox["column"] = "col-4";
}else if (topElements[i].boundingBox.width >  0.3333333333333332 &&  topElements[i].boundingBox.width < 0.4166666666666665 ){
  // topElements[i].boundingBox["position"] = ;
  topElements[i].boundingBox["column"] = "col-5";
}else if (topElements[i].boundingBox.width >  0.4166666666666665 &&  topElements[i].boundingBox.width < 0.4999999999999998){
  // topElements[i].boundingBox["position"] = ;
  topElements[i].boundingBox["column"] = "col-6";
}else if (topElements[i].boundingBox.width >  0.4999999999999998 &&  topElements[i].boundingBox.width < 0.5833333333333331){
  // topElements[i].boundingBox["position"] = ;
  topElements[i].boundingBox["column"] = "col-7";
}else if (topElements[i].boundingBox.width >  0.5833333333333331 &&  topElements[i].boundingBox.width < 0.6666666666666664){
  // topElements[i].boundingBox["position"] = ;
  topElements[i].boundingBox["column"] = "col-8";
}else if (topElements[i].boundingBox.width >  0.6666666666666664 &&  topElements[i].boundingBox.width < 0.7499999999999997 ){
  // topElements[i].boundingBox["position"] = ;
  topElements[i].boundingBox["column"] = "col-9";
}else if (topElements[i].boundingBox.width >  0.7499999999999997 &&  topElements[i].boundingBox.width < 0.833333333333333){
  // topElements[i].boundingBox["position"] = ;
  topElements[i].boundingBox["column"] = "col-10";
}else if (topElements[i].boundingBox.width >  0.833333333333333 &&  topElements[i].boundingBox.width < 0.9166666666666663 ){
  // topElements[i].boundingBox["position"] = ;
  topElements[i].boundingBox["column"] = "col-11";
}else if (topElements[i].boundingBox.width >  0.9166666666666663 &&  topElements[i].boundingBox.width < 1){
  // topElements[i].boundingBox["position"] = ;
  topElements[i].boundingBox["column"] = "col-12";
}

if (i === 0){
  topElements[0].boundingBox["range"] = "firstElement";
}
  }

  // console.log(topElements);


  data.predictions = topElements;

  // console.log(data.predictions)

  // for (let i = 1; i < leftElements.length; i++) {
  //   let rangeLeft = leftElements[i].boundingBox.top - leftElements[i - 1].boundingBox.top
  //   console.log(`Range Left: for index ${i} with a difference of ${rangeLeft} for ${leftElements[i].tagName}`)
  // }

  // leftElements.forEach((element, index) => {
  //   let i = topElements[element];
  //   let findTop = topElements.find(
  //     (value) => value.boundingBox === element.boundingBox
  //   );
  //   // console.log(element.tagName);
  //   // console.log(`${element.boundingBox.left}`);
  //   // console.log(findTop.boundingBox.top);
  //   // console.log("");
  //   // console.log("");
  // });

  // console.log('sorting left')
  // sortedLeft.forEach((element, index) => {
  //   console.log(element.boundingBox.left)
  // })

  // console.log("sortedLeft: ")
  // console.log(sortedLeft)

  // sortedTop.forEach((elementTop, index) => {
  //   let i = sortedLeft.findIndex((elementLeft) => {
  //     // console.log(elementTop.boundingBox.top)
  //     // console.log(elementLeft.boundingBox.top)
  //     return elementLeft.boundingBox.top === elementTop.boundingBox.top
  //   });

  //   // let top = sortedLeft.map(elementLeft => elementLeft.boundingBox.top);

  //   // let i = top.indexOf(elementTop.boundingBox.top);

  //   console.log(`Top: ${index} Left: ${i}`)

  // });

  // sortedTop.forEach((elementTop, index) => {
  //   let i = sortedLeft.indexOf({
  //     boundingBox: elementTop.boundingBox
  //   })
  //   console.log(`Top: ${index} Left: ${i}`)
  // });

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

    if (left < 0.3) {
      // console.log("Set in grid left- 1/1");
      // prediction.boundingBox.left = "left-left";
    } else if (left > 0.3 && left < 0.6) {
      // prediction.boundingBox["position"] = 'center';
      // prediction.boundingBox.left = "left-center";
    } else if (left > 0.6 && left < 1) {
      // prediction.boundingBox.left = "left-right";
      // prediction.boundingBox["position"] = 'right';
    }

    if (top < 0.3) {
      // console.log("Set in grid left- 1/1");
      // prediction.boundingBox.top = "top-top";
    } else if (top > 0.3 && top < 0.6) {
      // prediction.boundingBox["position"] = 'center';
      // prediction.boundingBox.top = "top-center";
    } else if (top > 0.6 && top < 1) {
      // prediction.boundingBox.top = "top-bottom";
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
        // positioningAlgorithm(data);

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
