const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const users = require("../data/users.json");
const router = express.Router();

passport.use(
    new LocalStrategy({ usernameField: "username" }, async (username, password, cb) => {
        const user = users[`${username}`];
        if (!user) {
            return cb(null, false, { message: "No user with that username" });
        }

        if (password !== user.password) {
            return cb(null, false, { message: "Password is not correct" });
        }

        return cb(null, user, { message: "Logged In Successfully" });
    })
);

passport.serializeUser((user, cb) => cb(null, user.username));
passport.deserializeUser((username, cb) => cb(null, users[`${username}`]));

router.get("/", (req, res) => res.render("login"));

router.post("/", passport.authenticate("local", {
    successRedirect: "/memes",
    failureRedirect: "/login",
    failureFlash: true
}));

module.exports = router;
