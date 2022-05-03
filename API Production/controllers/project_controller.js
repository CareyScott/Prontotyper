const res = require("express/lib/response");
const Project = require("../models/project_schema");
const User = require("../models/user_schema");

const getAllProjects = (req, res) => {
  Project.find()
    .then((data) => {
      if (data) {
        res.status(200).json(data);
      } else {
        res.status(404).json("No projects not found");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json(err);
    });
};
const getSingleProject = (req, res) => {
  Project.findById(req.params.id)
    .populate("components")
    .then((data) => {
      if (data) {
        res.status(200).json(data);
      } else {
        res.status(404).json(`Project with id: ${req.params.id} not found`);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json(err);
    });
  };

const addProject = (req, res) => {
  let projectData = req.body;
  Project.create(projectData)
    .then((data) => {
      if (data) {
        User.findByIdAndUpdate(
          {
            _id: data.user_id,
          },
          {
            $push: { projects: data._id },
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

const editProject = (req, res) => {
  let projectData = req.body;
  Project.findByIdAndUpdate(req.params.id, projectData, {
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

const deleteProject = (req, res) => {
  let projectData = req.body;
  Project.findByIdAndDelete(req.params.id, {
    new: true,
  })
    .then((data) => {
      if (data) {
        res.status(201).json("project deleted");
      } else {
        res
          .status(404)
          .json(
            `Project with id: ${req.params.id} not found & does not exist or must already be deleted`
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
  getAllProjects,
  getSingleProject,
  addProject,
  editProject,
  deleteProject,
};
