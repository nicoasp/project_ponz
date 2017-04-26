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
  let ponzPoints = [0, 40, 20, 10, 5, 2];
  if (distance > 5) {
    return 1;
  } else {
    return ponzPoints[distance];
  }
};

let updateAncestorPoints = (parentId, createdUserLevel) => {
  return new Promise(function(resolve, reject) {
    let points;
    User.findById(parentId)
      .then(parent => {
        points = pointsModel(createdUserLevel - parent.level);
        console.log("points log", points);
        parent.points += parseInt(points);
        return parent.save();
      })
      .then(result => {
        console.log(err);
        if (!result.parentId === null) {
          updateAncestorPoints(result.parentId, createdUserLevel);
        } else {
          resolve();
        }
      })
      .catch(err => {
        console.log(err);
      });
  });
};

router.post("/register/:id", (req, res, next) => {
  referrerId = req.params.id;
  const {username, password} = req.body;
  const children = [];
  const parentId = referrerId;
  const user = new User({username, password, children, parentId});
  user.save((err, user) => {
    console.log(err);
    console.log("saved new user", user);
    User.findByIdAndUpdate(referrerId, {
      $push: {children: user._id}
    })
      .then(updatedUser => {
        return User.findByIdAndUpdate(user._id, {level: updatedUser.level + 1});
      })
      .then(updatedUser => {
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
