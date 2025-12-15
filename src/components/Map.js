import React from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom red icon for current location
const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function Map({ places, center, selectedPlace, route }) {

  const routePositions =
    route?.geometry?.coordinates?.map((c) => [c[1], c[0]]) || [];

  return (
    <div className="map-container">
      <MapContainer center={center} zoom={14} style={{ height: "100%", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Current Location as Red Marker */}
        {center && (
          <Marker position={[center.lat, center.lng]} icon={redIcon}>
            <Popup>Your Location</Popup>
          </Marker>
        )}

        {/* Nearby Places */}
        {places.map((place) => (
          <Marker
            key={place.id}
            position={[place.lat, place.lng]}
            opacity={selectedPlace && place.id === selectedPlace.id ? 1 : 0.7}
          >
            <Popup>
              <strong>{place.name}</strong>
              <br />
              {place.address}
              <br />
              {place.distance ? `${place.distance.toFixed(2)} km away` : ""}
            </Popup>
          </Marker>
        ))}

        {/* Route Polyline */}
        {routePositions.length > 0 && (
          <Polyline positions={routePositions} color="blue" weight={4} />
        )}
      </MapContainer>
    </div>
  );
}

export default Map;
