//Select DOM Elements
let submitFormEl = document.querySelector("#searchBtn");
let inputEl = document.querySelector("#cityName");

//variables
let myKey = "52db57c9757e60965e92ca0e6d4c18a5";
let units = "units=imperial";
let storedCity = JSON.parse(localStorage.getItem("storedCity")) || [];
let city;
//get saved cities from local storage and display the as a list
function displaySearchedCity() {
  $("#storedCity").html("");
  for (let i = 0; i < storedCity.length; i++) {
    let li = document.createElement("button");
    $(li).attr("style", "width: 100%");
    li.textContent = storedCity[i];
    $("#storedCity").append(li);
    //add event listener to buttons to get and display weather
    $(li).on("click", function () {
      getWeather(li.textContent);
    });
  }
}
displaySearchedCity();

//fetch the current weather and forecast api's for the city the user inputs
function getWeather(city) {
  let currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${myKey}&${units}`;
  let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q= ${city}&appid=${myKey}&${units}`;
  currentWeather(currentUrl);
  fiveDayWeather(forecastUrl);
  inputEl.value = "";
  $(".futureForecast").html("");
}

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
  $(".currentWeather").html(
    `<h2>${data.name} (${currentDate.toLocaleDateString("en-US")})</h2> <figure>
    <img src="https://openweathermap.org/img/wn/${
      data.weather[0].icon
    }@2x.png"  alt="icon showing the weather"></figure><ul>  <li>Temp: ${
      data.main.temp
    }</li>
    <li>Wind: ${data.wind.speed} MPH</li>
    <li>Humidity: ${data.main.humidity} %</li></ul>`
  );
  getUv(data);
}
//function for fetching and displaying UV Index
async function getUv(data) {
  //query UV url by using the coord of the current city in the api for UV.
  let queryUv = `https://api.openweathermap.org/data/2.5/uvi?appid=${myKey}&lat=${data.coord.lat}&lon=${data.coord.lon}`;
  const response = await fetch(queryUv);
  const uv = await response.json();
  $(".currentWeather").append(`<p>UV Index: ${uv.value}</p>`);
}
//function to fetch 5 day weather
async function fiveDayWeather(forecastUrl) {
  const response = await fetch(forecastUrl);
  const data = await response.json();
  displayFiveDayWeather(data);
}

//function to display 5day weather forecast
function displayFiveDayWeather(data) {
  $("#text").text("5 Day Forecast");
  //use an array with numbers corresponding to the index of the data you want to extract
  let arr = [0, 8, 16, 24, 32];
  //loop over the array and create a div for each day with the weather conditions as list items
  arr.forEach(function (i) {
    let futureDate = new Date(data.list[i].dt * 1000);
    futureDate = futureDate.toLocaleDateString("en-US");
    $(".futureForecast").append(
      `<div>${futureDate}<img src="https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png" alt="icon showing the weather"> <ul><li>Temp: ${data.list[i].main.temp}</li><li>Wind: ${data.list[i].wind.speed} MPH</li><li>Humidity: ${data.list[i].main.humidity}%</li></ul></div`
    );
  });
}

//clear local storage
$("#clear").on("click", function () {
  localStorage.clear();
  $("#storedCity").html("");
});

//event listener and get city from user input or saved cities
submitFormEl.addEventListener("click", function () {
  city = inputEl.value;
  if (city === "") {
    return;
  }
  //store the searched city in an array in localStorage
  if (storedCity.indexOf(city) === -1) {
    storedCity.push(city);
    localStorage.setItem("storedCity", JSON.stringify(storedCity));
    displaySearchedCity();
  }
  getWeather(city);
});
