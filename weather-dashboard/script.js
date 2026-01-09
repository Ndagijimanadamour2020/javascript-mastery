// Replace with your actual OpenWeatherMap API key
const API_KEY = "YOUR_OPENWEATHER_API_KEY";
const BASE_URL = "https://api.openweathermap.org/data/2.5/";

const input = document.getElementById("cityInput");
const btn = document.getElementById("searchBtn");
const output = document.getElementById("weatherResult");

btn.addEventListener("click", () => {
  const city = input.value.trim();
  if (city) {
    fetchWeather(city);
  }
});

async function fetchWeather(city) {
  output.innerHTML = "Loading...";

  try {
    // Current weather
    const currentRes = await fetch(
      `${BASE_URL}weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    if (!currentRes.ok) throw new Error("City not found");
    const currentData = await currentRes.json();

    // 5-day forecast
    const forecastRes = await fetch(
      `${BASE_URL}forecast?q=${city}&appid=${API_KEY}&units=metric`
    );
    const forecastData = await forecastRes.json();

    renderWeather(currentData, forecastData);
  } catch (err) {
    output.innerHTML = `<p style="color:red">${err.message}</p>`;
  }
}

function renderWeather(current, forecast) {
  const daily = forecast.list.filter(item => item.dt_txt.includes("12:00"));

  output.innerHTML = `
    <h2>${current.name}, ${current.sys.country}</h2>
    <img src="https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png" alt="${current.weather[0].description}" />
    <p><strong>${current.main.temp} °C</strong></p>
    <p>${current.weather[0].description}</p>

    <div class="forecast">
      ${daily.map(day => `
        <div>
          <strong>${new Date(day.dt_txt).toLocaleDateString()}</strong>
          <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="${day.weather[0].description}" />
          <p>${day.main.temp} °C</p>
        </div>
      `).join("")}
    </div>
  `;
}
