import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// --- MongoDB Atlas connection with db name ---
mongoose.connect(
  "mongodb+srv://shewregdehana:Hana123@cluster0.zcfax7t.mongodb.net/cropdb2"
);

// ✅ Corrected Schema to match the provided JSON data
const cropSchema = new mongoose.Schema({
  name: { en: String, am: String },
  scientific: String,
  category: { en: String, am: String },
  image: String,
  success_rate: Number,
  price: {
    en: {
      "Market Price": String,
      "Price Trend": String,
      "Market Demand": String,
      "Export Potential": String
    },
    am: {
      "Market Price": String,
      "Price Trend": String,
      "Market Demand": String,
      "Export Potential": String
    }
  },
  varieties: [
    {
      name: { en: String, am: String },
      characteristics: {
        growing_time_days: Number,
        preferred_use: { en: String, am: String },
        disease_resistance: { en: String, am: String },   // ✅ object
        fertilizer_requirements: { en: String, am: String } // ✅ object
      }
    }
  ],
  overview: {
    plantingTime: { en: String, am: String },
    growingPeriod: { en: String, am: String },
    climateRequirements: { en: String, am: String },
    soilType: { en: String, am: String }
  },
  cultivation: {
    landPrep: { en: String, am: String },
    plantingMethod: { en: String, am: String },
    spacing: { en: String, am: String },
    waterRequirements: { en: String, am: String }
  },
  fertilizers: [
    {
      type: { en: String, am: String },
      application: { en: String, am: String },
      benefits: { en: String, am: String }
    }
  ],
  diseases: [
    {
      name: { en: String, am: String },
      symptoms: { en: String, am: String },
      control: { en: String, am: String }
    }
  ],
  pests: [
    {
      name: { en: String, am: String },
      symptoms: { en: String, am: String },
      control: { en: String, am: String }
    }
  ],
  harvesting: {
    harvestTime: { en: String, am: String },
    harvestMethod: { en: String, am: String },
    yieldPotential: { en: String, am: String },
    postHarvest: { en: String, am: String }
  },
  recommendation: { en: String, am: String },
  date_added: { type: Date, default: Date.now }
});


const Crop = mongoose.model("Crop", cropSchema, "crops");

// --- API ROUTES (Reordered for correct functionality) ---

// ✅ Route: search crops (place before specific ID route)
app.get("/api/crops/search/:query", async (req, res) => {
  try {
    const query = req.params.query;
    const crops = await Crop.find({
      $or: [
        { "name.en": { $regex: query, $options: "i" } },
        { "name.am": { $regex: query, $options: "i" } },
        { scientific: { $regex: query, $options: "i" } },
        { "category.en": { $regex: query, $options: "i" } },
        { "category.am": { $regex: query, $options: "i" } }
      ]
    });
    res.json(crops);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Route: get single crop by ID
app.get("/api/crops/:id", async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) {
      return res.status(404).json({ error: "Crop not found" });
    }
    res.json(crop);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Route: get all crops
app.get("/api/crops", async (req, res) => {
  try {
    const crops = await Crop.find();
    res.json(crops);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Route: add new crop
app.post("/api/crops", async (req, res) => {
  try {
    const newCrop = new Crop(req.body);
    const savedCrop = await newCrop.save();
    res.status(201).json(savedCrop);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Route: update crop
app.put("/api/crops/:id", async (req, res) => {
  try {
    const updatedCrop = await Crop.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedCrop) {
      return res.status(404).json({ error: "Crop not found" });
    }
    res.json(updatedCrop);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Route: delete crop
app.delete("/api/crops/:id", async (req, res) => {
  try {
    const deletedCrop = await Crop.findByIdAndDelete(req.params.id);
    if (!deletedCrop) {
      return res.status(404).json({ error: "Crop not found" });
    }
    res.json({ message: "Crop deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Start server ---
app.listen(5000, () =>
  console.log("✅ Server running on http://localhost:5000")
);