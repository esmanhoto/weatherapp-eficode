import React from "react";
import ReactDOM from "react-dom";
import WeatherForecast from "./components/WeatherForecast";
import styles from "./App.module.css";

const App: React.FC = () => (
  <div className={styles.container}>
    <WeatherForecast />
  </div>
);

ReactDOM.render(<App />, document.getElementById("app"));

export default App;
