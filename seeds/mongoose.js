const mongoose = require("mongoose");
const User = require("../models/User");
mongoose.connect("mongodb://localhost/ponzio");

User.remove({}, function(err) {
  console.log("collection removed");
});

User.create(
  {
    username: "owner",
    password: "owner",
    children: [],
    level: 1,
    parentId: null,
    points: 0
  },
  function(err) {
    console.log("owner user created");
  }
);
