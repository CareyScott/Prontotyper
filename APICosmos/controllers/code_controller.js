const FileSaver = require('file-saver');
const Blob = require('node-blob');


const res = require("express/lib/response");
const Code = require("../models/code_schema");
const User = require("../models/user_schema");
const Prediction = require("../models/prediction_schema");

const { BlobServiceClient } = require("@azure/storage-blob");

const blobSasUrl =
  "https://sketch2codestoresc.blob.core.windows.net/?sv=2020-08-04&ss=bfqt&srt=sco&sp=rwdlacupitfx&se=2022-03-28T19:07:26Z&st=2022-03-28T11:07:26Z&spr=https&sig=JqMKzkesXCjckyf63hP659XYg6lv1GeZYFfHkoY4l%2Fg%3D";
const blobServiceClient = new BlobServiceClient(blobSasUrl);
const containerName = "567567";
const containerClient = blobServiceClient.getContainerClient(containerName);

// const getAllCode = (req, res) => {
//   Code.find()
//     .then((data) => {
//       if (data) {
//         res.status(200).json(data);
//       } else {
//         res.status(404).json("No Code not found");
//       }
//     })
//     .catch((err) => {
//       console.error(err);
//       res.status(500).json(err);
//     });
// };

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

const generateFile = (prediction, code) => {
  let html = "";
  prediction.map((prediction, i) => {
    if (prediction.boundingBox.range === "nextRow") {
      html += `
       <div className="break flex"></div>
       <div
       key={'spacing-${i}'}
       className={'element ${prediction.boundingBox.pushLeft}  flex flexWidth'}
     >
     </div>
     <div
       key="object-${i}"
       className='${prediction.boundingBox.width} flex flexWidth'
     >
       
     ${checkTagName(prediction, code).code}
     </div>
       `;
    } else if (prediction.boundingBox.range === "firstElement") {
      html += `
          <div
            key={'first-${i}'}
            className={'${prediction.boundingBox.pushLeft}  flex flexWidth'}
          >
            {/* {i} */}
          </div>
          <div
            key={'same-${i}'} 
            className={'flex  ${prediction.boundingBox.width}'}
          >
            ${checkTagName(prediction, code).code}
          </div>
      `;
    } else {
      html += `
          <div
            key={'same-${i}'}
            className={'flex  ${prediction.boundingBox.width}'}
          >
            ${checkTagName(prediction).code}
          </div>
          `
    }

 
  });

 

  
  // save file in container as componentName.js
  const addContainer = async () => {
 

    // console.log(containerClient)
    const createContainerResponse = await containerClient.create();
    console.log(
      "Container was created successfully. requestId: ",
      createContainerResponse.requestId
    );
  };
  addContainer();

  

  const saveCodeToContainer = async (html) => {

    if (html){
      let code = new Blob([html], {type: "text/html"});
      html === code
      return html 
    }
   FileSaver.saveAs(html, "code.html");
    
   try {
    // reportStatus("Uploading files...");
    const promises = [];
    html.forEach(file => {
      console.log(file);

     //  get component name here
     // let filename = componentName + projectID + file.ext;
      const blockBlobClient = containerClient.getBlockBlobClient(file.name);
      promises.push(blockBlobClient.uploadData(file));
    })

    await Promise.all(promises);
    // reportStatus("Done.");
    // listFiles();
  } catch (error) {
    // reportStatus(error.message);
    console.log("comething went wrong uploading the file");
  }
  };

  saveCodeToContainer(html);
};

const downloadCode = (req, res) => {
  let framework = req.params.framework;
  let code;
  let prediction;
  let file;

  // step 1, mongoose get prediction by component id
  // step 2, get the code by framework

  let id = req.params.id;

  Prediction.findOne({ id })
    .then((data) => {
      if (data) {
        prediction = data.predictions;
        // console.log(prediction)
      } else {
        res.status(404).json("No Code not found");
      }
    })
    .then(() => {
      Code.find({ framework })
        .then((data) => {
          if (data) {
            code = data;
          } else {
            res.status(404).json("No Code not found");
          }
        })
        .then(() => {
          file = generateFile(prediction, code);
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

  // sends the componentName.js to the user
};
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
  //   getAllCode,
  generateFile,

  downloadCode,
  getSingleCode,
  addCode,
  editCode,
  deleteCode,
};
