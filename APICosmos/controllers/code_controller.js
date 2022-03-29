const { FileSaver } = require("file-saver");
const Blob = require("buffer");
const { DOMParser } = require("xmldom");
(fs = require("fs")), (path = require("path")), (util = require("util"));
const axios = require("axios").default;
const FormData = require("form-data"); // npm install --save form-data
const dotenv = require("dotenv");
// const intoStream = require("into-stream");
// const path = require("path");
const express = require("express");
const fileUpload = require("express-fileupload");
const azure = require("@azure/storage-blob");

// const FileAPI = require('file-api')  , File = FileAPI.File
// , FileList = FileAPI.FileList
// , FileReader = FileAPI.FileReader
// ;
const { BlobServiceClient } = require("@azure/storage-blob");

const res = require("express/lib/response");
const Code = require("../models/code_schema");
const User = require("../models/user_schema");
const Prediction = require("../models/prediction_schema");
const { append } = require("express/lib/response");
const blobName = "codeforContainer"
const blobSasUrl =
  "https://sketch2codestoresc.blob.core.windows.net/?sv=2020-08-04&ss=bfqt&srt=sco&sp=rwdlacupitfx&se=2022-03-29T17:38:59Z&st=2022-03-29T09:38:59Z&spr=https&sig=Br277%2FP6NNMke2AD0EXh36jxdcNfipj7aloK9Kv%2B%2B2A%3D";
const blobServiceClient = new BlobServiceClient(blobSasUrl);
const containerName = "yurt" ;
const containerClient = blobServiceClient.getContainerClient(containerName);
const instance = new express();

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
      console.log("Created container ");
    } catch (error) {
      console.log(error.message);
    }
  };
  // createContainer();

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
    // fs.writeFile("helloworld.txt", "Hello World!", function (err) {
    //   if (err) return console.log(err);
    // });

    // var content;
    // console.log(content);
    // fs.readFile("utf8", function (err, data) {
    //   if (err) {
    //     console.log(err);
    //     process.exit(1);
    //   }
    //   content = util.format(data, "test", "test", "test");
    //   console.log(content);
    // });

    // if (!file) {
    //   console.log(file);
    // }

    // let dataCode;
    // fs.writeFile("./UploadedFile", html, ["html"], function (err, data) {
    //   if (err) {
    //     return console.log(err);
    //   } else {
    //     dataCode = data;
    //   }
    // });
    // var formData = new FormData();
    // var content = html; // the body of the new file...
    // var blob = new FormData([content], { type: "text/html" });

    // formData.append("webmasterfile", blob);

    // const data = new FormData();
    // data.append(html, fs.createReadStream("./UploadedFile.html"));
    // let filename = "filename.html"

    // fs.appendFile(__dirname + "/files/" + "UploadedFile.html", 'data to append', function (err) {
    //   if (err) throw err;
    //   console.log('Saved!');
    // });

    let content = html;
    try {
      console.log("Uploading files...");
      const promises = [];
      // blobName = "upload.html"
      if (content) {
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        const uploadBlobResponse = await blockBlobClient.upload(content, content.length);
        console.log(`Upload block blob ${blobName} successfully`, uploadBlobResponse.requestId);

      }
      await Promise.all(promises);
      console.log("Done.");
      downloadCodeFromAzure();

      // listFiles();
    } catch (error) {
      console.log(error.message);
    }

    // dotenv.config();
    // 7.
    // instance.use(
    //   fileUpload({
    //     createParentPath: true,
    //   })
    // );
    // 8.

    // const containerName = "yurt";

    // const blobService = azure.createBlobService(
    //   process.env.AZURE_STORAGE_CONNECTION_STRING
    // );
    // // 9.
    // // instance.get("/", (req, res) => {
    // //   res.sendFile(path.join(__dirname, "index.html"));
    // // });
    // // 10.
    // instance.post("/fileupload", (request, response) => {
    //   // 10.1.
    //   if (!request.files) {
    //     return res.status(400).send("No files are received.");
    //   }

    //   // 10.2.
    //   const file = request.files.file;
    //   // 10.3.
    //   const path = __dirname + "/files/" + file.name;
    //   // 10.4.
    //   file.mv(path, (err) => {
    //     // 10.5.
    //     if (err) {
    //       return response.status(500).send(err);
    //     }
    //     // 10.6.
    //     return response.send({ status: "success", path: path });
    //   });
    // });
    // // 11.
    // instance.post("/blobupload", (request, response) => {
    //   if (!request.files) {
    //     return res.status(400).send("No files are received.");
    //   }

    //   // 11.1.
    //   const blobName = request.files.file.name;
    //   console.log(`Blob Name ${blobName}`);
    //   // 11.2.
    //   const stream = intoStream(request.files.file.data);
    //   console.log(`stream ${stream}`);
    //   // 11.3.
    //   const streamLength = request.files.file.data.length;
    //   console.log(`Length ${streamLength}`);
    //   // 11.4.
    //   blobService.createBlockBlobFromStream(
    //     containerName,
    //     blobName,
    //     stream,
    //     streamLength,
    //     (err) => {
    //       if (err) {
    //         response.status(500);
    //         response.send({ message: "Error Occured" });
    //         return;
    //       }

    //       response.status(200).send({message:
    // 'File Uploaded Successfully'});
    //     }
    //   );
    // });

    // const request_config = {
    //   headers: {
    //     ...data.getHeaders(),
    //   },
    // };

    // console.log(data);

    // return axios.post(
    //   "https://prontofunctionsapp.azurewebsites.net/api/UploadCode?code=PpfP/sUTXGKaNuBzzmERp8lqjnfxvEx9zOu9wCGWIK2XWZJ6NSnUtQ==",
    //   form,
    //   request_config
    // );

    //   return axios.({
    //     method: 'post',
    //     baseURL: "https://prontofunctionsapp.azurewebsites.net/api/UploadCode?code=PpfP/sUTXGKaNuBzzmERp8lqjnfxvEx9zOu9wCGWIK2XWZJ6NSnUtQ==",
    //     headers: {
    //         common: {
    //             Accept: 'application/json',
    //         }
    //     }
    // }).then(console.log("hi")).catch(error){
    //   console.log(error.message);
    // };

    // axios
    //   .post(
    //     `https://prontoupload.azurewebsites.net/api/upload?code=BT0J26/nBNaW04hEhaV1oAmvRT7dRIWk7TA0fvI5HK5wPmrcMJhcIA==/api/upload?filename=${filename}&username=N00181237@student.iadt.ie`
    //   , {
    //     headers: {
    //       'Content-Type': 'multipart/form-data'
    //     }
    //   })
    //   .then(function (response) {
    //     console.log(response);
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   });
  };

  uploadFiles(html);
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


async function downloadCodeFromAzure() {
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blobClient = containerClient.getBlobClient(blobName);

  // Get blob content from position 0 to the end
  // In Node.js, get downloaded data by accessing downloadBlockBlobResponse.readableStreamBody
  const downloadBlockBlobResponse = await blobClient.download();
  const downloaded = (
    await streamToBuffer(downloadBlockBlobResponse.readableStreamBody)
  ).toString();
  console.log("Downloaded blob content:", downloaded);


  fs.writeFile(`${blobName}.html`, downloaded, function(err) {
    if(err) {
        return console.error(err);
    }
    console.log("File saved successfully!");
});

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
}



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
