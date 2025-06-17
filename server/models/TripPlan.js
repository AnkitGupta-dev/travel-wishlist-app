const mongoose = require("mongoose");

const tripPlanSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    destinationId: { type: mongoose.Schema.Types.ObjectId, ref: "Destination", default: null },

    place: {
      type: String,
      required: true, // optional if you want to allow empty
    },

    budget: {
      transportation: Number,
      accommodation: Number,
      food: Number,
      activities: Number,
      misc: Number,
    },

    itinerary: [
      {
        day: Number,
        title: String,
        description: String,
        hour: String,
        period: String,
      }
    ],

  },
  { timestamps: true }
);

module.exports = mongoose.model("TripPlan", tripPlanSchema);
