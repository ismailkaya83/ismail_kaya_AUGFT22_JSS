var express = require("express");
var router = express.Router();
// const { resolve } = require('path');
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

global.memes = [];
router.get("/", function (req, res, next) {
    axios
        .get(process.env.API_URL)
        .then((response) => {
            global.memes = response.data.data.memes;
        })
        .catch((error) => {
            console.log(error);
        });
    res.render("memes", {memes});
});

module.exports = router;




