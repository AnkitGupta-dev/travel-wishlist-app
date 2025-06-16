import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Divider,
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

const Profile = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    currentPassword: "",
    newPassword: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch current user details from token payload (or user endpoint)
    const token = localStorage.getItem("token");
    if (token) {
      const { username, email } = JSON.parse(atob(token.split(".")[1]));
      setForm((prev) => ({ ...prev, username, email }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("https://travel-wishlist-api.onrender.com/api/auth/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Update failed");
        return;
      }

      setMessage("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong.");
    }
  };

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
        width: "100%",
        borderRadius: 3,
        background: "rgba(255, 247, 236, 0.9)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)", 
        backdropFilter: "blur(3px)",
        maxWidth: 500,}}>
        <Typography variant="h5" mb={2}>
          Edit Profile
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            name="username"
            fullWidth
            margin="normal"
            value={form.username}
            onChange={handleChange}
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            margin="normal"
            value={form.email}
            onChange={handleChange}
          />
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" mb={1}>
            Change Password
          </Typography>
          <TextField
            label="Current Password"
            name="currentPassword"
            type="password"
            fullWidth
            margin="normal"
            value={form.currentPassword}
            onChange={handleChange}
          />
          <TextField
            label="New Password"
            name="newPassword"
            type="password"
            fullWidth
            margin="normal"
            value={form.newPassword}
            onChange={handleChange}
          />

          {message && (
            <Typography color={message.includes("success") ? "green" : "error"} mt={2}>
              {message}
            </Typography>
          )}

          <Button type="submit" variant="contained" fullWidth sx={{ ...buttonStyle, mt: 3 }}>
            Update Profile
          </Button>
        </form>
      </Paper>
    </Box>
    </Box>
  );
};

export default Profile;
