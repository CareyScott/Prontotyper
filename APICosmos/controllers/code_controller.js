const Blob = require("buffer");
(fs = require("fs")), (path = require("path")), (util = require("util"));
const dotenv = require("dotenv");
const express = require("express");
const azure = require("@azure/storage-blob");

const { BlobServiceClient } = require("@azure/storage-blob");

const Code = require("../models/code_schema");
const Prediction = require("../models/prediction_schema");
const blobSasUrl =
  "https://sketch2codestoresc.blob.core.windows.net/?sv=2020-08-04&ss=bfqt&srt=sco&sp=rwdlacupitfx&se=2022-09-01T15:55:24Z&st=2022-04-25T07:55:24Z&spr=https&sig=kT52sph2xMa4nwrsf0szfKehC6%2F%2FJsxKHxNfRgztWm4%3D";
const blobServiceClient = new BlobServiceClient(blobSasUrl);
let fileSaved = false;
let htmlSent;
const instance = new express();

const checkTagName = (prediction, code) => {
  let value;
  code.forEach((element, index) => {
    if (element.tagName === prediction.tagName) {
      value = element;
    }
  });
  return value;
};

// uploads the html template literal to Azure storage as .html file
const uploadFiles = async (file, blobName, UserID) => {
  // gets container
  const containerClient = blobServiceClient.getContainerClient(UserID);

  // content setting
  let content = file;

  //async try/ catch
  try {
    console.log("Uploading files...");
    const promises = [];
    // if content, upload content with properties set by blobOptions
    if (content) {
      const blobOptions = {
        blobHTTPHeaders: { blobContentType: "text/html" },
      };

      // setting location (folder) + name of blob + filetype
      const blockBlobClient = containerClient.getBlockBlobClient(
        `${containerName}/ ${blobName}.html`
      );

      const uploadBlobResponse = await blockBlobClient.upload(
        content,
        content.length,
        blobOptions
      );
      console.log(
        `Upload code block blob ${blobName} successfully`
        // uploadBlobResponse.requestId
      );
    }

    // resolves promise
    await Promise.all(promises);
    console.log("Done.");
  } catch (error) {
    console.log(error.message);
  }
  return htmlSent;
};

// template literal - code generation loop
const generateFile = async (prediction, code, blobName) => {
  let html = "";
  prediction.map((prediction, i) => {
    if (prediction.boundingBox.range === "nextRow") {
      html += `
          <div className="break flex"></div>
          <div key={'spacing-${i}'} className={'element ${
        prediction.boundingBox.pushLeft
      }  flex flexWidth'}> </div>
          <div key={"object-${i}"} className={'${
        prediction.boundingBox.width
      } flex flexWidth'} >
       ${checkTagName(prediction, code).code}
          </div>`;
    } else if (prediction.boundingBox.range === "firstElement") {
      html += `
          <div key={'first-${i}'} className={'${
        prediction.boundingBox.pushLeft
      }  flex flexWidth'} ></div>
          <div key={'same-${i}'} className={'flex  ${
        prediction.boundingBox.width
      }'} >
            ${checkTagName(prediction, code).code}
          </div>`;
    } else {
      html += `
          <div key={'same-${i}'} className={'flex  ${
        prediction.boundingBox.width
      } ${prediction.boundingBox.left} '} >
            ${checkTagName(prediction, code).code}
          </div>`;
    }
  });

  return html;
};
// function run to generate code
const downloadCode = async (req, res) => {
  containerName = req.params.container;
  let id = req.params.id;
  let blobName = req.params.blobName;
  let framework = req.params.framework;
  let UserID = req.params.user;
  let code = [];
  let prediction;
  let file;

  // gets the prediction by id from CosmosDB
  Prediction.findOne({ id })
    .then((data) => {
      if (data) {
        prediction = data.predictions;
        console.log(data.predictions[0]);
      } else {
        res.status(404).json("Code not found");
        console.log("it was me");
      }
    })
    .then(() => {
      // then get all code snippets with the containing the framework name requested
      Code.find({ framework })
        .then((data) => {
          if (data) {
            // for use within checktagname function
            code = data;
          } else {
            res.status(404).json("No Code found");
            console.log("NOOOO! it was me");
          }
        })
        .then(async () => {
          // generate the file
          file = await generateFile(prediction, await code, await blobName);
          // once generated, upload the file to azure
          await uploadFiles(file, blobName, UserID, containerName);

          res.status(200).json(file);
        })

        .catch((err) => {
          console.error(err);
          res.status(500).json(err);
        });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json(err);
    });
};

//////////////// DEV /////////////////
const getSingleCode = (req, res) => {
  let framework = req.params.framework;
  Code.find({ framework })
    .then((data) => {
      if (data) {
        res.status(200).json(data);
      } else {
        res.status(404).json("No Code not found");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json(err);
    });
};

// DEV- adding code snippets to Cosmos
const addCode = (req, res) => {
  let CodeData = req.body;
  Code.create(CodeData)
    .then((data) => {
      res.status(201).json(data);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(422).json(err);
      } else {
        console.error(err);
        res.status(500).json(err);
      }
    });
};
// DEV- editing code snippets from Cosmos

const editCode = (req, res) => {
  let CodeData = req.body;
  Code.findByIdAndUpdate(req.params.id, CodeData, {
    new: true,
  })
    .then((data) => {
      if (data) {
        res.status(201).json(data);
      }
    })
    .catch((err) => {
      if (err.name === "Validation Error") {
        res.status(422).json(err);
      } else {
        console.error(err);
        res.status(500).json(err);
      }
    });
};

// DEV- deleting code snippets from Cosmos

const deleteCode = (req, res) => {
  let CodeData = req.body;
  Code.findByIdAndDelete(req.params.id, {
    new: true,
  })
    .then((data) => {
      if (data) {
        res.status(201).json("Code deleted");
      } else {
        res
          .status(404)
          .json(
            `Code with id: ${req.params.id} not found & does not exist or must already be deleted`
          );
      }
    })
    .catch((err) => {
      if (err.name === "Validation Error") {
        res.status(422).json(err);
      } else {
        console.error(err);
        res.status(500).json(err);
      }
    });
};
module.exports = {
  generateFile,
  downloadCode,
  getSingleCode,
  addCode,
  editCode,
  deleteCode,
};
