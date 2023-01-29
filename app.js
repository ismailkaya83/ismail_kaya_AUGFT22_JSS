require("dotenv").config({ path: "./.env" });
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const logger = require("morgan");
const session = require("express-session");
const JsonStore = require("express-session-json")(session);
const passport = require("passport");
const flash = require("express-flash");
const connectEnsureLogin = require("connect-ensure-login");

// ROUTES
const indexRouter = require("./routes/index");
const memesRouter = require("./routes/memes");
const memeRouter = require("./routes/meme");
const loginRouter = require("./routes/login");
const logoutRouter = require("./routes/logout");

const MemeObject = require("./public/js/memeClass");

const axios = require("axios");

const app = express();
app.use(flash());
// Configure Sessions Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  store: new JsonStore(),
}));

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


app.use(async function (req, res, next) {
  if (!req.app.locals.memes) {
    const memes = [];
    const response = await axios.get(process.env.API_URL);
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
      app.locals.memes = memes;
    }
  }
  next();
});


app.use("/", indexRouter);
app.use("/meme", connectEnsureLogin.ensureLoggedIn(), memeRouter);
app.use("/memes", memesRouter);
app.use("/login", loginRouter);
app.use("/logout", logoutRouter);

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
