const util = require('util');
const fs = require('fs');
const res = require("express/lib/response");
const TrainingApi = require("@azure/cognitiveservices-customvision-training");
const PredictionApi = require("@azure/cognitiveservices-customvision-prediction");
const msRest = require("@azure/ms-rest-js");

const trainingKey = "de15aea8800e4aacb1695ef40ab9d87a";
const trainingEndpoint = "https://westus2.api.cognitive.microsoft.com/";
const predictionKey = "de15aea8800e4aacb1695ef40ab9d87a";
const predictionEndpoint = "https://westus2.api.cognitive.microsoft.com/";


const publishIterationName = "Iteration1";

const credentials = new msRest.ApiKeyCredentials({ inHeader: { "Training-key": trainingKey } });
const trainer = new TrainingApi.TrainingAPIClient(credentials, trainingEndpoint);
const predictor_credentials = new msRest.ApiKeyCredentials({ inHeader: { "Prediction-key": predictionKey } });
const predictor = new PredictionApi.PredictionAPIClient(predictor_credentials, predictionEndpoint);


const predict = async (req, res) => {
    const domains = await trainer.getDomains()
    const objDetectDomain = domains.find(domain => domain.type === "ObjectDetection");
    const sampleProject = await trainer.getProject("1eab146a-0e50-449a-b2d2-d14c7664008c", { domainId: objDetectDomain.id });

    const sampleDataRoot = "Images";
	
    const testFile = fs.readFileSync(`${sampleDataRoot}/small.jpg`);
    const results = await predictor.detectImage(sampleProject.id, publishIterationName, testFile)
    
    .then((data) => {
        if (data) {
          res.status(200).json(data.predictions);
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
    
   
}



module.exports = {
  predict
  };
