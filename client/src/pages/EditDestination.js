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
            {existingImages.map((img, idx) => (
              <Grid item xs={6} sm={4} md={3} key={idx}>
                <img
                  src={`https://travel-wishlist-api.onrender.com/${img}`}
                  alt="existing"
                  style={{ width: "100%", borderRadius: 6 }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={imagesToDelete.includes(img)}
                      onChange={() => handleCheckbox(img)}
                    />
                  }
                  label="Delete"
                />
              </Grid>
            ))}
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
