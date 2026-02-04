export default function handler(req, res) {
  // Vercel'deki gizli kasadan anahtarları okuyoruz
  res.status(200).json({
    API_KEY_FOREX: process.env.VITE_API_KEY_FOREX,
    API_KEY_GOLD: process.env.VITE_API_KEY_GOLD,
    API_KEY_FINNHUB: process.env.VITE_API_KEY_FINNHUB,
    API_KEY_WEATHER: process.env.VITE_API_KEY_WEATHER
  });
}
