
import { WeatherData, QuoteData, CryptoData, MealData, ArtData, CyclePhase } from '../types';

// Fallback data ensures the app looks premium even if public APIs are rate-limited or down
const FALLBACK_QUOTE: QuoteData = {
  content: "Leadership is not about being in charge. It is about taking care of those in your charge.",
  author: "Simon Sinek"
};

const FALLBACK_WEATHER: WeatherData = {
  temperature: 72,
  weatherCode: 0, // Clear sky
  isDay: 1
};

const FALLBACK_MEAL: MealData = {
  id: "52959",
  name: "Roasted Asparagus",
  thumbnail: "https://www.themealdb.com/images/media/meals/1548772327.jpg",
  category: "Vegetarian",
  sourceUrl: "https://www.bbcgoodfood.com/recipes/roasted-asparagus"
};

const FALLBACK_ART: ArtData = {
  id: 27992,
  title: "A Sunday on La Grande Jatte",
  artist: "Georges Seurat",
  imageUrl: "https://www.artic.edu/iiif/2/2d484387-2509-5e8e-2c43-22f9981972eb/full/843,/0/default.jpg",
  date: "1884/86"
};

export const ExternalService = {
  /**
   * Fetches current weather for "Bio-Weather" intelligence.
   * Uses Open-Meteo (Free, No Key required).
   * Defaults to New York (Executive Hub) if geolocation fails.
   */
  async getWeather(lat = 40.7128, long = -74.0060): Promise<WeatherData> {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current_weather=true`
      );
      const data = await response.json();
      
      if (!data.current_weather) throw new Error("Invalid weather data");

      return {
        temperature: data.current_weather.temperature,
        weatherCode: data.current_weather.weathercode,
        isDay: data.current_weather.is_day
      };
    } catch (error) {
      console.warn("Weather API unavailable, using fallback:", error);
      return FALLBACK_WEATHER;
    }
  },

  /**
   * Fetches a random inspirational quote for the Executive Mantra.
   * Uses Quotable.io (Free).
   */
  async getDailyQuote(): Promise<QuoteData> {
    try {
      const response = await fetch('https://api.quotable.io/random?tags=business,success,wisdom');
      if (!response.ok) throw new Error("Quote API error");
      const data = await response.json();
      return {
        content: data.content,
        author: data.author
      };
    } catch (error) {
      // Fallback to local curated list if API fails
      const backups = [
        FALLBACK_QUOTE,
        { content: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
        { content: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau" }
      ];
      return backups[Math.floor(Math.random() * backups.length)];
    }
  },

  /**
   * Fetches real-time crypto prices for the Payment page.
   * Uses CoinGecko (Free public tier).
   */
  async getCryptoPrice(): Promise<number> {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'
      );
      const data = await response.json() as CryptoData;
      return data.bitcoin.usd;
    } catch (error) {
      console.warn("Crypto API unavailable", error);
      return 65000; // Fallback estimate
    }
  },

  /**
   * Fetches a cycle-synced meal recommendation.
   * Uses TheMealDB (Free).
   */
  async getMealRecommendation(phase: CyclePhase = CyclePhase.FOLLICULAR): Promise<MealData> {
    try {
      // Map phase to meal categories for nutritional alignment
      let category = 'Chicken';
      switch (phase) {
        case CyclePhase.MENSTRUAL:
          category = 'Vegetarian'; // Lighter, easier digestion
          break;
        case CyclePhase.FOLLICULAR:
          category = 'Seafood'; // Fresh, light proteins
          break;
        case CyclePhase.OVULATORY:
          category = 'Pasta'; // High energy
          break;
        case CyclePhase.LUTEAL:
          category = 'Dessert'; // Comfort (or Beef for iron, but Dessert is fun)
          break;
      }

      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
      const data = await response.json();
      
      if (!data.meals || data.meals.length === 0) return FALLBACK_MEAL;
      
      // Pick a random one from the category
      const randomMeal = data.meals[Math.floor(Math.random() * data.meals.length)];
      
      return {
        id: randomMeal.idMeal,
        name: randomMeal.strMeal,
        thumbnail: randomMeal.strMealThumb,
        category: category,
        sourceUrl: `https://www.themealdb.com/meal/${randomMeal.idMeal}` // Approximate URL
      };
    } catch (error) {
      console.warn("Meal API unavailable", error);
      return FALLBACK_MEAL;
    }
  },

  /**
   * Fetches a classic artwork for the Daily Muse.
   * Uses Art Institute of Chicago API (Free).
   */
  async getDailyArt(): Promise<ArtData> {
    try {
      // Fetch a random page of artworks to get variety
      const page = Math.floor(Math.random() * 5) + 1;
      const response = await fetch(
        `https://api.artic.edu/api/v1/artworks?page=${page}&limit=10&fields=id,title,artist_display,image_id,date_display`
      );
      const data = await response.json();
      
      if (!data.data || data.data.length === 0) return FALLBACK_ART;

      // Filter for ones with images
      const artWithImage = data.data.filter((a: any) => a.image_id);
      if (artWithImage.length === 0) return FALLBACK_ART;

      const art = artWithImage[Math.floor(Math.random() * artWithImage.length)];
      
      return {
        id: art.id,
        title: art.title,
        artist: art.artist_display,
        imageUrl: `https://www.artic.edu/iiif/2/${art.image_id}/full/843,/0/default.jpg`,
        date: art.date_display
      };
    } catch (error) {
      console.warn("Art API unavailable", error);
      return FALLBACK_ART;
    }
  },

  /**
   * Helper to interpret weather codes for LUNA context
   */
  getWeatherContext(code: number): string {
    if (code === 0) return "Clear skies";
    if (code >= 1 && code <= 3) return "Partly cloudy";
    if (code >= 45 && code <= 48) return "Foggy";
    if (code >= 51 && code <= 67) return "Rainy";
    if (code >= 71) return "Snowy";
    return "Overcast";
  }
};