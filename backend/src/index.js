// const debug = require("debug")("weathermap");
const Koa = require("koa");
const router = require("koa-router")();
const fetch = require("node-fetch");
const cors = require("kcors");
const bodyParser = require("koa-body");

const appId = process.env.APPID || "970c99e80503ab50d3da38fae6f1be3b";
const mapURI =
  process.env.MAP_ENDPOINT || "http://api.openweathermap.org/data/2.5";
const targetCity = process.env.TARGET_CITY || "Helsinki,fi";

const port = process.env.PORT || 9000;

const app = new Koa();

app.use(cors());
// app.use(bodyParser());

const fetchWeather = async () => {
  const endpoint = `${mapURI}/weather?q=${targetCity}&appid=${appId}`;
  const response = await fetch(endpoint);

  return response ? response.json() : {};
};

const fetchForecast = async (lat, lon) => {
  const endpoint = `${mapURI}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${appId}`;
  const response = await fetch(endpoint);
  return response ? response.json() : {};
};

router.get("/api/weather", async (ctx) => {
  const weatherData = await fetchWeather();

  ctx.type = "application/json; charset=utf-8";
  ctx.body = weatherData.weather ? weatherData.weather[0] : {};
});

router.get("/api/forecast", async (ctx) => {
  const { lat, lon } = ctx.query;
  if (!lat || !lon) {
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
