const mongoose = require("mongoose");
const { User } = require("../models");

let _pointsModel = distance => {
  let ponzPoints = [0, 40, 20, 10, 5, 2];
  if (distance > 5) {
    return 1;
  } else {
    return ponzPoints[distance];
  }
};

let updateAncestorPoints = (parentId, createdUserLevel) => {
  let points;
  return User.findById(parentId)
    .then(parent => {
      points = _pointsModel(createdUserLevel - parent.level);
      parent.points += parseInt(points);
      return parent.save();
    })
    .then(result => {
      if (result.parentId) {
        return updateAncestorPoints(result.parentId, createdUserLevel);
      }
    });
};


module.exports = updateAncestorPoints;