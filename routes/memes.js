const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("memes", {
        memes: req.app.locals.memes,
        user: req.user ? req.user.username : null,
    });
});

module.exports = router;





