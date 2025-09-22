console.log("Script loaded");
const city = document.querySelector(".city")
const dropDownContent = document.querySelector(".content")
const daysList = document.querySelector(".days-dropdown")
const date = document.querySelector(".date")
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

let dateObj = new Date();
let month = months[dateObj.getUTCMonth()];
let year = dateObj.getUTCFullYear();
const dayName = days[dateObj.getDay()];
console.log(dayName);
date.innerHTML = `${dayName}, ${month} ${year}`;


function toggleDropdown() { 
    console.log("button clicked")
    dropDownContent.classList.toggle("hide")
}

function daysDropDown() {
    console.log("button clicked")
    daysList.classList.toggle("hide")
}

const getWeatherData = async() => {
    try {
        const cityName = document.querySelector(".search-bar").value;
        const weatherDataFetch = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=6.4541&longitude=3.3947&daily=temperature_2m_max,temperature_2m_min&hourly=temperature_2m,wind_speed_10m,relative_humidity_2m,apparent_temperature,precipitation_probability,rain,showers,snowfall&current=wind_speed_10m,snowfall,showers,rain,relative_humidity_2m,precipitation,temperature_2m`, 
            {
                headers: {
                    Accept: "application/json"
                }
            }
        );
        const weatherData = await weatherDataFetch.json();
        console.log(weatherData.latitude) 
        console.log(weatherData.longitude) 
        // console.log(weatherData.current.wind_speed_10m)

        // reverse geocoding to get city name from lat and long
        const geoCodeUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${weatherData.latitude}&lon=${weatherData.longitude}`;
        const geocodeResponse = await fetch(geoCodeUrl, {
            headers: {
                'User-Agent': 'YourWeatherApp/1.0 (official.og.owolabi@gmail.com)' // Required by Nominatim
            }
        }); 

        const geoCodeData = await geocodeResponse.json();
        console.log(geoCodeData);
        city.innerHTML = `${geoCodeData.address.city || geoCodeData.address.town || geoCodeData.address.village || "Unknown Location"}, ${geoCodeData.address.country}`;
    }
    catch (error) {
        console.log(error)
    }
}
getWeatherData()
