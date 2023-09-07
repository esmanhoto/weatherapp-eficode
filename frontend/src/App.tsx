import React from "react";
import ReactDOM from "react-dom";
import WeatherForecast from "./components/WeatherForecast";

const App: React.FC = () => (
  <div>
    <WeatherForecast />
  </div>
);

ReactDOM.render(<App />, document.getElementById("app"));

export default App;
