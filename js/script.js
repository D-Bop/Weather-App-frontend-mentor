// console.log("Script loaded");
const city = document.querySelector(".city")
const temperature = document.querySelectorAll(".temp-display") 
const humidity = document.querySelector(".humidity")
const windSpeed = document.querySelector(".wind-speed")
const precipitation = document.querySelector(".precipitation")
const dropDownContent = document.querySelector(".content")
const daysList = document.querySelector(".days-dropdown")
const date = document.querySelector(".date")
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const daysForecast = document.querySelectorAll(".day")
const maxTemps = document.querySelectorAll(".max-temp")
const minTemps = document.querySelectorAll(".min-temp")
const dayIcon = document.querySelectorAll(".day-icon")
const presentDayIcon = document.querySelector(".todays-icon")
// console.log(maxTemps)
// console.log(minTemps)

let dateObj = new Date();
let month = months[dateObj.getUTCMonth()];
let year = dateObj.getUTCFullYear();
const dayName = days[dateObj.getDay()];
// console.log(dayName);
date.innerHTML = `${dayName}, ${month} ${year}`;


function toggleDropdown() { 
    console.log("button clicked")
    dropDownContent.classList.toggle("hide")
}

function daysDropDown() {
    console.log("button clicked")
    daysList.classList.toggle("hide")
}

function getWeatherIcon(weatherCode) {
    const weatherIcons = {
        0: "assets/images/icon-sunny.webp",   // Clear sky
        1: "assets/images/icon-partly-cloudy.webp",  // Mainly clear
        2: "assets/images/icon-partly-cloudy.webp",  // Partly clear
        3: "assets/images/icon-overcast.webp",  // Overcast
        45: "assets/images/icon-fog.webp",  // fog
        48: "assets/images/icon-fog.webp",  // depositing rime fog
        51: "assets/images/icon-drizzle.webp",  // Drizzle: Light
        53: "assets/images/icon-drizzle.webp",  // Drizzle: Moderate
        55: "assets/images/icon-drizzle.webp",  // Drizzle: Dense intensity
        61: "assets/images/icon-rain.webp",  // Rain: Slight
        63: "assets/images/icon-rain.webp",  // Rain: Moderate
        65: "assets/images/icon-rain.webp",  // Rain: Heavy intensity
        71: "assets/images/icon-snow.webp",  // snow fall: Slight
        73: "assets/images/icon-snow.webp",  // snow fall: Moderate
        75: "assets/images/icon-snow.webp",  // snow fall: Heavy intensity
        80: "assets/images/icon-rain.webp",  // Rain showers: Slight
        81: "assets/images/icon-rain.webp",  // Rain showers: Moderate
        82: "assets/images/icon-rain.webp",  // Rain showers: Violent
        95: "assets/images/icon-storm.webp",  // Thunderstorm: Slight or moderate
        96: "assets/images/icon-storm.webp",  // Thunderstorm with slight hail
        99: "assets/images/icon-storm.webp"   // Thunderstorm with heavy hail
    };
    return weatherIcons[weatherCode]
}


const getWeatherData = async() => {
    try {
        const cityName = document.querySelector(".search-bar").value;
        const weatherDataFetch = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=6.4541&longitude=3.3947&daily=weather_code,temperature_2m_max,temperature_2m_min&hourly=temperature_2m,wind_speed_10m,relative_humidity_2m,apparent_temperature,precipitation_probability,rain,showers,snowfall&current=wind_speed_10m,snowfall,showers,rain,relative_humidity_2m,precipitation,temperature_2m,weather_code`, 
            {
                headers: {
                    Accept: "application/json"
                }
            }
        );
        const weatherData = await weatherDataFetch.json();
        console.log(weatherData)
        console.log(weatherData.daily.time)
        console.log(weatherData.daily.temperature_2m_max) 
        console.log(weatherData.daily.temperature_2m_min) 

        // reverse geocoding to get city name from lat and long
        const geoCodeUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${weatherData.latitude}&lon=${weatherData.longitude}`;
        const geocodeResponse = await fetch(geoCodeUrl, {
            headers: {
                'User-Agent': 'YourWeatherApp/1.0 (official.og.owolabi@gmail.com)' // Required by Nominatim
            }
        }); 

        const geoCodeData = await geocodeResponse.json();
        // console.log(geoCodeData);
        // displaying api data on the page
        city.innerHTML = `${geoCodeData.address.city || geoCodeData.address.town || geoCodeData.address.village || "Unknown Location"}, ${geoCodeData.address.country}`;
        temperature.forEach ((temp) => { 
            // console.log(temp)
            temp.innerHTML = `${Math.round(weatherData.current.temperature_2m)}°`
        });
        humidity.innerHTML = `${weatherData.current.relative_humidity_2m}${weatherData.current_units.relative_humidity_2m}`
        windSpeed.innerHTML = `${Math.round(weatherData.current.wind_speed_10m)} ${weatherData.current_units.wind_speed_10m}`
        precipitation.innerHTML = `${weatherData.current.precipitation} ${weatherData.current_units.precipitation}`
        // Getting API DATE DATA and displaying day names
        const apiDates = weatherData.daily.time;
        console.log(apiDates)
        apiDates.forEach((apiDate, index) => {
            const date = new Date(apiDate);
            const dayName = date.toLocaleString('en-US', { weekday: 'short' });
            // console.log(dayName);
            daysForecast[index].innerHTML = dayName;
        })
        // Getting API TEMP DATA and displaying day temps
        // Max temps
        const apiMaxTemps = weatherData.daily.temperature_2m_max;
        console.log(apiMaxTemps)
        apiMaxTemps.forEach((apiMaxTemp, index) => { 
            maxTemps[index].innerHTML = `${Math.round(apiMaxTemp)}°`
        })
        // Min temps
        const apiMinTemps = weatherData.daily.temperature_2m_min;
        console.log(apiMinTemps)
        apiMinTemps.forEach((apiMinTemp, index) => {
            minTemps[index].innerHTML = `${Math.round(apiMinTemp)}°`
        })
        // Getting API WEATHER CODE DATA and displaying day weather icons
        const apiWeatherCodes = weatherData.daily.weather_code;
        console.log(apiWeatherCodes)
        console.log(dayIcon.length)
        apiWeatherCodes.forEach((apiWeatherCode, index) => {
            const iconPath = getWeatherIcon(apiWeatherCode);
            console.log(iconPath);
            const imgElement = dayIcon[index]
            imgElement.src = iconPath;
            imgElement.alt = "Weather Icon";
            // console.log(imgElement.src=iconPath)
        })
        // Displaying present day weather icon
        const presentDayWeatherCode = weatherData.current.weather_code;
        console.log(presentDayWeatherCode)
        const currentIcon = getWeatherIcon(presentDayWeatherCode);
        presentDayIcon.src = currentIcon;

    }
    catch (error) {
        console.log(error)
    }
}
getWeatherData()