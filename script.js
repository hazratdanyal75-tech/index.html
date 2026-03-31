const apiKey = "12e66aee9a7b5c3141fc50e34412d03b"; // Yahan apni API key dalein

document.getElementById('search-btn').addEventListener('click', () => {
    const city = document.getElementById('city-input').value;
    if(city) {
        getWeather(city);
    }
});

async function getWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if(data.cod === 200) {
            document.getElementById('city-name').innerText = data.name;
            document.getElementById('temp').innerText = Math.round(data.main.temp) + "°C";
            document.getElementById('description').innerText = data.weather[0].description;
            document.getElementById('humidity').innerText = data.main.humidity + "%";
            document.getElementById('wind').innerText = data.wind.speed + " km/h";
        } else {
            alert("Shehar nahi mila!");
        }
    } catch (error) {
        console.log("Error fetching data");
    }
}
