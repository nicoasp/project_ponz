let pointsModel = distance => {
  let ponzPoints = [0, 40, 20, 10, 5, 2];
  if (distance > 5) {
    return 1;
  }
  return ponzPoints[distance];
};

module.exports = pointsModel;