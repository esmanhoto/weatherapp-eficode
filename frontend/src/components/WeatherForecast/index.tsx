import React, { useEffect, useState } from "react";
import styles from "./WeatherForecast.module.css";

interface ForecastEntry {
  dt: number;
  dt_txt: string;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
  };
  weather: {
    description: string;
    icon: string;
    id: number;
    main: string;
  }[];
}

// const baseURL = process.env.ENDPOINT;
const baseURL =
  "https://ek8kpstazl.execute-api.eu-north-1.amazonaws.com/Prod/api";
console.log("Base URL:", baseURL);

const WeatherForecast: React.FC = () => {
  const [forecast, setForecast] = useState<ForecastEntry[]>([]);
  const currentDate = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(currentDate);

  const uniqueDates = Array.from(
    new Set(forecast.map(entry => entry.dt_txt.split(" ")[0]))
  ).slice(0, 5);
  const dateForecast = forecast.filter(entry =>
    entry.dt_txt.includes(selectedDate)
  );

  const getForecast = async (lat: number, long: number) => {
    try {
      const response = await fetch(
        `${baseURL}/forecast?lat=${lat}&lon=${long}`
      );
      const data = await response.json();
      console.log("Fetched data:", data);

      return data;
    } catch (error) {
      console.error(error);
    }
    return [];
  };

  useEffect(() => {
    const fetchWeatherAndForecast = async () => {
      try {
        const [latitude, longitude] = await getCoordinates();
        const forecastData = await getForecast(latitude, longitude);
        setForecast(forecastData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchWeatherAndForecast();
  }, []);

  const getCoordinates = () =>
    new Promise<[number, number]>(resolve => {
      const efiCodeHeadQarters = { lat: 60.1694696, long: 24.9235992 };

      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          position => {
            const { latitude, longitude } = position.coords;
            resolve([latitude, longitude]);
          },
          error => {
            console.error("Error getting geolocation:", error);
            resolve([efiCodeHeadQarters.lat, efiCodeHeadQarters.long]);
          }
        );
      } else {
        console.error("Geolocation is not available in this browser.");
        resolve([efiCodeHeadQarters.lat, efiCodeHeadQarters.long]);
      }
    });

  return (
    <div className={styles.forecastContainer} data-test-id="forecastContainer">
      <div className={styles.dateTabs} data-test-id="dateTabs">
        {uniqueDates.map(date => (
          <div
            key={date}
            onClick={() => setSelectedDate(date)}
            onKeyPress={() => setSelectedDate(date)}
            role="button"
            tabIndex={0}
            className={`${styles.dateButton} ${
              date === selectedDate ? styles.selectedDate : ""
            }`}
            data-test-id="dateButton">
            {date === currentDate
              ? "Today"
              : new Date(date).toLocaleDateString("default", {
                  weekday: "long"
                })}
          </div>
        ))}
      </div>
      <div className={styles.forecastTable} data-test-id="forecastTable">
        {dateForecast.map(entry => {
          const hour = entry.dt_txt.split(" ")[1].slice(0, 5);
          const { temp, temp_min, temp_max } = entry.main;
          const weatherIcon = entry.weather[0]?.icon.slice(0, -1);

          return (
            <div
              key={entry.dt}
              className={styles.forecastEntry}
              data-test-id="forecastEntry">
              <div className="">{hour}</div>
              <div data-test-id="temperatureEntry">
                {temp}
                °C
              </div>
              <img src={`../../img/${weatherIcon}.svg`} alt="weather-icon" />
              <div className="">
                {temp_min}
                °C -{temp_max}
                °C
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeatherForecast;
