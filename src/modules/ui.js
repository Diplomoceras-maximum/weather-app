// ##### Ui.js #####

// Imports
import {
  locationEl,
  datetimeEl,
  currentTempEl,
  highTempEl,
  lowTempEl,
  feelsLikeEl,
  conditionTextEl,
  conditionIconEl,
  precipChanceEl,
  precipTypeEl,
  windSpeedEl,
  humidityEl,
  cloudEl,
  visibilityEl,
  sunriseEl,
  sunsetEl,
  forecastList,
} from "./dom.js";
import { getWeatherEmoji } from "./utilities.js";

// Update UI with most up to date weather data of searched location
export function updateUI(data, isMetric) {
  const current = data.currentConditions; // Current weather conditons
  const today = data.days[0]; // Weather data for today

  // Update the location display
  locationEl.textContent = data.resolvedAddress;

  // Get the timezone from the API, default to UTC if none are given
  const tz = data.timezone || "UTC";

  // Convert the current time from epoch to a Date object
  const currentTime = new Date(current.datetimeEpoch * 1000); // Convert from seconds to milliseconds

  // Set up formatters to handle the date and time display of most recent weather recording
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

  // Format the date and time
  const dateFormatted = formatter.format(currentTime);
  const timeFormatted = timeFormatter.format(currentTime);

  // Update the date/time display with the formatted date and time
  datetimeEl.innerHTML = `${dateFormatted} | ${timeFormatted} <span class="last-recorded">(Last Updated - Local Time)</span>`;

  // ##### Update the rest of the UI with the locations weather data #####
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

  // Format sunrise and sunset times from epoch to Date objects
  const sunriseTime = new Date(today.sunriseEpoch * 1000);
  const sunsetTime = new Date(today.sunsetEpoch * 1000);

  // Update the sunrise and sunset time on the UI
  sunriseEl.textContent = timeFormatter.format(sunriseTime);
  sunsetEl.textContent = timeFormatter.format(sunsetTime);

  // ##### Update the 5-day Forecast display with the locations expected data #####
  renderForecast(data.days.slice(1, 6)); // next 5 days
}

// Renders the 5-day Forecast on the UI
export function renderForecast(days) {
  forecastList.innerHTML = ""; // Clear the forecast list placeholder/old data
  days.forEach((day) => {
    // Create a new card for each forecasted day
    const div = document.createElement("div");
    div.classList.add("forecast-day");

    // Format the date to display the day of the week
    const date = new Date(day.datetime).toLocaleDateString(undefined, {
      weekday: "short",
    });

    // Add the forecast day content to the card (date, icon, temperatures)
    div.innerHTML = `
      <p class="forecast-date">${date}</p>
      <p class="forecast-icon">${getWeatherEmoji(day.icon)}</p>
      <p class="forecast-temp">${Math.round(day.tempmax)}° / ${Math.round(
      day.tempmin
    )}°</p>
    `;

    // Append the card to the forecast list
    forecastList.appendChild(div);
  });
}
