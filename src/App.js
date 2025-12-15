import React, { useState, useEffect } from "react";
import Map from "./components/Map";
import ServiceList from "./components/ServiceList";
import Filter from "./components/Filter";
import { fetchNearbyPlaces, calculateDistance } from "./api";
import axios from "axios";
import "./App.css";

function App() {
  const [places, setPlaces] = useState([]);
  const [location, setLocation] = useState(null);
  const [category, setCategory] = useState("hospital");
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [route, setRoute] = useState(null); // GeoJSON route

  const handleSelectPlace = async (place) => {
    setSelectedPlace(place);
  
    if (location) {
      try {
        const response = await axios.get("https://nearby-services-finder.onrender.com/route", {
          params: {
            startLat: location.lat,
            startLng: location.lng,
            endLat: place.lat,
            endLng: place.lng,
          },
        });
  
        const feature = response.data.features[0];
  
        if (!feature) {
          console.error("No route found");
          setRoute(null);
          return;
        }
  
        const geometry = feature.geometry; // GeoJSON
        const summary = feature.properties.summary;
  
        setRoute({
          geometry: geometry,
          distance: summary.distance, // meters
          duration: summary.duration, // seconds
        });
  
      } catch (err) {
        console.error("Error Fetching Route", err);
        setRoute(null);
      }
    }
  };
  

  useEffect(() => {
    const getPlaces = async () => {
      if (location) {
        const data = await fetchNearbyPlaces(location, category);
        const dataWithDistance = data.map((place) => ({
          ...place,
          distance: calculateDistance(location.lat, location.lng, place.lat, place.lng),
        }));
        dataWithDistance.sort((a, b) => a.distance - b.distance);
        setPlaces(dataWithDistance);
      }
    };
    getPlaces();
  }, [location, category]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          }),
        (error) => {
          console.error("Geolocation error:", error);
          setLocation({ lat: 17.385, lng: 78.4867 }); // Hyderabad fallback
        }
      );
    } else {
      setLocation({ lat: 17.385, lng: 78.4867 });
    }
  }, []);

  return (
    <div className="container">
      <h1>Nearby Services Finder</h1>
      <Filter selectedType={category} onChange={setCategory} />
      <button
        onClick={() => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) =>
              setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
            );
          }
        }}
      >
        Refresh My Location
      </button>
      {location && (
        <Map places={places} center={location} selectedPlace={selectedPlace} route={route} />
      )}
      <ServiceList places={places} onSelect={handleSelectPlace} />
    </div>
  );
}

export default App;
