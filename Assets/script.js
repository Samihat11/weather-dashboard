//Select DOM Elements
let submitFormEl = document.querySelector("#searchBtn");
let inputEl = document.querySelector("#cityName");

//variables
let myKey = "52db57c9757e60965e92ca0e6d4c18a5";
let units = "units=imperial";
let storedCity = JSON.parse(localStorage.getItem("storedCity")) || [];
let city;

function displaySearchedCity() {
  storedCity.forEach(function (i) {
    $("#storedCity").append(`<li>${i}</li>`);
  });
  console.log(storedCity);
}
displaySearchedCity();

//fetch the current weather api for the city the user inputs
function getWeather(e) {
  e.preventDefault();
  city = inputEl.value;
  if (city === "") {
    return;
  }
  if (storedCity.indexOf(city) === -1) {
    storedCity.push(city);
    localStorage.setItem("storedCity", JSON.stringify(storedCity));
  }
  let currentUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${myKey}&${units}`;
  let forecastUrl = `http://api.openweathermap.org/data/2.5/forecast?q= ${city}&appid=${myKey}&${units}`;
  currentWeather(currentUrl);
  fiveDayWeather(forecastUrl);
  inputEl.value = "";
  reset();
}

function reset() {}
//add event listener to search city form
submitFormEl.addEventListener("click", getWeather);

//function to fetch current weather
async function currentWeather(currentUrl) {
  const response = await fetch(currentUrl);
  const data = await response.json();
  displayCurrentWeather(data);
}
//function to display the current weather
function displayCurrentWeather(data) {
  //append city name, date, and icon to current weather section
  let currentDate = new Date(data.dt * 1000);
  $(".currentWeather").attr("style", "border: 1px solid black");
  $("#city").append(
    `${data.name} (${currentDate.toLocaleDateString("en-US")})`
  );
  $("figure").append(
    `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png"  alt="icon showing the weather">`
  );

  //append conditions to ul
  $(".current").append(
    `<li>Temp: ${data.main.temp}</li>`,
    `<li>Wind: ${data.wind.speed} MPH</li>`,
    `<li>Humidity: ${data.main.humidity} %</li>`
  );
  getUv(data);
}
//function for fetching and displaying UV Index
async function getUv(data) {
  //query UV url by using the coord of the current city in the api for UV.
  let queryUv = `https://api.openweathermap.org/data/2.5/uvi?appid=${myKey}&lat=${data.coord.lat}&lon=${data.coord.lon}`;
  const response = await fetch(queryUv);
  const uv = await response.json();
  $(".current").append(`<li>UV Index: ${uv.value}`);
}
//function to fetch 5 day weather
async function fiveDayWeather(forecastUrl) {
  const response = await fetch(forecastUrl);
  const data = await response.json();
  displayFiveDayWeather(data);
}
function displayFiveDayWeather(data) {
  $("#text").text("5 Day Forecast");
  //since the weather forecast conditions are in an array use an array with numbers corresponding with the index of the data you want to extract
  let arr = [0, 8, 16, 24, 32];
  //loop over the array and create an li for each condition
  arr.forEach(function (i) {
    let futureDate = new Date(data.list[i].dt * 1000);
    futureDate = futureDate.toLocaleDateString("en-US");
    $(".futureForecast").append(
      `<div>${futureDate}<img src="https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png" alt="icon showing the weather"> <ul><li>Temp: ${data.list[i].main.temp}</li><li>Wind: ${data.list[i].wind.speed} MPH</li><li>Humidity: ${data.list[i].main.humidity}%</li></ul></div`
    );
  });
}
