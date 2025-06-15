// src/components/LocationPicker.js
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

const LocationMarker = ({ setLocation }) => {
  useMapEvents({
    click(e) {
      setLocation({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      });
    },
  });

  return null;
};

const LocationPicker = ({ location, setLocation }) => {
  return (
    <div style={{ height: "300px", marginTop: "20px" }}>
      <MapContainer
        center={location || { lat: 20.5937, lng: 78.9629 }} // Default to center of India
        zoom={5}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {location && <Marker position={location} />}
        <LocationMarker setLocation={setLocation} />
      </MapContainer>
    </div>
  );
};

export default LocationPicker;
