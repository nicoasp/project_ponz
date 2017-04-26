const express = require("express");
const router = express.Router();
const {User} = require("../models");

////
//Passport & Strategies
////
const passport = require("passport");

////
//Login Routes
////
router.get("/", (req, res) => {
  if (req.user) {
    res.render("home", {user: req.user});
  } else {
    res.redirect("/login");
  }
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/register/:id", (req, res) => {
  referralId = req.params.id;
  res.render("register", {referralId});
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
  })
);

let pointsModel = distance => {
  console.log("Distance: ", distance);
  let ponzPoints = [0, 40, 20, 10, 5, 2];
  if (distance > 5) {
    console.log("Inside points function, returning: ", 1)
    return 1;
  } else {
    console.log("Inside points function, returning: ", ponzPoints[distance])
    return ponzPoints[distance];
  }
};

let updateAncestorPoints = (parentId, createdUserLevel) => {
  return new Promise(function(resolve, reject) {
    let points;
    User.findById(parentId)
      .then(parent => {
        points = pointsModel(createdUserLevel - parent.level);
        parent.points += parseInt(points);
        return parent.save();
      })
      .then(result => {
        if (!result.parentId === null) {
          updateAncestorPoints(result.parentId, createdUserLevel);
        } else {
          resolve();
        }
      })
      // .catch(err => {
      //   // console.log(err);
      // });
  });
};

router.post("/register/:id", (req, res, next) => {
  const {username, password} = req.body;
  const children = [];
  const parentId = req.params.id;;
  const points = 0;
  const level = 1;
  const user = new User({username, password, children, parentId, points, level});
  user.save((err, user) => {
    console.log("User after first being created: ", user);
    User.findByIdAndUpdate(parentId, {
      $push: {"children": user._id}
    })
      .then(parentUser => {
        let newUserLevel = parentUser.level + 1;
        user.level = newUserLevel;
        return user.save();
        // return User.findByIdAndUpdate(user._id, {$set: {"level": newUserLevel}});
      })
      .then(updatedUser => {
        console.log("User created and updated: ", updatedUser)
        return updateAncestorPoints(updatedUser.parentId, updatedUser.level);
      })
      .then(() => {
        req.login(user, function(err) {
          if (err) {
            return next(err);
          }
          return res.redirect("/");
        });
      });
  });
});

router.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

module.exports = router;
