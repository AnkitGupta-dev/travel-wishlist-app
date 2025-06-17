require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import Routes
const authRoutes = require('./routes/auth');
const destinationRoutes = require('./routes/destinations');
const tripPlanRoutes = require('./routes/tripPlan');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));


// Routes
app.use('/api/auth', authRoutes); // ✅ Auth routes (register/login)
app.use('/api/destinations', destinationRoutes); // ✅ Destinations CRUD
app.use('/api/tripplans', tripPlanRoutes);

// MongoDB Connection + Start Server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));
