const res = require("express/lib/response");
const User = require("../models/user_schema");
const getAllUsers = (req, res) => {
  User.find()
    .then((data) => {
      if (data) {
        res.status(200).json(data);
      } else {
        res.status(404).json("No users not found");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json(err);
    });
};
const getSingleUser = (req, res) => {
  User.findById(req.params.id)
    .then((data) => {
      if (data) {
        res.status(200).json(data);
      } else {
        res.status(404).json(`User with id: ${req.params.id} not found`);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json(err);
    });
};
module.exports = {
  getAllUsers,
  getSingleUser,
};
