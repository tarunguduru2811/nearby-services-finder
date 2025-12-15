const express = require("express");
const axios = require("axios");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
const PORT = 5000;

const ORS_API_KEY = process.env.ORS_API_KEY; // Free key from openrouteservice.org

app.get("/route", async (req, res) => {
  const { startLat, startLng, endLat, endLng } = req.query;

  try {
    const response = await axios.post(
      "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
      {
        coordinates: [
          [parseFloat(startLng), parseFloat(startLat)],
          [parseFloat(endLng), parseFloat(endLat)],
        ],
      },
      {
        headers: {
          Authorization: ORS_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch route" });
  }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
