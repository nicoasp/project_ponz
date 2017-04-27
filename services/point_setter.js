const mongoose = require("mongoose");
const {User} = require("../models");
const pointsModel = require("./points_model");


let updateAncestorPoints = (parentId, createdUserLevel) => {
  return User.findById(parentId)
    .then(parent => {
      parent.points += pointsModel(createdUserLevel - parent.level);
      return parent.save();
    })
    .then(result => {
      if (result.parentId) {
        return updateAncestorPoints(result.parentId, createdUserLevel);
      }
    });
};

module.exports = updateAncestorPoints;
