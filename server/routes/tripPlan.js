const express = require("express");
const router = express.Router();
const TripPlan = require("../models/TripPlan");
const verifyToken = require("../middleware/verifyToken");
const Destination = require("../models/Destination");

// ✅ Create a New Trip Plan
router.post("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id; // ✅ _id must be here
    console.log("Received userId:", userId); // Log to confirm

    const newPlan = new TripPlan({
      userId,
      ...req.body,
    });

    await newPlan.save();
    res.status(201).json(newPlan);
  } catch (err) {
    console.error("Trip Plan creation error:", err);
    res.status(400).json({ message: "Error creating trip plan", error: err.message });
  }
});


// ✅ Get All Trip Plans of Logged-In User
router.get("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id; // Ensure this is the correct way to get user ID
    const plans = await TripPlan.find({ userId });
    res.status(200).json(plans);
  } catch (err) {
    console.error("Fetching trip plans error:", err);
    res.status(500).json({ message: "Failed to fetch trip plans" });
  }
});

// (Optional) ✅ Delete a Trip Plan
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deleted = await TripPlan.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Trip not found" });
    res.json({ message: "Trip deleted successfully" });
  } catch (err) {
    console.error("Delete trip error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// PUT /api/tripplans/:id
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const plan = await TripPlan.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json({ message: "Trip plan updated", plan });
  } catch (err) {
    res.status(500).json({ error: "Failed to update trip plan" });
  }
});

// Get a specific trip plan
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const plan = await TripPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: "Trip not found" });
    res.json(plan);
  } catch (err) {
    console.error("Error fetching trip:", err);
    res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;
