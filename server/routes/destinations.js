const express = require("express");
const router = express.Router();
const Destination = require("../models/Destination");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const verifyToken = require("../middleware/verifyToken");

// -------- Multer Setup --------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// -------- GET all destinations --------
router.get("/", verifyToken, async (req, res) => {
  try {
    const destinations = await Destination.find({ userId: req.userId });
    res.json(destinations);
  } catch (err) {
    console.error("GET error:", err);
    res.status(500).json({ message: "Error fetching destinations" });
  }
});

// -------- GET single destination by ID --------
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination || destination.userId.toString() !== req.userId) {
      return res.status(404).json({ message: "Destination not found" });
    }
    res.json(destination);
  } catch (err) {
    console.error("GET by ID error:", err);
    res.status(500).json({ message: "Error fetching destination" });
  }
});

// -------- POST new destination --------
router.post("/", verifyToken, upload.array("images", 10), async (req, res) => {
  try {
    const { name, notes, journal, visited, location } = req.body;

    // Basic validation
    if (!name || !location) {
      return res.status(400).json({ message: "Name and location are required" });
    }

    const images = req.files.map((file) => file.path.replace(/\\/g, "/"));

    const destination = new Destination({
      name,
      notes,
      journal,
      visited: visited === "true",
      location: JSON.parse(location),
      images,
      userId: req.userId,
    });

    await destination.save();
    res.status(201).json(destination);
  } catch (err) {
    console.error("POST error (create):", err);
    res.status(500).json({ message: "Error creating destination" });
  }
});

// -------- PUT (update) destination --------
router.put("/:id", verifyToken, upload.array("newImages", 10), async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) return res.status(404).json({ message: "Not found" });

    if (destination.userId.toString() !== req.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { name, notes, journal, visited, location } = req.body;

    if (name) destination.name = name;
    if (notes) destination.notes = notes;
    if (journal) destination.journal = journal;
    if (visited !== undefined) destination.visited = visited === "true";
    if (location) destination.location = JSON.parse(location);

    if (req.body.imagesToDelete) {
      const imagesToDelete = JSON.parse(req.body.imagesToDelete);
      destination.images = destination.images.filter((img) => {
        if (imagesToDelete.includes(img)) {
          const imgPath = path.join(__dirname, "..", img);
          if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
          return false;
        }
        return true;
      });
    }

    if (req.files && req.files.length > 0) {
      const newImagePaths = req.files.map((file) => file.path.replace(/\\/g, "/"));
      destination.images.push(...newImagePaths);
    }

    await destination.save();
    res.json(destination);
  } catch (err) {
    console.error("PUT error (update):", err);
    res.status(500).json({ message: "Server error during update" });
  }
});

// -------- DELETE destination --------
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) return res.status(404).json({ message: "Not found" });

    if (destination.userId.toString() !== req.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    for (const img of destination.images) {
      const imgPath = path.join(__dirname, "..", img);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    await destination.deleteOne();
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("DELETE error:", err);
    res.status(500).json({ message: "Server error during delete" });
  }
});

// -------- PUT (update budget + itinerary) --------
router.put("/:id/plan", verifyToken, async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) return res.status(404).json({ message: "Destination not found" });

    if (destination.userId.toString() !== req.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { budget, itinerary } = req.body;

    if (budget) destination.budget = budget;
    if (itinerary) destination.itinerary = itinerary;

    await destination.save();
    res.json({ message: "Plan updated successfully", destination });
  } catch (err) {
    console.error("PUT error (plan update):", err);
    res.status(500).json({ message: "Error updating trip plan" });
  }
});

// -------- POST Trip Plan (Budget + Itinerary) --------
router.post("/:id/plan", verifyToken, async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) return res.status(404).json({ message: "Destination not found" });

    if (destination.userId.toString() !== req.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { budget, itinerary } = req.body;
    if (budget) {
      destination.budget = {
        ...budget,
        total:
          (budget.transportation || 0) +
          (budget.accommodation || 0) +
          (budget.food || 0) +
          (budget.activities || 0) +
          (budget.others || 0),
      };
    }
    if (itinerary) destination.itinerary = itinerary;

    await destination.save();
    res.status(200).json({ message: "Trip plan added successfully", destination });
  } catch (err) {
    console.error("POST /:id/plan error:", err);
    res.status(500).json({ message: "Server error while adding plan" });
  }
});

// -------- GET Budget & Itinerary for a Destination --------
router.get("/:id/plan", verifyToken, async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);

    if (!destination || destination.userId.toString() !== req.userId) {
      return res.status(404).json({ message: "Destination not found" });
    }

    res.json({
      budget: destination.budget || {},
      itinerary: destination.itinerary || [],
    });
  } catch (err) {
    console.error("GET /:id/plan error:", err);
    res.status(500).json({ message: "Server error while fetching trip plan" });
  }
});


module.exports = router;
