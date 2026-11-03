
let input = document.getElementById("input");
let display = document.getElementById("display");
let list = document.getElementById("list");
let searchBtn = document.getElementById("searchBtn");
let historyList = document.getElementById("historyList");

let history = JSON.parse(localStorage.getItem("history")) || [];

async function weather(city) {

    display.innerHTML = "Loading...";
    list.innerHTML = "";

    try {
        let api = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`);
        if (!api.ok)
        {
            throw new Error("city api wrong");
        }
        let data = await api.json();
        
        if (!data.results)
        {
            throw new Error("City not found");
        }

        
        let cityName = data.results[0].name;
        let latitude = data.results[0].latitude;
        let longitude = data.results[0].longitude;

        let api2 = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
        if (!api2.ok)
        {
            throw new Error("Weather not found");
        }
        let weatherData = await api2.json();

        display.innerHTML = "";

        let li1 = document.createElement("li");
        li1.innerHTML = "City: " + cityName;
        let li2 = document.createElement("li");
        li2.innerHTML = "Temperature: " + weatherData.current_weather.temperature + " °C";
        if(Number(weatherData.current_weather.temperature) > 30)
        {
            li2.style.color = "red";
        }
        else if(Number(weatherData.current_weather.temperature) < 20)
        {
            li2.style.color = "blue";
        }
        else
        {
            li2.style.color = "black";
        }
        let li3 = document.createElement("li");
        li3.innerHTML = "Wind Speed: " + weatherData.current_weather.windspeed + " km/h";

        list.appendChild(li1);
        list.appendChild(li2);
        list.appendChild(li3);

        history.unshift(city);
        history = history.slice(0, 5);
        localStorage.setItem("history", JSON.stringify(history));
        historyList.innerHTML = history.join("<br>");
    }
    catch(error)
    {
        display.innerHTML = "Error: " + error.message;
    }
}


input.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        let city = input.value.toLowerCase().trim();
        if (city === "") {
            display.innerHTML = "Please enter a city name";
        }
        else
        {
            weather(city);
        }
    }
});

searchBtn.addEventListener("click", function(event) {
    
        event.preventDefault();
        let city = input.value.toLowerCase().trim();
        if (city === "") {
            display.innerHTML = "Please enter a city name";
        }
        else
        {
            weather(city);
        }
});

historyList.innerHTML = history.join("<br>");

if (history.length > 0) {
    input.value = history[0];
    weather(history[0]);
}
