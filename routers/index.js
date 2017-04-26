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

router.post("/register/:id", (req, res, next) => {
  referrerId = req.params.id;
  const {username, password} = req.body;
  const children = [];
  const user = new User({username, password, children});
  user.save((err, user) => {
    console.log(err);
    console.log("saved new user", user);
    User.findByIdAndUpdate(referrerId, {
      $push: {"children": user._id}
    }).then(updatedUser => {
      console.log("updated parent user", updatedUser);
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
