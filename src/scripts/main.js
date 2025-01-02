/* global alert */
import {
  fetchForecastByCity,
  fetchForecastByGeo,
  fetchWeatherByCity,
  fetchWeatherByGeo,
} from "./weatherApi";

const cityButton = document.querySelector("#cityButton");
const geoButton = document.querySelector("#geoButton");
const form = document.querySelector("#form");
const formInput = document.querySelector("#formInput");
const currentCity = document.querySelector("#current-city");
const date = document.querySelector("#current-date");
const month = document.querySelector("#current-month");
const weatherIcon = document.querySelector("#current-icon");
const weatherDescription = document.querySelector("#description");
const currentTemperature = document.querySelector("#temperature");
const currentHumidity = document.querySelector("#humidity");
const currentWind = document.querySelector("#wind");
const fahrenheitsLink = document.querySelector("#fahrenheitLink");
const celciusLink = document.querySelector("#celciusLink");
const weatherContainer = document.querySelector("#weather-container");
const loadingMessage = document.querySelector("#loading-message");
const loadingSpinner = document.querySelector("#loading-spinner");

function formatDate(dateInSec) {
  const currentDate = new Date(dateInSec * 1000);
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayOfWeekIndex = currentDate.getDay();
  const currentDay = days[dayOfWeekIndex];
  const currentMonthDay = currentDate.getUTCDate();

  return `${currentDay}, ${currentMonthDay}`;
}

function formatMonth(dateInSec) {
  const currentDate = new Date(dateInSec * 1000);
  const months = [
    "January",
    "Fabruary",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const currentMonth = months[currentDate.getMonth()];

  return `${currentMonth}`;
}

function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        resolve({
          latitude,
          longitude,
        });
      },
      (error) => reject(error),
    );
  });
}

function changeTemperatureToFahrenheit(e) {
  e.preventDefault();

  const currentTempInCelc = currentTemperature.innerHTML;

  currentTemperature.innerHTML = `${Math.round(currentTempInCelc * 1.8 + 32)}`;
  celciusLink.classList.remove("nonActive");
  fahrenheitsLink.classList.add("nonActive");
}

function changeTemperatureToCelcius(e) {
  e.preventDefault();

  const currentTempInFarenh = currentTemperature.innerHTML;

  currentTemperature.innerHTML = `${Math.round(
    (currentTempInFarenh - 32) / 1.8,
  )}`;
  celciusLink.classList.add("nonActive");
  fahrenheitsLink.classList.remove("nonActive");
}

function updateCurrentWeather(response) {
  currentCity.innerHTML = response.city;
  date.innerHTML = formatDate(response.time);
  month.innerHTML = formatMonth(response.time);
  weatherIcon.setAttribute("src", `${response.condition.icon_url}`);
  weatherDescription.innerHTML = response.condition.description;
  currentTemperature.innerHTML = `${Math.round(response.temperature.current)} `;
  currentHumidity.innerHTML = `humidity: ${response.temperature.humidity}%`;
  currentWind.innerHTML = `wind: ${Math.round(response.wind.speed)} km/hr`;
}

function updateForecastWeather(forecastResponse) {
  for (let i = 1; i <= 5; i++) {
    const forecastDayData = forecastResponse[i - 1];
    const forecastImage = document.querySelector(`#forecastImage_${i}`);
    const forecastDay = document.querySelector(`#forecastDay_${i}`);
    const forecastMaxTemp = document.querySelector(`#forecastTempMax_${i}`);
    const forecastMinTemp = document.querySelector(`#forecastTempMin_${i}`);

    forecastImage.setAttribute("src", `${forecastDayData.condition.icon_url}`);
    forecastDay.innerHTML = formatDate(forecastDayData.time);

    forecastMaxTemp.innerHTML = `${Math.round(
      forecastDayData.temperature.maximum,
    )}°С`;

    forecastMinTemp.innerHTML = `${Math.round(
      forecastDayData.temperature.minimum,
    )}°С`;
  }
}

async function changeWeatherDataByCity(e) {
  e.preventDefault();

  const city = formInput.value.trim();

  if (!city) {
    return;
  }

  weatherContainer.classList.add("d-none");
  loadingMessage.classList.add("d-none");
  loadingSpinner.classList.remove("d-none");
  cityButton.disabled = true;

  try {
    const response = await fetchWeatherByCity(city);
    const forecastResponse = await fetchForecastByCity(city);

    updateCurrentWeather(response);
    updateForecastWeather(forecastResponse);
  } catch (error) {
    alert("Failed to fetch weather data. Please try again later.");
    loadingMessage.classList.remove("d-none");
  } finally {
    weatherContainer.classList.remove("d-none");
    loadingMessage.classList.add("d-none");
    loadingSpinner.classList.add("d-none");
    cityButton.disabled = false;
  }
}

async function changeWeatherDataByGeo(e) {
  e.preventDefault();

  weatherContainer.classList.add("d-none");
  loadingMessage.classList.add("d-none");
  loadingSpinner.classList.remove("d-none");
  cityButton.disabled = true;

  try {
    const { latitude, longitude } = await getCurrentLocation();
    const response = await fetchWeatherByGeo(latitude, longitude);
    const forecastResponse = await fetchForecastByGeo(latitude, longitude);

    updateCurrentWeather(response);
    updateForecastWeather(forecastResponse);
  } catch {
    alert("Failed to fetch weather data. Please try again later.");
    loadingMessage.textContent = "Choose the city...";
  } finally {
    weatherContainer.classList.remove("d-none");
    loadingMessage.classList.add("d-none");
    loadingSpinner.classList.add("d-none");
    geoButton.disabled = false;
  }
}

form.addEventListener("submit", changeWeatherDataByCity);
cityButton.addEventListener("click", changeWeatherDataByCity);
geoButton.addEventListener("click", changeWeatherDataByGeo);
fahrenheitsLink.addEventListener("click", changeTemperatureToFahrenheit);
celciusLink.addEventListener("click", changeTemperatureToCelcius);
