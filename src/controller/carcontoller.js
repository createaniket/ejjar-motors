const Car = require("../models/Car");

// Add a new car
exports.addCar = async (req, res) => {
  try {
    const carData = { ...req.body };
    const car = await Car.create(carData);
    res.status(201).json({ success: true, car });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all cars with filters
exports.getCars = async (req, res) => {
  try {
    let filter = {};
    if (req.query.make) filter.make = req.query.make;
    if (req.query.model) filter.model = req.query.model;
    if (req.query.year) filter.year = req.query.year;
    if (req.query.fuelType) filter.fuelType = req.query.fuelType;
    if (req.query.transmission) filter.transmission = req.query.transmission;
    if (req.query.city) filter.city = req.query.city;

    if (req.query.priceMin || req.query.priceMax) {
      filter.price = {};
      if (req.query.priceMin) filter.price.$gte = Number(req.query.priceMin);
      if (req.query.priceMax) filter.price.$lte = Number(req.query.priceMax);
    }

    const cars = await Car.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, cars });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get single car by ID
exports.getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id)
      .populate("seller", "name email phone")
      .populate("buyer", "name email phone");

    if (!car) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }

    res.status(200).json({ success: true, car });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update car (Admin or Car Owner only)
exports.updateCar = async (req, res) => {
  try {
    let car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }

    if (car.seller.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    car = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, car });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete car (Admin or Car Owner only)
exports.deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }

    if (car.seller.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    await car.deleteOne();
    res.status(200).json({ success: true, message: "Car deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Mark car as sold
exports.markAsSold = async (req, res) => {
  try {
    const { buyerId } = req.body;
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }

    if (car.status === "Sold") {
      return res.status(400).json({ success: false, message: "Car is already sold" });
    }

    car.status = "Sold";
    car.buyer = buyerId;
    await car.save();

    res.status(200).json({ success: true, message: "Car marked as sold", car });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
