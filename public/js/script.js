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
            <div class="text-center">
                <h2 class="mb-4">${weatherData.city.name} <small class="text-light">(${new Date(current.dt * 1000).toLocaleDateString()})</small></h2>
                <img src="http://openweathermap.org/img/w/${current.weather[0].icon}.png" 
                     alt="${current.weather[0].description}"
                     class="weather-icon mb-3">
                <div class="temperature">${Math.round(current.main.temp)}°C</div>
                <div class="conditions">${current.weather[0].description}</div>
                <div class="row mt-4">
                    <div class="col-4">
                        <div class="text-uppercase small">Humidity</div>
                        <div class="fs-5">${current.main.humidity}%</div>
                    </div>
                    <div class="col-4">
                        <div class="text-uppercase small">Wind</div>
                        <div class="fs-5">${current.wind.speed} m/s</div>
                    </div>
                </div>
            </div>
        `;

        // Render 5-day forecast
        const dailyForecasts = weatherData.list.filter((item, index) => index % 8 === 0).slice(0, 5);
        forecast.innerHTML = dailyForecasts
            .map(day => `
                <div class="col">
                    <div class="forecast-day">
                        <h3 class="h6">${new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}</h3>
                        <img src="http://openweathermap.org/img/w/${day.weather[0].icon}.png" 
                             alt="${day.weather[0].description}"
                             class="weather-icon">
                        <div class="fs-4">${Math.round(day.main.temp)}°C</div>
                        <div class="small text-muted">
                            <div>Wind: ${day.wind.speed} m/s</div>
                            <div>Humidity: ${day.main.humidity}%</div>
                        </div>
                    </div>
                </div>
            `)
            .join('');
    }
}); 