// Define the City interface
interface City {
  id: string;
  name: string;
}

// TODO: Complete the HistoryService class
export class HistoryService {
  private static cities: City[] = [];

  // TODO: Define a read method that reads from the searchHistory.json file
  private static async read(): Promise<City[]> {
    // Temporary implementation
    return this.cities;
  }

  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private static async write(cities: City[]): Promise<void> {
    this.cities = cities;
  }

  // Get cities from the searchHistory.json file
  static async getCities(): Promise<City[]> {
    return this.read();
  }

  // Add a city to the searchHistory.json file
  static async addCity(city: City): Promise<void> {
    const cities = await this.read();
    cities.push(city);
    await this.write(cities);
  }

  // Remove a city from the searchHistory.json file
  static async deleteCity(id: string): Promise<void> {
    const cities = await this.read();
    const filteredCities = cities.filter(city => city.id !== id);
    await this.write(filteredCities);
  }
}
