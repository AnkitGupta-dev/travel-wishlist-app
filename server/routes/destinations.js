const express = require("express");
const router = express.Router();
const Destination = require("../models/Destination");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const verifyToken = require("../middleware/verifyToken");

// -------- Multer Setup --------
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "travel-destinations", // you can name this whatever you want
    allowed_formats: ["jpg", "jpeg", "png"],
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
const { cloudinary } = require("../utils/cloudinary"); // add this at top if not already
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage }); // using memoryStorage now

router.post("/", verifyToken, upload.array("images", 10), async (req, res) => {
  try {
    const { name, notes, journal, visited, location, countryCode } = req.body;

    if (!name || !location || !countryCode) {
      return res.status(400).json({ message: "Name, location, and country are required" });
    }

    // 🌩 Upload to Cloudinary
    let uploadedImages = [];
    for (const file of req.files) {
      const b64 = Buffer.from(file.buffer).toString("base64");
      const dataURI = `data:${file.mimetype};base64,${b64}`;
      const uploadRes = await cloudinary.uploader.upload(dataURI, {
        folder: "travel-wishlist",
      });
      uploadedImages.push(uploadRes.secure_url); // get Cloudinary image URL
    }

    const destination = new Destination({
      name,
      notes,
      journal,
      visited: visited === "true",
      location: JSON.parse(location),
      countryCode,
      images: uploadedImages,
      userId: req.userId,
    });

    await destination.save();
    res.status(201).json(destination);
  } catch (err) {
    console.error("Cloudinary POST error:", err);
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

module.exports = router;
