// src/pages/ViewDestination.js
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
} from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ViewDestination = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`https://travel-wishlist-api.onrender.com/api/destinations/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setDestination(data);
      } catch (err) {
        console.error("Fetch error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    const decodeToken = () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      const payload = JSON.parse(atob(token.split(".")[1]));
      setCurrentUser(payload.id);
    };

    decodeToken();
    fetchDestination();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this destination?")) return;

    try {
      const res = await fetch(`https://travel-wishlist-api.onrender.com/api/destinations/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!res.ok) throw new Error("Delete failed");
      navigate("/");
    } catch (err) {
      console.error("Delete error:", err.message);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (!destination) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <Typography variant="h6">Destination not found</Typography>
      </Box>
    );
  }

  const NextArrow = (props) => {
  const { onClick } = props;
  return (
    <div
      style={{
        position: "absolute",
        right: 10,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 5,
        fontSize: "36px",
        color: "#ff7043",
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      🢂
    </div>
  );
};

const PrevArrow = (props) => {
  const { onClick } = props;
  return (
    <div
      style={{
        position: "absolute",
        left: 10,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 5,
        fontSize: "36px",
        color: "#ff7043",
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      🢀
    </div>
  );
};


  const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
};


  return (
    <Box sx={{ p: 3, minHeight: "100vh", background: "linear-gradient(to bottom, #fff7ec, #fde6bc)" }}>
      <Box display="flex" justifyContent="center" mt={5}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: "90%",
            borderRadius: 3,
            background: "rgba(255, 247, 236, 0.9)",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(3px)",
            maxWidth: 800,
          }}
        >
          <Typography variant="h4" gutterBottom>
            {destination.name}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Journal:</strong> {destination.journal}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Visited:</strong> {destination.visited ? "Yes" : "No"}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Location:</strong> {destination.location?.lat}, {destination.location?.lng}
          </Typography>

          {destination.images.length > 0 && (
            <>
              <Typography variant="h6" mt={3} mb={2}>
                Images
              </Typography>
              <Slider {...sliderSettings}>
                {destination.images.map((img, index) => (
                  <Box key={index} display="flex" justifyContent="center">
                    <Box
                      key={index}
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      sx={{
                        height: 400,
                        width: "100%",
                        backgroundColor: "rgba(255, 247, 236, 0.9)",
                        borderRadius: "8px",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={`https://travel-wishlist-api.onrender.com/${img}`}
                        alt="Destination"
                        style={{
                          maxHeight: "100%",
                          maxWidth: "100%",
                          objectFit: "contain",
                        }}
                      />
                    </Box>

                  </Box>
                ))}
              </Slider>
            </>
          )}

          {currentUser === destination.userId && (
            <Box mt={4} display="flex" gap={2}>
              <Button
                variant="outlined"
                color="primary"
                component={Link}
                to={`/edit/${destination._id}`}
              >
                Edit
              </Button>
              <Button variant="outlined" color="error" onClick={handleDelete}>
                Delete
              </Button>
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default ViewDestination;
