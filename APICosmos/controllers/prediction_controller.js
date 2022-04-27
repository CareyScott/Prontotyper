const util = require("util");
const fs = require("fs");
const res = require("express/lib/response");
const TrainingApi = require("@azure/cognitiveservices-customvision-training");
const PredictionApi = require("@azure/cognitiveservices-customvision-prediction");
const msRest = require("@azure/ms-rest-js");
const { find } = require("../models/project_schema");
const Code = require("../models/code_schema");
const PredictionSchema = require("../models/prediction_schema");
const { BlobServiceClient } = require("@azure/storage-blob");

const trainingKey = "de15aea8800e4aacb1695ef40ab9d87a";
const trainingEndpoint = "https://westus2.api.cognitive.microsoft.com/";
const predictionKey = "de15aea8800e4aacb1695ef40ab9d87a";
const predictionEndpoint = "https://westus2.api.cognitive.microsoft.com/";

const blobSasUrl =
  "https://sketch2codestoresc.blob.core.windows.net/?sv=2020-08-04&ss=bfqt&srt=sco&sp=rwdlacupitfx&se=2022-09-01T15:55:24Z&st=2022-04-25T07:55:24Z&spr=https&sig=kT52sph2xMa4nwrsf0szfKehC6%2F%2FJsxKHxNfRgztWm4%3D";
const blobServiceClient = new BlobServiceClient(blobSasUrl);

const publishIterationName = "Iteration1";
var c = console.log.bind(console);
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
  // Sort prediction array by top-most values
  let sortedTop = data.predictions.sort((prev, current) => {
    return prev.boundingBox.top - current.boundingBox.top;
  });

  let topElements = [];

  // creating an array of elements ordered by top
  sortedTop.forEach((element, index) => {
    let topElement = element.boundingBox.top;
    topElements.push(element);
  });

  //	Sort prediction array by left-most values
  let sortedLeft = data.predictions.sort((prev, current) => {
    return prev.boundingBox.left - current.boundingBox.left;
  });

  // creating an array of elements ordered by left
  let leftElements = [];
  sortedLeft.forEach((element, index) => {
    let leftElement = element.boundingBox.left;
    leftElements.push(element);
  });

  // writing leftIndex of corresponding left most & top most index
  topElements.forEach((elementTop, index) => {
    let i = leftElements.findIndex((elementLeft) => {
      return elementLeft.boundingBox.top === elementTop.boundingBox.top;
    });

    elementTop.boundingBox["elementLeft"] = i;

    // c(`Top: ${index} Left: ${i}`);
  });

  let width = "";
  let left = "";
  let classNameWidth = "width-";
  let classNameLeft = "left-";
  let rowWidth = 0;

  let rowLeft = 0;

  // iterating through each prediction & determining difference between each by top value

  for (let i = 0; i < topElements.length; i++) {
    let rangeTop;

    // if index is 0, rangetop stays the same
    if (i === 0) {
      rangeTop = topElements[i].boundingBox.top;
      // else rangetop is equal to top minus top of the last entry
    } else {
      rangeTop =
        topElements[i].boundingBox.top - topElements[i - 1].boundingBox.top;
    }

    // c(
    //   `Range Top: for index ${i} with a difference of ${rangeTop} for ${topElements[i].tagName}`
    // );

    // if (topElements[i].boundingBox.left < topElements[i+1].boundingBox.left){
    //   i --;
    // }

    // determining rows

    // if rangetop is greather than 0.3, move to the next line
    if (rangeTop > 0.03) {
      topElements[i].boundingBox["range"] = "nextRow";
      rowWidth = 0;

      // if there is a textbox + label beside eachother, call for textBoxWithLabel
      if (
        topElements[i].tagName === "Label" &&
        topElements[i + 1].tagName === "TextBox"
      ) {
        topElements.splice(i + 1, 1);
        topElements[i].tagName = "textBoxWithLabel";
      }
    } else {
      // otherwise keep on same row
      topElements[i].boundingBox["range"] = "sameRow";
    }

    // if the index is 0 name as firstElement
    if (i === 0) {
      topElements[0].boundingBox["range"] = "firstElement";
    }

    // determining width column span
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

    // determining the pushLeft span
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

    // width = classNameWidth string + the result resultRight integer
    topElements[i].boundingBox["width"] = classNameWidth + resultWidth;

    // pushLeft = classNameLeft string + the result resultLeft integer
    topElements[i].boundingBox["pushLeft"] = classNameLeft + resultLeft;

    if (i === 0) {
      topElements[0].boundingBox["range"] = "firstElement";
    }

    // index at length of array = lastElement
    if (i === topElements.length) {
      topElements[topElements.length].boundingBox["range"] = "lastElement";
    }

    if (topElements[i].boundingBox.range === "sameRow") {
      let s = topElements[i].boundingBox.width;
      let nextS = topElements[i - 1].boundingBox.pushLeft;
      // extracting the value of width of last element
      s = s.substring(s.indexOf("-") + 1);
      // extracting the value of next element
      nextS = nextS.substring(nextS.indexOf("-") + 1);

      let sumOfS = nextS - s;

      if (rowWidth + sumOfS > COLS) {
        let dif = rowWidth + sumOfS - COLS;
        sumOfS -= dif;
      }
      topElements[i - 1].boundingBox.pushLeft = `left-${sumOfS}`;
    }

    let temp1 = topElements[i - 1];
    let temp2 = topElements[i];

    if (
      data.predictions[i].boundingBox.range === "sameRow" &&
      data.predictions[i].boundingBox.elementLeft <
        data.predictions[i - 1].boundingBox.elementLeft
    ) {
      temp2 = topElements[i - 1];
      temp1 = topElements[i];
    }

    // c(rowWidth);

    // if (topElements[i].boundingBox.range === "sameRow"  ){
    //   topElements[i].boundingBox["left"] = "";
    // }
    // if (topElements[i].boundingBox.range === "firstElement") {
    //   topElements[i].boundingBox["push"] = topElements[i].boundingBox.column;
    // }
    // c(topElements);

    // c(topElements.code)
  }

  // topElements.forEach((topElement, i) => {
  //   if (topElement.boundingBox.range === "sameRow"){
  //     let s = topElement.boundingBox.width
  //     s = s.substring(s.indexOf('-')+1);
  //     c(s)
  //     // topElements[i - 1].boundingBox.
  //   }
  // })

  topElements.forEach((element) => {
    element["code"] = "";
  });
  // topElements[i]['code'] = code
  data.predictions = topElements;

  // c(codeArray)

  // c(data.predictions)

  // for (let i = 1; i < leftElements.length; i++) {
  //   let rangeLeft = leftElements[i].boundingBox.top - leftElements[i - 1].boundingBox.top
  //   c(`Range Left: for index ${i} with a difference of ${rangeLeft} for ${leftElements[i].tagName}`)
  // }

  // leftElements.forEach((element, index) => {
  //   let i = topElements[element];
  //   let findTop = topElements.find(
  //     (value) => value.boundingBox === element.boundingBox
  //   );
  //   // c(element.tagName);
  //   // c(`${element.boundingBox.left}`);
  //   // c(findTop.boundingBox.top);
  //   // c("");
  //   // c("");
  // });

  // c('sorting left')
  // sortedLeft.forEach((element, index) => {
  //   c(element.boundingBox.left)
  // })

  // c("sortedLeft: ")
  // c(sortedLeft)

  // sortedTop.forEach((elementTop, index) => {
  //   let i = sortedLeft.findIndex((elementLeft) => {
  //     // c(elementTop.boundingBox.top)
  //     // c(elementLeft.boundingBox.top)
  //     return elementLeft.boundingBox.top === elementTop.boundingBox.top
  //   });

  //   // let top = sortedLeft.map(elementLeft => elementLeft.boundingBox.top);

  //   // let i = top.indexOf(elementTop.boundingBox.top);

  //   c(`Top: ${index} Left: ${i}`)

  // });

  // sortedTop.forEach((elementTop, index) => {
  //   let i = sortedLeft.indexOf({
  //     boundingBox: elementTop.boundingBox
  //   })
  //   c(`Top: ${index} Left: ${i}`)
  // });

  // var array = [];
  // predictionArray.forEach( function(key, value) {
  //   // c(value);
  //     array.push(value);
  // });
  // array.sort(function(a, b) {
  //   // c(a , b);
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
  //       // c(x);

  //         if (x.boundingBox.prop == y.boundingBox.prop) return 0;
  //         else if (parseInt(x.boundingBox.prop) > parseInt(y.boundingBox.prop)) return 1;
  //         else return -1;
  //     });

  //     return clone.slice(0, n || 1);
  // }

  // var prop;

  // var topScorers = getTopN(arr,  "left", 2);
  // topScorers.forEach(function(item, index) {
  //     c("#" + (index+1) + ": " + item.boundingBox.left + "  -  " + item.tagName);
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

  // c(data.predictions);
  // data.predictions.forEach(prediction => {

  // var topPositions = [];
  //  topPositions = prediction.boundingBox.left;

  // });
}

const predict = async (req, res) => {
  async function downloadCodeFromAzure() {
    const containerClient = blobServiceClient.getContainerClient(
      req.params.containerName
    );

    console.log(req.params.blobName);
    const blobClient = containerClient.getBlobClient(req.params.blobName);

    // Get blob content from position 0 to the end
    // In Node.js, get downloaded data by accessing downloadBlockBlobResponse.readableStreamBody
    const downloadBlockBlobResponse = await blobClient.download();
    const downloaded = await streamToBuffer(
      downloadBlockBlobResponse.readableStreamBody
    );
    // console.log("Downloaded blob content" + downloaded);

    // console.log("Downloaded blob content:", downloaded);

    // fs.writeFile(`./Images/${req.params.blobName}`, downloaded, function (err) {
    //   if (err) {
    //     return console.error(err);
    //   }
    //   console.log("File saved successfully!");
    //   fileSaved = true;
    //   downloadedFile = downloaded;

    //   return downloadedFile;
    // });

    // [Node.js only] A helper method used to read a Node.js readable stream into a Buffer
    async function streamToBuffer(readableStream) {
      return new Promise((resolve, reject) => {
        const chunks = [];
        readableStream.on("data", (data) => {
          chunks.push(data instanceof Buffer ? data : Buffer.from(data));
        });
        readableStream.on("end", () => {
          resolve(Buffer.concat(chunks));
        });
        readableStream.on("error", reject);
      });
    }

    return downloaded;
  }

  // await downloadCodeFromAzure();

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
        let tagId = element.tagId;
        // const q = () => Code.findOne();

        const gettingCode = (element) => {
          if (element) {
            Code.findOne(
              { tagId }

              // (error, success) => {
              //   if (error) {
              //     res.status(500).json(err);
              //     console.error;
              //   }
              // }
            )
              .clone()
              .then((data) => {
                // c(data);
                element.code = data.code;
                var arrayItem = data.code;
                predictionArray.push(arrayItem);
              });

            // await q.clone()

            // res.status(201).json(data);
            // return element
            // c(element);
          }
          // return q;
        };

        gettingCode(element);
        // function (err, docs) {
        // c(`${docs.code} at index ${index}`);

        // return docs
        // }
      });
      // c(predictionArray);
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
  //     c(tag)
  //       return tag;
  //   });
  // }

  const sampleDataRoot = "Images";
  // const  downloadedFile = downloadCodeFromAzure();
  // const testFile = fs.readFileSync(`${sampleDataRoot}/${req.params.blobName}`);
  await predictor
    .detectImage(
      sampleProject.id,
      publishIterationName,
      await downloadCodeFromAzure()
    )
    .then((data) => {
      if (data) {
        data.predictions = data.predictions.filter(
          (prediction) => prediction.probability >= 0.9
        );
        findTopPosition(data);

        // c(data);

        let savedPrediction = addPrediction(data);

        // c(data);

        // c(savedPrediction);

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
        //   c(arrayItem)
        //   })

        res.status(200).json(data);
        console.log("done predicting");
      } else {
        res.status(404).json("No prediction can be made");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json(err);
    });

  // Show results
  // c("Results:");
  // let probabilityThreshold;
  // results.predictions.forEach(predictedResult => {
  // c(`\t ${predictedResult.tagName}: ${(predictedResult.probability * 100.0).toFixed(2)}% ${predictedResult.boundingBox.left},${predictedResult.boundingBox.top},${predictedResult.boundingBox.width},${predictedResult.boundingBox.height}`);
  // c(`\t ${predictedResult.tagName}: ${(predictedResult.probability * 100.0).toFixed(2)}% `);
  // probabilityThreshold = predictedResult.probability > 0.80;
  // c(probabilityThreshold)
  //     if (probabilityThreshold === true){
  //     // c(`\t ${predictedResult.tagName}: ${(predictedResult.probability * 100.0).toFixed(2)}%  `);
  //     // c(predictedResult);
  // }
  // res.status(201).json(results.predictions);
  // })
};

module.exports = {
  predict,
  // getCode
};
