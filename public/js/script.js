document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    const cityInput = document.getElementById('city-input');
    const currentWeather = document.getElementById('current-weather');
    const forecast = document.getElementById('forecast');
    const searchHistory = document.getElementById('search-history');

    // Load search history on page load
    loadSearchHistory();

    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const city = cityInput.value.trim();
        if (city) {
            await getWeatherData(city);
            cityInput.value = '';
        }
    });

    async function loadSearchHistory() {
        try {
            const response = await fetch('/api/weather/history');
            const cities = await response.json();
            renderSearchHistory(cities);
        } catch (err) {
            console.error('Error loading search history:', err);
        }
    }

    function renderSearchHistory(cities) {
        searchHistory.innerHTML = cities
            .map(city => `
                <div class="history-item" data-city="${city.name}">
                    <span>${city.name}</span>
                    <button class="delete-btn" data-id="${city.id}">×</button>
                </div>
            `)
            .join('');

        // Add click handlers
        document.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.classList.contains('delete-btn')) {
                    getWeatherData(item.dataset.city);
                }
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                await deleteCity(btn.dataset.id);
            });
        });
    }

    async function getWeatherData(city) {
        try {
            const response = await fetch('/api/weather', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ city })
            });

            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }

            renderWeather(data.weather);
            loadSearchHistory();
        } catch (err) {
            alert('Error fetching weather data: ' + err.message);
        }
    }

    async function deleteCity(id) {
        try {
            await fetch(`/api/weather/history/${id}`, {
                method: 'DELETE'
            });
            loadSearchHistory();
        } catch (err) {
            console.error('Error deleting city:', err);
        }
    }

    function renderWeather(weatherData) {
        // Render current weather
        const current = weatherData.list[0];
        currentWeather.innerHTML = `
            <h2>${weatherData.city.name} (${new Date(current.dt * 1000).toLocaleDateString()})</h2>
            <img src="http://openweathermap.org/img/w/${current.weather[0].icon}.png" 
                 alt="${current.weather[0].description}">
            <p>Temperature: ${current.main.temp}°C</p>
            <p>Humidity: ${current.main.humidity}%</p>
            <p>Wind Speed: ${current.wind.speed} m/s</p>
        `;

        // Render 5-day forecast
        const dailyForecasts = weatherData.list.filter((item, index) => index % 8 === 0).slice(0, 5);
        forecast.innerHTML = dailyForecasts
            .map(day => `
                <div class="forecast-day">
                    <h3>${new Date(day.dt * 1000).toLocaleDateString()}</h3>
                    <img src="http://openweathermap.org/img/w/${day.weather[0].icon}.png" 
                         alt="${day.weather[0].description}">
                    <p>Temp: ${day.main.temp}°C</p>
                    <p>Wind: ${day.wind.speed} m/s</p>
                    <p>Humidity: ${day.main.humidity}%</p>
                </div>
            `)
            .join('');
    }
}); 