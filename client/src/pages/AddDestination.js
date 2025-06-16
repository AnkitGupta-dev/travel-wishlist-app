// src/pages/AddDestination.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  FormControlLabel,
  Checkbox,
  MenuItem,
  IconButton,
} from "@mui/material";
import LocationPicker from "../components/LocationPicker";
import countries from "../data/countries";
import DeleteIcon from "@mui/icons-material/Delete";

const AddDestination = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    journal: "",
    visited: false,
    countryCode: "",
  });
  const [location, setLocation] = useState(null);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageUploadMessage, setImageUploadMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
    setImageUploadMessage(`${files.length} image(s) selected ✅`);
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...images];
    const updatedPreviews = [...imagePreviews];
    updatedImages.splice(index, 1);
    updatedPreviews.splice(index, 1);
    setImages(updatedImages);
    setImagePreviews(updatedPreviews);
    setImageUploadMessage(`${updatedImages.length} image(s) selected ✅`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !location || !form.countryCode) {
      setError("Name, location, and country are required.");
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("journal", form.journal);
    formData.append("visited", form.visited);
    formData.append("location", JSON.stringify(location));
    formData.append("countryCode", form.countryCode);

    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]);
    }

    try {
      const res = await fetch("https://travel-wishlist-api.onrender.com/api/destinations", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Add failed");
        return;
      }

      navigate("/");
    } catch (err) {
      console.error("Add error:", err);
      setError("Something went wrong.");
    }
  };

  return (
    <Box display="flex" justifyContent="center" mt={5}>
      <Paper elevation={3} sx={{ p: 4, width: 500 }}>
        <Typography variant="h5" mb={3}>
          Add Destination
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Destination Name"
            name="name"
            fullWidth
            margin="normal"
            value={form.name}
            onChange={handleChange}
          />
          <TextField
            label="Journal Entry"
            name="journal"
            fullWidth
            multiline
            rows={4}
            margin="normal"
            value={form.journal}
            onChange={handleChange}
          />
          <FormControlLabel
            control={
              <Checkbox
                name="visited"
                checked={form.visited}
                onChange={handleChange}
              />
            }
            label="Visited?"
          />

          {/* Country Selector */}
          <TextField
            select
            label="Country"
            name="countryCode"
            fullWidth
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

          <LocationPicker location={location} setLocation={setLocation} />

          <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{ mt: 2 }}
          >
            Upload Images
            <input
              type="file"
              hidden
              multiple
              accept="image/*"
              onChange={handleImageChange}
            />
          </Button>

          {imageUploadMessage && (
            <Typography color="success.main" mt={1}>
              {imageUploadMessage}
            </Typography>
          )}

          {/* Image Previews with Remove */}
          <Box mt={2} display="flex" flexWrap="wrap" gap={2}>
            {imagePreviews.map((url, index) => (
              <Box key={index} position="relative">
                <img
                  src={url}
                  alt={`preview-${index}`}
                  style={{
                    width: "120px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                  }}
                />
                <IconButton
                  size="small"
                  onClick={() => handleRemoveImage(index)}
                  sx={{
                    position: "absolute",
                    top: -10,
                    right: -10,
                    backgroundColor: "#fff",
                    boxShadow: 1,
                    ":hover": { backgroundColor: "#f44336", color: "#fff" },
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>

          {error && (
            <Typography color="error" mt={2}>
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
          >
            Add Destination
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default AddDestination;
