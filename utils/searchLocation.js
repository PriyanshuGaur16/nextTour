// const fetch = require("node-fetch"); // If using Node 18+, you can skip this line

async function searchLocation(location) {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${location}`
  );
  const data = await response.json();

  if (data.length > 0) {
    const lat = data[0].lat;
    const lon = data[0].lon;
    return { lat, lon }; // just return coords
  } else {
    return null;
  }
}




module.exports = searchLocation;

