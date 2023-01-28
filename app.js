require("dotenv").config({ path: "./.env" });
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var logger = require("morgan");
const session = require("express-session");
var JsonStore = require("express-session-json")(session);
const passport = require("passport");
const flash = require("express-flash");
const connectEnsureLogin = require("connect-ensure-login");
const users = require("./data/users.json");

// ROUTES
var indexRouter = require("./routes/index");
var memesRouter = require("./routes/memes");
var memeRouter = require("./routes/meme");
var loginRouter = require("./routes/login");

// Custom object
const MemeObject = require("./public/js/memeClass");

// Third Party
const axios = require("axios");

var app = express();
app.use(flash());
// Configure Sessions Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  store: new JsonStore(),
}));

const initializePassport = require("./public/js/auth");
initializePassport(passport, (username) => users[`${username}`]);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(__dirname + "/node_modules/bootstrap/dist"));
app.use(express.static(__dirname + "/node_modules/jquery/dist/"));

app.use(passport.initialize());
app.use(passport.session());

// Fetch memes from API and store in res.locals.memes
app.use(async function (req, res, next) {
  if (!req.app.locals.memes) {
    const memes = [];
    const response = await axios.get(process.env.MEMES_API);
    const data = response.data;
    if (data && data.success) {
      data.data.memes.forEach((meme) => {
        let memeObject = new MemeObject(
            meme.id,
            meme.name,
            meme.url,
            meme.width,
            meme.height,
            meme.box_count,
            false
        );
        memes.push(memeObject);
      });
      console.log("MEMES FETCHED ");
      app.locals.memes = memes;
    }
  }
  next();
});

// Routes
app.use("/", indexRouter);
app.use("/meme", connectEnsureLogin.ensureLoggedIn(), memeRouter);
app.use("/memes", memesRouter);
app.use("/login", loginRouter);
app.use("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
