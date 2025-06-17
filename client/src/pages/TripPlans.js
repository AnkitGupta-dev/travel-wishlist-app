import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import {
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Divider,
  Box,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";

// Common button style
const buttonStyle = {
  backgroundColor: "#f4c16e", // warm soft orange
  color: "#000",
  fontWeight: 500,
  textTransform: "none",
  borderRadius: "6px",
  "&:hover": {
    backgroundColor: "#e5ae4d",
  },
};

const TripPlans = () => {
  const navigate = useNavigate();

// Handle Edit Plan
const handleEdit = (plan) => {
  navigate("/tripplanner", { state: { planToEdit: plan } });
};

// Handle Delete Plan
const handleDelete = async (id) => {
  const confirm = window.confirm("Are you sure you want to delete this trip plan?");
  if (!confirm) return;

  try {
    await axios.delete(`https://travel-wishlist-api.onrender.com/api/tripplans/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setPlans((prev) => prev.filter((plan) => plan._id !== id));
  } catch (err) {
    console.error(err);
    alert("Failed to delete trip plan");
  }
};

  const { token } = useAuth();
  const [plans, setPlans] = useState([]);

  useEffect(() => {
  if (!token) {
    navigate("/login");
  }
}, [token, navigate]);


  useEffect(() => {
  const fetchPlans = async () => {
    try {
      const res = await axios.get("https://travel-wishlist-api.onrender.com/api/tripplans", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPlans(res.data);
    } catch (err) {
      if (token) {
        console.error(err);
        alert("Failed to fetch trip plans");
      }
    }
  };

  if (token) {
    fetchPlans();
  }
}, [token]);


  return (
    <Box sx={{ 
      p: 3, 
      minHeight: "100vh", 
      background: "linear-gradient(to bottom, #fff7ec, #fde6bc)" 
      }}>
    <Container maxWidth="lg">
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          mb: 3,
          alignItems: "center",
          justifyContent: "center"
        }}
      >  
      <Typography variant="h4" gutterBottom sx={{ mt: 3 }}>
        <b>Your Trip Plans</b>
      </Typography>
      </Box>

      {plans.length === 0 ? (
        <Typography variant="body1" sx={{ mt: 2 }}>
          No plans found.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {plans.map((plan, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card 
  elevation={3}
  sx={{ 
    backgroundColor: "#fff0d9",  // Light creamy tone
    borderRadius: "12px",
    border: "1px solid #f4c16e",
    boxShadow: "0 4px 8px rgba(244, 193, 110, 0.3)",
    transition: "transform 0.2s ease",
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 6px 12px rgba(244, 193, 110, 0.4)",
    },
  }}
>
  <CardContent>
    <Typography variant="h6" gutterBottom sx={{ color: "#d17c00" }}>
      Plan #{index + 1}
    </Typography>

     <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#8a5c00" }}>
    Place:
    </Typography>
    <Box ml={2} mb={1}>
      <Typography>{plan.place || "No place name provided"}</Typography>
    </Box>

    <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#8a5c00" }}>
      Budget:
    </Typography>
    <Box ml={2}>
      {Object.entries(plan.budget).map(([key, value]) => (
        <Typography key={key}>
          {key.charAt(0).toUpperCase() + key.slice(1)}: ₹{value}
        </Typography>
      ))}
      <Typography sx={{ fontWeight: "bold", mt: 1 }}>
    Total: ₹
    {Object.values(plan.budget).reduce((acc, val) => acc + Number(val || 0), 0)}
  </Typography>
    </Box>

    <Divider sx={{ my: 2, borderColor: "#f4c16e" }} />

    <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#8a5c00" }}>
      Itinerary:
    </Typography>
    {plan.itinerary.map((item, idx) => (
      <Box key={idx} ml={2} mb={1}>
        <Typography>
          <strong>Day {item.day}:</strong> {item.title || "No title"}{" "}
          <em>({item.hour && item.period ? `${item.hour} ${item.period}` : "No Time"})</em>
        </Typography>
        <Typography color="text.secondary" variant="body2">
          {item.description || "No description"}
        </Typography>
      </Box>
    ))}
    <Box display="flex" justifyContent="flex-end" gap={1} mt={2}>
  <Button 
    size="small" 
    variant="outlined" 
    color="primary"
    onClick={() => handleEdit(plan)}
  >
    Edit
  </Button>
  <Button 
    size="small" 
    variant="outlined" 
    color="error"
    onClick={() => handleDelete(plan._id)}
  >
    Delete
  </Button>
  <Link to={`/trip-plans/${plan._id}`} style={{ textDecoration: "none" }}>
  <Button size="small" variant="contained" color="secondary" sx={buttonStyle} >
    View Details
  </Button>
</Link>

</Box>

  </CardContent>
</Card>

            </Grid>
          ))}

        </Grid>
      )}
    </Container>
    </Box>
  );
};

export default TripPlans;
