const express = require("express");
const dotenv = require("dotenv");
const router = express.Router();

dotenv.config();

/* GET home page. */
router.get("/", (req, res, next) => {
  res.render("index", { title: "Express" });
});

router.get("/upload", (req, res, next) => {
  res.render("upload");
});

module.exports = router;
