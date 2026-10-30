/* ==========================================
   LIVE WEATHER APP
   API: Open-Meteo
   No backend required
   No API key required for this public endpoint
========================================== */

const API = {
    weather: "https://api.open-meteo.com/v1/forecast",
    geocoding: "https://geocoding-api.open-meteo.com/v1/search"
};


/* ==========================================
   ELEMENTS
========================================== */

const elements = {
    app: document.getElementById("weatherApp"),

    cityName: document.getElementById("cityName"),
    currentTemperature: document.getElementById("currentTemperature"),
    weatherDescription: document.getElementById("weatherDescription"),

    highTemperature: document.getElementById("highTemperature"),
    lowTemperature: document.getElementById("lowTemperature"),
    feelsLike: document.getElementById("feelsLike"),

    humidity: document.getElementById("humidity"),
    windSpeed: document.getElementById("windSpeed"),
    sunrise: document.getElementById("sunrise"),
    sunset: document.getElementById("sunset"),
    cloudCover: document.getElementById("cloudCover"),
    rainChance: document.getElementById("rainChance"),

    hourlyForecast: document.getElementById("hourlyForecast"),
    hourlyDetails: document.getElementById("hourlyDetails"),
    dailyForecast: document.getElementById("dailyForecast"),

    chartPath: document.getElementById("chartPath"),

    alertIcon: document.getElementById("alertIcon"),
    alertTitle: document.getElementById("alertTitle"),
    alertDescription: document.getElementById("alertDescription"),

    highlightTitle: document.getElementById("highlightTitle"),
    highlightDescription: document.getElementById("highlightDescription"),
    tomorrowTemperature: document.getElementById("tomorrowTemperature"),

    statusMessage: document.getElementById("statusMessage"),

    searchForm: document.getElementById("searchForm"),
    cityInput: document.getElementById("cityInput"),

    deviceTime: document.getElementById("deviceTime")
};


/* ==========================================
   APP STATE
========================================== */

let currentLocation = {
    name: "Lagos",
    latitude: 6.5244,
    longitude: 3.3792,
    country: "Nigeria"
};

let weatherData = null;
let showingExtendedHours = false;


/* ==========================================
   WEATHER CODE DESCRIPTIONS
========================================== */

function getWeatherInfo(code, isDay = 1) {

    if (code === 0) {
        return {
            description: "Clear",
            icon: isDay ? "☀️" : "🌙",
            theme: isDay ? "clear" : "night"
        };
    }

    if (code === 1) {
        return {
            description: "Mainly clear",
            icon: isDay ? "🌤️" : "🌙",
            theme: isDay ? "clear" : "night"
        };
    }

    if (code === 2) {
        return {
            description: "Partly cloudy",
            icon: "⛅",
            theme: "cloudy"
        };
    }

    if (code === 3) {
        return {
            description: "Overcast",
            icon: "☁️",
            theme: "cloudy"
        };
    }

    if ([45, 48].includes(code)) {
        return {
            description: "Foggy",
            icon: "🌫️",
            theme: "cloudy"
        };
    }

    if ([51, 53, 55].includes(code)) {
        return {
            description: "Drizzle",
            icon: "🌦️",
            theme: "rainy"
        };
    }

    if ([56, 57].includes(code)) {
        return {
            description: "Freezing drizzle",
            icon: "🌧️",
            theme: "rainy"
        };
    }

    if ([61, 63, 65].includes(code)) {
        return {
            description: "Rain",
            icon: "🌧️",
            theme: "rainy"
        };
    }

    if ([66, 67].includes(code)) {
        return {
            description: "Freezing rain",
            icon: "🌧️",
            theme: "rainy"
        };
    }

    if ([71, 73, 75, 77].includes(code)) {
        return {
            description: "Snow",
            icon: "❄️",
            theme: "cloudy"
        };
    }

    if ([80, 81, 82].includes(code)) {
        return {
            description: "Rain showers",
            icon: "🌦️",
            theme: "rainy"
        };
    }

    if ([85, 86].includes(code)) {
        return {
            description: "Snow showers",
            icon: "🌨️",
            theme: "cloudy"
        };
    }

    if ([95, 96, 99].includes(code)) {
        return {
            description: "Thunderstorm",
            icon: "⛈️",
            theme: "rainy"
        };
    }

    return {
        description: "Unknown conditions",
        icon: "🌡️",
        theme: "clear"
    };
}


/* ==========================================
   TEMPERATURE FORMATTING
========================================== */

function formatTemperature(value) {

    if (value === undefined || value === null || !Number.isFinite(value)) {
        return "--°";
    }

    return `${Math.round(value)}°`;
}


/* ==========================================
   TIME FORMATTING
========================================== */

function formatHour(dateString) {

    const date = new Date(dateString);

    return date.toLocaleTimeString([], {
        hour: "2-digit",
        hour12: false
    });
}


function formatClock(dateString) {

    const date = new Date(dateString);

    return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    });
}


function formatDay(dateString, index) {

    if (index === 0) {
        return "Today";
    }

    if (index === 1) {
        return "Tomorrow";
    }

    return new Date(dateString).toLocaleDateString([], {
        weekday: "short"
    });
}


/* ==========================================
   DEVICE CLOCK
========================================== */

function updateClock() {

    elements.deviceTime.textContent =
        new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        });

}

updateClock();

setInterval(updateClock, 30000);


/* ==========================================
   FETCH WEATHER
========================================== */

async function fetchWeather(latitude, longitude) {

    elements.statusMessage.textContent =
        "Getting the latest weather...";

    const params = new URLSearchParams({

        latitude,
        longitude,

        current: [
            "temperature_2m",
            "relative_humidity_2m",
            "apparent_temperature",
            "is_day",
            "precipitation",
            "rain",
            "showers",
            "weather_code",
            "cloud_cover",
            "wind_speed_10m"
        ].join(","),

        hourly: [
            "temperature_2m",
            "apparent_temperature",
            "precipitation_probability",
            "precipitation",
            "weather_code",
            "wind_speed_10m"
        ].join(","),

        daily: [
            "weather_code",
            "temperature_2m_max",
            "temperature_2m_min",
            "sunrise",
            "sunset",
            "precipitation_probability_max"
        ].join(","),

        timezone: "auto",
        forecast_days: 7,
        forecast_hours: 48
    });

    const response = await fetch(`${API.weather}?${params}`);

    if (!response.ok) {
        throw new Error(
            "Unable to retrieve weather data. Please try again."
        );
    }

    const data = await response.json();

    if (!data.current || !data.hourly || !data.daily) {
        throw new Error("The weather service returned incomplete data.");
    }

    weatherData = data;

    renderWeather(data);

    elements.statusMessage.textContent =
        `Updated at ${formatClock(data.current.time)} local time`;

}


/* ==========================================
   RENDER ALL WEATHER DATA
========================================== */

function renderWeather(data) {

    renderCurrentWeather(data);
    renderHourlyForecast(data);
    renderDailyForecast(data);
    renderWeatherDetails(data);
    renderHighlights(data);
    updateBackground(data.current);
}


/* ==========================================
   CURRENT WEATHER
========================================== */

function renderCurrentWeather(data) {

    const current = data.current;
    const daily = data.daily;

    const weather = getWeatherInfo(
        current.weather_code,
        current.is_day
    );

    const todayIndex = Math.max(
        0,
        daily.time.indexOf(current.time.slice(0, 10))
    );

    elements.currentTemperature.textContent =
        formatTemperature(current.temperature_2m);

    elements.weatherDescription.textContent =
        weather.description;

    elements.highTemperature.textContent =
        formatTemperature(daily.temperature_2m_max[todayIndex]);

    elements.lowTemperature.textContent =
        formatTemperature(daily.temperature_2m_min[todayIndex]);

    elements.feelsLike.textContent =
        formatTemperature(current.apparent_temperature);

}


/* ==========================================
   HOURLY FORECAST
========================================== */

function renderHourlyForecast(data) {

    const hourly = data.hourly;

    const currentTime = new Date(data.current.time).getTime();

    let indexes = [];

    for (let i = 0; i < hourly.time.length; i++) {

        const hourTime = new Date(hourly.time[i]).getTime();

        if (hourTime >= currentTime) {
            indexes.push(i);
        }

    }

    if (!showingExtendedHours) {
        indexes = indexes.slice(0, 6);
    } else {
        indexes = indexes.slice(0, 48);
    }

    elements.hourlyForecast.innerHTML = "";

    elements.hourlyDetails.innerHTML = "";

    const chartTemperatures = [];

    indexes.forEach((index, position) => {

        const time = hourly.time[index];

        const temperature = hourly.temperature_2m[index];

        const code = hourly.weather_code[index];

        const rainProbability =
            hourly.precipitation_probability[index] ?? 0;

        const info = getWeatherInfo(code, 1);

        chartTemperatures.push(temperature);

        const item = document.createElement("div");

        item.className = "hour-item";

        const timeLabel =
            position === 0
                ? "Now"
                : formatHour(time);

        item.innerHTML = `
            <span class="hour-time">${timeLabel}</span>

            <span class="hour-icon">${info.icon}</span>

            <span class="hour-temp">
                ${formatTemperature(temperature)}
            </span>

            <span class="hour-rain">
                ${Math.round(rainProbability)}%
            </span>
        `;

        elements.hourlyForecast.appendChild(item);

        const detail = document.createElement("div");

        detail.className = "hourly-detail";

        detail.textContent = `${Math.round(
            hourly.wind_speed_10m[index] ?? 0
        )}`;

        elements.hourlyDetails.appendChild(detail);

    });

    drawTemperatureChart(chartTemperatures);

    document.getElementById("showMoreHours").innerHTML =
        showingExtendedHours
            ? "Show fewer hours <span>›</span>"
            : "Next 48 hours <span>›</span>";

    document.getElementById("hourlyDate").textContent =
        showingExtendedHours ? "Next 48 hours" : "Today";

}


/* ==========================================
   TEMPERATURE GRAPH
========================================== */

function drawTemperatureChart(temperatures) {

    if (!temperatures.length) {
        elements.chartPath.setAttribute("d", "");
        return;
    }

    const width = 340;
    const height = 65;
    const padding = 5;

    const minimum = Math.min(...temperatures) - 2;
    const maximum = Math.max(...temperatures) + 2;

    const difference = maximum - minimum || 1;

    const points = temperatures.map((temperature, index) => {

        const x =
            temperatures.length === 1
                ? width / 2
                : padding +
                  (index / (temperatures.length - 1)) *
                  (width - padding * 2);

        const y =
            height -
            ((temperature - minimum) / difference) *
            (height - 10);

        return { x, y };
    });

    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 1; i < points.length; i++) {

        const previous = points[i - 1];

        const current = points[i];

        const middleX = (previous.x + current.x) / 2;

        path +=
            ` Q ${middleX} ${previous.y}, ${current.x} ${current.y}`;

    }

    elements.chartPath.setAttribute("d", path);

}


/* ==========================================
   DAILY FORECAST
========================================== */

function renderDailyForecast(data) {

    const daily = data.daily;

    elements.dailyForecast.innerHTML = "";

    daily.time.forEach((date, index) => {

        const info = getWeatherInfo(
            daily.weather_code[index],
            1
        );

        const high = daily.temperature_2m_max[index];

        const low = daily.temperature_2m_min[index];

        const rain =
            daily.precipitation_probability_max[index] ?? 0;

        const item = document.createElement("div");

        item.className = "daily-item";

        item.innerHTML = `
            <span class="daily-day">
                ${formatDay(date, index)}
            </span>

            <span class="daily-icon">
                ${info.icon}
            </span>

            <span class="daily-rain">
                ${Math.round(rain)}%
            </span>

            <span class="daily-low">
                ${formatTemperature(low)}
            </span>

            <span class="daily-high">
                ${formatTemperature(high)}
            </span>
        `;

        elements.dailyForecast.appendChild(item);

    });

}


/* ==========================================
   WEATHER DETAILS
========================================== */

function renderWeatherDetails(data) {

    const current = data.current;

    const daily = data.daily;

    const todayIndex = Math.max(
        0,
        daily.time.indexOf(current.time.slice(0, 10))
    );

    elements.humidity.textContent =
        `${Math.round(current.relative_humidity_2m)}%`;

    elements.windSpeed.textContent =
        `${Math.round(current.wind_speed_10m)} km/h`;

    elements.cloudCover.textContent =
        `${Math.round(current.cloud_cover)}%`;

    elements.rainChance.textContent =
        `${Math.round(
            daily.precipitation_probability_max[todayIndex] ?? 0
        )}%`;

    elements.sunrise.textContent =
        formatClock(daily.sunrise[todayIndex]);

    elements.sunset.textContent =
        formatClock(daily.sunset[todayIndex]);

}


/* ==========================================
   WEATHER HIGHLIGHTS
========================================== */

function renderHighlights(data) {

    const current = data.current;

    const daily = data.daily;

    const todayIndex = Math.max(
        0,
        daily.time.indexOf(current.time.slice(0, 10))
    );

    const tomorrowIndex = Math.min(
        todayIndex + 1,
        daily.time.length - 1
    );

    const todayHigh = daily.temperature_2m_max[todayIndex];

    const tomorrowHigh =
        daily.temperature_2m_max[tomorrowIndex];

    const rainChance =
        daily.precipitation_probability_max[todayIndex] ?? 0;

    elements.tomorrowTemperature.textContent =
        formatTemperature(tomorrowHigh) + "C";

    if (todayHigh >= 35) {

        elements.alertIcon.textContent = "🌡️";

        elements.alertTitle.textContent = "Very hot weather";

        elements.alertDescription.textContent =
            `Today's forecast reaches ${Math.round(todayHigh)}°C. ` +
            "Drink water regularly and avoid prolonged exposure to extreme heat.";

        elements.highlightTitle.textContent =
            "Rising temperatures";

        elements.highlightDescription.textContent =
            "Expect hot conditions. Stay hydrated and take breaks in the shade.";

    } else if (rainChance >= 60) {

        elements.alertIcon.textContent = "🌧️";

        elements.alertTitle.textContent = "Rain may be on the way";

        elements.alertDescription.textContent =
            `There is a ${Math.round(rainChance)}% chance of precipitation today.`;

        elements.highlightTitle.textContent =
            "Possible rainfall";

        elements.highlightDescription.textContent =
            "Consider carrying an umbrella if you are heading outside.";

    } else {

        elements.alertIcon.textContent = "☀️";

        elements.alertTitle.textContent = "Today's weather";

        elements.alertDescription.textContent =
            `The expected high is ${Math.round(todayHigh)}°C. ` +
            "Check the hourly forecast for changes throughout the day.";

        elements.highlightTitle.textContent =
            "Weather outlook";

        elements.highlightDescription.textContent =
            `Tomorrow's high is expected to reach ${Math.round(tomorrowHigh)}°C.`;

    }

}


/* ==========================================
   BACKGROUND THEMING
========================================== */

function updateBackground(current) {

    const info = getWeatherInfo(
        current.weather_code,
        current.is_day
    );

    elements.app.classList.remove(
        "night",
        "rainy",
        "cloudy"
    );

    if (info.theme !== "clear") {
        elements.app.classList.add(info.theme);
    }

}


/* ==========================================
   SEARCH CITY
========================================== */

async function searchCity(city) {

    const query = city.trim();

    if (!query) {
        elements.statusMessage.textContent =
            "Please enter a city name.";
        return;
    }

    elements.statusMessage.textContent =
        "Searching for your city...";

    try {

        const params = new URLSearchParams({
            name: query,
            count: 1,
            language: "en",
            format: "json"
        });

        const response = await fetch(
            `${API.geocoding}?${params}`
        );

        if (!response.ok) {
            throw new Error("Unable to search for that city.");
        }

        const result = await response.json();

        if (!result.results || result.results.length === 0) {
            throw new Error(
                "City not found. Check the spelling and try again."
            );
        }

        const place = result.results[0];

        currentLocation = {
            name: place.name,
            latitude: place.latitude,
            longitude: place.longitude,
            country: place.country || ""
        };

        elements.cityName.textContent = place.name;

        await fetchWeather(
            place.latitude,
            place.longitude
        );

        elements.searchForm.classList.add("hidden");

        elements.cityInput.value = "";

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    } catch (error) {

        elements.statusMessage.textContent = error.message;

    }

}


/* ==========================================
   GET USER'S LOCATION
========================================== */

function getUserLocation() {

    if (!navigator.geolocation) {

        elements.statusMessage.textContent =
            "Geolocation is not supported by this browser.";

        return;
    }

    elements.statusMessage.textContent =
        "Requesting your location permission...";

    navigator.geolocation.getCurrentPosition(

        async position => {

            const latitude = position.coords.latitude;

            const longitude = position.coords.longitude;

            try {

                currentLocation = {
                    name: "My location",
                    latitude,
                    longitude,
                    country: ""
                };

                elements.cityName.textContent = "My location";

                await fetchWeather(latitude, longitude);

                /*
                 * The browser provides coordinates, not a city name.
                 * Weather is fetched directly from those coordinates.
                 */

            } catch (error) {

                elements.statusMessage.textContent = error.message;

            }

        },

        error => {

            const messages = {
                1: "Location permission was denied. Search for a city instead.",
                2: "Your location is currently unavailable.",
                3: "Location request timed out."
            };

            elements.statusMessage.textContent =
                messages[error.code] ||
                "Unable to access your location.";

        },

        {
            enableHighAccuracy: false,
            timeout: 12000,
            maximumAge: 300000
        }

    );

}


/* ==========================================
   EVENT LISTENERS
========================================== */

document.getElementById("openSearch").addEventListener(
    "click",
    () => {

        elements.searchForm.classList.toggle("hidden");

        if (!elements.searchForm.classList.contains("hidden")) {
            elements.cityInput.focus();
        }

    }
);


document.getElementById("closeSearch").addEventListener(
    "click",
    () => {

        elements.searchForm.classList.add("hidden");

    }
);


elements.searchForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();

        searchCity(elements.cityInput.value);

    }
);


document.getElementById("refreshWeather").addEventListener(
    "click",
    async () => {

        try {

            await fetchWeather(
                currentLocation.latitude,
                currentLocation.longitude
            );

        } catch (error) {

            elements.statusMessage.textContent = error.message;

        }

    }
);


document.getElementById("locationButton").addEventListener(
    "click",
    getUserLocation
);


document.getElementById("searchNavigation").addEventListener(
    "click",
    () => {

        elements.searchForm.classList.remove("hidden");

        elements.cityInput.focus();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }
);


document.getElementById("homeButton").addEventListener(
    "click",
    () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }
);


document.getElementById("forecastButton").addEventListener(
    "click",
    () => {

        document.querySelector(".daily-card").scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }
);


document.getElementById("showMoreHours").addEventListener(
    "click",
    () => {

        showingExtendedHours = !showingExtendedHours;

        if (weatherData) {
            renderHourlyForecast(weatherData);
        }

    }
);


/* ==========================================
   INITIALIZE APP
========================================== */

async function initializeWeatherApp() {

    try {

        await fetchWeather(
            currentLocation.latitude,
            currentLocation.longitude
        );

    } catch (error) {

        elements.statusMessage.textContent =
            "Unable to load weather. Check your internet connection and refresh.";

        elements.weatherDescription.textContent =
            "Weather unavailable";

    }

}

initializeWeatherApp();


/* ==========================================
   AUTO-REFRESH WEATHER
========================================== */

/*
 * Refresh weather every 15 minutes.
 * This updates the forecast from the API.
 */

setInterval(async () => {

    try {

        await fetchWeather(
            currentLocation.latitude,
            currentLocation.longitude
        );

    } catch (error) {

        console.warn("Automatic weather refresh failed:", error);

    }

}, 15 * 60 * 1000);