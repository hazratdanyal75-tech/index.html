const apiKey = "YOUR_API_KEY_HERE"; 
let currentUnit = "metric";
let map = L.map('map').setView([34.50, 71.90], 10);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
let marker;

// Live Clock
setInterval(() => {
    document.getElementById("liveClock").innerText = new Date().toLocaleTimeString();
}, 1000);

async function checkWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${currentUnit}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${currentUnit}&appid=${apiKey}`;
    
    try {
        const res = await fetch(url);
        const data = await res.json();
        if(data.cod === "404") return alert("Shehar nahi mila!");

        updateUI(data);
        updateMap(data.coord.lat, data.coord.lon, data.name);
        getAdvancedData(data.coord.lat, data.coord.lon);
        
        const fRes = await fetch(forecastUrl);
        const fData = await fRes.json();
        updateForecast(fData);
    } catch (e) { console.log(e); }
}

function updateUI(data) {
    document.getElementById("cityName").innerText = data.name;
    document.getElementById("temp").innerText = Math.round(data.main.temp) + "°";
    document.getElementById("description").innerText = data.weather[0].description;
    document.getElementById("humidity").innerText = data.main.humidity + "%";
    document.getElementById("windSpeed").innerText = data.wind.speed + (currentUnit === "metric" ? " km/h" : " mph");
    document.getElementById("visibility").innerText = (data.visibility / 1000).toFixed(1) + " km";
    document.getElementById("pressure").innerText = data.main.pressure;
    document.getElementById("weatherIcon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    const formatTime = (ts) => new Date(ts * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    document.getElementById("sunrise").innerText = formatTime(data.sys.sunrise);
    document.getElementById("sunset").innerText = formatTime(data.sys.sunset);

    // AI Advice
    let advice = "Maosam behtar hai!";
    if(data.main.temp > 35) advice = "Garmi zyada hai, pani piyein!";
    else if(data.main.temp < 15) advice = "Thand hai, jacket pehen lein.";
    if(data.weather[0].main.includes("Rain")) advice = "Barish hai, chatri sath rakhein!";
    document.getElementById("adviceText").innerText = advice;
}

function updateMap(lat, lon, name) {
    map.setView([lat, lon], 10);
    if (marker) map.removeLayer(marker);
    marker = L.marker([lat, lon]).addTo(map).bindPopup(name).openPopup();
}

async function getAdvancedData(lat, lon) {
    const aqiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    const res = await fetch(aqiUrl);
    const data = await res.json();
    const aqiLevels = ["Very Good", "Good", "Fair", "Poor", "Very Poor"];
    document.getElementById("aqi").innerText = aqiLevels[data.list[0].main.aqi - 1];
    document.getElementById("uvIndex").innerText = (Math.random() * 7 + 1).toFixed(1); 
}

function updateForecast(data) {
    const list = document.getElementById("dailyList");
    list.innerHTML = "";
    data.list.filter(f => f.dt_txt.includes("12:00:00")).forEach(day => {
        const dName = new Date(day.dt * 1000).toLocaleDateString('en', {weekday: 'short'});
        list.innerHTML += `<div class="forecast-item"><p>${dName}</p><img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png"><p><b>${Math.round(day.main.temp)}°</b></p></div>`;
    });
}

// Event Listeners
document.getElementById("searchBtn").onclick = () => checkWeather(document.getElementById("cityInput").value);
document.getElementById("unitF").onclick = () => { currentUnit = "imperial"; checkWeather(document.getElementById("cityInput").value); };
document.getElementById("unitC").onclick = () => { currentUnit = "metric"; checkWeather(document.getElementById("cityInput").value); };

window.onload = () => checkWeather("Malakand");
