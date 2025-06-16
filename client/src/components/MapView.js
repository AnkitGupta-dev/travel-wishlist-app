// src/components/MapView.js
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Box, Typography } from "@mui/material";

// Custom green (visited) icon
const visitedIcon = new L.Icon({
  iconUrl: "https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-green.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Custom red (wishlist) icon
const wishlistIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/833/833472.png",
  iconSize: [25, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

const MapView = ({ destinations }) => {
  return (
    <Box
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        mb: 4,
        background: "#fff7ec", // match your app’s warm tone
      }}
    >
      <Typography
        variant="h6"
        sx={{ textAlign: "center", py: 2, fontWeight: 500, color: "#444" }}
      >
        <b>🌍 Your Travel Map</b>
      </Typography>

      <MapContainer
        center={[20, 0]}
        zoom={2}
        minZoom={2}
        maxZoom={5}
        scrollWheelZoom={true}
        zoomSnap={0.5}
        style={{ 
            height: "450px", 
            width: "100%", 
            borderRadius: "12px", 
            marginTop: "20px" }}
        worldCopyJump={false}
        maxBounds={[
            [-85, -180], 
            [85, 180]]}
        maxBoundsViscosity={1.0}
      >
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
        />
        {destinations.map((dest, idx) =>
          dest.location?.lat && dest.location?.lng ? (
            <Marker
              key={idx}
              position={[dest.location.lat, dest.location.lng]}
              icon={dest.visited ? visitedIcon : wishlistIcon}
            >
              <Popup>
                <strong>{dest.name}</strong>
                <br />
                {dest.visited ? "✅ Visited" : "❤️ Wishlist"}
              </Popup>
            </Marker>
          ) : null
        )}
      </MapContainer>
    </Box>
  );
};

export default MapView;
