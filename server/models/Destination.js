const mongoose = require("mongoose");

const DestinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  notes: String,
  location: {
    lat: Number,
    lng: Number,
  },
  visited: {
    type: Boolean,
    default: false,
  },
  userId: { // ✅ changed from 'user' to 'userId'
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  journal: {
    type: String,
  },
  images: [String],
  reminderDate: Date,
}, { timestamps: true });

module.exports = mongoose.model("Destination", DestinationSchema);
