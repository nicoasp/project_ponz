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
  User.findById(req.user._id)
    .populate({
      path: 'children',
      populate: {
        path: 'children',
        populate: {
          path: 'children'
        }
      }
    })
    .then(user => {
      res.render("home", { user });
    })      
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


const updateAncestorPoints = require("../services/point_setter");

router.post("/register/:id", (req, res, next) => {
  const {username, password} = req.body;
  const children = [];
  const parentId = req.params.id;
  const points = 0;
  const level = 1;
  const user = new User({
    username,
    password,
    children,
    parentId,
    points,
    level
  });
  user.save((err, createdUser) => {
    User.findByIdAndUpdate(parentId, {
      $push: {children: createdUser._id}
    })
      .then(parentUser => {
        let newUserLevel = parentUser.level + 1;
        createdUser.level = newUserLevel;
        return createdUser.save();
      })
      .then(updatedUser => {
        updateAncestorPoints(
          updatedUser.parentId,
          updatedUser.level
        ).then(() => {
          req.login(updatedUser, function(err) {
            if (err) {
              return next(err);
            }
            return res.redirect("/");
          });
        });
      });
  });
});

router.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

module.exports = router;
