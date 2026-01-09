import { WEATHER_API_KEY, WEATHER_BASE_URL } from "../shared/constants.js";
import { saveData, getData } from "../shared/utils.js";

const input = document.getElementById("cityInput");
const btn = document.getElementById("searchBtn");
const output = document.getElementById("output");

btn.addEventListener("click", () => loadWeather(input.value.trim()));

async function loadWeather(city) {
  if (!city) return;
  output.innerHTML = "Loading...";

  try {
    const cache = getData("weather_cache");
    if (cache.city === city && Date.now() - cache.time < 600000) {
      render(cache.data, cache.forecast);
      return;
    }

    const [current, forecast] = await Promise.all([
      fetch(`${WEATHER_BASE_URL}weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`).then(r => r.json()),
      fetch(`${WEATHER_BASE_URL}forecast?q=${city}&appid=${WEATHER_API_KEY}&units=metric`).then(r => r.json())
    ]);

    saveData("weather_cache", {
      city,
      data: current,
      forecast,
      time: Date.now()
    });

    render(current, forecast);

  } catch {
    output.innerHTML = "Unable to fetch weather data.";
  }
}

function render(data, forecast) {
  const daily = forecast.list.filter(item => item.dt_txt.includes("12:00"));

  output.innerHTML = `
    <h2>${data.name}</h2>
    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">
    <p>${data.main.temp} °C</p>
    <p>${data.weather[0].description}</p>

    <div class="forecast">
      ${daily.map(day => `
        <div>
          <strong>${new Date(day.dt_txt).toLocaleDateString()}</strong>
          <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png">
          <p>${day.main.temp} °C</p>
        </div>
      `).join("")}
    </div>
  `;
}
