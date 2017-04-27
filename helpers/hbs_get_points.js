const pointsModel = require("../services/points_model")


const getPoints = function(childLevel, userLevel) {
	return pointsModel(childLevel - userLevel);
}



module.exports = getPoints;