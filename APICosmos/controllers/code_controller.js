const {FileSaver} = require("file-saver");
const Blob = require("buffer");
const { DOMParser } = require('xmldom')
fs = require('fs'),path = require("path"),
util = require("util");



// const FileAPI = require('file-api')  , File = FileAPI.File
// , FileList = FileAPI.FileList
// , FileReader = FileAPI.FileReader
// ;
const { BlobServiceClient } = require("@azure/storage-blob");


const res = require("express/lib/response");
const Code = require("../models/code_schema");
const User = require("../models/user_schema");
const Prediction = require("../models/prediction_schema");

const blobSasUrl =
  "https://sketch2codestoresc.blob.core.windows.net/?sv=2020-08-04&ss=bfqt&srt=sco&sp=rwdlacupitfx&se=2022-03-28T19:07:26Z&st=2022-03-28T11:07:26Z&spr=https&sig=JqMKzkesXCjckyf63hP659XYg6lv1GeZYFfHkoY4l%2Fg%3D";
const blobServiceClient = new BlobServiceClient(blobSasUrl);
const containerName = "container" + new Date().getTime();
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
          `;
    }
  });

  // save file in container as componentName.js
  const createContainer = async () => {
    try {
        console.log(`Creating container "${containerName}"...`);
        await containerClient.createIfNotExists();
        // reportStatus(`Done.`);
        console.log('Created container ')
        uploadFiles(html)
    } catch (error) {
        console.log(error.message);
    }


};

createContainer()

  // addContainer();


  // const saveCodeToContainer = async (html) => {
  //   // if (html) {
  //   //   let code = new Blob([html], { type: "text/html" });
  //   //   html === code;
  //   //   return html;
  //   // }
  //   // FileSaver.saveAs(html, "code" + uuidv1() + ".html");

  //   // console.log(html)
  //   try {
  //     const containerName = "8888";
  //     const containerClient = blobServiceClient.getContainerClient(containerName);


  //     const blobName = "code" + uuidv1() + ".txt"
  //     const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  //     console.log("\nUploading to Azure storage as blob:\n\t", blobName);

  //     // Upload data to the blob
  //     // const data = html;
  //     const uploadBlobResponse = await blockBlobClient.upload(
  //       html.toString(),
  //       html.length
  //     );
  //     console.log(
  //       "Blob was uploaded successfully. requestId: ",
  //       uploadBlobResponse.requestId
  //     );
  //     // reportStatus("Done.");
  //     // listFiles();
  //   } catch (error) {
  //     // reportStatus(error.message);
  //     console.log("something went wrong uploading the file");
  //   }
  // };

  // saveCodeToContainer(html)


  // const uploadFiles = async () => {
  //     // var parser = new DOMParser();
  //     // var doc = parser.parseFromString(html, 'text/html');

  //     // var file = new File([`${html}`], "filename");
  //     // var f = new File([""], "filename.txt", {type: "text/plain"})

  //     // return doc.body;
    
  //   //  FileSaver.saveAs(html, "code" + uuidv1() + ".html");
  //   const data = "Hello, World!";

  //   try {
  //     // reportStatus("Uploading files...");
  //     // const promises = [];
  //     // doc.forEach(file => {
  //       // let file = doc
  //     console.log(data);

  //      //  get component name here
  //      // let filename = componentName + projectID + file.ext;
  //       const blockBlobClient = containerClient.getBlockBlobClient(file.name);
  //       push(blockBlobClient.uploadData(data));
  //     // })

  //     // await Promise.all(promises);
  //     // reportStatus("Done.");
  //     // listFiles();
  //   } catch (error) {
  //     // reportStatus(error.message);
  //     console.log("comething went wrong uploading the file");
  //   }
    
  // };
  // uploadFiles()


  const uploadFiles = async (html) => {
    let file = fs.writeFile('helloworld.txt', 'Hello World!', function (err) {
      if (err) return console.log(err);
      
    }    );


    var content;
console.log(content);
fs.readFile( 'utf8', function (err, data) {
    if (err) {
        console.log(err);
        process.exit(1);
    }
    content = util.format(data, "test", "test", "test");
    console.log(content);
});
   

    if (!file){
      console.log(file);
    }

    try {
      console.log("Uploading files...");
        const promises = [];
        if (file) {
            const blockBlobClient = containerClient.getBlockBlobClient(file.name);
            promises.push(blockBlobClient.uploadBrowserData(file));
        }
        await Promise.all(promises);
        console.log("Done.");
        // listFiles();
    }
    catch (error) {
            console.log(error.message);
    }
}



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
