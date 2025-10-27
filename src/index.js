import "./styles.css";

// ====== CONFIG ======
const API_KEY = "YWLS6K9TT2PAHNNRES8R9N792";
const BASE_URL =
  "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";

// ====== ELEMENT REFERENCES ======
const searchInput = document.getElementById("search-input");
const fetchBtn = document.getElementById("fetch-btn");
const unitToggleBtn = document.getElementById("unit-toggle-btn");
const messageBox = document.getElementById("message-box");

const locationEl = document.getElementById("current-location");
const datetimeEl = document.getElementById("current-datetime");
const currentTempEl = document.getElementById("current-temp");
const highTempEl = document.getElementById("high-temp");
const lowTempEl = document.getElementById("low-temp");

const feelsLikeEl = document.getElementById("feels-like-temp");
const conditionTextEl = document.getElementById("condition-text");
const conditionIconEl = document.getElementById("condition-icon");

const precipChanceEl = document.getElementById("precip-chance");
const precipTypeEl = document.getElementById("precip-type");
const windSpeedEl = document.getElementById("wind-speed");
const humidityEl = document.getElementById("humidity");
const cloudEl = document.getElementById("cloudcover");
const visibilityEl = document.getElementById("visibility");
const sunriseEl = document.getElementById("sunrise");
const sunsetEl = document.getElementById("sunset");

const forecastList = document.getElementById("forecast-list");

// ====== STATE ======
let isMetric = true;

// ====== EVENT LISTENERS ======
fetchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) fetchWeather(query);
});

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const query = searchInput.value.trim();
    if (query) fetchWeather(query);
  }
});

unitToggleBtn.addEventListener("click", () => {
  isMetric = !isMetric;
  unitToggleBtn.textContent = isMetric ? "°C" : "°F";
  const query = searchInput.value.trim();
  if (query) fetchWeather(query);
});

// ====== MAIN FUNCTION ======
async function fetchWeather(location) {
  showMessage("");

  const unitGroup = isMetric ? "metric" : "us";
  const url = `${BASE_URL}${encodeURIComponent(
    location
  )}?unitGroup=${unitGroup}&key=${API_KEY}&include=days,current`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Location not found");
    const data = await res.json();
    updateUI(data);
    showMessage(""); // clear
  } catch (err) {
    showMessage(err.message || "Unable to fetch weather", "error");
  }
}

// ====== UPDATE UI ======
function updateUI(data) {
  const current = data.currentConditions;
  const today = data.days[0];

  // ---- Current Info ----
  locationEl.textContent = data.resolvedAddress;

  // Use the timezone from the API
  const tz = data.timezone || "UTC"; // Default to UTC if no timezone provided

  // Ensure currentTime is properly defined using the epoch timestamp
  const currentTime = new Date(current.datetimeEpoch * 1000); // Convert from seconds to milliseconds

  // Format the date and time with Intl.DateTimeFormat for timezone handling
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const timeFormatter = new Intl.DateTimeFormat([], {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const dateFormatted = formatter.format(currentTime);
  const timeFormatted = timeFormatter.format(currentTime);

  // Set the datetime in the placeholder
  datetimeEl.innerHTML = `${dateFormatted} | ${timeFormatted} <span class="last-recorded">(Last Updated - Local Time)</span>`;

  // ---- Other Weather Data ----
  currentTempEl.textContent = `${Math.round(current.temp)}°${
    isMetric ? "C" : "F"
  }`;
  highTempEl.textContent = `${Math.round(today.tempmax)}°${
    isMetric ? "C" : "F"
  }`;
  lowTempEl.textContent = `${Math.round(today.tempmin)}°${
    isMetric ? "C" : "F"
  }`;

  feelsLikeEl.textContent = `${Math.round(current.feelslike)}°${
    isMetric ? "C" : "F"
  }`;
  conditionTextEl.textContent = current.conditions;
  conditionIconEl.textContent = getWeatherEmoji(current.icon);

  precipChanceEl.textContent = `${Math.round(today.precipprob)}%`;
  precipTypeEl.textContent = today.preciptype
    ? today.preciptype.join(", ").toUpperCase()
    : "NONE";
  windSpeedEl.textContent = `${Math.round(current.windspeed)} ${
    isMetric ? "km/h" : "mph"
  }`;
  humidityEl.textContent = `${Math.round(current.humidity)}%`;
  cloudEl.textContent = `${Math.round(current.cloudcover)}%`;
  visibilityEl.textContent = `${Math.round(current.visibility)} ${
    isMetric ? "km" : "mi"
  }`;

  // Format Sunrise and Sunset times
  const sunriseTime = new Date(today.sunriseEpoch * 1000);
  const sunsetTime = new Date(today.sunsetEpoch * 1000);

  // Format the times using the correct timezone
  sunriseEl.textContent = timeFormatter.format(sunriseTime);
  sunsetEl.textContent = timeFormatter.format(sunsetTime);

  // ---- Forecast ----
  renderForecast(data.days.slice(1, 6)); // next 5 days
}

// ====== FORECAST ======
function renderForecast(days) {
  forecastList.innerHTML = "";
  days.forEach((day) => {
    const div = document.createElement("div");
    div.classList.add("forecast-day");

    const date = new Date(day.datetime).toLocaleDateString(undefined, {
      weekday: "short",
    });
    div.innerHTML = `
      <p class="forecast-date">${date}</p>
      <p class="forecast-icon">${getWeatherEmoji(day.icon)}</p>
      <p class="forecast-temp">${Math.round(day.tempmax)}° / ${Math.round(
      day.tempmin
    )}°</p>
    `;
    forecastList.appendChild(div);
  });
}

// ====== UTILITIES ======
function getWeatherEmoji(icon) {
  const map = {
    "clear-day": "☀️",
    "clear-night": "🌙",
    "partly-cloudy-day": "⛅",
    "partly-cloudy-night": "☁️",
    cloudy: "☁️",
    rain: "🌧️",
    "showers-day": "🌦️",
    "showers-night": "🌦️",
    thunderstorm: "⛈️",
    snow: "❄️",
    fog: "🌫️",
  };
  return map[icon] || "🌈";
}

function showMessage(msg, type = "") {
  if (!msg) {
    messageBox.classList.add("hidden");
    messageBox.textContent = "";
    return;
  }
  messageBox.textContent = msg;
  messageBox.className = ""; // reset
  messageBox.classList.add(type === "error" ? "error" : "info");
  messageBox.classList.remove("hidden");
}
