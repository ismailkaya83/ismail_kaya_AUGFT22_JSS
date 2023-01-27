var express = require("express");
var router = express.Router();

router.post("/", function (req, res, next) {
    try {
        const {id} = req.body;
        const meme = memes.find((meme) => meme.id === id);
        console.log("MEME", meme);
        res.render("meme", {meme});
        res.status(200).json({message: "success"});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "server error"});
    }
});

module.exports = router;
