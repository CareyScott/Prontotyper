const res = require("express/lib/response");
const Project = require("../models/project_schema");
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
    .then((data) => {
      if (data) {
        res.status(200).json(data);
      } else {
        res.status(404).json("Project with id: ${req.params.id)} not found");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json(err);
    });
};

module.exports = {
  getAllProjects,
  getSingleProject,
};
