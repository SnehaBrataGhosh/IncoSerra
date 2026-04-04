import dotenv from 'dotenv';

dotenv.config();

const BAD_WEATHER_KEYWORDS = [
  'rain',
  'drizzle',
  'thunderstorm',
  'snow',
  'mist',
  'fog',
  'haze',
  'squall',
  'tornado',
];

/**
 * Fetches current weather from OpenWeatherMap.
 * Falls back to a neutral summary if the API key is missing or the call fails.
 */
export async function fetchWeatherSummary(city) {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const defaultCity = process.env.OPENWEATHER_DEFAULT_CITY || 'Mumbai';
  const q = (city && String(city).trim()) || defaultCity;

  if (!apiKey) {
    return {
      raw: null,
      summary: 'Unavailable (configure OPENWEATHER_API_KEY)',
      isBad: false,
      cityUsed: q,
    };
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      q
    )}&appid=${apiKey}&units=metric`;
    const res = await fetch(url);
    if (!res.ok) {
      return {
        raw: null,
        summary: 'Weather lookup failed',
        isBad: false,
        cityUsed: q,
      };
    }
    const data = await res.json();
    const main = data.weather?.[0]?.main || '';
    const desc = data.weather?.[0]?.description || main;
    const lower = `${main} ${desc}`.toLowerCase();
    const isBad = BAD_WEATHER_KEYWORDS.some((k) => lower.includes(k));
    return {
      raw: data,
      summary: desc ? desc.replace(/\b\w/g, (c) => c.toUpperCase()) : main,
      isBad,
      cityUsed: q,
    };
  } catch {
    return {
      raw: null,
      summary: 'Weather service error',
      isBad: false,
      cityUsed: q,
    };
  }
}
