const mongoose = require("mongoose");
const {User} = require("../models");

let pointsModel = distance => {
  let ponzPoints = [0, 40, 20, 10, 5, 2];
  if (distance > 5) {
    return 1;
  }
  return ponzPoints[distance];
};

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
