import dotenv from "dotenv";
dotenv.config();

// Define the interface for Coordinates
interface Coordinates {
  lat: number;
  lon: number;
}

// Define the interface for Weather
interface Weather {
  temperature: number;
  humidity: number;
  condition: string;
}

class WeatherService {
  private baseURL: string;
  private apiKey: string;

  constructor() {
    this.baseURL = process.env.API_BASE_URL|| "";
    this.apiKey = process.env.API_KEY || "";

    if (!this.apiKey) {
      throw new Error("API Key for weather service is missing. Add it to your .env file.");
    }
  }

  // Fetch location data based on city name
  private async fetchLocationData(query: string): Promise<Coordinates> {
    const response = await fetch(
      `${this.baseURL}/geo/1.0/direct?q=${query}&limit=1&appid=${this.apiKey}`
    );

    if (!response.ok) {
      throw new Error(`Error fetching location data: ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.length) {
      throw new Error(`No location found for query: ${query}`);
    }

    return { lat: data[0].lat, lon: data[0].lon };
  }

  // Fetch weather data based on coordinates
  private async fetchWeatherData(coordinates: Coordinates): Promise<Weather> {
    const { lat, lon } = coordinates;
    const response = await fetch(
      `${this.baseURL}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`
    );

    if (!response.ok) {
      throw new Error(`Error fetching weather data: ${response.statusText}`);
    }

    const data = await response.json();
    console.log (data)
    return {
      temperature: data.main.temp,
      humidity: data.main.humidity,
      condition: data.weather[0].description,
    };
  }

  // Get weather data for a specific city
  public async getWeatherForCity(city: string): Promise<Weather> {
    const coordinates = await this.fetchLocationData(city);
    return await this.fetchWeatherData(coordinates);
  }
}
export default new WeatherService();
// Example usage
// (async () => {
//   try {
//     const weatherService = new WeatherService();
//     const weather = await weatherService.getWeatherForCity("Seattle");
//     console.log("Weather in Seattle:", weather);
//   } catch (error) {
//     console.error("Error:", error);
//   }
// })();
