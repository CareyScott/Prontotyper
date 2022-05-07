// const { FileSaver } = require("file-saver");
const Blob = require("buffer");
// const { DOMParser } = require("xmldom");
(fs = require("fs")), (path = require("path")), (util = require("util"));
// const axios = require("axios").default;
// const FormData = require("form-data"); // npm install --save form-data
const dotenv = require("dotenv");
// const intoStream = require("into-stream");
// const path = require("path");
const express = require("express");
// const fileUpload = require("express-fileupload");
const azure = require("@azure/storage-blob");

const { BlobServiceClient } = require("@azure/storage-blob");

// const res = require("express/lib/response");
const Code = require("../models/code_schema");
// const User = require("../models/user_schema");
const Prediction = require("../models/prediction_schema");
// const { append } = require("express/lib/response");
const blobSasUrl =
  "https://sketch2codestoresc.blob.core.windows.net/?sv=2020-08-04&ss=bfqt&srt=sco&sp=rwdlacupitfx&se=2022-09-01T15:55:24Z&st=2022-04-25T07:55:24Z&spr=https&sig=kT52sph2xMa4nwrsf0szfKehC6%2F%2FJsxKHxNfRgztWm4%3D";
// Create a new BlobServiceClient
const blobServiceClient = new BlobServiceClient(blobSasUrl);
// const containerName = "yurt";
let fileSaved = false;
let htmlSent;
const instance = new express();

const checkTagName = (prediction, code) => {
  let value;
  // console.log(prediction);
  code.forEach((element, index) => {
    if (element.tagName === prediction.tagName) {
      value = element;
    }
  });
  return value;
};

const uploadFiles = async (file, blobName, UserID) => {
  const containerClient = blobServiceClient.getContainerClient(UserID);

  let content = file;
  try {
    console.log("Uploading files...");
    const promises = [];
    // blobName = "upload.html"
    if (content) {
      const blobOptions = {
        blobHTTPHeaders: { blobContentType: "text/html" },
      };

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
    await Promise.all(promises);
    console.log("Done.");


    // downloadCodeFromAzure();

    // listFiles();
  } catch (error) {
    console.log(error.message);
  }
  return htmlSent;
};

const generateFile = async (prediction, code, blobName) => {
  let html = "";
   prediction.map((prediction, i) => {
    if (prediction.boundingBox.range === "nextRow") {
      html += `
          <div className="break flex"></div>
          <div key={'spacing-${i}'} className={'element ${prediction.boundingBox.pushLeft}  flex flexWidth'}> </div>
          <div key={"object-${i}"} className={'${prediction.boundingBox.width} flex flexWidth'} >
       ${checkTagName(prediction, code).code}
          </div>`
    } else if (prediction.boundingBox.range === "firstElement") {
      html += `
          <div key={'first-${i}'} className={'${prediction.boundingBox.pushLeft}  flex flexWidth'} ></div>
          <div key={'same-${i}'} className={'flex  ${prediction.boundingBox.width}'} >
            ${checkTagName(prediction, code).code}
          </div>`
    } else {
      html += `
          <div key={'same-${i}'} className={'flex  ${prediction.boundingBox.width} ${prediction.boundingBox.left} '} >
            ${checkTagName(prediction, code).code}
          </div>`
    }
  });


return html;
};

// save file in container as componentName.js
// const createContainer = async (containerClient) => {
//   try {
//     console.log(`Creating container "${containerName}"...`);
//     await containerClient.createIfNotExists();
//     // reportStatus(`Done.`);
//     console.log("Created container");
//   } catch (error) {
//     console.log(error.message);
//   }
// };

const downloadCode = async (req, res) => {
  containerName = req.params.container;
  let id = req.params.id;
  let blobName = req.params.blobName;
  let framework = req.params.framework;
  let UserID = req.params.user;
  let code = [];
  let prediction;
  let file;


  Prediction.findOne({ id })
    .then( (data) => {
      if ( data) {
          prediction = data.predictions;
        console.log(data.predictions[0])
      } else {
        res.status(404).json("Code not found");
        console.log("it was me")
      }
    })
    .then(() => {
      Code.find({ framework })
        .then((data) => {
          // console.log(data);
          if (data) {
            code = data;
          } else {
            res.status(404).json("No Code found");
            console.log("NOOOO! it was me")

          }
        })
        .then(async () => {
            file = await generateFile( prediction, await code, await blobName);
            await uploadFiles(file, blobName, UserID, containerName);

          res.status(200).json(file)
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

// async function downloadCodeFromAzure() {
//   const containerClient = blobServiceClient.getContainerClient(containerName);
//   console.log("download");
//   const blobClient = containerClient.getBlobClient(blobName);
//   console.log("fghfgh");
//   // Get blob content from position 0 to the end
//   // In Node.js, get downloaded data by accessing downloadBlockBlobResponse.readableStreamBody
//   const downloadBlockBlobResponse = await blobClient.download();
//   const downloaded = await streamToBuffer(
//     downloadBlockBlobResponse.readableStreamBody
//   );
//   console.log("Downloaded blob content");

//   // console.log("Downloaded blob content:", downloaded);

//   // console.log("download")
//   // fs.writeFile(`${blobName}.html`, downloaded, function (err) {
//   //   console.log("gffghgjk")
//   //   if (err) {
//   //     return console.error(err);
//   //   }
//   //   console.log("File saved successfully!");
//   //   fileSaved = true;
//   //   downloadedFile = downloaded;

//   //   // return downloadedFile;
//   // });

//   // [Node.js only] A helper method used to read a Node.js readable stream into a Buffer
//   async function streamToBuffer(readableStream) {
//     return new Promise((resolve, reject) => {
//       const chunks = [];
//       readableStream.on("data", (data) => {
//         chunks.push(data instanceof Buffer ? data : Buffer.from(data));
//       });
//       readableStream.on("end", () => {
//         resolve(Buffer.concat(chunks));
//       });
//       readableStream.on("error", reject);
//     });
//   }

//   return downloaded;
// }

const getSingleCode = (req, res) => {
  let framework = req.params.framework;
  // Code.find({framework: req.params.framework})
  Code.find({ framework })
    // .populate("components")
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

const addCode = (req, res) => {
  let CodeData = req.body;
  Code.create(CodeData)
    .then((data) => {
      //   if (data) {
      //     User.findByIdAndUpdate(
      //       {
      //         _id: data.user_id,
      //       },
      //       {
      //         $push: { Code: data._id },
      //       },
      //       (error, success) => {
      //         if (error) {
      //           res.status(500).json(err);
      //         }
      //       }
      //     );
      res.status(201).json(data);
      //   }
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
