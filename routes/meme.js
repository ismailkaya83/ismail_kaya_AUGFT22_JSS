const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
    const { id } = req.body;
    const meme = req.app.locals.memes.find(meme => meme.id === id);
    meme.visited = true;
    res.render("meme", {
        meme,
        user: req.user.username,
        isAuthenticated: true
    });
});

module.exports = router;

