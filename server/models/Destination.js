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
  
  budget: {
    transportation: { type: Number, default: 0 },
    accommodation: { type: Number, default: 0 },
    food: { type: Number, default: 0 },
    activities: { type: Number, default: 0 },
    others: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
  },
  itinerary: [
    {
      day: Number,
      title: String,
      description: String,
    }
  ],

}, { timestamps: true });

module.exports = mongoose.model("Destination", DestinationSchema);
