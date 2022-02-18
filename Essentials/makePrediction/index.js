const util = require('util');
const fs = require('fs');
const TrainingApi = require("@azure/cognitiveservices-customvision-training");
const PredictionApi = require("@azure/cognitiveservices-customvision-prediction");
const msRest = require("@azure/ms-rest-js");

const trainingKey = "de15aea8800e4aacb1695ef40ab9d87a";
const trainingEndpoint = "https://westus2.api.cognitive.microsoft.com/";
const predictionKey = "de15aea8800e4aacb1695ef40ab9d87a";
const predictionResourceId = "/subscriptions/c9e00d87-1435-44d3-9a46-48489b2abcd7/resourceGroups/sketch2code-vision-SC/providers/Microsoft.CognitiveServices/accounts/sketch2code-vision-sc";
const predictionEndpoint = "https://westus2.api.cognitive.microsoft.com/";


// <snippet_vars>
const publishIterationName = "Iteration1";
const setTimeoutPromise = util.promisify(setTimeout);
// </snippet_vars>

// <snippet_auth>
const credentials = new msRest.ApiKeyCredentials({ inHeader: { "Training-key": trainingKey } });
const trainer = new TrainingApi.TrainingAPIClient(credentials, trainingEndpoint);
const predictor_credentials = new msRest.ApiKeyCredentials({ inHeader: { "Prediction-key": predictionKey } });
const predictor = new PredictionApi.PredictionAPIClient(predictor_credentials, predictionEndpoint);
// </snippet_auth>

// <snippet_helper>
/* Helper function to let us use await inside a forEach loop.
 * This lets us insert delays between image uploads to accommodate the rate limit.
 */
// async function asyncForEach(array, callback) {
//     for (let i = 0; i < array.length; i++) {
//         await callback(array[i], i, array);
//     }
// }
// </snippet_helper>

// <snippet_create>
(async () => {
    // console.log("Creating project...");
    const domains = await trainer.getDomains()
    const objDetectDomain = domains.find(domain => domain.type === "ObjectDetection");
    const sampleProject = await trainer.getProject("1bc291a0-6fa9-49fb-9337-c2b3a05977d2", { domainId: objDetectDomain.id });
    // </snippet_create>

    const sampleDataRoot = "Images";
	
    // <snippet_test>
    const testFile = fs.readFileSync(`${sampleDataRoot}/sample_2.png`);
    const results = await predictor.detectImage(sampleProject.id, publishIterationName, testFile)

    // Show results
    console.log("Results:");
    results.predictions.forEach(predictedResult => {
        console.log(`\t ${predictedResult.tagName}: ${(predictedResult.probability * 100.0).toFixed(2)}% ${predictedResult.boundingBox.left},${predictedResult.boundingBox.top},${predictedResult.boundingBox.width},${predictedResult.boundingBox.height}`);
    });
    // </snippet_test>

	// Clean up resources
	// <snippet_delete>
	// console.log ("Unpublishing iteration ID: " + trainingIteration.id);
	// await trainer.unpublishIteration(sampleProject.id, trainingIteration.id);
	// console.log ("Deleting project ID: " + sampleProject.id);
	// await trainer.deleteProject(sampleProject.id);
	// </snippet_delete>

    // <snippet_function_close>
})()
// </snippet_function_close>