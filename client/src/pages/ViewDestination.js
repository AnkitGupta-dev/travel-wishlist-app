// src/pages/ViewDestination.js
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  CircularProgress,
} from "@mui/material";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";

const ViewDestination = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
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
        maxWidth: 800 }}>
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
          <strong>Location:</strong>{" "}
          {destination.location?.lat}, {destination.location?.lng}
        </Typography>

        {destination.images.length > 0 && (
          <>
            <Typography variant="h6" mt={3} mb={1}>
              Images
            </Typography>
            <Grid container spacing={2}>
              {destination.images.map((img, index) => (
                <Grid item xs={4} key={index}>
                  <img
                    src={`https://travel-wishlist-api.onrender.com/${img}`}
                    alt="Destination"
                    style={{ width: "100%", cursor: "pointer" }}
                    onClick={() => {
                      setLightboxIndex(index);
                      setIsOpen(true);
                    }}
                  />
                </Grid>
              ))}
            </Grid>
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

      {isOpen && (
        <Lightbox
          mainSrc={`https://travel-wishlist-api.onrender.com/${destination.images[lightboxIndex]}`}
          nextSrc={`https://travel-wishlist-api.onrender.com/${destination.images[(lightboxIndex + 1) % destination.images.length]}`}
          prevSrc={`https://travel-wishlist-api.onrender.com/${destination.images[(lightboxIndex + destination.images.length - 1) % destination.images.length]}`}
          onCloseRequest={() => setIsOpen(false)}
          onMovePrevRequest={() =>
            setLightboxIndex((lightboxIndex + destination.images.length - 1) % destination.images.length)
          }
          onMoveNextRequest={() =>
            setLightboxIndex((lightboxIndex + 1) % destination.images.length)
          }
        />
      )}
    </Box>
    </Box>
  );
};

export default ViewDestination;
