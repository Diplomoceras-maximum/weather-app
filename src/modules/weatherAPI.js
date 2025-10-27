// ##### WeatherAPI.js #####

// Imports
import { API_KEY, BASE_URL } from "./config.js";
import { updateUI } from "./ui.js";
import { isMetric } from "./state.js";
import { showMessage } from "./utilities.js";

// Function makes an API request to the service, processes it, then updates the UI
export async function fetchWeather(location) {
  showMessage("");

  const unitGroup = isMetric ? "metric" : "us"; // "metric" for celsius, "us" for fahrenheit
  const url = `${BASE_URL}${encodeURIComponent(
    location
  )}?unitGroup=${unitGroup}&key=${API_KEY}&include=days,current`; // Add the searched location to the API url

  try {
    const res = await fetch(url); // Fetch data from the API
    if (!res.ok) throw new Error("Location not found"); // Error if location is not found
    const data = await res.json(); // Parse the API response as JSON
    updateUI(data, isMetric); // Update the UI with the fetched weather data
    showMessage(""); // Clear any previous messages
  } catch (err) {
    showMessage(err.message || "Unable to fetch weather", "error"); // Show error
  }
}
