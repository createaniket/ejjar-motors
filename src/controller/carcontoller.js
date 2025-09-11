

const Car = require("../models/Car");

// Add a new car (Admin or User - based on role)
export const addCar = async (req, res) => {
  try {
    const carData = { ...req.body, seller: req.user._id }; // req.user set from auth middleware
    const car = await Car.create(carData);

    res.status(201).json({ success: true, car });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all cars with filters (for listing page)
export const getCars = async (req, res) => {
  try {
    let filter = {};

    // Filters via query params
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
export const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id)
      .populate("seller", "name email phone") // show seller details
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
export const updateCar = async (req, res) => {
  try {
    let car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }

    // Check if user is seller or admin
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
export const deleteCar = async (req, res) => {
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

// Mark car as sold (when a buyer purchases it)
export const markAsSold = async (req, res) => {
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
