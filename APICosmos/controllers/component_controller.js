const res = require("express/lib/response");
const Component = require("../models/component_schema");
const Project = require("../models/project_schema");

// getting all components
const getAllComponents = (req, res) => {
  // mongoose modal call & query
  Component.find()
    .then((data) => {
      if (data) {
        res.status(200).json(data);
      } else {
        res.status(404).json("No components not found");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json(err);
    });
};

// get component by id
const getSingleComponent = (req, res) => {
  // mongoose modal call & query
  Component.findById(req.params.id)
    // populates component recieved with the parent project object
    .populate("project")

    .then((data) => {
      if (data) {
        res.status(200).json(data);
      } else {
        res.status(404).json(`component with id: ${req.params.id} not found`);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json(err);
    });
};

// create component
const addComponent = (req, res) => {
  let componentData = req.body;
  // mongoose modal call & query
  Component.create(componentData)
    .then((data) => {
      if (data) {
        Project.findByIdAndUpdate(
          {
            _id: data.project,
          },
          {
            $push: { components: data._id },
          },
          (error, success) => {
            if (error) {
              res.status(500).json(err);
            }
          }
        );
        res.status(201).json(data);
      }
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

// edit component
const editComponent = (req, res) => {
  let componentData = req.body;
  //find by id to update
  // mongoose modal call & query
  Component.findByIdAndUpdate(req.params.id, componentData, {
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
// deleting component
const deleteComponent = (req, res) => {
  // mongoose modal call & query
  Component.findByIdAndDelete(req.params.id, {
    new: true,
  })
    .then((data) => {
      if (data) {
        res.status(201).json("deleted");
      } else {
        res
          .status(404)
          .json(
            `Component with id: ${req.params.id} not found & does not exist or must already be deleted`
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
  getAllComponents,
  getSingleComponent,
  addComponent,
  editComponent,
  deleteComponent,
};
