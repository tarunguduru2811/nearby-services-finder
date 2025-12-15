import axios from "axios";
// Helper function to calculate distance (Haversine formula)
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };
  
export const fetchNearbyPlaces = async (location, category = "hospital") => {
  try {
    const lat = location.lat;
    const lon = location.lng;
    const delta = 0.05; // ~5 km
    const viewbox = `${lon - delta},${lat - delta},${lon + delta},${lat + delta}`;

    const response = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: {
        q: category,
        format: "json",
        limit: 20,
        bounded: 1,
        viewbox: viewbox,
      },
    });

    return response.data.map((place, index) => ({
      id: index,
      name: place.display_name.split(",")[0], // first part as name
      address: place.display_name,            // full address
      lat: parseFloat(place.lat),
      lng: parseFloat(place.lon),
    }));
  } catch (error) {
    console.error("Error fetching places:", error);
    return [];
  }
};
