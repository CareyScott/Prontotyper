const res = require("express/lib/response");
const Code = require("../models/code_schema");
const User = require("../models/user_schema");

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
  console.log(prediction);
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
            ${checkTagName(prediction, props).code}
          </div>
      `;
    } else {
      html += `
          <div
            key={'same-${i}'}
            className={'flex  ${prediction.boundingBox.width}'}
          >
            ${checkTagName(prediction, props).code}
          </div>
          `;
    }
  });
  // save file in container as componentName.js
};

const downloadCode = (req, res) => {
  let framework = req.params.framework;

  let code;
  let prediction;

  let file;

  // step 1, mongoose get prediction by component id
  // step 2, get the code by framework
  //

  Prediction.find({})
    .then((data) => {
      if (data) {
        prediction = data;
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
  downloadCode,
  getSingleCode,
  addCode,
  editCode,
  deleteCode,
};
