const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const loading = document.getElementById("loading");
const weatherInfo = document.getElementById("weatherInfo");

searchBtn.addEventListener("click", handleSearch);

// Adding Event listener on "Enter" key press in the search field
cityInput.addEventListener("keyup", function (event) {
  if (event.key === "Enter" && event.target.tagName === "INPUT") {
    handleSearch();
  }
});

// Search function
function handleSearch() {
  const cityName = cityInput.value;

  // Check if the trimmed value is empty or if it contains only spaces
  if (cityName.trim() === "" || /^\s+$/.test(cityName)) {
    showError("Invalid! Please enter a valid name.");
    return;
  }
  // Check if weatherInfo container exists
  let weatherInfoContainer = document.getElementById("weatherInfo");

  if (!weatherInfoContainer) {
    // If it doesn't exist, create a new container
    weatherInfoContainer = document.createElement("div");
    weatherInfoContainer.id = "weatherInfo";
    document.body.appendChild(weatherInfoContainer);
  }

  fetchWeather(cityName);
  showWeatherInfo();
}

// Function to fetch weather data from API
function fetchWeather(city) {
  const apiKey = "73c2f6a0a3b3813acf767bc05a8189da";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  loading.classList.remove("hidden");
  weatherInfo.innerHTML = "";

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Not Found! Please enter a valid city name.");
      }
      return response.json();
    })
    .then((data) => {
      displayWeather(data);
      setTheme(data);
    })
    .catch((error) => {
      showError(error.message);
    })
    .finally(() => {
      loading.classList.add("hidden");
    });
}

// Function to display weather information
function displayWeather(data) {
  const weatherInfoContainer = document.getElementById("weatherInfo");
  const iconCode = data.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

  weatherInfoContainer.innerHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <p class="temperature">${Math.round(data.main.temp)}°C</p>
        <img src="${iconUrl}" alt="${
    data.weather[0].description
  }" class="weather-icon">
        <p class="weather-description">${data.weather[0].description}</p>
        <p class="humidity">Humidity: ${data.main.humidity}%</p>
    `;
}

// Function to show error message
function showError(message) {
  const weatherInfo = document.getElementById("weatherInfo");
  weatherInfo.innerHTML = `<p class="error-msg">${message}</p>`;
  weatherInfo.classList.add("show");
}

// Function to set theme
function setTheme(data) {
  const date = new Date();
  const sunrise = new Date(data.sys.sunrise * 1000);
  const sunset = new Date(data.sys.sunset * 1000);
  const isDay = date >= sunrise && date < sunset;

  if (isDay) {
    setLightMode();
  } else {
    setDarkMode();
  }
}

// Function to set light mode
function setLightMode() {
  document.body.classList.remove("dark-mode");
  document.body.classList.add("light-mode");
}

// Function to set dark mode
function setDarkMode() {
  document.body.classList.remove("light-mode");
  document.body.classList.add("dark-mode");
}

// Function to show weather information
function showWeatherInfo() {
  const weatherInfoContainer = document.getElementById("weatherInfo");
  weatherInfoContainer.classList.add("show");
}
// Function to hide weather information
function hideWeatherInfo() {
  weatherInfo.classList.remove("show");
}
