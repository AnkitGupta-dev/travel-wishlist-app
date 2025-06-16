import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Grid,
} from "@mui/material";

// Common button style
const buttonStyle = {
  marginLeft: 1,
  backgroundColor: "#f4c16e", // warm soft orange
  color: "#000",
  fontWeight: 500,
  textTransform: "none",
  borderRadius: "6px",
  "&:hover": {
    backgroundColor: "#e5ae4d",
  },
};

const Home = () => {
  const [destinations, setDestinations] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [viewMode, setViewMode] = useState("card");

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("https://travel-wishlist-api.onrender.com/api/destinations", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setDestinations(data);
    };

    fetchData();
  }, []);

  const filtered = destinations
    .filter((d) => d.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "recent") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <Box sx={{ p: 3 }}>
      {/* Search, Sort, View Mode Toggle */}
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
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          size="small"
        >
          <MenuItem value="recent">Most Recent</MenuItem>
          <MenuItem value="name">Alphabetical</MenuItem>
        </Select>
        <Button
          sx={buttonStyle}
          variant="contained"
          onClick={() => setViewMode(viewMode === "card" ? "journal" : "card")}
        >
          {viewMode === "card" ? "Switch to Journal View" : "Switch to Card View"}
        </Button>
      </Box>

      {/* Destination View */}
      {viewMode === "card" ? (
        <Box sx={{ maxWidth: "1200px", mx: "auto" }}>
          <Grid container spacing={3}>
            {filtered.map((dest) => (
              <Grid item xs={12} sm={6} md={4} key={dest._id}>
              <Card
                component={Link}
                to={`/destination/${dest._id}`}
                sx={{ textDecoration: "none", color: "inherit", height: "100%" }}
              >
                {dest.images?.length > 0 ? (
                  <CardMedia
                    component="img"
                    height="180"
                    image={`https://travel-wishlist-api.onrender.com/${dest.images[0]}`}
                    alt={dest.name}
                  />
                ) : (
                  <Box
                    sx={{
                      height: 180,
                      background: "#f0f0f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#888",
                    }}
                  >
                    No Image
                  </Box>
                )}
                <CardContent>
                  <Typography variant="h6">{dest.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {dest.visited ? "✅ Visited" : "📍 Want to Visit"}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {dest.journal?.slice(0, 80) || "No journal entry."}...
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        </Box>
      ) : (
        <Box>
          {filtered.map((dest) => (
            <Box
              key={dest._id}
              sx={{
                background: "#fff",
                p: 2,
                mb: 2,
                borderRadius: 2,
                boxShadow: 1,
              }}
            >
              <Typography variant="h6">{dest.name}</Typography>
              <Typography variant="body2">
                <strong>Visited:</strong> {dest.visited ? "Yes" : "No"}
              </Typography>
              <Typography variant="body2">
                <strong>Journal:</strong> {dest.journal || "No entry."}
              </Typography>
              <Button
                component={Link}
                to={`/destination/${dest._id}`}
                size="small"
                sx={{ mt: 1 }}
              >
                Open
              </Button>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Home;
