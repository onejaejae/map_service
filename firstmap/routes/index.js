const express = require("express");
const dotenv = require("dotenv");
const router = express.Router();
const locationModel = require("../models/location");

dotenv.config();

/* GET home page. */
router.get("/", (req, res, next) => {
  res.render("index", { title: "Express" });
});

router.get("/upload", (req, res, next) => {
  res.render("upload");
});

router.get("/location", async (req, res, next) => {
  try {
    const result = await locationModel.find({}, { _id: 0, __v: 0 });

    res.status(200).json({ message: "success", data: result });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/location", async (req, res, next) => {
  // const { title, address, lat, lng } = req.body;
  try {
    let location = new locationModel(req.body);
    await location.save();

    res.status(200).json({
      message: "success",
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
