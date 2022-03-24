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
const getSingleCode = (req, res) => {
  // Code.find({framework: req.params.framework})
  Code.find()
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
  getSingleCode,
  addCode,
  editCode,
  deleteCode,
};
