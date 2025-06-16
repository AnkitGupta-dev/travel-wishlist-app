// src/pages/EditDestination.js
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Typography,
  Box,
  Paper,
  Grid,
  MenuItem,
} from "@mui/material";
import countries from "../data/countries";
import DeleteIcon from "@mui/icons-material/Delete";

const EditDestination = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    notes: "",
    journal: "",
    visited: false,
    location: "",
    countryCode: "",
  });
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`https://travel-wishlist-api.onrender.com/api/destinations/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (res.ok) {
        setForm((prev) => ({
          ...prev,
          ...data,
          countryCode: data.countryCode || "",
        }));
        setExistingImages(data.images || []);
      } else {
        alert("Not found");
        navigate("/");
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleCheckbox = (img) => {
    setImagesToDelete((prev) =>
      prev.includes(img) ? prev.filter((i) => i !== img) : [...prev, img]
    );
  };

  const handleFileChange = (e) => {
    setNewImages(e.target.files);
  };

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.entries(form).forEach(([key, val]) =>
      formData.append(key, typeof val === "object" ? JSON.stringify(val) : val)
    );
    formData.append("imagesToDelete", JSON.stringify(imagesToDelete));
    for (let img of newImages) formData.append("newImages", img);

    const res = await fetch(`https://travel-wishlist-api.onrender.com/api/destinations/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      body: formData,
    });

    if (res.ok) {
      alert("Updated");
      navigate(`/destination/${id}`);
    } else {
      alert("Update failed");
    }
  };

  return (
    <Box sx={{ 
          p: 3, 
          minHeight: "100vh", 
          background: "linear-gradient(to bottom, #fff7ec, #fde6bc)" 
          }}>
    <Container maxWidth="md">
      <Paper 
      sx={{ 
        p: 4, 
        width: "90%",
        borderRadius: 3,
        background: "rgba(255, 247, 236, 0.9)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)", 
        backdropFilter: "blur(3px)",
        mt: 4 }}>
        <Typography variant="h5">Edit Destination</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Location"
            name="location"
            value={form.location}
            onChange={handleChange}
            margin="normal"
          />

          {/* Country Dropdown */}
          <TextField
            select
            fullWidth
            label="Country"
            name="countryCode"
            value={form.countryCode}
            onChange={handleChange}
            margin="normal"
          >
            {countries.map((country) => (
              <MenuItem key={country.code} value={country.code}>
                {country.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Notes"
            name="notes"
            value={form.notes}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Journal"
            name="journal"
            value={form.journal}
            onChange={handleChange}
            margin="normal"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={form.visited}
                onChange={handleChange}
                name="visited"
              />
            }
            label="Visited"
          />

          <Typography variant="subtitle1" mt={2}>
            Existing Images
          </Typography>
          <Grid container spacing={2}>
            {existingImages.map((img, idx) => {
              const isSelected = imagesToDelete.includes(img);
              return (
                <Grid item xs={6} sm={4} md={3} key={idx}>
                  <Box
                    sx={{
                      position: "relative",
                      height: 180,
                      borderRadius: 2,
                      overflow: "hidden",
                      backgroundColor: "#f0f0f0",
                      border: isSelected ? "3px solid #f44336" : "2px solid transparent",
                      boxShadow: isSelected ? "0 0 10px rgba(244, 67, 54, 0.6)" : "",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                    }}
                    onClick={() => handleCheckbox(img)}
                  >
                    <img
                      src={`https://travel-wishlist-api.onrender.com/${img}`}
                      alt="existing"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        borderRadius: 6,
                      }}
                    />
                    <DeleteIcon
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        backgroundColor: "white",
                        borderRadius: "50%",
                        padding: "4px",
                        fontSize: 24,
                        color: isSelected ? "#f44336" : "#555",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          color: "#f44336",
                        },
                      }}
                    />
                  </Box>
                </Grid>
              );
            })}
          </Grid>


          <Typography mt={2}>Add New Images</Typography>
          <input type="file" multiple onChange={handleFileChange} />

          <Box mt={3}>
            <Button variant="contained" type="submit">
              Save Changes
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
    </Box>
  );
};

export default EditDestination;
