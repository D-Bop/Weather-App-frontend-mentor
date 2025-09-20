console.log("Script loaded");

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
        const WeatherDataFetch = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m`, 
            {
                headers: {
                    Accept: "application/json"
                }
            }
        );
        const weatherData = await WeatherDataFetch.json();
        console.log(weatherData) 
              
    }
    catch (error) {
        console.log(error)
    }
}
console.log(getWeatherData())
