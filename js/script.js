// console.log("Script loaded");
const city = document.querySelector(".city")
const temperature = document.querySelectorAll(".temp-display") 
const humidity = document.querySelector(".humidity")
const windSpeed = document.querySelector(".wind-speed")
const precipitation = document.querySelector(".precipitation")
const dropDownContent = document.querySelector(".content")
const daysDropdown = document.querySelector(".days-dropdown")
const daysList = document.querySelectorAll(".days-btn")
const currentHourlyDate = document.querySelector(".hourly-date")
const date = document.querySelector(".date")
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const daysForecast = document.querySelectorAll(".day")
const maxTemps = document.querySelectorAll(".max-temp")
const minTemps = document.querySelectorAll(".min-temp")
const dayIcon = document.querySelectorAll(".day-icon")
const presentDayIcon = document.querySelector(".todays-icon")

let dateObj = new Date();
let month = months[dateObj.getUTCMonth()];
let year = dateObj.getUTCFullYear();
const dayName = days[dateObj.getDay()];
date.innerHTML = `${dayName}, ${month} ${year}`;
const currentHour = dateObj.getHours();
const currentDate =dateObj.toISOString().split("T")[0];
console.log(currentDate)
console.log(currentHour)
daysList.forEach((dayBtn, index) => {
    dayBtn.innerHTML = days[index]
})


function toggleDropdown() { 
    dropDownContent.classList.toggle("hide")
    // daysList.classList.toggle("hide")
}

function daysDropDown() {
    daysDropdown.classList.toggle("hide")
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

currentHourlyDate.innerHTML = `${dayName}`

const getWeatherData = async(lat, lon) => {
    try {
        const cityName = document.querySelector(".search-bar").value;
        const weatherDataFetch = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min&hourly=temperature_2m,wind_speed_10m,relative_humidity_2m,apparent_temperature,precipitation_probability,rain,showers,snowfall,weather_code&current=wind_speed_10m,snowfall,showers,rain,relative_humidity_2m,precipitation,temperature_2m,weather_code`, 
            {
                headers: {
                    Accept: "application/json"
                }
            }
        );
        const weatherData = await weatherDataFetch.json();
        console.log(weatherData)

        // reverse geocoding to get city name from lat and long
        const geoCodeUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${weatherData.latitude}&lon=${weatherData.longitude}`;
        const geocodeResponse = await fetch(geoCodeUrl, {
            headers: {
                'User-Agent': 'YourWeatherApp/1.0 (official.og.owolabi@gmail.com)' // Required by Nominatim
            }
        }); 

        const geoCodeData = await geocodeResponse.json();
        // displaying api data on the page
        city.innerHTML = `${geoCodeData.address.city || geoCodeData.address.town || geoCodeData.address.village || "Unknown Location"}, ${geoCodeData.address.country}`;
        temperature.forEach ((temp) => { 
            temp.innerHTML = `${Math.round(weatherData.current.temperature_2m)}°`
        });
        humidity.innerHTML = `${weatherData.current.relative_humidity_2m}${weatherData.current_units.relative_humidity_2m}`
        windSpeed.innerHTML = `${Math.round(weatherData.current.wind_speed_10m)} ${weatherData.current_units.wind_speed_10m}`
        precipitation.innerHTML = `${weatherData.current.precipitation} ${weatherData.current_units.precipitation}`
        // Getting API DATE DATA and displaying day names
        const apiDates = weatherData.daily.time;
        apiDates.forEach((apiDate, index) => {
            const date = new Date(apiDate);
            const dayName = date.toLocaleString('en-US', { weekday: 'short' });
            // console.log(dayName);
            daysForecast[index].innerHTML = dayName;
        })
        // Getting API TEMP DATA and displaying day temps
        // Max temps
        const apiMaxTemps = weatherData.daily.temperature_2m_max;
        apiMaxTemps.forEach((apiMaxTemp, index) => { 
            maxTemps[index].innerHTML = `${Math.round(apiMaxTemp)}°`
        })
        // Min temps
        const apiMinTemps = weatherData.daily.temperature_2m_min;
        apiMinTemps.forEach((apiMinTemp, index) => {
            minTemps[index].innerHTML = `${Math.round(apiMinTemp)}°`
        })
        // Getting API WEATHER CODE DATA and displaying day weather icons
        const apiWeatherCodes = weatherData.daily.weather_code;
        apiWeatherCodes.forEach((apiWeatherCode, index) => {
            const iconPath = getWeatherIcon(apiWeatherCode);
            const imgElement = dayIcon[index]
            imgElement.src = iconPath;
            imgElement.alt = "Weather Icon";
            // console.log(imgElement.src=iconPath)
        })
        // Displaying present day weather icon
        const presentDayWeatherCode = weatherData.current.weather_code;
        const currentIcon = getWeatherIcon(presentDayWeatherCode);
        presentDayIcon.src = currentIcon;
        // Displaying hourly temperature.
        // console.log(weatherData.hourly.time)
        const hourlyTime = weatherData.hourly.time;
        const hourlyTemps =weatherData.hourly.temperature_2m;
        const hourlyWeatherCodes = weatherData.hourly.weather_code;
        console.log(hourlyTime)
        console.log(hourlyTemps)
        console.log(hourlyWeatherCodes)

        // creating an array for filtered data
        let filteredTimes = []; 
        let filteredTemps = [];
        let filteredWeatherCodes = [];

        // Filtering present day data

        if(Array.isArray(hourlyTime)) {
            hourlyTime.forEach((time, index) => {
                if(typeof time == "string") {
                    const timeStr = time.split("T")[1] //getting the time part of the iso date string
                    const dayStr = time.split("T")[0] // getting the date part of the iso date string
                    // console.log(dayStr)
                    if(dayStr === currentDate) {
                        filteredTimes.push(timeStr) //pushing present day's data to the array
                        filteredTemps.push(hourlyTemps[index])
                        filteredWeatherCodes.push(hourlyWeatherCodes[index])
                        // console.log(filteredTimes)
                    }
                } 
            })
            console.log(`Filtered Times: ${filteredTimes}`)
            console.log(`Filtered Temps: ${filteredTemps}`)
            console.log(`Filtered WeatherCode: ${filteredWeatherCodes}`) 
        }else{
            console.log("Hourly time is invalid")
        }

        // Getting the next 8 hours from the present date data
        const next8hours = filteredTimes.slice(currentHour, currentHour + 8);
        const next8hoursTemps = filteredTemps.slice(currentHour, currentHour + 8);
        const next8hoursWeatherCode = filteredWeatherCodes.slice(currentHour, currentHour + 8);
        console.log(next8hours)
        console.log(next8hoursTemps)
        console.log(next8hoursWeatherCode)
        // Displaying the next 8 hours data on the page
        if(next8hours.length === 8) {
            const hourlyBoxes = document.querySelectorAll(".box-1");
            hourlyBoxes.forEach((box, index) => {
                const timeElement = box.querySelector(".hour");
                const tempElement = box.querySelector(".time-temp p");
                const iconElement = box.querySelector("img");
                timeElement.innerHTML = next8hours[index]
                tempElement.innerHTML = `${Math.round(next8hoursTemps[index])}°` 
                const iconPath = getWeatherIcon(next8hoursWeatherCode[index]);
                iconElement.src = iconPath;
                iconElement.alt = "Weather Icon";
            })
        }
    }
    catch (error) {
        console.log(error)
    }
}

const getUserLocation = () => {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            let lat = position.coords.latitude;
            let long = position.coords.longitude;
            getWeatherData(lat, long)
        })
    } else {
        console.log("Geolocation is not supported by this browser.")
    }
}

// getUserLocation();

window.onload = getUserLocation;


