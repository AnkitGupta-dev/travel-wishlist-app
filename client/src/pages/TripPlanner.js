import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";

// Common button style
const buttonStyle = {
  backgroundColor: "#f4c16e",
  color: "#000",
  fontWeight: 500,
  textTransform: "none",
  borderRadius: "6px",
  "&:hover": {
    backgroundColor: "#e5ae4d",
  },
};

const TripPlanner = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const editingPlan = location.state?.planToEdit || null;

  const [formData, setFormData] = useState({
    place: "",
    transportation: "",
    accommodation: "",
    food: "",
    activities: "",
    misc: "",
    itinerary: [{ day: 1, title: "", hour: "", period: "", description: "" }],
  });

  useEffect(() => {
  if (!token) {
    navigate("/login");
  }
}, [token, navigate]);


  useEffect(() => {
    if (editingPlan) {
      setFormData({
        place: editingPlan.place || "",
        transportation: editingPlan.budget.transportation || "",
        accommodation: editingPlan.budget.accommodation || "",
        food: editingPlan.budget.food || "",
        activities: editingPlan.budget.activities || "",
        misc: editingPlan.budget.misc || "",
        itinerary: editingPlan.itinerary || [{ day: 1, title: "", description: "", hour: "", period: "" }],
      });
    }
  }, [editingPlan]);

  const handleChange = (e, idx, field) => {
  if (typeof idx === "number" && field) {
    // It's an itinerary field
    const updatedItinerary = [...formData.itinerary];
    updatedItinerary[idx][field] = field === "day" ? Number(e.target.value) : e.target.value;
    setFormData({ ...formData, itinerary: updatedItinerary });
  } else {
    const { name, value } = e.target;
    // Handle fallback if name is missing (like for place field)
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
};


  const addItineraryField = () => {
  setFormData({
    ...formData,
    itinerary: [
      ...formData.itinerary,
      { day: formData.itinerary.length + 1, title: "", description: "", hour: "", period: "" },
    ],
  });
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      place: formData.place,
      budget: {
        transportation: Number(formData.transportation),
        accommodation: Number(formData.accommodation),
        food: Number(formData.food),
        activities: Number(formData.activities),
        misc: Number(formData.misc),
      },
      itinerary: formData.itinerary.map(item => ({
        day: item.day,
        title: item.title,
        description: item.description,
        hour: item.hour,
        period: item.period
      })),
    };
    
    console.log("Payload to be sent:", payload);
    
    try {
      if (editingPlan) {
        await axios.put(
          `https://travel-wishlist-api.onrender.com/api/tripplans/${editingPlan._id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Trip plan updated successfully!");
      } else {
        await axios.post(
          "https://travel-wishlist-api.onrender.com/api/tripplans",
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Trip plan created successfully!");
      }
      navigate("/tripplans");
    } catch (err) {
      console.error(err);
      alert("Error saving plan");
    }
  };

  return (
    <Box
      sx={{
        p: 3,
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #fff7ec, #fde6bc)",
      }}
    >
      <Box display="flex" justifyContent="center" mt={5}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: 500,
            borderRadius: 3,
            background: "rgba(255, 247, 236, 0.9)",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(3px)",
          }}
        >
          <Box display="flex" justifyContent="center">
            <Typography variant="h4" gutterBottom sx={{ mt: 3 }}>
              <b>{editingPlan ? "Edit Trip Plan" : "Plan Your Trip"}</b>
            </Typography>
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              name="place"
              label="City / Place"
              value={formData.place}
              onChange={handleChange}
              required
            />
            {["transportation", "accommodation", "food", "activities", "misc"].map((field) => (
              <TextField
                key={field}
                name={field}
                label={`Budget for ${field}`}
                value={formData[field]}
                onChange={handleChange}
                type="number"
                required
              />
            ))}
            <Box display="flex" justifyContent="center">
            <Typography variant="h5"><b>Itinerary</b></Typography>
            </Box>
            {formData.itinerary.map((item, idx) => (
              <Box key={idx} sx={{ 
                display: "flex",
                flexDirection: "column", 
                gap: 1,
                border: "1px solid #ddd",
                borderRadius: 2,
                p: 2,
                mb: 2,
                background: "rgba(255, 247, 230, 0.9)",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                backdropFilter: "blur(3px)",
              }}>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <TextField
                  label="Day"
                  type="number"
                  value={item.day}
                  onChange={(e) => handleChange(e, idx, "day")}
                  required
                  sx={{ width: "80px" }}
                />
                <TextField
                  label="Title"
                  value={item.title}
                  onChange={(e) => handleChange(e, idx, "title")}
                  required
                  sx={{ flex: 1 }}
                />
                <TextField
                  select
                  label="Hour"
                  value={String(item.hour || "")}
                  onChange={(e) => handleChange(e, idx, "hour")}
                  required
                  sx={{ width: "100px" }}
                  >
                    {[...Array(12)].map((_, i) => (
                      <MenuItem key={i + 1} value={i + 1}>
                        {i + 1}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    select
                    label="AM/PM"
                    value={item.period || ""}
                    onChange={(e) => handleChange(e, idx, "period")}
                    required
                    sx={{ width: "100px" }}
                  >
                    <MenuItem value="AM">AM</MenuItem>
                    <MenuItem value="PM">PM</MenuItem>
                  </TextField>
                </Box>

                <TextField
                  label="Description"
                  value={item.description}
                  onChange={(e) => handleChange(e, idx, "description")}
                  required
                  fullWidth
                  multiline
                  rows={2}
                />

              </Box>
            ))}

            <Button onClick={addItineraryField} variant="outlined" sx={buttonStyle}>
              Add Another Day
            </Button>

            <Button type="submit" variant="contained" sx={{ ...buttonStyle, mt: 2 }}>
              {editingPlan ? "Update Plan" : "Submit Plan"}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default TripPlanner;
