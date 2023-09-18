// const debug = require("debug")("weathermap");
const Koa = require("koa");
const router = require("koa-router")();
const fetch = require("node-fetch");
const cors = require("kcors");

const appId = process.env.APPID || "";
const mapURI =
  process.env.MAP_ENDPOINT || "http://api.openweathermap.org/data/2.5";

const port = process.env.PORT || 9000;

const app = new Koa();

app.use(cors());

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

router.get("/api/forecast", async (ctx) => {
  const { lat, lon } = ctx.query;
  if (!isValidLatitude(lat) || !isValidLongitude(lon)) {
    ctx.throw(400, "Latitude and Longitude are required.");
  }

  const forecastData = await fetchForecast(lat, lon);

  ctx.type = "application/json; charset=utf-8";
  ctx.body = forecastData.list || [];
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(port);

console.log(`App listening on port ${port}`);
module.exports = app;
