const util = require("util");
const fs = require("fs");
const res = require("express/lib/response");
const TrainingApi = require("@azure/cognitiveservices-customvision-training");
const PredictionApi = require("@azure/cognitiveservices-customvision-prediction");
const msRest = require("@azure/ms-rest-js");
const { find } = require("../models/project_schema");
const Code = require("../models/code_schema");
const PredictionSchema = require("../models/prediction_schema");

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

const COLS = 12;
const COL_WIDTH = 0.0833333333333333;
const COL_LEFT = 0.0833333333333333;

function inRangeWidth(width, index) {
  if (width > COL_WIDTH * index && width < COL_WIDTH * (index + 1)) {
    return index + 1;
  }
  return false;
}

function inRangeLeft(left, index) {
  if (left > COL_LEFT * index && left < COL_LEFT * (index + 1)) {
    return index + 1;
  }
  return false;
}

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

    elementTop.boundingBox["elementLeft"] = i;

    // console.log(elementTop)
    // let top = sortedLeft.map(elementLeft => elementLeft.boundingBox.top);

    // let i = top.indexOf(elementTop.boundingBox.top);

    console.log(`Top: ${index} Left: ${i}`);
  });

  let width = "";
  let left = "";
  let classNameWidth = "width-";
  let classNameLeft = "left-";
  let rowWidth = 0;

  let rowLeft = 0;

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

    // if (topElements[i].boundingBox.left < topElements[i+1].boundingBox.left){
    //   i --;
    // }

    // determining rows

    if (rangeTop > 0.03) {
      topElements[i].boundingBox["range"] = "nextRow";
      rowWidth = 0;
    } else {
      // topElements[i].boundingBox["position"] = ;
      topElements[i].boundingBox["range"] = "sameRow";
    }

    if (i === 0) {
      topElements[0].boundingBox["range"] = "firstElement";
    }

    // determining columns

    resultWidth =
      inRangeWidth(topElements[i].boundingBox.width, 0) ||
      inRangeWidth(topElements[i].boundingBox.width, 1) ||
      inRangeWidth(topElements[i].boundingBox.width, 2) ||
      inRangeWidth(topElements[i].boundingBox.width, 3) ||
      inRangeWidth(topElements[i].boundingBox.width, 4) ||
      inRangeWidth(topElements[i].boundingBox.width, 5) ||
      inRangeWidth(topElements[i].boundingBox.width, 6) ||
      inRangeWidth(topElements[i].boundingBox.width, 7) ||
      inRangeWidth(topElements[i].boundingBox.width, 8) ||
      inRangeWidth(topElements[i].boundingBox.width, 9) ||
      inRangeWidth(topElements[i].boundingBox.width, 10) ||
      inRangeWidth(topElements[i].boundingBox.width, 11);

    rowWidth += resultWidth;

    resultLeft =
      inRangeLeft(topElements[i].boundingBox.left, 0) ||
      inRangeLeft(topElements[i].boundingBox.left, 1) ||
      inRangeLeft(topElements[i].boundingBox.left, 2) ||
      inRangeLeft(topElements[i].boundingBox.left, 3) ||
      inRangeLeft(topElements[i].boundingBox.left, 4) ||
      inRangeLeft(topElements[i].boundingBox.left, 5) ||
      inRangeLeft(topElements[i].boundingBox.left, 6) ||
      inRangeLeft(topElements[i].boundingBox.left, 7) ||
      inRangeLeft(topElements[i].boundingBox.left, 8) ||
      inRangeLeft(topElements[i].boundingBox.left, 9) ||
      inRangeLeft(topElements[i].boundingBox.left, 10) ||
      inRangeLeft(topElements[i].boundingBox.left, 11);

    rowLeft += resultLeft;

    // if(inRange(width, 0)){
    //   className += '1';
    // }
    // else if(inRange(width, 1)){
    //   className += '2';
    // }
    // else if(inRange(width, 1)){
    //   className += '2';
    // }else {

    // }

    topElements[i].boundingBox["width"] = classNameWidth + resultWidth;

    topElements[i].boundingBox["pushLeft"] = classNameLeft + resultLeft;

    if (i === 0) {
      topElements[0].boundingBox["range"] = "firstElement";
    }

    if (topElements[i].boundingBox.range === "sameRow") {
      let s = topElements[i].boundingBox.width;
      let nextS = topElements[i - 1].boundingBox.pushLeft;
      s = s.substring(s.indexOf("-") + 1);
      nextS = nextS.substring(nextS.indexOf("-") + 1);

      let sumOfS = nextS - s;

      console.log(`ROW Width with S: ${rowWidth + sumOfS}`);

      if (rowWidth + sumOfS > COLS) {
        let dif = rowWidth + sumOfS - COLS;
        sumOfS -= dif;
      }

      topElements[i - 1].boundingBox.pushLeft = `left-${sumOfS}`;
    }

    // console.log(rowWidth);

    // if (topElements[i].boundingBox.range === "sameRow"  ){
    //   topElements[i].boundingBox["left"] = "";
    // }
    // if (topElements[i].boundingBox.range === "firstElement") {
    //   topElements[i].boundingBox["push"] = topElements[i].boundingBox.column;
    // }
    // console.log(topElements);

    // console.log(topElements.code)
  }

  // topElements.forEach((topElement, i) => {
  //   if (topElement.boundingBox.range === "sameRow"){
  //     let s = topElement.boundingBox.width
  //     s = s.substring(s.indexOf('-')+1);
  //     console.log(s)
  //     // topElements[i - 1].boundingBox.
  //   }
  // })

  topElements.forEach((element) => {
    element["code"] = "";
  });
  // topElements[i]['code'] = code
  data.predictions = topElements;

  // console.log(codeArray)

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

const predict = async (req, res) => {
  const domains = await trainer.getDomains();
  const objDetectDomain = domains.find(
    (domain) => domain.type === "ObjectDetection"
  );
  const sampleProject = await trainer.getProject(
    "1eab146a-0e50-449a-b2d2-d14c7664008c",
    { domainId: objDetectDomain.id }
  );

  const addPrediction = async (data) => {
    let predictionData = data;
    PredictionSchema.create(predictionData).then((data) => {
      // sortedTop.forEach((elementTop, index) => {

      predictionArray = [];

      data.predictions.forEach((element, index) => {

        let tagId = element.tagId
        if (element) {
         await Code.findOne({tagId},
            
            
            (error, success) => {
              if (error) {
                res.status(500).json(err);
                console.error;
              }
            }
          ).then((success) => {console.log(success.code)})
          // res.status(201).json(data);
          // return element
          // console.log(element);
          var arrayItem = element;
          predictionArray.push(arrayItem);
        }
        // function (err, docs) {
        // console.log(`${docs.code} at index ${index}`);

        // return docs
        // }
      });

      // console.log(predictionArray);
      return predictionArray;
    });

    // .catch((err) => {
    //   if (err.name === "ValidationError") {
    //     res.status(422).json(err);
    //   } else {
    //     console.error(err);
    //     res.status(500).json(err);
    //   }
    // });
  };

  // function getCode(tagName) {
  //   Code.findOne({ tagName }).then((tag) => {
  //     // let arrayItem = tag;
  //     // tagsArray.push(arrayItem);
  //     console.log(tag)
  //       return tag;
  //   });
  // }

  const sampleDataRoot = "Images";

  const testFile = fs.readFileSync(`${sampleDataRoot}/alltest.jpg`);
  const results = await predictor
    .detectImage(sampleProject.id, publishIterationName, testFile)

    .then((data) => {
      if (data) {
        data.predictions = data.predictions.filter(
          (prediction) => prediction.probability >= 0.9
        );

        findTopPosition(data);

        console.log(data);

        let savedPrediction = addPrediction(data);

        console.log(data);

        // console.log(savedPrediction);

        // const getCode = async(tagName, index) => {

        //   codeArray = [];
        //   try{
        //     const code = await Code.findOne(({ tagName }), function (err, docs) {});
        //     return code;
        //   }catch (err) {
        //     return 'error occured';
        //   }
        // }

        // let arrayCode = [];

        // data.predictions.forEach((prediction, index) => {
        //   let code = getCode(prediction.tagName);
        //   prediction['code'] = code;

        //       var arrayItem = prediction;
        // arrayCode.push(arrayItem);
        //   console.log(arrayItem)
        //   })

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
  // getCode
};
