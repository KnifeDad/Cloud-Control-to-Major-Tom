import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

interface Coordinates {
  lat: number;
  lon: number;
}

interface Weather {
  temperature: number;
  conditions: string;
}

interface WeatherResponse {
  city: {
    id: string;
    name: string;
  };
  weather: Weather;
}

export class WeatherService {
  private static readonly API_KEY = process.env.OPENWEATHER_API_KEY;
  private static readonly BASE_URL = 'https://api.openweathermap.org/data/2.5';

  static async getWeatherData(city: string): Promise<WeatherResponse> {
    try {
      const response = await axios.get(
        `${this.BASE_URL}/weather?q=${city}&appid=${this.API_KEY}&units=metric`
      );

      return {
        city: {
          id: response.data.id,
          name: response.data.name
        },
        weather: {
          temperature: response.data.main.temp,
          conditions: response.data.weather[0].main
        }
      };
    } catch (error) {
      throw new Error('Failed to fetch weather data');
    }
  }
} 