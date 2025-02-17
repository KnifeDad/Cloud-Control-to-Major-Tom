import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

interface WeatherResponse {
  city: {
    id: string;
    name: string;
  };
  list: Array<{
    dt: number;
    main: {
      temp: number;
      humidity: number;
    };
    weather: Array<{
      icon: string;
      description: string;
    }>;
    wind: {
      speed: number;
    };
  }>;
}

export class WeatherService {
  private static readonly API_KEY = process.env.OPENWEATHER_API_KEY;
  private static readonly BASE_URL = 'https://api.openweathermap.org/data/2.5';

  static async getWeatherData(city: string): Promise<WeatherResponse> {
    try {
      // TEMPORARY DEBUG - Remove after fixing
      console.log('Environment check:', {
        hasKey: !!process.env.OPENWEATHER_API_KEY,
        keyLength: process.env.OPENWEATHER_API_KEY?.length
      });

      if (!this.API_KEY) {
        throw new Error('OpenWeather API key is not configured');
      }

      const url = `${this.BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${this.API_KEY}&units=metric`;
      const response = await axios.get(url);

      // Basic validation
      if (!response.data || !response.data.list) {
        throw new Error('Invalid response format from weather API');
      }

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error('API key is inactive or invalid');
        }
        throw new Error(`Weather API error: ${error.response?.data?.message || error.message}`);
      }
      throw error;
    }
  }
} 