// ##### EventListeners.js #####

// Imports
import { fetchWeather } from "./weatherAPI.js";
import { fetchBtn, searchInput, unitToggleBtn } from "./dom.js";
import { isMetric, updateIsMetric } from "./state.js";

// Function for the event listeners
export function setupEventListeners() {
  // Event listener for the Search button to fetch the weather data
  fetchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (query) fetchWeather(query);
  });

  // Event listener for pressing "Enter" in the search input field
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const query = searchInput.value.trim();
      if (query) fetchWeather(query);
    }
  });

  // Event listener for toggling between metric and imperial units
  unitToggleBtn.addEventListener("click", () => {
    updateIsMetric(!isMetric);
    unitToggleBtn.textContent = isMetric ? "°C" : "°F";
    const query = searchInput.value.trim();
    if (query) fetchWeather(query);
  });
}
