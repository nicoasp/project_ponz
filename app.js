const app = require("express")();

////
//Session
////
const expressSession = require("express-session");
app.use(
  expressSession({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
  })
);

////
//Body Parser
////
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}));

////
//Flash Msgs
////
const flash = require("flash");
app.use(flash());

////
//Mongoose
////
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/passport-app");
// const models = require("./models");
// const User = models.User;

////
//Passport
////
const passport = require("passport");
app.use(passport.initialize());
app.use(passport.session());

// ////
// //Passport Sessions
// ////
// passport.serializeUser(function(user, done) {
//   done(null, user.id);
// });
//
// passport.deserializeUser(function(id, done) {
//   User.findById(id, function(err, user) {
//     done(err, user);
//   });
// });

////
//Handlebars
////
const hbs = require("express-handlebars");
app.engine(
  "hbs",
  hbs({
    defaultLayout: "application",
    partialsDir: "views/partials",
    extname: ".hbs"
  })
);
app.set("view engine", "hbs");

////
//Routers
////
const indexRouter = require("./routers/index");
app.use("/", indexRouter);

////
//Server Listen
////
const hostname = process.env.HOST || "localhost";
const port = process.env.PORT || 3000;
app.listen(port, hostname);
