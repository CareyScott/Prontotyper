const res = require("express/lib/response");
const Component = require("../models/component_schema");
const Project = require("../models/project_schema");

const getAllComponents = (req, res) => {
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
const getSingleComponent = (req, res) => {
  Component.findById(req.params.id)
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

const addComponent = (req, res) => {
  let componentData = req.body;
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

const editComponent = (req, res) => {
  let componentData = req.body;
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

const deleteComponent = (req, res) => {
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
