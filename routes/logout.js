const express = require("express");
const router = express.Router();

router.post("/", function (req, res, next) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect("/login");
    });
    const memes = req.app.locals.memes;
    memes.forEach(meme => meme.visited = false);
});

module.exports = router;