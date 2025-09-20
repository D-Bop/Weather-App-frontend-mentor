console.log("Script loaded");

const dropDownContent = document.querySelector(".content")
const daysList = document.querySelector(".days-dropdown")

function toggleDropdown() { 
    console.log("button clicked")
    dropDownContent.classList.toggle("hide")
}

function daysDropDown() {
    console.log("button clicked")
    daysList.classList.toggle("hide")
}
