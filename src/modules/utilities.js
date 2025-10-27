// ##### Utilities.js #####

// Imports
import { messageBox } from "./dom.js";

// Function that displays a relevant weather icon for each weather condition
export function getWeatherEmoji(icon) {
  const map = {
    "clear-day": "☀️", // Sunny day
    "clear-night": "🌙", // Clear night
    "partly-cloudy-day": "⛅", // Partly cloudy day
    "partly-cloudy-night": "☁️", // Partly cloudy night
    cloudy: "☁️", // Cloudy
    rain: "🌧️", // Raining
    "showers-day": "🌦️", // Raining during the day
    "showers-night": "🌦️", // Raining during the night
    thunderstorm: "⛈️", // Thunderstorms
    snow: "❄️", // Snow
    fog: "🌫️", // Fog
  };
  return map[icon] || "❓"; // Default if icon is unknown
}

// Function to show an error message
export function showMessage(msg) {
  // If no message is passed, hide the message box
  if (!msg) {
    messageBox.classList.add("hidden");
    messageBox.textContent = "";
    return;
  }
  messageBox.textContent = msg; // Set the error message text
  messageBox.className = ""; // Reset previous message classes
  messageBox.classList.add("error"); // Add the "error" class to messages for styling
  messageBox.classList.remove("hidden");
}
