const mongoose = require("mongoose");
const bluebird = require("bluebird");
const Schema = mongoose.Schema;

var User = mongoose.model("User", UserSchema);

module.exports = User;
