const res = require("express/lib/response");
const Project = require("../models/project_schema");
const User = require("../models/user_schema");

// getitng all projects
const getAllProjects = (req, res) => {
  // mongoose model query
  Project.find()
    .then((data) => {
      if (data) {
        // return response
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

// getitng single project by ID
const getSingleProject = (req, res) => {
  // mongoose model query
  Project.findById(req.params.id)
    // populating project with all it's referenced components from mongoose schema
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

// gadding a project
const addProject = (req, res) => {
  let projectData = req.body;
  // mongoose model query
  Project.create(projectData)
    .then((data) => {
      if (data) {
        // updating the users project object ID array
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

// updating project
const editProject = (req, res) => {
  let projectData = req.body;
  // mongoose model query
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

// deleting project
const deleteProject = (req, res) => {
  let projectData = req.body;
  // mongoose model query
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
