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

// Base URL for the API. Using environment variable for security and flexibility.
const baseURL = process.env.ENDPOINT;

const WeatherForecast: React.FC = () => {
  // State to hold forecast data.
  const [forecast, setForecast] = useState<ForecastEntry[]>([]);

  // Extract current date to use as initial selected date.
  const currentDate = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(currentDate);

  // Extract unique dates from the forecast data for tab headings.
  const uniqueDates = Array.from(
    new Set(forecast.map(entry => entry.dt_txt.split(" ")[0]))
  ).slice(0, 5);

  // Filter forecast entries based on the selected date.
  const dateForecast = forecast.filter(entry =>
    entry.dt_txt.includes(selectedDate)
  );
  const alignmentClass =
    dateForecast.length < 5 ? styles.centeredItems : styles.startAlignedItems;

  // Fetch forecast data based on latitude and longitude.
  const getForecast = async (lat: number, long: number) => {
    try {
      const response = await fetch(
        `${baseURL}/forecast?lat=${lat}&lon=${long}`
      );
      const data = await response.json();

      return data;
    } catch (error) {
      console.error(error);
    }
    return [];
  };

  useEffect(() => {
    const fetchWeatherAndForecast = async () => {
      try {
        const [latitude, longitude] = await getUserCoordinates();
        const forecastData = await getForecast(latitude, longitude);
        setForecast(forecastData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchWeatherAndForecast();
  }, []);

  // Utility function to get user's coordinates or fallback to default.
  const getUserCoordinates = () =>
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
    <div
      className={`${styles.forecastContainer} ${alignmentClass}`}
      data-test-id="forecastContainer">
      <div className={styles.header}>Eficode&apos;s Weather Forecast</div>
      <div className={styles.dateTabs} data-test-id="dateTabs">
        {uniqueDates.map(date => (
          <div className={styles.dateWrapper}>
            <div
              className={date === selectedDate ? styles.fadeIn : styles.noFade}
            />
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
            <div
              className={date === selectedDate ? styles.fadeOut : styles.noFade}
            />
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
              <div className={styles.forecastLine}>
                <div className={styles.forecastKey}>Time: </div>
                <div>{hour}</div>
              </div>
              <div className={styles.forecastLine}>
                <div className={styles.forecastKey}>Temp: </div>
                <div data-test-id="temperatureEntry">{temp}°C</div>
              </div>
              <img src={`../../img/${weatherIcon}.svg`} alt="weather-icon" />
              <div className={styles.forecastLine}>
                <div className={styles.forecastKey}>Min - Max:</div>
                <div>
                  {temp_min}°C - {temp_max}°C
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeatherForecast;
