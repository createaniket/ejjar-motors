const express = require("express");
const {
  addCar,
  getCars,
  getCarById,
  updateCar,
  deleteCar,
  markAsSold,
} = require("../controller/carcontoller.js");

const AdAuth = require("../middlewares/AdAuth.js")

const router = express.Router();

// Public Routes
router.get("/", getCars); // fetch all cars with filters
router.get("/:id", getCarById); // fetch car by ID

// Protected Routes (logged-in users)
router.post("/", AdAuth, addCar); // add a car (Admin/User)
router.put("/:id", AdAuth, updateCar); // update car (owner/admin)
router.delete("/:id", AdAuth, deleteCar); // delete car (owner/admin)
router.put("/:id/sold", AdAuth, markAsSold); // mark car as sold

module.exports = router;