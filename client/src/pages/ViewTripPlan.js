import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Box,
  Paper,
  Container,
  Typography,
  Divider,
  Button,
  CircularProgress,
} from "@mui/material";

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

const ViewTripPlan = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await axios.get(`https://travel-wishlist-api.onrender.com/api/tripplans/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPlan(res.data);
      } catch (err) {
        console.error("Error fetching trip:", err);
        setPlan(null);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchPlan();
    }
  }, [id, token]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!plan) {
    return (
      <Container sx={{ mt: 5 }}>
        <Typography variant="h5" color="error">
          Trip not found
        </Typography>
        <Button onClick={() => navigate(-1)} sx={{ mt: 2 }} variant="contained">
          Go Back
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ 
      p: 3, 
      minHeight: "100vh", 
      background: "linear-gradient(to bottom, #fff7ec, #fde6bc)" 
    }}>
        <Box display="flex" justifyContent="center" mt={5}>
        <Paper elevation={3} 
              sx={{ 
                p: 4, 
                width: 500,
                borderRadius: 3,
                background: "rgba(255, 247, 236, 0.9)",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)", 
                backdropFilter: "blur(3px)",
                }}>
      <Container maxWidth="md">
         <Box display="flex" justifyContent="center">
        <Typography variant="h4" gutterBottom>
            <b>
          Trip to {plan.place}
          </b>
        </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6">Budget Breakdown:</Typography>
        <ul>
          {Object.entries(plan.budget).map(([key, value]) => (
            <li key={key}>
              {key.charAt(0).toUpperCase() + key.slice(1)}: ₹{value}
            </li>
          ))}
        </ul>

        <Typography variant="h6" sx={{ mt: 3 }}>
          Itinerary:
        </Typography>
        {plan.itinerary.map((item, idx) => (
          <Box key={idx} mb={2}>
            <Typography>
              <strong>Day {item.day}:</strong> {item.title} ({item.hour} {item.period})
            </Typography>
            <Typography color="text.secondary">{item.description}</Typography>
          </Box>
        ))}

        <Button onClick={() => navigate(-1)} sx={{ ...buttonStyle, mt: 4 }} variant="contained">
          Go Back
        </Button>
      </Container>
        </Paper>
        </Box>
    </Box>
  );
};

export default ViewTripPlan;
