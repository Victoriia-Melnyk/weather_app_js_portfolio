import axios from "axios";

const API_KEY = "aao33d4100dc1f18c42d1b9teb580408";
const BASE_URL = "https://api.shecodes.io/weather/v1/";

export const fetchWeatherByCity = async (city) => {
  const url = `${BASE_URL}current?query=${city}&key=${API_KEY}&units=metric`;
  const response = await axios.get(url);

  return response.data;
};

export const fetchWeatherByGeo = async (latitude, longitude) => {
  const url =
    `${BASE_URL}current?lon=${longitude}&lat=${latitude}&key=${API_KEY}` +
    `&units=metric`;
  const response = await axios.get(url);

  return response.data;
};

export const fetchForecastByCity = async (forecastCity) => {
  const url = `${BASE_URL}forecast?query=${forecastCity}&key=${API_KEY}&units=metric`;

  const response = await axios.get(url);

  return response.data.daily.slice(0, 5);
};

export const fetchForecastByGeo = async (latitude, longitude) => {
  const url = `${BASE_URL}forecast?lon=${longitude}&lat=${latitude}&key=${API_KEY}&units=metric`;

  const response = await axios.get(url);

  return response.data.daily.slice(0, 5);
};
