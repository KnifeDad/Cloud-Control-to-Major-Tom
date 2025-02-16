import { Router } from 'express';
import { WeatherService } from '../../service/weatherService.js';
import { HistoryService } from '../../service/historyService.js';

const router = Router();

// Define interfaces for better type safety
interface City {
  id: string;
  name: string;
}

interface Weather {
  // Add weather properties based on your API response
  temperature: number;
  conditions: string;
  // ... other weather properties
}

// POST Request with city name to retrieve weather data
router.post('/', (req, res) => {
  const { city } = req.body;
  
  WeatherService.getWeatherData(city)
    .then((response) => {
      return HistoryService.addCity(response.city)
        .then(() => {
          res.json(response);
        });
    })
    .catch((error: Error) => {
      console.error('Error fetching weather:', error);
      res.status(500).json({ error: error.message });
    });
});

// GET search history
router.get('/history', (_req, res) => {
  HistoryService.getCities()
    .then((cities) => {
      res.json(cities);
    })
    .catch((error: Error) => {
      console.error('Error fetching history:', error);
      res.status(500).json({ error: error.message });
    });
});

// DELETE city from search history
router.delete('/history/:id', (req, res) => {
  const { id } = req.params;
  
  HistoryService.deleteCity(id)
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error: Error) => {
      console.error('Error deleting city:', error);
      res.status(500).json({ error: error.message });
    });
});

export default router;
