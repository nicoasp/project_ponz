const express = require("express");
const router = express.Router();
////
//Passport & Strategies
////
const passport = require("passport");

////
//Login Routes
////
router.get("/", (req, res) => {
  // console.log(req.user);
  // if (req.user) {
  res.render("home");
  // } else {
  //   res.redirect("/login");
  // }
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/logout", (req, res) => {
  res.redirect("/login");
});

module.exports = router;
