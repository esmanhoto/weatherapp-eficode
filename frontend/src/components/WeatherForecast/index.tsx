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

const baseURL = process.env.ENDPOINT;
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
    console.log("trying to fetch forecast");
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
      const forecastData = await getForecast(61.4917167, 23.7833776);
      console.log("forecastData", forecastData);
      setForecast(forecastData || []);
    };

    fetchWeatherAndForecast();
  }, []);

  return (
    <div className={styles.forecastContainer}>
      <div className={styles.dateTabs}>
        {uniqueDates.map(date => (
          <div
            key={date}
            onClick={() => setSelectedDate(date)}
            onKeyPress={() => setSelectedDate(date)}
            role="button"
            tabIndex={0}
            className={`${styles.dateButton} ${
              date === selectedDate ? styles.selectedDate : ""
            }`}>
            {date === currentDate
              ? "Today"
              : new Date(date).toLocaleDateString("default", {
                  weekday: "long"
                })}
          </div>
        ))}
      </div>

      <div className={styles.forecastTable}>
        {dateForecast.map(entry => {
          const hour = entry.dt_txt.split(" ")[1].slice(0, 5);
          const { temp, temp_min, temp_max } = entry.main;
          const weatherIcon = entry.weather[0]?.icon.slice(0, -1);

          return (
            <div key={entry.dt} className={styles.forecastEntry}>
              <div className="">{hour}</div>
              <div className="">
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
