const fetch = require("node-fetch");

const appId = process.env.APPID || "";
const mapURI =
  process.env.MAP_ENDPOINT || "http://api.openweathermap.org/data/2.5";

const isValidLatitude = (lat) => {
  return lat && !isNaN(lat) && lat >= -90 && lat <= 90;
};

const isValidLongitude = (lon) => {
  return lon && !isNaN(lon) && lon >= -180 && lon <= 180;
};

const fetchForecast = async (lat, lon) => {
  const endpoint = `${mapURI}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${appId}`;
  const response = await fetch(endpoint);
  return response ? response.json() : {};
};

exports.handler = async (event) => {
  const { lat, lon } = event.queryStringParameters;

  if (!isValidLatitude(lat) || !isValidLongitude(lon)) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Latitude and Longitude are required.",
      }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  }

  try {
    const forecastData = await fetchForecast(lat, lon);
    return {
      statusCode: 200,
      body: JSON.stringify(forecastData.list),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Internal server error",
      }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  }
};
