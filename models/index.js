const mongoose = require("mongoose");
const bluebird = require("bluebird");

mongoose.Promise = bluebird;

const models = {};
models.User = require("./User");

module.exports = models;
