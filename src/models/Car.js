import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {
    // Basic Info
    title: { type: String, required: true }, // "Honda City 2018 VX"
    description: { type: String },
    images: [{ type: String }], // Cloudinary/URL
    videos: [{ type: String }],

    // Vehicle Details
    make: { type: String, required: true }, // e.g., Honda, Toyota
    model: { type: String, required: true }, // e.g., City, Fortuner
    variant: { type: String }, // e.g., VX, VXi
    year: { type: Number, required: true },
    registrationYear: { type: Number }, // sometimes different than mfg year
    fuelType: { type: String, enum: ["Petrol", "Diesel", "CNG", "LPG", "Electric", "Hybrid"] },
    transmission: { type: String, enum: ["Manual", "Automatic", "AMT", "CVT", "DCT"] },
    bodyType: {
      type: String,
      enum: ["Hatchback", "Sedan", "SUV", "MUV", "Coupe", "Convertible", "Pickup", "Van", "Other"],
    },
    color: { type: String },

    // Specs
    engineCC: { type: Number }, // 1197, 1498, etc.
    powerBhp: { type: Number }, // horsepower
    torqueNm: { type: Number },
    seatingCapacity: { type: Number },
    doors: { type: Number, default: 4 },
    mileage: { type: Number }, // kmpl or Wh/km
    fuelTankCapacity: { type: Number }, // liters/kWh

    // Ownership & Condition
    kmDriven: { type: Number, required: true },
    owners: { type: Number, default: 1 }, // 1st, 2nd, 3rd owner
    ownershipType: { type: String, enum: ["Individual", "Company", "Dealer"], default: "Individual" },
    condition: { type: String, enum: ["Excellent", "Good", "Fair", "Poor"], default: "Good" },
    accidentHistory: { type: Boolean, default: false },
    serviceHistory: { type: Boolean, default: false },
    insuranceType: { type: String, enum: ["Comprehensive", "Third-Party", "Zero-Dep", "None"], default: "None" },
    insuranceValidity: { type: Date },

    // Registration / Legal
    registrationNumber: { type: String }, // masked for users
    registrationState: { type: String }, // e.g., "DL", "MH"
    rto: { type: String }, // specific RTO
    pucValidTill: { type: Date }, // Pollution certificate
    loanOnCar: { type: Boolean, default: false },
    hypothecation: { type: String }, // Bank name if loan

    // Location
    city: { type: String, required: true },
    state: { type: String, required: true },
    pinCode: { type: String },
    address: { type: String },

    // Pricing
    price: { type: Number, required: true },
    negotiable: { type: Boolean, default: false },
    expectedPrice: { type: Number }, // seller expected price
    marketValue: { type: Number }, // estimated by platform

    // Status
    status: {
      type: String,
      enum: ["Available", "Sold", "Pending", "Under Verification"],
      default: "Available",
    },
    listingType: { type: String, enum: ["Sell", "Auction"], default: "Sell" },
    featured: { type: Boolean, default: false }, // promoted listing

    // User References
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // once sold
    isDealer: { type: Boolean, default: false },

    // Platform Metadata
    views: { type: Number, default: 0 },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    inquiries: [{ type: mongoose.Schema.Types.ObjectId, ref: "Inquiry" }],

    // Audit
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Car", carSchema);
