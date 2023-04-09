const search_toggle_btn = document.querySelector(".search-toggle-btn");
const close_btn = document.querySelector(".close-btn");
const search_bar = document.querySelector(".search-bar");
const unit_togglers = document.querySelectorAll(".unit-togglers button");
const accessKey = "b973e4e8f0f360eb0c5f3fbd675bb7c2";
const search_btn = document.querySelector(".search-btn");
const input = document.querySelector(".search-section input");
const temperature = document.querySelector(".temperature .number");
const weather = document.querySelector(".weather");
const weather_img = document.querySelector(".weather-img-container img");
const location_name = document.querySelector(".location-name");
const calendar = document.querySelector(".calendar");
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const wind_speed = document.querySelector(".wind .number");
const wind_compass = document.querySelector(".wind .indicator img");
const wind_direction = document.querySelector(".wind .abbreviation");
const humidity = document.querySelector(".humidity .number");
const humidity_progress = document.querySelector(".humidity .progress-done");
const visibility = document.querySelector(".visibility .number");
const air_pressure = document.querySelector(".air-pressure .number");
const daily_forecast_cards = document.querySelector(".daily-forecast-cards");
search_toggle_btn.addEventListener("click", () =>
  search_bar.classList.add("active")
);
close_btn.addEventListener("click", () =>
  search_bar.classList.remove("active")
);

unit_togglers.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    unit_togglers.forEach((btn) => btn.classList.remove("active"));
    btn.classList.add("active");
     if (btn.classList.contains("celsius-toggle-btn")) getWeather("metric", "&#8451;")
     else getWeather("imperial", "&#8457;")
  });
});

search_btn.addEventListener("click", () => {
  getWeather("metric", "&#8451;")
});
function getWeather(unit, symbol) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${input.value}&appid=${accessKey}&units=${unit}`
  )
    .then((res) => res.json())
    .then((data) => {
      updateWeather(data, symbol);
      const coord = data.coord;
      const lat = coord.lat;
      const lon = coord.lon;
      updateWeatherForcast(lat, lon, unit, symbol);
      close_btn.click();
    });
}

function updateWeather(data, symbol) {
  // update the main weather
  weather_img.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
  temperature.innerText = `${Math.round(data.main.temp)}`;
  weather.innerText = data.weather[0].main;
  location_name.innerText = data.name;
  // Show today's date
  const day = new Date().getDay();
  const date = new Date().getDate();
  const month_num = new Date().getMonth();
  calendar.innerText = `${weekday[day]}, ${date} ${months[month_num]}`;
  // update today's highlights
  wind_speed.innerText = (data.wind.speed * 2.236936).toFixed(2);
  const wind_deg = data.wind.deg;
  wind_compass.style.transform = `rotate(${wind_deg}deg)`;
 // wind_direction.innerText = degToCompass(wind_deg);
  if (wind_deg >= 348.75) wind_direction.innerText = "N"
  else if (wind_deg >= 11.25 && wind_deg < 33.75) wind_direction.innerText = "NNE";
  else if (wind_deg >= 33.75 && wind_deg < 56.25) wind_direction.innerText = "NE";
  else if (wind_deg >= 56.25 && wind_deg < 78.75) wind_direction.innerText = "ENE";
  else if (wind_deg >= 78.75 && wind_deg < 101.25) wind_direction.innerText = "E";
  else if (wind_deg >= 101.25 && wind_deg < 123.75) wind_direction.innerText = "ESE";
  else if (wind_deg >= 123.75 && wind_deg < 146.25) wind_direction.innerText = "SE";
  else if (wind_deg >= 146.25 && wind_deg < 168.75) wind_direction.innerText = "SSE";
  else if (wind_deg >= 168.75 && wind_deg < 191.25) wind_direction.innerText = "S";
  else if (wind_deg >= 191.25 && wind_deg < 213.75) wind_direction.innerText = "SSW";
  else if (wind_deg >= 213.75 && wind_deg < 236.25) wind_direction.innerText = "SW";
  else if (wind_deg >= 236.25 && wind_deg < 258.75) wind_direction.innerText = "WSW";
  else if (wind_deg >= 258.75 && wind_deg < 281.25) wind_direction.innerText = "W";
  else if (wind_deg >= 281.25 && wind_deg < 303.75) wind_direction.innerText = "WNW";
  else if (wind_deg >= 303.75 && wind_deg < 326.25) wind_direction.innerText = "NW";
  else if (wind_deg >= 326.25 && wind_deg < 348.75) wind_direction.innerText = "NNW";
  humidity.innerText = data.main.humidity;
  humidity_progress.style.width = data.main.humidity + "%";
  visibility.innerText = (data.visibility * 0.000621).toFixed(1);
  air_pressure.innerText = data.main.pressure;
}

function updateWeatherForcast(lat, lon, unit, symbol) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${accessKey}&units=${unit}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const forecastDays = data.list.filter((data) => {
        const dataClock = data.dt_txt.split(" ")[1];
        return dataClock == "00:00:00";
      });
      daily_forecast_cards.innerHTML = "";
      forecastDays.forEach((day) => {
        const dataCalendar = day.dt_txt.split(" ")[0];
        const date = new Date(dataCalendar);
        const forecastDay = date.getDay();
        const forecastDate = date.getDate();
        const forecastMonth = date.getMonth();
        const article = document.createElement("article");
        article.innerHTML = `
        <div class="time">
              <span class="day">${weekday[forecastDay]},  ${forecastDate} ${
          months[forecastMonth]
        }</span>
            </div>
            <div class="weather-img-container">
              <img src="Sleet.png;" />
            </div>
            <div class="temperature">
              <span class="min">${Math.round(day.main.temp_min)} ${symbol}</span>
              <span class="max">${Math.round(day.main.temp_max)} ${symbol}</span>
            </div>
        `;
        daily_forecast_cards.appendChild(article);
        const firstCard = daily_forecast_cards.querySelector("article");
        const firstCardDay = firstCard.querySelector(".day")
        firstCardDay.innerText = "Tomorrow"
        const img = article.querySelector("img");
        img.src = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;
      });
    })
    .catch((err) => console.log(err));
}
/*
function degToCompass(num) {
  const val = Math.floor(num / 22.5 + 0.5);
  const arr = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];
  return arr[val % 32];
}*/
// Toggle the temperature units based on the buttons clicked
  // refactor the code to a reusable one to recall the api with different unit
// Add the city searched to location and add it to dom so that user can click the cities and show the weather according to that
// update the data based on user geolocation
// Bonus: automatically update it based on user's IP address
// Bonus: use the latest version of api, like the translation of city names to coordinates for accurate and latest data
