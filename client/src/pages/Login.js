// src/pages/Login.js
import { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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

const Login = () => {
  const [identifier, setIdentifier] = useState(""); // username or email
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ Use login from AuthContext

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(
        "https://travel-wishlist-api.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ identifier, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
      } else {
        login(data.token);       // ✅ Call context login
        navigate("/");           // ✅ Redirect to homepage
      }
    } catch (err) {
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
      <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          gap={2}
        >
        <TextField
          label="Username or Email"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
          sx={{ width: "100%" }}
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          sx={{ width: "100%" }}
        />
        {error && (
        <Typography color="error" align="center">
            {error}
        </Typography>
        )}
        <Button
          sx={{ ...buttonStyle, width: "100%" }} // 👈 ensures it's same width as inputs
          variant="contained"
          type="submit"
        >
          Login
        </Button>
        </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;
